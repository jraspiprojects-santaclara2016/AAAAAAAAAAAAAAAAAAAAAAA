#!/usr/bin/env bash
#delete logs that are older than 10days. (you need to execute this in a cron job every day for this to work!)
find ../logs -mmin +14400 -type f -delete