/**
 * $ himan generator cmd handler.
 */

const path = require('path');

const generator = require('./database/code.generator')
const functions = require('../../utils/functions.utils');

const {
  logger
} = require('../../logger');

const {
  asking,
  packageAsking
} = require('./asking');
const { basename } = require('path');

/**
 * Entry
 * @param {*} config 
 */
async function asyncGenerate(config = {}) {

  const projectDir = config['projectDir'] || path.resolve(process.cwd(), '.');

  // Asking
  const answers = await doAsking(config);

  // const projectName = `${answers['code']}-${answers['project']}`
  const projectName = `${answers['project']}`
  const mvnJavaPath = `src${path.sep}main${path.sep}java`

  const webPath = answers['__package_path__']
  const domainSrcPath = answers['__package_path__'].replace('/web','')
  const webRootPath = `${projectDir}${path.sep}${projectName}${path.sep}`

  const domainPath = `${projectDir}${path.sep}${projectName}${path.sep}${projectName}-core${path.sep}${mvnJavaPath}${path.sep}${domainSrcPath}${path.sep}core${path.sep}domain${path.sep}`
  const entityPath = `${domainPath}entity${path.sep}`
  const dtoPath = `${domainPath}dto${path.sep}`

  const webProjectPath = `${projectDir}${path.sep}${projectName}${path.sep}${projectName}-web${path.sep}${mvnJavaPath}${path.sep}${webPath}${path.sep}web${path.sep}`

  let repositoryPath = `${webProjectPath}repository${path.sep}`
  repositoryPath = repositoryPath.replace(`${projectName}-web`, `${projectName}-repository`)

  let servicePath = `${webProjectPath}service${path.sep}`
  servicePath = servicePath.replace(`${projectName}-web`, `${projectName}-service`)

  const serviceImplPath = `${servicePath}impl${path.sep}`
  const mapperPath = `${servicePath}mapper${path.sep}`

  const controllerPath = `${webProjectPath}controller${path.sep}`

  let setting = {
    domainPath,
    entityPath,
    dtoPath,
    webPath,
    webRootPath,
    webProjectPath,
    repositoryPath,
    servicePath,
    serviceImplPath,
    mapperPath,
    controllerPath,
    ...answers
  }

  await generator.asyncGenerate(setting)
}

/**
 * Asking some questions.
 * @param {*} config 
 * @returns 
 */
async function doAsking(config) {

  const answers = await asking(config);

  // config.database.
  let database = config['database']
  let databaseName = database['database']
  let tablePrefix = database['tablePrefix']

  if (!!!databaseName) {
    databaseName = answers['database']
  }
  if (!!!tablePrefix) {
    tablePrefix = answers['tablePrefix']
  }

  // Deep clone
  functions.deepCloneProperty(config, answers)

  // Package
  const package = await packageAsking(config);
  functions.cloneProperty(config, package, '__package__')
  config['__package_path__'] = config['__package__'].replace(new RegExp(`${path.sep}.`, "g"), `${path.sep}`)

  // Report
  logger.white('------------------------------------------------------------------')
  logger.red(`$ himan generator report:`)
  logger.green(`产品代号: ${config['code']}`)
  logger.green(`项目: ${config['project']}`)
  logger.green(`工程: ${config['project']}`)
  logger.green(`模块: ${config['module']}`)
  logger.green(`包名: ${config['__package__']}`)
  logger.green(`数据库: ${databaseName}`)
  logger.green(`表前缀: ${tablePrefix}`)
  logger.white('------------------------------------------------------------------')

  return config
}

module.exports = {
  asyncGenerate
}