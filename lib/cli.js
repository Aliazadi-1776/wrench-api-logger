const inquirer = require('inquirer');
const chalkModule = require('chalk');
const chalk = chalkModule.default || chalkModule;
const { printBanner } = require('./banner');
const { logResponse, saveToJSON, saveToHAR, saveToBinary } = require('./logger');

async function run(options) {
  if (typeof options.realtime === 'undefined') options.realtime = true;
  if (typeof options.duration === 'undefined') options.duration = 0;

  let playwright;
  try {
    playwright = require('playwright');
  } catch (error) {
    if (error && error.code === 'MODULE_NOT_FOUND' && error.message.includes("'playwright'")) {
      throw new Error("Missing dependency: playwright. Install it with `npm install playwright`.");
    }
    throw error;
  }

  if (!options.quiet) printBanner();

  if (options.interactive || !options.url) {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'url', message: 'Enter target URL:', validate: (val) => val.startsWith('http') || 'Must be a valid URL' },
      { type: 'input', name: 'filter', message: 'Enter regex filter (e.g., api/*):', default: '.*' },
      { type: 'confirm', name: 'headless', message: 'Run headless?', default: true },
      { type: 'list', name: 'output', message: 'Output type:', choices: ['json', 'har', 'binary'] },
      { type: 'confirm', name: 'realtime', message: 'Show realtime logs?', default: true }
    ]);
    Object.assign(options, answers);
  }

  console.log(chalk.green(`Starting logger for ${options.url}...`));

  const browser = await playwright.chromium.launch({ headless: options.headless });
  const page = await browser.newPage();

  const responses = [];

  page.on('response', async (response) => {
    if (response.url().match(new RegExp(options.filter))) {
      const data = await logResponse(response);
      responses.push(data);

      if (options.realtime) {
        const now = new Date().toISOString();
        console.log(`[${now}] ${data.method} ${data.status} ${data.url} (${data.bodySize}B)`);
      }
    }
  });

  const parsedTimeout = Number.parseInt(options.timeout, 10);
  const timeout = Number.isFinite(parsedTimeout) ? parsedTimeout : 30000;
  await page.goto(options.url, { timeout });

  const parsedDuration = Number.parseInt(options.duration, 10);
  const duration = Number.isFinite(parsedDuration) ? parsedDuration : 0;
  if (duration > 0) {
    console.log(chalk.cyan(`Logger will stop automatically after ${duration}ms.`));
    await page.waitForTimeout(duration);
  } else {
    console.log(chalk.cyan('Logger is running. Press Ctrl+C to stop and save output.'));
    if (!options.headless) {
      console.log(chalk.cyan('You can also press Enter to stop.'));
    }
    await new Promise((resolve) => {
      let stopped = false;
      const stop = () => {
        if (stopped) return;
        stopped = true;
        process.removeListener('SIGINT', stop);
        process.removeListener('SIGTERM', stop);
        if (!options.headless) {
          process.stdin.removeListener('data', stop);
        }
        resolve();
      };

      process.once('SIGINT', stop);
      process.once('SIGTERM', stop);
      if (!options.headless) {
        process.stdin.once('data', stop);
      }
    });
  }

  await browser.close();

  // Save based on output
  if (options.output === 'json') saveToJSON(responses);
  else if (options.output === 'har') saveToHAR(responses);
  else if (options.output === 'binary') saveToBinary(responses);

  console.log(chalk.green('Logging complete! Check out/ folder.'));
}

module.exports = { run };
