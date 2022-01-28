/**
 * 下划线转换驼峰
 * @param {*} source 
 * @returns 
 */
 function toCamelCase(source) {
    return source.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
}

/**
 * 转-实体类名
 * @param {*} source 
 * @returns 
 */
function toEntity(source) {
    let instancesource = toCamelCase(source)
    return firstToUpperCase(instancesource)
}

/**
 * 驼峰转换下划线
 * @param {*} source 
 * @returns 
 */
function toUnderLine(source) {
    return source.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^(_)/, '');
}

/**
 * 驼峰转换横线
 * @param {*} source 
 * @returns 
 */
function toSplitLine(source) {
    return source.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^(-)/, '');
}

/**
 * 首字母小写
 * @param {*} source 
 * @returns 
 */
function firstToLowerCase(source) {
    return source.substring(0, 1).toLowerCase() + source.substring(1);
}

/**
 * 首字母大写
 * @param {*} source 
 * @returns 
 */
function firstToUpperCase(source) {
    return source.substring(0, 1).toUpperCase() + source.substring(1);
}

/**
 * 数据类型转换
 * @param {*} dataType 
 * @returns 
 */
function convertToJavaDataType(dataType, tableInfo = {}, fieldInfo = {}) {
    switch (dataType) {
        case 'char':
        case 'varchar':
            fieldInfo['propertyType'] = 'String'
            break;
        case 'text':
        case 'longtext':
            fieldInfo['propertyType'] = 'String'
            fieldInfo['dataLength'] = fieldInfo['dataLength'] || 2000
            break;
        case 'bigint':
            fieldInfo['fieldType'] = 'java.lang.Long'
            fieldInfo['propertyType'] = 'Long'
            break;
        case 'int':
        case 'midlleint':
        case 'smallint':
        case 'tinyint':
            fieldInfo['fieldType'] = 'java.lang.Integer'
            fieldInfo['propertyType'] = 'Integer'
            break;
        case 'datetime':
            fieldInfo['fieldType'] = 'java.util.Date'
            fieldInfo['propertyType'] = 'Date'
            tableInfo['importPackages'].push('java.util.Date')
            break;
        case 'decimal':
            fieldInfo['fieldType'] = 'java.math.BigDecimal'
            fieldInfo['propertyType'] = 'BigDecimal'
            tableInfo['importPackages'].push('java.math.BigDecimal')
            break;
        default:
            break;
    }
}

/**
 * 数组去重
 * @param {*} array 
 * @returns 
 */
function toUnique(array) {
    return Array.from(new Set(array));
}

/**
 * 包含
 * @param {*} str 
 * @param {*} substr 
 * @returns 
 */
function contains(str, substr) {
    return str.indexOf(substr) >= 0;
}

module.exports = {
    toCamelCase,
    toEntity,
    toUnderLine,
    toSplitLine,
    toUnique,
    firstToLowerCase,
    firstToUpperCase,
    convertToJavaDataType,
    contains
}