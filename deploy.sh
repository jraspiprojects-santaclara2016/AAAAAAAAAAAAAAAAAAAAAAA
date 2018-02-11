#!/usr/bin/env bash
echo 'rm package-lock.json';
rm package-lock.json;
echo 'Pulling repo off Github...';
git pull;
echo 'Installing all dependencies...';
npm install;
echo 'Stopping running forever instances...';
npm stop;
echo 'Starting a new instance...';
npm start;
echo 'deploy.sh script...DONE';