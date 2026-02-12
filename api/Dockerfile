# ---- build stage
FROM python:3.11-slim AS build
WORKDIR /w

RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Installe à un prefix (inclut /install/bin + /install/lib...)
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ---- runtime stage
FROM python:3.11-slim AS runtime
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PATH="/usr/local/bin:${PATH}"

# Copie tout ce que pip a installé (libs + binaires comme gunicorn)
COPY --from=build /install /usr/local

COPY . /app

EXPOSE 8080
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app", "--workers", "2", "--threads", "4", "--timeout", "60"]



