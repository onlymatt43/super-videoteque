#!/bin/bash

# ===========================================
# 🎬 Super Vidéothèque - MASTER START SCRIPT
# ===========================================
# Domaine fixe: vendibly-constrictive-hillary.ngrok-free.dev
# ===========================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
NGROK_CONFIG="$PROJECT_DIR/ngrok.yml"
NGROK_URL="https://vendibly-constrictive-hillary.ngrok-free.dev"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🎬 SUPER VIDÉOTHÈQUE - DÉMARRAGE AUTO   ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Nettoyage
echo -e "${YELLOW}[1/4] 🧹 Nettoyage...${NC}"
pkill -f "ngrok start" 2>/dev/null || true
pkill -f "tsx watch" 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 1
echo -e "  ${GREEN}✓ Nettoyé${NC}"

# ngrok
echo -e "${YELLOW}[2/4] 🌐 Démarrage de ngrok...${NC}"
cd "$PROJECT_DIR"
ngrok start backend --config="$NGROK_CONFIG" > /dev/null 2>&1 &
echo $! > "$PROJECT_DIR/.ngrok.pid"
sleep 2
echo -e "  ${GREEN}✓ ngrok: ${NGROK_URL}${NC}"

# Backend
echo -e "${YELLOW}[3/4] 🔧 Démarrage du Backend...${NC}"
cd "$BACKEND_DIR"
npm run dev > "$PROJECT_DIR/.backend.log" 2>&1 &
echo $! > "$PROJECT_DIR/.backend.pid"
sleep 2
echo -e "  ${GREEN}✓ Backend démarré${NC}"

# Frontend
echo -e "${YELLOW}[4/4] 🎨 Démarrage du Frontend...${NC}"
cd "$FRONTEND_DIR"
npm run dev > "$PROJECT_DIR/.frontend.log" 2>&1 &
echo $! > "$PROJECT_DIR/.frontend.pid"
sleep 2
echo -e "  ${GREEN}✓ Frontend démarré${NC}"

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║          ✅ TOUT EST DÉMARRÉ !            ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Frontend:${NC}  http://localhost:5173"
echo -e "  ${BLUE}Backend:${NC}   http://localhost:4000"
echo -e "  ${GREEN}Public:${NC}    ${NGROK_URL}"
echo ""
