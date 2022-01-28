/**
 * TableInfo
 * model
 */
 class TableInfo {
    constructor(catalog, tableName, tableComment) {
        this.catalog = catalog;
        this.tableName = tableName;
        this.tableComment = tableComment;
    }
}

/**
 * ColumnInfo
 * model
 */
class ColumnInfo {
    constructor(
        tableName,
        columnName,
        notNull,
        dataType,
        dataLength,
        primaryKey,
        maxBit,
        minBit,
        columnComment) {
        this.tableName = tableName;
        this.columnName = columnName;
        this.notNull = notNull;
        this.dataType = dataType;
        this.dataLength = dataLength;
        this.primaryKey = primaryKey;
        this.maxBit = maxBit;
        this.minBit = minBit;
        this.columnComment = columnComment;
    }
}

module.exports = {
    TableInfo,
    ColumnInfo
}