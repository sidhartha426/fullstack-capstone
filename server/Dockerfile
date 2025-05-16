FROM node:18-alpine AS react-build

WORKDIR /home/node/react
COPY ./frontend .
RUN npm install
RUN npm run build


FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONWRITEBYTECODE=1

WORKDIR /home

COPY djangoapp ./djangoapp
COPY djangoproj ./djangoproj
COPY frontend/static ./frontend/static
COPY --from=react-build  /home/node/react/build ./frontend/build
COPY manage.py .
COPY requirements.txt .
COPY entrypoint.sh .
RUN python3 -m pip install -U -r requirements.txt


EXPOSE 8000
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["/bin/bash","./entrypoint.sh"]
CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]

