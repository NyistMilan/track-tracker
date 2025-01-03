from airflow import DAG
from airflow.operators.python import PythonOperator
from dbt_airflow.core.task_group import DbtTaskGroup
from dbt_airflow.core.config import DbtProjectConfig, DbtProfileConfig
from dotenv import load_dotenv
from pathlib import Path
import requests
import logging
import os
import json
import psycopg2
from datetime import datetime, timedelta

load_dotenv()

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'spotify_api_to_azure',
    default_args=default_args,
    description='Fetch Spotify tracks, load into PostgreSQL, and transform using dbt',
    schedule_interval='@hourly',
    start_date=datetime(2023, 1, 1),
    catchup=False,
) as dag:

    def fetch_recent_tracks_via_api():
        """
        Calls the backend API to fetch recent tracks for all users and exports them to files.
        """
        try:
            api_url = os.getenv("API_URL")
            headers = {"x-api-key": os.getenv("API_KEY")}
            payload = {"userIds": []}

            response = requests.post(api_url, json=payload, headers=headers)

            if response.status_code == 200:
                result = response.json()
                logging.info(f"Results: {result}")

                if result["success"]:
                    logging.info("Successfully fetched tracks via backend API.")
                    data_dir = os.getenv("DATA_DIR")
                    os.makedirs(data_dir, exist_ok=True)

                    for user_result in result["results"]:
                        if user_result["success"]:
                            user_id = user_result["userId"]
                            tracks = user_result.get("tracks", [])

                            if tracks:
                                timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
                                file_path = f"{data_dir}{user_id}_{timestamp}_tracks.json"

                                if not os.path.exists(file_path):
                                    with open(file_path, "w") as f:
                                        json.dump(tracks, f)
                                    logging.info(f"Exported {len(tracks)} tracks for user {user_id} to {file_path}.")
                            else:
                                logging.warning(f"No tracks found for user {user_id}.")
                        else:
                            logging.error(f"Failed for user {user_result['userId']}: {user_result['message']}")
                else:
                    logging.error(f"API call failed: {result['message']}")
            else:
                logging.error(f"Failed to fetch tracks via backend API: {response.text}")

        except Exception as e:
            logging.error(f"Error in fetch_recent_tracks_via_api: {str(e)}")
            raise

    def load_to_postgresql():
        """
        Load raw Spotify data from JSON files into PostgreSQL.
        """
        try:
            conn = psycopg2.connect(
                dbname=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT"),
            )
            cursor = conn.cursor()

            data_dir = os.getenv("DATA_DIR")
            for filename in os.listdir(data_dir):
                file_path = os.path.join(data_dir, filename)
                if os.path.isfile(file_path):
                    user_id = filename.split("_")[0]

                    with open(file_path, "r") as f:
                        data = json.load(f)

                    for item in data:
                        track = item.get('track') or {}
                        album = track.get('album') or {}
                        artists = album.get('artists') or [{}]
                        artist = artists[0] if artists else {}

                        track_id = track.get('id')
                        track_name = track.get('name')
                        played_at = item.get('played_at')
                        duration_ms = track.get('duration_ms')
                        popularity = track.get('popularity')
                        album_name = album.get('name')
                        album_id = album.get('id')
                        album_release_date = album.get('release_date')
                        artist_name = artist.get('name')
                        artist_id = artist.get('id')

                        if track_id and played_at:
                            cursor.execute("""
                                INSERT INTO raw.spotify_tracks (
                                    user_id, track_id, played_at, track_name, artist_name, artist_id, 
                                    album_name, album_id, duration_ms, popularity, album_release_date
                                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                                ON CONFLICT DO NOTHING
                            """, (
                                user_id, track_id, played_at, track_name, artist_name, artist_id,
                                album_name, album_id, duration_ms, popularity, album_release_date
                            ))
                    logging.info(f"Loaded data from {filename} into raw.spotify_tracks")

                    os.remove(file_path)
                    logging.info(f"Removed processed file: {filename}")

            conn.commit()
            cursor.close()
            conn.close()

        except Exception as e:
            logging.error(f"Error in load_to_postgresql: {str(e)}")
            raise

    fetch_tracks_task = PythonOperator(
        task_id='fetch_recent_tracks_via_api',
        python_callable=fetch_recent_tracks_via_api,
    )

    load_to_postgresql_task = PythonOperator(
        task_id='load_to_postgresql',
        python_callable=load_to_postgresql,
    )

    dbt_tg = DbtTaskGroup(
        group_id='dbt_tasks',
        dbt_project_config=DbtProjectConfig(
            project_path=Path(os.getenv("DBT_PROJECT_DIR", "/dbt_project")),
            manifest_path=Path(os.getenv("DBT_MANIFEST_PATH", "/dbt_project/target/manifest.json")),
        ),
        dbt_profile_config=DbtProfileConfig(
            profiles_path=Path(os.getenv("DBT_PROFILES_DIR", "/home/astro/.dbt")),
            target=os.getenv("DBT_TARGET", "dev"),
        ),
    )

    fetch_tracks_task >> load_to_postgresql_task >> dbt_tg
