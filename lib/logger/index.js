/**
 * $ himan cli logger.
 */
const chalk = require('chalk');

// ================================================================= logger.init()

/**
 * init()
 * @param {*} program 
 */
const init = function (program) {
  program.option('-d, --debug', 'enable debugger');

  this.debugEnabled = process.argv.includes('-d') || process.argv.includes('--debug'); // Need this early
  if (this.debugEnabled) {
    info('Debug logging is on');
  }
};

// ================================================================= logger.xxx()

/**
 * dir()
 * @param {*} msg 
 */
const dir = function (msg) {
  console.dir(msg);
};

/**
 * log()
 * @param {*} msg 
 */
const log = function (msg) {
  console.log(msg);
};

/**
 * debug()
 * @param {*} msg 
 */
const debug = function (msg) {
  if (this.debugEnabled) {
    console.log(`${chalk.blue('[DEBUG]')} | ${msg}`);
  }
};

/**
 * info()
 * @param {*} msg 
 */
const info = function (msg) {
  console.info(`${chalk.green.bold('[INFO]')} | ${msg}`);
};

/**
 * infoYellow()
 * @param {*} msg 
 */
const infoYellow = function (msg) {
  console.info(`${chalk.green.bold('[INFO]')} | ${chalk.yellow(msg)}`);
};


/**
 * warn()
 * @param {*} msg 
 * @param {*} trace 
 */
const warn = function (msg, trace = false) {
  console.warn(`${chalk.yellow.bold('[WARN]')} | ${chalk.yellow(msg)}`);
  if (trace) {
    console.log(trace);
  }
};

/**
 *warnRed() 
 * @param {*} msg 
 * @param {*} trace 
 */
const warnRed = function (msg, trace = false) {
  console.warn(`${chalk.red.bold('[WARN]')} | ${chalk.yellow(msg)}`);
  if (trace) {
    console.log(trace);
  }
};

/**
 * error
 * @param {*} msg 
 * @param {*} trace 
 */
const error = function (msg, trace = false) {
  console.error(`${chalk.red.bold('[ERROR]')} | ${chalk.red(msg)}`);
  if (trace) {
    console.log(trace);
  }
  // process.exitCode = 1;
};

/**
 * Use with caution.
 * process.exit is not recommended by Node.js.
 * Refer to https://nodejs.org/api/process.html#process_process_exit_code.
 */
const fatal = function (msg, trace) {
  console.error(`${chalk.red(msg)}`);
  if (trace) {
    console.log(trace);
  }
  // process.exit(1);
};

// ================================================================= logger.color()
/**
 * white()
 * @param {*} msg 
 */
const white = function (msg) {
  console.log(`${chalk.white(msg)}`);
};

/**
 * green()
 * @param {*} msg 
 */
const green = function (msg) {
  console.log(`${chalk.green(msg)}`);
};

/**
 * cyan()
 * @param {*} msg 
 */
const cyan = function (msg) {
  console.log(`${chalk.cyan(msg)}`);
};

/**
 * yellow()
 * @param {*} msg 
 */
const yellow = function (msg) {
  console.log(`${chalk.yellow(msg)}`);
};

/**
 * red()
 * @param {*} msg 
 */
const red = function (msg) {
  console.log(`${chalk.red(msg)}`);
};

// =================================================================

/**
 * Export logger.
 */
const logger = {
  init,
  dir,
  log,
  debug,
  info,
  infoYellow,
  warn,
  warnRed,
  error,
  fatal,
  white,
  green,
  cyan,
  yellow,
  red
};


module.exports = {
  logger
};