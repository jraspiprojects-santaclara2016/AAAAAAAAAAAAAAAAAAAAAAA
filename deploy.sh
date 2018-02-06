#!/usr/bin/env bash
echo 'Pulling repo off Github...';
git fetch --all
echo 'Installing all dependencies...';
npm install;
echo 'Stopping running forever instances...';
npm stop;
echo 'Starting a new instance...';
npm start;
echo 'deploy.sh script...DONE';