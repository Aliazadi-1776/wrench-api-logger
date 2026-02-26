#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node is not installed. Install Node.js 18+ first."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed."
  exit 1
fi

echo "Installing dependencies..."
cd "$ROOT_DIR"
npm install

echo "Installing Playwright Chromium browser..."
npx playwright install chromium

echo "Linking CLI globally as wrench-logger..."
npm link

if [[ -f "${ROOT_DIR}/icon.png" ]]; then
  mkdir -p "${HOME}/.local/share/icons" "${HOME}/.local/share/applications"
  cp "${ROOT_DIR}/icon.png" "${HOME}/.local/share/icons/wrench-logger.png"
  cat > "${HOME}/.local/share/applications/wrench-logger.desktop" <<'EOF'
[Desktop Entry]
Type=Application
Name=Wrench Logger
Exec=wrench-logger --interactive
Icon=wrench-logger
Terminal=true
Categories=Development;Network;
EOF
fi

echo "Done. Run: wrench-logger --help"
