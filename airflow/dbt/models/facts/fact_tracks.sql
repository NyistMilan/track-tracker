{{ config(materialized='table') }}

with base as (
    select
        user_id,
        track_id,
        artist_id,
        album_id,
        played_at
    from {{ source('raw', 'spotify_tracks') }}
),

aggregated as (
    select
        user_id,
        track_id,
        artist_id,
        album_id,
        min(played_at) as first_played_at,
        max(played_at) as last_played_at,
        count(*) as play_count
    from base
    group by user_id, track_id, artist_id, album_id
)

select * from aggregated
