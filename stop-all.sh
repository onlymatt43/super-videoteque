#!/bin/bash

# ===========================================
# 🛑 Super Vidéothèque - STOP ALL
# ===========================================

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo ""
echo -e "${RED}🛑 Arrêt de Super Vidéothèque...${NC}"
echo ""

# Kill by PID files
for pidfile in .ngrok.pid .backend.pid .frontend.pid; do
    if [ -f "$PROJECT_DIR/$pidfile" ]; then
        PID=$(cat "$PROJECT_DIR/$pidfile")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID" 2>/dev/null
            echo -e "  ✓ Arrêté: $pidfile (PID: $PID)"
        fi
        rm -f "$PROJECT_DIR/$pidfile"
    fi
done

# Force kill any remaining processes
pkill -f "ngrok start" 2>/dev/null || true
pkill -f "tsx watch" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Kill by port
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:4040 | xargs kill -9 2>/dev/null || true

# Cleanup
rm -f "$PROJECT_DIR/.ngrok-url"
rm -f "$PROJECT_DIR/.backend.log"
rm -f "$PROJECT_DIR/.frontend.log"

echo ""
echo -e "${GREEN}✅ Tout est arrêté !${NC}"
echo ""
