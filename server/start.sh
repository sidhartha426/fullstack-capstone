#!/bin/bash
# Check if the URL parameter is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <url>"
  exit 1
fi


frontend_url="$1"
backend_url=$(echo "$frontend_url" | sed 's/8000/3030/')
sentiment_analyzer_url=$(echo "$frontend_url" | sed 's/8000/5000/')



echo "MONGO_USER=root" > .env
echo "MONGO_PASS=olw92tWUWVCEqHVDUSy9hxoB" >> .env

echo "frontend_url=$frontend_url" > ./djangoproj/.env

echo "backend_url=$backend_url" > ./djangoapp/.env
echo "sentiment_analyzer_url=$sentiment_analyzer_url" >> ./djangoapp/.env


cd djangoapp/microservices
docker build . -t sentiment
cd ../..

cd database
docker build . -t nodeapp
cd ..

docker build . -t djangoapp
docker-compose up -d
