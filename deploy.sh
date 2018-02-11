#!/usr/bin/env bash
echo 'Remove package-lock.json...';
rm package-lock.json;
echo 'Pulling repo off Github...';
git pull;
echo 'Running docker...';
docker build Dockerfile
docker run monikabot