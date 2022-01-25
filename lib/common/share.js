const fs = require('fs-extra')
const {
    HimanDB,
} = require('../model/himan.model');

const {
    HIMAN_DB,
    BRANCHES,
    ENVS,
    MACHINES,
    PRODUCT_CODES,
    GROUP_ID,
    ARTIFACT_ID,
    ROOT_VERSION
} = require('../utils/constants');

/**
 * Load the himan db file.
 */
function loadHimanDB() {
    let db = new HimanDB([])
    db['branches'] = BRANCHES
    db['evns'] = ENVS
    db['machines'] = MACHINES
    db['codes'] = PRODUCT_CODES
    db['repository'] = 'https://github.com/photowey/project-template.git'

    db['rootGroupId'] = GROUP_ID
    db['rootArtifactId'] = ARTIFACT_ID
    db['rootVersion'] = ROOT_VERSION

    try {
        var data = fs.readFileSync(`${HIMAN_DB}`, 'UTF-8');
        return data ? JSON.parse(data.toString()) : db
    } catch (err) {
        return db
    }
}

module.exports = {
    loadHimanDB
}