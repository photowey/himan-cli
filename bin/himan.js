/**
 * @Author: weichangjun
 * @Date: 2022-03-17 15:28:51
 * @LastEditTime: 2022-03-30 13:55:31
 * @LastEditors: weichangjun
 * @Description: 
 * @FilePath: /himan-cli/bin/himan.js
 * @Copyright (c) 2022 by weichangjun/Uphicoo Co., Ltd. All Rights Reserved.
 */
#!/usr/bin/env node

'use strict';

/**
 * $ himan cmd handler.
 */

const program = require('commander');
const fs = require('fs-extra');

const packageJson = require('../package.json');

const {
    logger
} = require('../lib/logger');

const {
    HIMAN_HOME,
    HIMAN_DB,
    BRANCHES,
    ENVS,
    MACHINES,
    PRODUCT_CODES,
    GROUP_ID,
    ARTIFACT_ID,
    ROOT_VERSION,
    DATA_BASE
} = require('../lib/utils/constants');

const {
    HimanDB
} = require('../lib/model/himan.model');

/**
 * Ensure home dir && db file.
 */
__init__()

/**
 * Himan cli.
 */
program
    .version(packageJson.version, '-v, --version')
    .usage('<command> [options]')
    .command('create', 'create a backend micro-service project')
    .command('generator', 'a code generator for database reverse engineering')

// Test logger debug?
logger.init(program)

// Parse the args.
program.parse(process.argv);

// =====================================================
function __init__() {
    ensureHomeDir()
    ensureHimanDB()
}

function ensureHomeDir() {
    try {
        fs.ensureDir(HIMAN_HOME)
    } catch (error) { }
}

function ensureHimanDB() {
    try {
        fs.readFileSync(`${HIMAN_DB}`, 'UTF-8');
    } catch (error) {
        let db = new HimanDB([])
        db['branches'] = BRANCHES
        db['evns'] = ENVS
        db['machines'] = MACHINES
        db['codes'] = PRODUCT_CODES
        db['repository'] = 'https://github.com/photowey/project-template.git'
        db['rootGroupId'] = GROUP_ID
        db['rootArtifactId'] = ARTIFACT_ID
        db['rootVersion'] = ROOT_VERSION
        db['database'] = DATA_BASE
        db['template'] = 'local'
        fs.outputFileSync(HIMAN_DB, JSON.stringify(db, "", 4))
    }
}