#!/bin/bash

# Script para compactar standard-ms excluindo node_modules e .env

SOURCE_DIR="$(basename "$PWD")"
OUTPUT_FILE="${SOURCE_DIR}.tar.gz"

echo "Compactando $SOURCE_DIR..."
echo "Arquivo de saída: $OUTPUT_FILE"

tar -czf "../$OUTPUT_FILE" \
  --exclude="$SOURCE_DIR/node_modules" \
  --exclude="$SOURCE_DIR/**/node_modules" \
  --exclude="$SOURCE_DIR/.env" \
  --exclude="$SOURCE_DIR/**/.env" \
  --exclude="$SOURCE_DIR/.git" \
  "../$SOURCE_DIR"

if [ $? -eq 0 ]; then
  echo "✓ Compactação concluída com sucesso!"
  echo "✓ Arquivo criado: $OUTPUT_FILE"
  ls -lh "../$OUTPUT_FILE"
else
  echo "✗ Erro na compactação"
  exit 1
fi
