FROM node:18-alpine AS react-build

WORKDIR /home/node/react
COPY ./frontend .
RUN npm install
RUN npm run build


FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /home

COPY djangoapp ./djangoapp
COPY djangoproj ./djangoproj
COPY frontend/static ./frontend/static
COPY --from=react-build  /home/node/react/build ./frontend/build
COPY manage.py .
COPY requirements.txt .


RUN python3 -m pip install -U -r requirements.txt
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate --run-syncdb


EXPOSE 8000
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

