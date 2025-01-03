from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.sensors.filesystem import FileSensor
from dbt_airflow.core.task_group import DbtTaskGroup
from dbt_airflow.core.config import DbtProjectConfig, DbtProfileConfig
from dotenv import load_dotenv
import psycopg2
import os
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path

load_dotenv()

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

def parse_and_load_json(file_path, user_id, cursor):
    """
    Parse and load JSON data into PostgreSQL.
    """
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        for record in data:
            ts = record.get('ts')
            spotify_track_uri = record.get('spotify_track_uri')
            track_name = record.get('master_metadata_track_name')
            artist_name = record.get('master_metadata_album_artist_name')
            album_name = record.get('master_metadata_album_album_name')
            album_id = record.get('master_metadata_album_album_id')
            duration_ms = record.get('ms_played', 0)
            popularity = record.get('popularity')
            album_release_date = record.get('album_release_date')
            artist_id = record.get('artist_id')

            if ts and spotify_track_uri:
                track_id = spotify_track_uri.split(':')[-1]
                cursor.execute("""
                    INSERT INTO raw.spotify_tracks (
                        user_id, track_id, played_at, track_name, artist_name, artist_id, 
                        album_name, album_id, duration_ms, popularity, album_release_date
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT DO NOTHING
                """, (
                    user_id, track_id, ts, track_name, artist_name, artist_id,
                    album_name, album_id, duration_ms, popularity, album_release_date
                ))
        logging.info(f"Successfully processed {file_path}")
    except Exception as e:
        logging.error(f"Error parsing {file_path}: {str(e)}")
        raise

def load_to_postgresql():
    """
    Load data from JSON files into PostgreSQL database.
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
        staging_dir = os.getenv("STAGING_DIR", "/usr/local/airflow/staging/")

        for user_dir in os.listdir(staging_dir):
            user_path = os.path.join(staging_dir, user_dir)
            if os.path.isdir(user_path):
                for filename in os.listdir(user_path):
                    file_path = os.path.join(user_path, filename)
                    if filename.endswith(".json"):
                        parse_and_load_json(file_path, user_dir, cursor)
                        os.remove(file_path)
                        logging.info(f"Processed and removed {file_path}")

        conn.commit()
        cursor.close()
        conn.close()
        logging.info("Data successfully loaded into PostgreSQL.")
    except Exception as e:
        logging.error(f"Error in load_to_postgresql: {str(e)}")
        raise

with DAG(
    'spotify_history_to_azure',
    default_args=default_args,
    description='Triggered by file uploads to Airflow staging',
    schedule_interval=None,
    start_date=datetime(2023, 1, 1),
    catchup=False,
) as dag:

    file_sensor_task = FileSensor(
        task_id='file_sensor',
        filepath=os.getenv("STAGING_DIR", "/usr/local/airflow/staging/") + "/*.json",
        fs_conn_id='fs_default',
        poke_interval=30,
        timeout=600,
        mode='poke'
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

    file_sensor_task >> load_to_postgresql_task >> dbt_tg
