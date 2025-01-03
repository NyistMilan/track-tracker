{{ config(materialized='table') }}

select
    distinct
    artist_id,
    artist_name
from {{ source('raw', 'spotify_tracks') }}
