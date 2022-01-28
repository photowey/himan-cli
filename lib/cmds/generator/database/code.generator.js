const os = require('os')
const path = require('path');

const dao = require('./dao')
const formatter = require('../../../utils/date.formatter')
const render = require('../resources/render');

/**
 * Generate()
 */
async function asyncGenerate(config = {}) {

  let databaseName = config['database']['database']
  let tablePrefix = config['database']['tablePrefix'] || ''

  let author = config['author'] || os.hostname()
  let version = config['version'] || '1.0.0'
  let now = new Date()
  let today = formatter.format(now, 'yyyy/MM/dd')

  config['sep'] = `${path.sep}`

  let tables = await dao.asyncTableInfos(databaseName, config['database'])
  let tableInfos = await dao.asyncColumnInfos(databaseName, tablePrefix, tables, config)

  let tableInfoArray = Array.from(tableInfos)
  tableInfoArray.forEach((tableInfo) => {
    let base = {
      author: `${author}`,
      date: `${today}`,
      version: `${version}`,
      tableInfo: tableInfo,
      package: tableInfo['package'],
      entity: tableInfo['entityName'],
      dto: tableInfo['dtoName']
    }

    // Entity
    generateEntity(base, tableInfo, config)
    // DTO
    generateDto(base, tableInfo, config)

    // Repository
    generateRepository(base, tableInfo, config)

    // Service
    generateService(base, tableInfo, config)
    // ServiceImpl
    generateServiceImpl(base, tableInfo, config)

    // Mapper
    generateMapper(base, tableInfo, config)

    // Controller
    generateController(base, tableInfo, config)
  })
}


async function generateEntity(base = {}, tableInfo = {}, config = {}) {
  let context = {
    webRootPath: config['webRootPath'],
    fileName: `${config['entityPath']}${tableInfo['entityName']}.java`,
    ...base
  }
  render.asyncRender('entity.ftl', context)
}


async function generateDto(base = {}, tableInfo = {}, config = {}) {
  let context = {
    webRootPath: config['webRootPath'],
    fileName: `${config['dtoPath']}${tableInfo['dtoName']}.java`,
    ...base
  }
  render.asyncRender('dto.ftl', context)
}


async function generateRepository(base = {}, tableInfo = {}, config = {}) {
  let context = {
    webRootPath: config['webRootPath'],
    fileName: `${config['repositoryPath']}${tableInfo['entityName']}Repository.java`,
    ...base
  }
  render.asyncRender('repository.ftl', context)
}


async function generateService(base = {}, tableInfo = {}, config = {}) {
  let context = {
    webRootPath: config['webRootPath'],
    fileName: `${config['servicePath']}${tableInfo['entityName']}Service.java`,
    ...base
  }
  render.asyncRender('service.ftl', context)
}


async function generateServiceImpl(base = {}, tableInfo = {}, config = {}) {
  let context = {
    webRootPath: config['webRootPath'],
    fileName: `${config['serviceImplPath']}${tableInfo['entityName']}ServiceImpl.java`,
    ...base
  }
  render.asyncRender('service-impl.ftl', context)
}


async function generateMapper(base = {}, tableInfo = {}, config = {}) {
  let context = {
    webRootPath: config['webRootPath'],
    fileName: `${config['mapperPath']}${tableInfo['entityName']}Mapper.java`,
    ...base
  }
  render.asyncRender('mapper.ftl', context)
}


async function generateController(base = {}, tableInfo = {}, config = {}) {
  let context = {
    webRootPath: config['webRootPath'],
    fileName: `${config['controllerPath']}${tableInfo['entityName']}Controller.java`,
    ...base
  }
  render.asyncRender('controller.ftl', context)
}


module.exports = {
  asyncGenerate
}