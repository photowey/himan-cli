const path = require('path')
const fs = require('fs-extra');

const {
    logger
} = require('../../../logger');

/**
 * Freemarker instance
 */
const Freemarker = require('freemarker.js')
const freemarker = new Freemarker({
    viewRoot: path.join(__dirname, './templates'),
    options: {}
});

/**
 * Async render freemarker template file and return Promise.
 * @param {*} templateName the name of template
 * @param {*} context the render context
 * @returns 
 */
async function asyncRenderPromise(templateName, context) {
    return new Promise((resolve, reject) => {
        try {
            let fileContent = freemarker.renderSync(templateName, context)
            if (fileContent) {
                fs.outputFileSync(`${context.fileName}`, fileContent)
                console.log('create file:%s successfully...', `${context['fileName']}`)
                resolve('success')
            } else {
                reject('fail')
            }
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Async render freemarker template file.
 * @param {*} templateName the name of template
 * @param {*} context the render context
 * @returns 
 */
async function asyncRender(templateName, context) {
    try {
        let fileContent = freemarker.renderSync(templateName, context)
        let rootLength = `${context['providerRootPath']}`.length
        let fileName = `${context['fileName']}`.substring(rootLength)
        if (fileContent) {
            fs.outputFileSync(`${context.fileName}`, fileContent)
            logger.infoYellow(`--- >>> create file: --- ${fileName} successfully <<< ---`)
        }
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    asyncRenderPromise,
    asyncRender
}