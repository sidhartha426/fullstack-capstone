#!/bin/bash
# Check if the URL parameter is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <url>"
  exit 1
fi


frontend_url="$1"
backend_url=$(echo "$frontend_url" | sed 's/8000/3030/')
sentiment_analyzer_url=$(echo "$frontend_url" | sed 's/8000/5000/')

# Output the modified URL
echo "$frontend_url"
echo "$backend_url"
echo "$sentiment_analyzer_url"

echo "MONGO_USER=root" > ./database/.env
echo "MONGO_PASS=olw92tWUWVCEqHVDUSy9hxoB" >> ./database/.env

echo "frontend_url=$frontend_url" > ./djangoproj/.env

echo "backend_url=$backend_url" > ./djangoapp/.env
echo "sentiment_analyzer_url=$sentiment_analyzer_url" >> ./djangoapp/.env

rm -f db.sqlite3
rm -f ./djangoapp/__init__.py
rm -rf ./djangoapp/__pycache__

python3 manage.py makemigrations
python3 manage.py migrate --run-syncdb


cd djangoapp/microservices
docker build . -t sentiment

cd ../..

cd database
docker build . -t nodeapp
docker-compose up -d

cd ..

cd frontend
npm install
npm run build

cd ..


pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate
python3 -m pip install -U -r requirements.txt

python3 manage.py runserver
