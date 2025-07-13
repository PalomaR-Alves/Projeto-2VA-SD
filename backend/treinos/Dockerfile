FROM python:3.11-slim

RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

COPY . .

EXPOSE 8000

ENTRYPOINT ["/wait-for.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
