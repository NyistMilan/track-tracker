{{ config(materialized='table') }}

select
    distinct user_id
from {{ source('raw', 'spotify_tracks') }}
