#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="wrench-logger"
CLI_NAME="wrench-logger"
VERSION="$(node -p "require('${ROOT_DIR}/package.json').version")"
DIST_DIR="${ROOT_DIR}/dist"
WORK_DIR="${DIST_DIR}/deb-work"
PKG_DIR="${WORK_DIR}/pkg"
INSTALL_DIR="/opt/${APP_NAME}"

rm -rf "${WORK_DIR}"
mkdir -p "${PKG_DIR}/DEBIAN" "${PKG_DIR}${INSTALL_DIR}" "${PKG_DIR}/usr/bin" "${PKG_DIR}/usr/share/applications" "${PKG_DIR}/usr/share/pixmaps"

cp -a "${ROOT_DIR}/bin" "${PKG_DIR}${INSTALL_DIR}/"
cp -a "${ROOT_DIR}/lib" "${PKG_DIR}${INSTALL_DIR}/"
cp -a "${ROOT_DIR}/node_modules" "${PKG_DIR}${INSTALL_DIR}/"
cp -a "${ROOT_DIR}/package.json" "${PKG_DIR}${INSTALL_DIR}/"
cp -a "${ROOT_DIR}/package-lock.json" "${PKG_DIR}${INSTALL_DIR}/"
cp -a "${ROOT_DIR}/install.sh" "${PKG_DIR}${INSTALL_DIR}/"
cp -a "${ROOT_DIR}/icon.png" "${PKG_DIR}/usr/share/pixmaps/${CLI_NAME}.png"

cat > "${PKG_DIR}/usr/bin/${CLI_NAME}" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
APP_DIR="/opt/wrench-logger"
export NODE_PATH="${APP_DIR}/node_modules"
exec node "${APP_DIR}/bin/wrench-logger" "$@"
EOF
chmod 755 "${PKG_DIR}/usr/bin/${CLI_NAME}"

cat > "${PKG_DIR}/usr/share/applications/${CLI_NAME}.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=Wrench Logger
Exec=${CLI_NAME} --interactive
Icon=${CLI_NAME}
Terminal=true
Categories=Development;Network;
EOF

cat > "${PKG_DIR}/DEBIAN/control" <<EOF
Package: ${CLI_NAME}
Version: ${VERSION}
Section: utils
Priority: optional
Architecture: amd64
Maintainer: Aliazadi-1776
Depends: nodejs (>= 18)
Description: CLI tool to capture and log API responses using Playwright.
EOF

cat > "${PKG_DIR}/DEBIAN/postinst" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
APP_DIR="/opt/wrench-logger"
if command -v node >/dev/null 2>&1; then
  node "${APP_DIR}/node_modules/playwright/cli.js" install chromium || true
fi
EOF
chmod 755 "${PKG_DIR}/DEBIAN/postinst"

mkdir -p "${DIST_DIR}"
OUTPUT_DEB="${DIST_DIR}/${CLI_NAME}_${VERSION}_amd64.deb"
dpkg-deb --root-owner-group --build "${PKG_DIR}" "${OUTPUT_DEB}"
echo "Built: ${OUTPUT_DEB}"
