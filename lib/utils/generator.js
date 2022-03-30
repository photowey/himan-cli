const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const {
    PROJECT_TEMPLATE_NAME,
    TEMP_DIR
} = require('../../lib/utils/constants')

const replacer = require('../../lib/utils/replace.variables');

const {
    logger
} = require('../logger');


const functions = require('./functions.utils')

const parent = TEMP_DIR

const templateParentDir = `${parent}${path.sep}${PROJECT_TEMPLATE_NAME}`

/**
 * Generate the Java code.
 * @param {*} context the context of var's of for template placeholders.
 */
async function doGenerate(context) {

    checkEvn()

    logger.green(`✨ Creating prohect:[${context['name']}] in ${context['projectDir']}.`)
    await recursiveSearchAsync(templateParentDir, context)

    logger.white('------------------------------------------------------------------')
    logger.red(`⚓ Successfully created project:[${context['name']}].`)
    logger.red(`⚙️ Get started with the following commands:`)
    logger.log(`${chalk.red('$')} ${chalk.cyan('cd ' + context['name'])}`)
    logger.log(`${chalk.red('$')} ${chalk.cyan('mvn install -DskipTests')}`)
    logger.log(`${chalk.red('$')} ${chalk.cyan('mvn spring-boot:run')}`)
    logger.white('------------------------------------------------------------------')
}

/**
 * Check the runtime evn.
 * @param {*} params
 */
function checkEvn(config = {}) {
    if (!functions.hasJava()) {
        logger.warnRed(`the machine not installed the JAVA, visit the oracle home page:[https://www.oracle.com/index.html] to download`)
    }
    if (!functions.hasMvn()) {
        logger.warnRed(`the machine not installed the MAVEN, visit the maven home page:[https://maven.apache.org/] to download`)
    }
}

/**
 * Asynchronously read the target-path，use recursive.
 * @param {*} templateParentDir
 * @param {*} context
 */
async function recursiveSearchAsync(targetPath, context) {
    let {
        project,
        projectDir,
        __package_path__
    } = context

    let projectBaseDir = `${projectDir}${path.sep}${project}`
    fs.readdir(targetPath, function (err, files) {
        if (err) {
            logger.red(err)
        } else {
            files.forEach(function (filename) {
                var filedir = path.join(targetPath, filename);
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        logger.red('read the file failure.');
                    } else {
                        var isFile = stats.isFile();
                        var isDir = stats.isDirectory();
                        if (isFile) {
                            let fileName = `${projectBaseDir}${filedir.substr(templateParentDir.length)}`

                            // Replace the template file name to the target file name.
                            fileName = fileName.replace(PROJECT_TEMPLATE_NAME, `${project}`)
                            fileName = fileName.replace(`com${path.sep}uphicoo${path.sep}project${path.sep}template`, `${__package_path__}`)

                            // ${PROJECT}
                            fileName = replacer.replaceVariables(fileName, context)

                            // Read the Template file content.
                            let fileContent = fs.readFileSync(filedir, 'UTF-8')
                            // Replace the all placeholders.
                            fileContent = replacer.replaceVariables(fileContent, context)
                            // Write the file.
                            fs.outputFileSync(fileName, fileContent)
                            logger.info(`${chalk.cyan('create')} | ${chalk.yellow(fileName.substr((`${projectDir}`.length) + 1))}`)
                        }
                        if (isDir) {
                            // Recursive.
                            recursiveSearchAsync(filedir, context);
                        }
                    }
                })
            });
        }
    });
}

module.exports = {
    doGenerate
}