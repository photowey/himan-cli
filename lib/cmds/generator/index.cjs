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
 
 /**
  * 代码生成器入口
  * 异步生成代码
  * @param {*} config 
  */
 async function asyncGenerate(config = {}) {
 
   const projectDir = config['projectDir'] || path.resolve(process.cwd(), '.');
 
   // Asking
   const answers = await doAsking(config);
 
   const projectName = `${answers['code']}-${answers['project']}`
   const mvnJavaPath = `src${path.sep}main${path.sep}java`
   const mvnResourcePath = `src${path.sep}main${path.sep}resources`
 
   const providerPath = answers['__package_path__']
   const providerRootPath = `${projectDir}${path.sep}${projectName}${path.sep}`
 
   const domainPath = `${projectDir}${path.sep}${projectName}${path.sep}${projectName}-core${path.sep}${mvnJavaPath}${path.sep}${providerPath}${path.sep}core${path.sep}domain${path.sep}`
   const entityPath = `${domainPath}entity${path.sep}`
   const dtoPath = `${domainPath}dto${path.sep}`
 
   const providerProjectPath = `${projectDir}${path.sep}${projectName}${path.sep}${projectName}-provider${path.sep}${mvnJavaPath}${path.sep}${providerPath}${path.sep}provider${path.sep}`
 
   let repositoryPath = `${providerProjectPath}repository${path.sep}`
   repositoryPath = repositoryPath.replace(`${projectName}-provider`, `${projectName}-repository`)
 
   const hbmPath = `${repositoryPath}hbm${path.sep}`
   const guzzPath = `${projectDir}${path.sep}${projectName}${path.sep}${projectName}-repository${path.sep}${mvnResourcePath}${path.sep}`
 
   let servicePath = `${providerProjectPath}service${path.sep}`
   servicePath = servicePath.replace(`${projectName}-provider`, `${projectName}-service`)
 
   const serviceImplPath = `${servicePath}impl${path.sep}`
   const mapperPath = `${servicePath}mapper${path.sep}`
 
   const controllerPath = `${providerProjectPath}controller${path.sep}`
 
   let setting = {
     domainPath,
     entityPath,
     dtoPath,
     providerPath,
     providerRootPath,
     providerProjectPath,
     repositoryPath,
     hbmPath,
     guzzPath,
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
   let databaseName = answers['databaseName']
   config['database']['database'] = databaseName
 
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
   logger.green(`工程: ${config['code']}-${config['project']}`)
   logger.green(`包名: ${config['__package__']}`)
   logger.white('------------------------------------------------------------------')
 
   return config
 }
 
 module.exports = {
   asyncGenerate
 }