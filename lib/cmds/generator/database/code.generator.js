const os = require('os')
const path = require('path');

const dao = require('./dao')
const formatter = require('../utils/date.formatter')
const render = require('../resources/render')


/**
 * Generate()
 */
async function asyncGenerate(config = {}) {
  let databaseName = config['databaseName']
  let tablePrefix = config['tablePrefix'] || ''
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

    // hbm.xml
    generateHbm(base, tableInfo, config)
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

  let businesses = []
  tableInfoArray.forEach((tableInfo) => {
    let guzzArray = Array.from(tableInfo.guzzs)
    guzzArray.forEach((business) => {
      businesses.push(business)
    })
  })

  // guzz.xml
  generateGuzz(businesses, config)
}


async function generateEntity(base = {}, tableInfo = {}, config = {}) {
  let context = {
    providerRootPath: config['providerRootPath'],
    fileName: `${config['entityPath']}${tableInfo['entityName']}.java`,
    ...base
  }
  render.syncRender('entity.ftl', context)
}


async function generateDto(base = {}, tableInfo = {}, config = {}) {
  let context = {
    providerRootPath: config['providerRootPath'],
    fileName: `${config['dtoPath']}${tableInfo['dtoName']}.java`,
    ...base
  }
  render.syncRender('dto.ftl', context)
}


async function generateHbm(base = {}, tableInfo = {}, config = {}) {
  let context = {
    providerRootPath: config['providerRootPath'],
    fileName: `${config['hbmPath']}${tableInfo['entityName']}.hbm.xml`,
    ...base
  }
  render.syncRender('hbm.ftl', context)
}


async function generateRepository(base = {}, tableInfo = {}, config = {}) {
  let context = {
    providerRootPath: config['providerRootPath'],
    fileName: `${config['repositoryPath']}${tableInfo['entityName']}Repository.java`,
    ...base
  }
  render.syncRender('repository.ftl', context)
}


async function generateService(base = {}, tableInfo = {}, config = {}) {
  let context = {
    providerRootPath: config['providerRootPath'],
    fileName: `${config['servicePath']}${tableInfo['entityName']}Service.java`,
    ...base
  }
  render.syncRender('service.ftl', context)
}


async function generateServiceImpl(base = {}, tableInfo = {}, config = {}) {
  let context = {
    providerRootPath: config['providerRootPath'],
    fileName: `${config['serviceImplPath']}${tableInfo['entityName']}ServiceImpl.java`,
    ...base
  }
  render.syncRender('service-impl.ftl', context)
}


async function generateMapper(base = {}, tableInfo = {}, config = {}) {
  let context = {
    providerRootPath: config['providerRootPath'],
    fileName: `${config['mapperPath']}${tableInfo['entityName']}Mapper.java`,
    ...base
  }
  render.syncRender('mapper.ftl', context)
}


async function generateController(base = {}, tableInfo = {}, config = {}) {
  let context = {
    providerRootPath: config['providerRootPath'],
    fileName: `${config['controllerPath']}${tableInfo['entityName']}Controller.java`,
    ...base
  }
  render.syncRender('controller.ftl', context)
}


async function generateGuzz(businesses = [], config = {}) {
  let context = {
    businesses,
    businesses,
    fileName: `${config['guzzPath']}guzz.xml`
  }
  render.syncRender('guzz.ftl', context)
}


module.exports = {
  asyncGenerate
}