const inquirer = require('inquirer');

const {
  loadHimanDB
} = require('../deploy/asking')

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
    default: 'zcj',
    choices: db['codes']
  })

  if (!(!!config['project'])) {
    questions.push({
      type: 'input',
      name: 'project',
      message: '逆向工程名称(stockapply,contract,org,...):',
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

  if (!!database && !(!!database['database'])) {
    questions.push({
      type: 'input',
      name: 'databaseName',
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

  let questionInners = [{
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
    project
  } = config

  let questions = []

  questions.push({
    type: 'input',
    name: '__package__',
    message: '新建项目包名:',
    default: `com.${code}.${project.replace('-', '.')}`
  })

  return inquirer.prompt(questions).then(answers => ({
    ...answers
  }));
}

module.exports = {
  asking,
  packageAsking
}