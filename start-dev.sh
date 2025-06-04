#!/bin/bash

echo "🚀 Iniciando Dashboard Traffic v2..."
echo "📁 Navegando para apps/web..."

cd "$(dirname "$0")/apps/web" || {
    echo "❌ Erro: Não foi possível navegar para apps/web"
    exit 1
}

echo "📦 Diretório atual: $(pwd)"
echo "🔍 Verificando arquivos..."

if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado"
    exit 1
fi

if [ ! -f "src/app/globals.css" ]; then
    echo "❌ Erro: globals.css não encontrado"
    exit 1
fi

echo "✅ Arquivos verificados"
echo "🛠️  Executando pnpm dev..."
echo "🌐 Aplicação estará disponível em: http://localhost:3000"
echo ""

pnpm dev 