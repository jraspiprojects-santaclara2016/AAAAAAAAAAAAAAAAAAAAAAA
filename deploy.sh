#!/usr/bin/env bash
echo 'Remove package-lock.json...';
rm package-lock.json;
echo 'Pulling repo off Github...';
git pull;
echo 'Running docker...';
docker build --env DISCORD_TOKEN --env OPENWEATHERMAP_TOKEN --env LOL_TOKEN --env NODE_ENV .