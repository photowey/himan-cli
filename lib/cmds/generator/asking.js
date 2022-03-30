const inquirer = require('inquirer');

const {
  loadHimanDB
} = require('../../../lib/common/share')

const functions = require('../../utils/functions.utils');

/**
 * questions
 */
async function asking(config = {}) {

  let db = loadHimanDB()

  let database = db['database']
  if (!!database) {
    config['database'] = database
  }

  let questions = []

  questions.push({
    type: 'list',
    name: 'code',
    message: '新建项目所属产品代号?',
    default: 'uphicoo',
    choices: db['codes']
  })

  if (!(!!config['project'])) {
    questions.push({
      type: 'input',
      name: 'project',
      message: '新建项目名称(supplychain,ips,...):',
      default: config['project'] || 'himanapp',
      validate(value) {
        if (value === '') {
          return '(・∀・(・∀・(・∀・*)请输入:逆向工程名称!'
        } else {
          return true
        }
      }
    })
  }

  if (!(!!config['module'])) {
    questions.push({
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
    })
  }


  if (!!database && !(!!database['database'])) {
    questions.push({
      type: 'input',
      name: 'database',
      message: '数据库:',
      validate(value) {
        if (value === '') {
          return '(・∀・(・∀・(・∀・*)请输入:数据库!'
        } else {
          return true
        }
      }
    })
  }

  if (!!database && functions.isEmpty((database['tablePrefix'] || []))) {
    questions.push({
      type: 'input',
      name: 'tablePrefix',
      message: '数据表前缀:',
      validate(value) {

        /*if (value === '') {
          return '(・∀・(・∀・(・∀・*)请输入:数据表前缀!'
        } else {
          return true
        }*/

        return true
      }
    })
  }

  let questionInners = [
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

  questionInners.forEach(question => {
    questions.push(question)
  })

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
    module,
    project
  } = config

  let questions = []

  questions.push({
    type: 'input',
    name: '__package__',
    message: '新建项目包名:',
    default: `com.${code}.${project.replace('-', '')}.${module}`
  })

  return inquirer.prompt(questions).then(answers => ({
    ...answers
  }));
}

module.exports = {
  asking,
  packageAsking
}