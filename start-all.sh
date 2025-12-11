#!/bin/bash

# ===========================================
# 🎬 Super Vidéothèque - MASTER START SCRIPT
# ===========================================
# Ce script fait TOUT automatiquement :
# 1. Arrête les anciens processus
# 2. Démarre ngrok
# 3. Récupère l'URL ngrok automatiquement
# 4. Configure le frontend avec la bonne URL
# 5. Démarre backend + frontend
# ===========================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
NGROK_CONFIG="$PROJECT_DIR/ngrok.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🎬 SUPER VIDÉOTHÈQUE - DÉMARRAGE AUTO   ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════╝${NC}"
echo ""

# ===========================================
# ÉTAPE 1: Nettoyage
# ===========================================
echo -e "${YELLOW}[1/6] 🧹 Nettoyage des anciens processus...${NC}"

# Kill existing processes
pkill -f "ngrok start" 2>/dev/null || true
pkill -f "tsx watch" 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:4040 | xargs kill -9 2>/dev/null || true

sleep 1
echo -e "  ${GREEN}✓ Nettoyé${NC}"

# ===========================================
# ÉTAPE 2: Vérifier les dépendances
# ===========================================
echo -e "${YELLOW}[2/6] 📦 Vérification des dépendances...${NC}"

if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo -e "  Installing backend dependencies..."
    cd "$BACKEND_DIR" && npm install --silent
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "  Installing frontend dependencies..."
    cd "$FRONTEND_DIR" && npm install --silent
fi

echo -e "  ${GREEN}✓ Dépendances OK${NC}"

# ===========================================
# ÉTAPE 3: Démarrer ngrok
# ===========================================
echo -e "${YELLOW}[3/6] 🌐 Démarrage de ngrok...${NC}"

cd "$PROJECT_DIR"
ngrok start backend --config="$NGROK_CONFIG" > /dev/null 2>&1 &
NGROK_PID=$!
echo $NGROK_PID > "$PROJECT_DIR/.ngrok.pid"

# Attendre que ngrok démarre
sleep 3

# Récupérer l'URL ngrok via l'API locale
NGROK_URL=""
for i in {1..10}; do
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)
    if [ -n "$NGROK_URL" ]; then
        break
    fi
    sleep 1
done

if [ -z "$NGROK_URL" ]; then
    echo -e "  ${RED}✗ Impossible de récupérer l'URL ngrok${NC}"
    echo -e "  ${YELLOW}Utilisation de localhost comme fallback${NC}"
    NGROK_URL="http://localhost:4000"
fi

echo -e "  ${GREEN}✓ ngrok URL: ${CYAN}$NGROK_URL${NC}"

# ===========================================
# ÉTAPE 4: Configurer le frontend
# ===========================================
echo -e "${YELLOW}[4/6] ⚙️  Configuration du frontend...${NC}"

# Mettre à jour le .env du frontend
echo "VITE_API_BASE_URL=$NGROK_URL" > "$FRONTEND_DIR/.env"

echo -e "  ${GREEN}✓ Frontend configuré avec: $NGROK_URL${NC}"

# ===========================================
# ÉTAPE 5: Démarrer le Backend
# ===========================================
echo -e "${YELLOW}[5/6] 🔧 Démarrage du Backend...${NC}"

cd "$BACKEND_DIR"
npm run dev > "$PROJECT_DIR/.backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$PROJECT_DIR/.backend.pid"

# Attendre que le backend soit prêt
sleep 3

# Vérifier que le backend répond
if curl -s http://localhost:4000 > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Backend démarré (PID: $BACKEND_PID)${NC}"
else
    echo -e "  ${YELLOW}⚠ Backend en cours de démarrage...${NC}"
fi

# ===========================================
# ÉTAPE 6: Démarrer le Frontend
# ===========================================
echo -e "${YELLOW}[6/6] 🎨 Démarrage du Frontend...${NC}"

cd "$FRONTEND_DIR"
npm run dev > "$PROJECT_DIR/.frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$PROJECT_DIR/.frontend.pid"

sleep 2
echo -e "  ${GREEN}✓ Frontend démarré (PID: $FRONTEND_PID)${NC}"

# ===========================================
# RÉSUMÉ
# ===========================================
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ TOUT EST DÉMARRÉ !            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Frontend Local:${NC}  http://localhost:5173"
echo -e "  ${BLUE}Backend Local:${NC}   http://localhost:4000"
echo -e "  ${BLUE}Backend ngrok:${NC}   ${CYAN}$NGROK_URL${NC}"
echo -e "  ${BLUE}ngrok Dashboard:${NC} http://localhost:4040"
echo ""
echo -e "${YELLOW}📋 Commandes utiles:${NC}"
echo -e "  ${CYAN}./stop-all.sh${NC}     - Arrêter tout"
echo -e "  ${CYAN}tail -f .backend.log${NC}  - Voir logs backend"
echo -e "  ${CYAN}tail -f .frontend.log${NC} - Voir logs frontend"
echo ""

# Sauvegarder l'URL ngrok pour référence
echo "$NGROK_URL" > "$PROJECT_DIR/.ngrok-url"

# Ouvrir le navigateur
sleep 2
open http://localhost:5173
