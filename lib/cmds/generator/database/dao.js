const {
    createPool
} = require('./pool')

const {
    mysql
} = require('./mysql')

const {
    TableInfo,
} = require('../model/table.model')

const {
    DATA_BASE_TABLE_INFO_SQL,
    DATA_BASE_COLUMN_INFO_SQL
} = require('../types/database.types.sql')


const functions = require('../utils/functions.utils')

/**
 * Query table info
 */
async function asyncTableInfos(databaseName, options = {}) {
    return new Promise((resolve, reject) => {

        var connection = mysql.createConnection(options);

        let sql = `${DATA_BASE_TABLE_INFO_SQL}`
        console.log('-------------------------------------111options' + options)
        console.log('-------------------------------------111sql' + sql)

        connection.connect();

        connection.query({
            sql: sql,
            values: [`${databaseName}`]
        }, (error, resultSet) => {
            if (error) {
                reject(error)
            }

            console.log('-------------------------------------1111')
            console.log(resultSet)

            let results = Array.prototype.slice.call(resultSet);
            // let results = Array.from(resultSet);
            let tables = []
            results.forEach(element => {
                let table = new TableInfo(databaseName, element.tableName, element.talbeComment)
                tables.push(table)
            });

            resolve(tables)
        })

        connection.end();
    })
}


/**
 * Query given table's column info
 */
async function asyncColumnInfos(databaseName, tablePrefix = [], tables = [], config = {}) {
    let promises = tables.map((table) => {
        return new Promise((resolve, reject) => {

            let webPath = `${config['webPath']}${config['sep']}web`.replace(/\\/g, '/')
            let domanSrcPath = `${config['webPath']}`.replace(/\\/g, '/')

            let options = config['database']
            var connection = mysql.createConnection(options);
            let sql = `${DATA_BASE_COLUMN_INFO_SQL}`
            console.log('-------------------------------------222options' + options)
            console.log('-------------------------------------222sql' + sql)

            let tableName = table['tableName'] || ''

            let replaceTableName = tableName
            tablePrefix.forEach(prefix => {
                replaceTableName = replaceTableName.replace(new RegExp(prefix, 'g'), '')
            })

            let entityName = functions.toEntity(replaceTableName)

            let tableComment = (table['tableComment'] || '').replace(/\\s*|\\t|\\r|\\n/g, '') || `${entityName}`

            let controllerMapping = functions.toSplitLine(entityName).toLowerCase()

            let tableInfo = {
                convert: false,
                tableName: tableName,
                catalog: `${databaseName}`,
                comment: `${tableComment}` || '',
                entityName: `${entityName}`,
                dtoName: `${entityName}DTO`,
                repositoryName: `${entityName}Repository`,
                serviceName: `${entityName}Service`,
                serviceImplName: `${entityName}ServiceImpl`,
                mapperName: `${entityName}Mapper`,
                controllerName: `${entityName}Controller`,
                controllerMapping: `${controllerMapping}`,
                fields: [],
                importPackages: [],
                package: {
                    controller: (`${webPath}.controller`).replace(/\//g, '.'),
                    dto: (`${domanSrcPath}/core/domain/dto`).replace(/\//g, '.'),
                    entity: (`${domanSrcPath}/core/domain/entity`).replace(/\//g, '.'),
                    mapper: (`${webPath}/service/mapper`).replace(/\//g, '.'),
                    repository: (`${webPath}/repository`).replace(/\//g, '.'),
                    service: (`${webPath}/service`).replace(/\//g, '.'),
                    serviceImpl: (`${webPath}/service/impl`).replace(/\//g, '.'),
                }
            }

            connection.connect();

            connection.query({
                sql: sql,
                values: [`${databaseName}`, `${table['tableName']}`]
            }, (error, resultSet) => {

                if (error) {
                    reject(error)
                }

                console.log(resultSet)


                console.log('-------------------------------------2222')
                let results = Array.prototype.slice.call(resultSet);
                //let results = Array.from(resultSet);

                let tableFields = []

                results.forEach(element => {

                    let columnName = element.columnName || ''
                    if (!!functions.contains(columnName, "_")) {
                        // hello_world -> HelloWorld
                        columnName = functions.toCamelCase(columnName)
                    }

                    // HelloWorld -> helloWorld
                    let fieldName = functions.firstToLowerCase(columnName)

                    let columnComment = (element['columnComment'] || '').replace(/\\s*|\\t|\\r|\\n/g, '')

                    let tableField = {
                        primaryKey: (element.primaryKey === 'PRI'),
                        notNull: (element.notNull === 'NO'),
                        fieldName: `${element.columnName}` || '',
                        dataType: element.dataType,
                        fieldLength: element.dataLength || 0,
                        maxBit: element.maxBit || 0,
                        minBit: element.minBit || 0,
                        comment: `${columnComment}` || '',
                        entityComment: `${tableComment}`,
                        fieldType: '',
                        propertyType: '',
                        propertyName: `${fieldName}`
                    }

                    // populate fieldType && propertyType && importPackages
                    functions.convertToJavaDataType(element.dataType, tableInfo, tableField)
                    // toUnique
                    tableInfo.importPackages = functions.toUnique(tableInfo.importPackages)

                    tableFields.push(tableField)
                });

                tableInfo.fields = tableFields
                resolve(tableInfo)
            })
            connection.end();
        })
    })

    let tableInfos = await Promise.all(promises)
    return new Promise((resolve, reject) => {
        resolve(tableInfos)
    })
}


module.exports = {
    asyncTableInfos,
    asyncColumnInfos
}