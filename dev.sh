#!/bin/bash

# ===========================================
# Super Vidéothèque - Dev Mode (Interactive)
# ===========================================
# Lance backend et frontend dans des onglets Terminal séparés

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎬 Super Vidéothèque - Mode Dev${NC}"

# Check dependencies
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo "📦 Installation backend..."
    cd "$BACKEND_DIR" && npm install
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "📦 Installation frontend..."
    cd "$FRONTEND_DIR" && npm install
fi

# Open in new Terminal tabs (macOS)
osascript <<EOF
tell application "Terminal"
    activate
    
    -- Backend tab
    do script "cd '$BACKEND_DIR' && echo '🔧 Backend - Port 4000' && npm run dev"
    
    -- Frontend tab
    delay 1
    do script "cd '$FRONTEND_DIR' && echo '🎨 Frontend - Port 5173' && npm run dev"
end tell
EOF

echo ""
echo -e "${GREEN}✅ Terminaux ouverts !${NC}"
echo ""
echo -e "  ${BLUE}Backend:${NC}  http://localhost:4000"
echo -e "  ${BLUE}Frontend:${NC} http://localhost:5173"

# Open browser after delay
sleep 3
open http://localhost:5173
