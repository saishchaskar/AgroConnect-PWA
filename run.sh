#!/usr/bin/env bash
set -e

if [ -z "$GEMINI_API_KEY" ]; then
  echo "Error: Run with GEMINI_API_KEY='your-key' ./run.sh"
  exit 1
fi
export GCP_API_KEY="$GEMINI_API_KEY"

if [ ! -f backend/src/main/resources/serviceAccountKey.json ]; then
  echo "Error: Place serviceAccountKey.json inside backend/src/main/resources/ first."
  exit 1
fi

trap "kill 0" EXIT
(cd backend && mvn spring-boot:run) &
(cd frontend && npm install --legacy-peer-deps && npm start)
