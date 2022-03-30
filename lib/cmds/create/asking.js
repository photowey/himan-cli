const inquirer = require('inquirer');
const { logger } = require('../../logger');

const {
    loadHimanDB
} = require('../../common/share')

/**
 * questions
 */
async function asking(config = {}) {

    let db = loadHimanDB()

    let questions = [{
        type: 'list',
        name: 'code',
        message: '新建项目所属产品代号?',
        default: 'uphicoo',
        choices: db['codes']
    },
    {
        type: 'input',
        name: 'name',
        message: '新建项目名称(supplychain,ips,...):',
        default: config['project'] ? config['project'].replace('-', '') : 'himan-app',
        validate(value) {
            if (value === '') {
                return '(・∀・(・∀・(・∀・*)请输入:项目名称!'
            } else {
                return true
            }
        }
    },
    {
        type: 'input',
        name: 'module',
        message: '新建项目模块(merchant,camera,...):',
        default: config['module'] ? config['module'].replace('-', '') : 'merchant',
        validate(value) {
            if (value === '') {
                return '(・∀・(・∀・(・∀・*)请输入:项目模块!'
            } else {
                return true
            }
        }
    },
    {
        type: 'input',
        name: 'version',
        message: '版本号:',
        default: '1.0.0',
        validate(value) {
            if (value === '') {
                return '(・∀・(・∀・(・∀・*)请输入:版本号!'
            } else {
                return true
            }
        }
    },
    {
        type: 'input',
        name: 'author',
        message: '作者:',
        validate(value) {
            if (value === '') {
                return '(・∀・(・∀・(・∀・*)请输入:项目作者!'
            } else {
                return true
            }
        }
    }
    ];

    return inquirer.prompt(questions).then(answers => ({
        ...answers
    }));
}

/**
 * Asking package.
 * @param {*} config 
 * @returns 
 */
async function packageAsking(config = {}) {
    let {
        code,
        name,
        project,
        module
    } = config

    let questions = []

    // supplychain.merchant
    // ips.camera
    let project_name = (name).replace(`${code}`, '').replace('-', '').replace('_', '')

    questions.push({
        type: 'input',
        name: '__package__',
        message: '新建项目包名:',
        // com.uphicoo.supplychain.merchant
        default: `com.${code}.${project_name}.${module}`
    })

    return inquirer.prompt(questions).then(answers => ({
        ...answers
    }));
}

/**
 * The confirm of the input info of project.
 * @param {*} config 
 * @returns 
 */
async function confirmInput(config = {}) {
    let questions = []

    questions.push({
        type: 'confirm',
        name: 'confirm',
        message: '确认项目信息?',
        default: true
    })

    return inquirer.prompt(questions).then(answers => ({
        ...answers
    }));
}

module.exports = {
    asking,
    packageAsking,
    confirmInput
}