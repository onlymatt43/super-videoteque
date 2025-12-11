#!/bin/bash

# ===========================================
# Super Vidéothèque - Start Script
# ===========================================

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎬 Super Vidéothèque - Démarrage...${NC}"
echo ""

# Check if node_modules exist
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances backend...${NC}"
    cd "$BACKEND_DIR" && npm install
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances frontend...${NC}"
    cd "$FRONTEND_DIR" && npm install
fi

# Create PID directory
mkdir -p "$PROJECT_DIR/.pids"

# Start Backend
echo -e "${GREEN}🚀 Démarrage du Backend (port 4000)...${NC}"
cd "$BACKEND_DIR"
npm run dev > "$PROJECT_DIR/.logs/backend.log" 2>&1 &
echo $! > "$PROJECT_DIR/.pids/backend.pid"

# Wait a bit for backend to start
sleep 2

# Start Frontend
echo -e "${GREEN}🚀 Démarrage du Frontend (port 5173)...${NC}"
cd "$FRONTEND_DIR"
npm run dev > "$PROJECT_DIR/.logs/frontend.log" 2>&1 &
echo $! > "$PROJECT_DIR/.pids/frontend.pid"

# Wait a bit
sleep 2

echo ""
echo -e "${GREEN}✅ Tout est démarré !${NC}"
echo ""
echo -e "  ${BLUE}Backend:${NC}  http://localhost:4000"
echo -e "  ${BLUE}Frontend:${NC} http://localhost:5173"
echo ""
echo -e "${YELLOW}Pour arrêter: ./stop.sh${NC}"
echo -e "${YELLOW}Voir les logs: tail -f .logs/backend.log .logs/frontend.log${NC}"

# Open browser
if command -v open &> /dev/null; then
    sleep 1
    open http://localhost:5173
fi
