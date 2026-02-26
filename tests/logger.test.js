const fs = require('fs');
const os = require('os');
const path = require('path');
const { saveToJSON, saveToHAR, saveToBinary } = require('../lib/logger');

describe('logger output writers', () => {
  let tempDir;
  let originalCwd;

  beforeEach(() => {
    originalCwd = process.cwd();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'api-logger-test-'));
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('saveToJSON creates out directory and file', () => {
    saveToJSON([{ url: 'https://example.com', method: 'GET', status: 200 }]);
    expect(fs.existsSync(path.join(tempDir, 'out', 'responses.json'))).toBe(true);
  });

  test('saveToHAR creates out directory and file', () => {
    saveToHAR([{ url: 'https://example.com', method: 'GET', status: 200, headers: {}, bodySize: 0, body: '' }]);
    expect(fs.existsSync(path.join(tempDir, 'out', 'capture.har'))).toBe(true);
  });

  test('saveToBinary creates out directory and binary files', () => {
    saveToBinary([{ body: 'abc' }, { body: 'xyz' }]);
    expect(fs.existsSync(path.join(tempDir, 'out', 'response_0.bin'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'out', 'response_1.bin'))).toBe(true);
  });
});
