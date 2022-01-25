const fs = require('fs-extra');

const {
    TEMP_DIR
} = require('../../lib/utils/constants');

const git = require('download-git-repo');

const {
    logger
} = require('../logger')

/**
 * Fetch the template.
 * @param {*} gitUrl
 * @param {*} projectName
 * @param {*} downloadPath
 * @param {*} forceGitClone
 * @returns
 */
function fetchTemplate(gitUrl, projectName, downloadPath, forceGitClone = true) {
    return new Promise((resolve, reject) => {

        // https://www.npmjs.com/package/download-git-repo
        let url = 'direct:' + (gitUrl.endsWith('.git') ? gitUrl : gitUrl + '.git') + '#main'

        logger.cyan(`-----------------------git clone report-----------------------`)
        logger.cyan(`project name:           ${projectName}`)
        logger.cyan(`template download path: ${downloadPath}`)
        logger.cyan(`git repository url:     ${gitUrl}`)
        logger.cyan(`-----------------------git clone report-----------------------`)
        logger.cyan(`$ git clone ${gitUrl} ...`)

        git(url, downloadPath, { clone: forceGitClone }, function (err) {
            if (err) {
                logger.red(`fetch the template:[${projectName}] failure... `)
                console.log(err);
                reject(err);
                process.exit(1);
            } else {
                resolve({
                    TEMP_DIR,
                    projectName,
                    downloadPath
                });
                logger.green(`fetch the template:[${projectName}] successfully... `)
            }
        })
    });
};

module.exports = {
    fetchTemplate
};