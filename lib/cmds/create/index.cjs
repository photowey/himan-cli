/**
 * $ himan create cmd handler.
 */

// Charset.
// const iconv = require('iconv-lite');

const path = require('path');

const {
    asking,
    packageAsking,
    confirmInput
} = require('./asking');

const {
    logger
} = require('../../logger/index.js');

const functions = require('../../utils/functions.utils');
const formatter = require('../../utils/date.formatter')
const git = require('../../utils/git.utils');
const generator = require('../../utils/generator');

const {
    loadHimanDB
} = require('../../common/share')

const {
    TEMP_DIR
} = require('../../utils/constants');

// const unzip = require('../../utils/unzip');

/**
 * Handlde the $ himan create cmd.
 * @param {*} config 
 */
async function create(config = {}) {

    var db = loadHimanDB()
    let gitUrl = db['repository']
    let projectName = path.basename(gitUrl);
    projectName = projectName.endsWith('.git') ? projectName.replace(new RegExp(`\\.git`, "g"), '') : projectName
    let downloadPath = path.join(TEMP_DIR, projectName);

    let deleteLocalTemplate = !!config['deleteLocalTemplate'] || false
    if (deleteLocalTemplate) {
        functions.deleteFolder(downloadPath)
    }

    functions.ensureDirSync(downloadPath)

    // 1.Fetch template from git
    // local(default) || remote
    var local = db['template'] || 'local'
    if(local !== 'local') {
        await git.fetchTemplate(gitUrl, projectName, downloadPath, true);
    }

    // 2.Asking some questions.
    const answers = await doAsking(config);
    answers['PROJECT'] = functions.firstToUpperCase(functions.toCamelCase(config['project'].replace('-', '_')))

    // 3.Do code generate.
    await handleGenerate(answers, db)
}

/**
 * Generate the project.
 * @param {*} answers 
 */
async function handleGenerate(answers, db = {}) {
    populateJavaPackagePath(answers)
    populateDate(answers)
    populateParent(answers, db)

    await generator.doGenerate(answers)
}

/**
 * Populate java src path.
 * @param {*} answers 
 */
function populateJavaPackagePath(answers) {

    answers['appName'] = `${answers['code']}${answers['name']}`
    answers['__version__'] = `${answers['version']}-SNAPSHOT`
}

/**
 * Populate date.
 * @param {*} answers 
 */
function populateDate(answers) {
    let now = new Date()
    answers['now'] = formatter.format(now, 'yyyy/MM/dd')
    answers['date'] = formatter.format(now, 'yyyy/MM/dd')
}

/**
 * Poulate parent-module maven coordinate.
 * @param {*} answers 
 * @param {*} db 
 */
function populateParent(answers, db = {}) {
    functions.cloneProperty(answers, db, 'rootGroupId')
    functions.cloneProperty(answers, db, 'rootArtifactId')
    functions.cloneProperty(answers, db, 'rootVersion')
}

/**
 * Asking some questions.
 * @param {*} config 
 * @returns 
 */
async function doAsking(config) {

    const answers = await asking(config);
    functions.cloneProperty(config, answers, 'code')
    functions.cloneProperty(config, answers, 'name')
    functions.cloneProperty(config, answers, 'module')

    functions.cloneProperty(answers, config, 'project')
    functions.cloneProperty(answers, config, 'projectDir')

    // 暂时-不分机房
    answers['configURI'] = answers.code === 'uphicoo' ? 'http://127.0.0.1:8848' : 'http://127.0.0.1:8848'

    answers['groupId'] = `com.${answers.code}`
    answers['artifactId'] = answers['project']

    // Package
    const package = await packageAsking(config);
    functions.cloneProperty(answers, package, '__package__')
    answers['__package_path__'] = answers['__package__'].replace(new RegExp(`${path.sep}.`, "g"), `${path.sep}`)

    // Report
    logger.white('------------------------------------------------------------------')
    logger.red(`$ himan create report:`)
    logger.green(`项目: ${answers['project']}`)
    logger.green(`产品代号: ${answers['code']}`)
    logger.green(`名称: ${answers['name']}`)
    logger.green(`模块: ${answers['module']}`)
    logger.green(`包名: ${answers['__package__']}`)
    logger.white('------------------------------------------------------------------')

    // Confirm the input infos.
    const confirm = await confirmInput(config);
    if (!confirm['confirm']) {
        logger.red(`项目信息输入有误,交互即将退出,请稍后重试...￣□￣｜｜`)
        process.exit(1)
    }

    return answers
}

module.exports = {
    create
}