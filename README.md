# 🔧 Wrench Logger

![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-API%20Capture-2EAD33?logo=playwright&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-Debian-FCC624?logo=linux&logoColor=black)

یک ابزار CLI برای کپچر و لاگ گرفتن از API responseها با Playwright 👨‍💻  
A CLI tool to capture and log API responses with Playwright.

---

## 📦 Download (One Click)

- 🐧 Debian Package (.deb): [⬇️ Download](./dist/wrench-logger_1.0.0_amd64.deb)

---

## 🇮🇷 راهنمای فارسی

### نصب سریع
```bash
./install.sh
wrench-logger --help
```

### نصب نسخه Debian
```bash
sudo dpkg -i ./dist/wrench-logger_1.0.0_amd64.deb
```

نصب اولیه مرورگر Chromium برای Playwright (فقط یک‌بار):
```bash
node /opt/wrench-logger/node_modules/playwright/cli.js install chromium
```

بعد از نصب `.deb`، با کلیک روی آیکون برنامه در منو، `wrench-logger --interactive` باز می‌شود.

### استفاده
```bash
wrench-logger --url https://example.com --filter "api|graphql" --headless --output json
```

گزینه‌های مهم:
- `--url <url>` آدرس سایت هدف
- `--filter <regex>` فیلتر درخواست‌ها
- `--output <json|har|binary>` نوع خروجی
- `--realtime` لاگ لحظه‌ای
- `--interactive` حالت تعاملی
- `--duration <ms>` توقف خودکار؛ اگر `0` باشد اپ باز می‌ماند تا Stop دستی

---

## 🇬🇧 English Guide

### Quick install (from clone)
```bash
./install.sh
wrench-logger --help
```

### Install Debian package
```bash
sudo dpkg -i ./dist/wrench-logger_1.0.0_amd64.deb
```

Install Playwright Chromium browser once after package install:
```bash
node /opt/wrench-logger/node_modules/playwright/cli.js install chromium
```

After `.deb` install, clicking the app icon launches `wrench-logger --interactive`.

### Usage example
```bash
wrench-logger --url https://example.com --filter "api|graphql" --headless --output json
```

Key options:
- `--url <url>` target website
- `--filter <regex>` API URL filter
- `--output <json|har|binary>` output format
- `--realtime` live response logs
- `--interactive` interactive mode
- `--duration <ms>` auto-stop; `0` keeps it running until manual stop

---

## 🧪 Test
```bash
npm test
```

## 🏗 Build
```bash
npm run build:deb
```

## 🎯 Output files
- `out/responses.json`
- `out/capture.har`
- `out/response_*.bin`

ساخته شده با عشق و کافئین ☕✨  
Built with coffee and curiosity.
