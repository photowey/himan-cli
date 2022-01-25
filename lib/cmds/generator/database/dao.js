const {
    createPool
} = require('./pool')

const {
    mysql
} = require('./mysql')

const {
    Guzz,
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

        connection.connect();

        connection.query({
            sql: sql,
            values: [`${databaseName}`]
        }, (error, resultSet) => {
            if (error) {
                reject(error)
            }

            // let results = Array.prototype.slice.call(resultSet);
            let results = Array.from(resultSet);
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
 * asyncTableInfos
 * with pool
 * @param {*} databaseName 
 * @param {*} options 
 * @returns 
 */
async function asyncTableInfosWithPool(databaseName, options = {}) {
    return new Promise((resolve, reject) => {
        let nativePool = createPool(options)
        nativePool.getConnection((error, connection) => {

            if (error) {
                reject(error)
            }

            let sql = `${DATA_BASE_TABLE_INFO_SQL}`

            connection.query({
                sql: sql,
                values: [`${databaseName}`]
            }, (error, resultSet) => {
                if (error) {
                    reject(error)
                }

                // let results = Array.prototype.slice.call(resultSet);
                let results = Array.from(resultSet);
                let tables = []
                results.forEach(element => {
                    let table = new TableInfo(databaseName, element.tableName, element.talbeComment)
                    tables.push(table)
                });

                connection.release()
                resolve(tables)
            })
        })
    })
}

/**
 * Query given table's column info
 */
async function asyncColumnInfos(databaseName, tablePrefix, tables = [], config = {}) {
    let promises = tables.map((table) => {
        return new Promise((resolve, reject) => {

            let providerPath = `${config['providerPath']}${config['sep']}provider`.replace(/\\/g, '/')
            
            let options = config['database']
            var connection = mysql.createConnection(options);


            let sql = `${DATA_BASE_COLUMN_INFO_SQL}`

            let tableName = table['tableName'] || ''
            let tableNameTemp = tableName.replace(tablePrefix, '')
            let entityName = functions.toEntity(tableNameTemp)
            let tableComment = (table['tableComment'] || '').replace(/\\s*|\\t|\\r|\\n/g, '') || `${entityName}`

            let controllerMapping = functions.toSplitLine(entityName).toLowerCase()
            let sqlBuilderAnnotationName = functions.firstToLowerCase(entityName)

            let tableInfo = {
                convert: false,
                tableName: tableName,
                catalog: `${databaseName}`,
                comment: `${tableComment}` || '',
                entityName: `${entityName}`,
                dtoName: `${entityName}DTO`,
                repositoryName: `${entityName}Repository`,
                sqlBuilderName: `${entityName}SqlBuilder`,
                sqlBuilderAnnotationName: `${sqlBuilderAnnotationName}`,
                hbmName: `${entityName}`,
                serviceName: `${entityName}Service`,
                serviceImplName: `${entityName}ServiceImpl`,
                mapperName: `${entityName}Mapper`,
                controllerName: `${entityName}Controller`,
                controllerMapping: `/${controllerMapping}`,
                fields: [],
                guzzs: [],
                requirePackages: [],
                package: {
                    controller: (`${providerPath}.controller`).replace(/\//g, '.'),
                    dto: (`${providerPath}/core/domain/dto`).replace(/\//g, '.'),
                    entity: (`${providerPath}/core/domain/entity`).replace(/\//g, '.'),
                    mapper: (`${providerPath}/service/mapper`).replace(/\//g, '.'),
                    repository: (`${providerPath}/repository`).replace(/\//g, '.'),
                    service: (`${providerPath}/service`).replace(/\//g, '.'),
                    serviceImpl: (`${providerPath}/service/impl`).replace(/\//g, '.'),
                }
            }

            // repository.guzz.hbm.xml's path
            let repositoryPath = `${providerPath}/repository`

            let guzzs = []
            let guzz = new Guzz(`${entityName}`, `${repositoryPath}/${entityName}`)

            guzzs.push(guzz)
            tableInfo.guzzs = guzzs

            connection.connect();

            connection.query({
                sql: sql,
                values: [`${databaseName}`, `${table['tableName']}`]
            }, (error, resultSet) => {

                if (error) {
                    reject(error)
                }

                // let results = Array.prototype.slice.call(resultSet);
                let results = Array.from(resultSet);

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

                    // populate fieldType && propertyType && requirePackages
                    functions.convertToJavaDataType(element.dataType, tableInfo, tableField)
                    // toUnique
                    tableInfo.requirePackages = functions.toUnique(tableInfo.requirePackages)

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

/**
 * asyncColumnInfosWithPool
 * with pool
 * @param {*} databaseName 
 * @param {*} tablePrefix 
 * @param {*} tables 
 * @param {*} config 
 * @returns 
 */
async function asyncColumnInfosWithPool(databaseName, tablePrefix, tables = [], config = {}) {
    let promises = tables.map((table) => {
        return new Promise((resolve, reject) => {

            let options = config['database']

            const nativePool = createPool(options)
            let providerPath = `${config['providerPath']}${config['sep']}provider`.replace(/\\/g, '/')

            nativePool.getConnection((error, connection) => {
                if (error) {
                    reject(error)
                }

                let sql = `${DATA_BASE_COLUMN_INFO_SQL}`

                let tableName = table['tableName'] || ''
                let tableNameTemp = tableName.replace(tablePrefix, '')
                let entityName = functions.toEntity(tableNameTemp)
                let tableComment = (table['tableComment'] || '').replace(/\\s*|\\t|\\r|\\n/g, '') || `${entityName}`

                let controllerMapping = functions.toSplitLine(entityName).toLowerCase()
                let sqlBuilderAnnotationName = functions.firstToLowerCase(entityName)

                let tableInfo = {
                    convert: false,
                    tableName: tableName,
                    catalog: `${databaseName}`,
                    comment: `${tableComment}` || '',
                    entityName: `${entityName}`,
                    dtoName: `${entityName}DTO`,
                    repositoryName: `${entityName}Repository`,
                    sqlBuilderName: `${entityName}SqlBuilder`,
                    sqlBuilderAnnotationName: `${sqlBuilderAnnotationName}`,
                    hbmName: `${entityName}`,
                    serviceName: `${entityName}Service`,
                    serviceImplName: `${entityName}ServiceImpl`,
                    mapperName: `${entityName}Mapper`,
                    controllerName: `${entityName}Controller`,
                    controllerMapping: `/${controllerMapping}`,
                    fields: [],
                    guzzs: [],
                    requirePackages: [],
                    package: {
                        controller: (`${providerPath}.controller`).replace(/\//g, '.'),
                        dto: (`${providerPath}/core/domain/dto`).replace(/\//g, '.'),
                        entity: (`${providerPath}/core/domain/entity`).replace(/\//g, '.'),
                        mapper: (`${providerPath}/service/mapper`).replace(/\//g, '.'),
                        repository: (`${providerPath}/repository`).replace(/\//g, '.'),
                        service: (`${providerPath}/service`).replace(/\//g, '.'),
                        serviceImpl: (`${providerPath}/service/impl`).replace(/\//g, '.'),
                    }
                }

                // repository.guzz.hbm.xml's path
                let repositoryPath = `${providerPath}/repository`

                let guzzs = []
                let guzz = new Guzz(`${entityName}`, `${repositoryPath}/${entityName}`)

                guzzs.push(guzz)
                tableInfo.guzzs = guzzs

                connection.query({
                    sql: sql,
                    values: [`${databaseName}`, `${table['tableName']}`]
                }, (error, resultSet) => {

                    if (error) {
                        reject(error)
                    }

                    // let results = Array.prototype.slice.call(resultSet);
                    let results = Array.from(resultSet);

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

                        // populate fieldType && propertyType && requirePackages
                        functions.convertToJavaDataType(element.dataType, tableInfo, tableField)
                        // toUnique
                        tableInfo.requirePackages = functions.toUnique(tableInfo.requirePackages)

                        tableFields.push(tableField)
                    });

                    tableInfo.fields = tableFields

                    connection.release()
                    resolve(tableInfo)
                })
            })
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