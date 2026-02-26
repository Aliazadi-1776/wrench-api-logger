const mockLogResponse = jest.fn().mockResolvedValue({
  method: 'GET',
  status: 200,
  url: 'https://example.com/api',
  bodySize: 2
});
const mockSaveToJSON = jest.fn();
const mockSaveToHAR = jest.fn();
const mockSaveToBinary = jest.fn();

const mockBrowserClose = jest.fn().mockResolvedValue();
const mockPageWaitForTimeout = jest.fn().mockResolvedValue();
const mockPageGoto = jest.fn().mockResolvedValue();
const mockPageOn = jest.fn();
const mockPage = {
  on: mockPageOn,
  goto: mockPageGoto,
  waitForTimeout: mockPageWaitForTimeout
};
const mockBrowser = {
  newPage: jest.fn().mockResolvedValue(mockPage),
  close: mockBrowserClose
};
const mockLaunch = jest.fn().mockResolvedValue(mockBrowser);

jest.mock('playwright', () => ({
  chromium: {
    launch: mockLaunch
  }
}), { virtual: true });

jest.mock('../lib/banner', () => ({
  printBanner: jest.fn()
}));

jest.mock('../lib/logger', () => ({
  logResponse: mockLogResponse,
  saveToJSON: mockSaveToJSON,
  saveToHAR: mockSaveToHAR,
  saveToBinary: mockSaveToBinary
}));

const { run } = require('../lib/cli');

beforeEach(() => {
  jest.clearAllMocks();
});

test('run does not throw error with minimal options', async () => {
  const options = { url: 'https://example.com', filter: '.*', output: 'json', headless: true, timeout: '5000', duration: '10' };
  await expect(run(options)).resolves.toBeUndefined();

  expect(mockLaunch).toHaveBeenCalledWith({ headless: true });
  expect(mockPageGoto).toHaveBeenCalledWith('https://example.com', { timeout: 5000 });
  expect(mockPageWaitForTimeout).toHaveBeenCalledWith(10);
  expect(mockBrowserClose).toHaveBeenCalled();
  expect(mockSaveToJSON).toHaveBeenCalledWith([]);
});

test('run saves HAR when output is har', async () => {
  const options = { url: 'https://example.com', filter: '.*', output: 'har', headless: true, timeout: '5000', duration: '10' };
  await expect(run(options)).resolves.toBeUndefined();
  expect(mockSaveToHAR).toHaveBeenCalledWith([]);
  expect(mockSaveToJSON).not.toHaveBeenCalled();
  expect(mockSaveToBinary).not.toHaveBeenCalled();
});

test('run saves binary when output is binary', async () => {
  const options = { url: 'https://example.com', filter: '.*', output: 'binary', headless: true, timeout: '5000', duration: '10' };
  await expect(run(options)).resolves.toBeUndefined();
  expect(mockSaveToBinary).toHaveBeenCalledWith([]);
  expect(mockSaveToJSON).not.toHaveBeenCalled();
  expect(mockSaveToHAR).not.toHaveBeenCalled();
});
