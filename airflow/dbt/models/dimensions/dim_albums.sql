{{ config(materialized='table') }}

select
    distinct
    album_id,
    album_name,
    album_release_date
from {{ source('raw', 'spotify_tracks') }}
