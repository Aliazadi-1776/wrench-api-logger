const fs = require('fs');
const path = require('path');
const OUTPUT_DIR = 'out';

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

async function logResponse(response) {
  const body = await response.body().catch(() => Buffer.from(''));
  return {
    url: response.url(),
    method: response.request().method(),
    status: response.status(),
    headers: response.headers(),
    body: body.toString('utf-8'),
    bodySize: body.length
  };
}

function saveToJSON(responses) {
  ensureOutputDir();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'responses.json'), JSON.stringify(responses, null, 2));
}

function saveToHAR(responses) {
  ensureOutputDir();
  const har = {
    log: {
      version: '1.2',
      creator: { name: 'Playwright API Logger', version: '1.0' },
      entries: responses.map(res => ({
        startedDateTime: new Date().toISOString(),
        request: { method: res.method, url: res.url, headers: res.headers },
        response: { status: res.status, headers: res.headers, content: { size: res.bodySize, text: res.body } }
      }))
    }
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'capture.har'), JSON.stringify(har, null, 2));
}

function saveToBinary(responses) {
  ensureOutputDir();
  responses.forEach((res, index) => {
    fs.writeFileSync(path.join(OUTPUT_DIR, `response_${index}.bin`), Buffer.from(res.body));
  });
}

module.exports = { logResponse, saveToJSON, saveToHAR, saveToBinary };
