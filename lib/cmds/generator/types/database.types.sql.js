/**
 * 查询-数据库里面数据表信息
 */
 const DATA_BASE_TABLE_INFO_SQL = `
 SELECT 
 TABLE_NAME AS tableName, 
 TABLE_COMMENT AS talbeComment 
 FROM information_schema.\`TABLES\` 
 WHERE 
 TABLE_SCHEMA = ? `
 
 const DATA_BASE_COLUMN_INFO_SQL = `
 SELECT 
 TABLE_NAME AS tableName, 
 COLUMN_NAME AS columnName, 
 IS_NULLABLE AS notNull,
 DATA_TYPE AS dataType, 
 CHARACTER_MAXIMUM_LENGTH AS dataLength, 
 COLUMN_KEY AS primaryKey, 
 NUMERIC_PRECISION AS maxBit, 
 NUMERIC_SCALE AS minBit, 
 COLUMN_COMMENT AS columnComment 
 FROM 
 information_schema.\`COLUMNS\` 
 WHERE 
 TABLE_SCHEMA = ? 
 AND TABLE_NAME = ? 
 ORDER BY TABLE_NAME, 
 ORDINAL_POSITION`
 
 module.exports = {
     DATA_BASE_TABLE_INFO_SQL,
     DATA_BASE_COLUMN_INFO_SQL
 }