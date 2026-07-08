#!/usr/bin/env bash
# Simple mongodump backup script for production. Requires mongodump to be installed.
# Usage: ./scripts/backup-mongo.sh /path/to/backups

set -euo pipefail

OUT_DIR=${1:-./backups}
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")

MONGO_URI=${MONGODB_URI:-${MONGODB_URI:-mongodb://localhost:27017/jobboard}}

mkdir -p "$OUT_DIR"

echo "Starting mongodump for $MONGO_URI"

mongodump --uri="$MONGO_URI" --archive="$OUT_DIR/mongodump-$TIMESTAMP.archive" --gzip

echo "Backup completed: $OUT_DIR/mongodump-$TIMESTAMP.archive.gz"
