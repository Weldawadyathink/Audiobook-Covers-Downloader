FROM python:3.13-bookworm AS pythonbuilder
WORKDIR /app
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
RUN python -m venv .venv
COPY requirements.txt .
RUN .venv/bin/pip install -r requirements.txt


FROM denoland/deno:debian AS denobuilder
WORKDIR /app
COPY deno.json deno.lock ./
RUN deno install --frozen=true


FROM python:3.13-slim-bookworm

ENV DENO_DIR=/deno-dir/
COPY --from=denoland/deno:bin /deno /usr/local/bin/
COPY --from=denobuilder /deno-dir /deno-dir
WORKDIR /app
COPY --from=pythonbuilder /app/.venv .venv/

COPY . .

CMD ["deno", "task", "start"]
