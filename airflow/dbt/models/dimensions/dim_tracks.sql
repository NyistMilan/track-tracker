{{ config(materialized='table') }}

select
    distinct
    track_id,
    track_name,
    duration_ms,
    popularity
from {{ source('raw', 'spotify_tracks') }}
