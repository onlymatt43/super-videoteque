#!/bin/bash

# ===========================================
# Super Vidéothèque - Stop Script
# ===========================================

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}🛑 Super Vidéothèque - Arrêt...${NC}"
echo ""

# Kill by PID files
if [ -f "$PROJECT_DIR/.pids/backend.pid" ]; then
    PID=$(cat "$PROJECT_DIR/.pids/backend.pid")
    if kill -0 "$PID" 2>/dev/null; then
        kill "$PID" 2>/dev/null
        echo -e "  ✓ Backend arrêté (PID: $PID)"
    fi
    rm -f "$PROJECT_DIR/.pids/backend.pid"
fi

if [ -f "$PROJECT_DIR/.pids/frontend.pid" ]; then
    PID=$(cat "$PROJECT_DIR/.pids/frontend.pid")
    if kill -0 "$PID" 2>/dev/null; then
        kill "$PID" 2>/dev/null
        echo -e "  ✓ Frontend arrêté (PID: $PID)"
    fi
    rm -f "$PROJECT_DIR/.pids/frontend.pid"
fi

# Also kill any remaining processes on the ports
lsof -ti:4000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Kill tsx watch and vite processes related to this project
pkill -f "tsx watch.*super-videotheque" 2>/dev/null
pkill -f "vite.*super-videotheque" 2>/dev/null

echo ""
echo -e "${GREEN}✅ Tout est arrêté !${NC}"
