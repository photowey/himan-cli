/**
 * $ himan commons.
 */

const os = require('os');
const path = require('path');

/**
 * Cli name.
 */
const CLI_NAME = 'himan';
/**
 * db.json.
 */
const DB_NAME = 'db.json';

/**
 * Success message.
 */
const SUCCESS_MESSAGE = 'Congratulations, Himan execution is complete!';

/**
 * Sponsor message.
 */
const SPONSOR_MESSAGE = 'Sponsored with ❤️ by <photowey@gmail.com>.';

/**
 * Himan home.
 */
const HIMAN_HOME = `${os.homedir()}${path.sep}.${CLI_NAME}`;

/**
 * Himan db.
 */
const HIMAN_DB = `${HIMAN_HOME}${path.sep}${DB_NAME}`;

/**
 * Himan template temp dir.
 */
const TEMP_DIR = path.resolve(`${HIMAN_HOME}`, '.__himan_project_template_temp_dir__');

/**
 * Git branches
 */
const BRANCHES = ['master', 'dev']

/**
 * The envs
 */
const ENVS = ['dev', 'test', 'pre', 'prod']

/**
 * The target machine room.
 */
const MACHINES = ['ips', 'chain']

/**
 * The table prefix.
 */
const TABLE_PREFIX = ['sys_', 'plt_', 'mch_', 'biz_', 'std_', 'api_']

/**
 * The product codes
 */
const PRODUCT_CODES = ['uphicoo']

const GROUP_ID = 'com.uphicoo'
const ARTIFACT_ID = 'uphicoo-cloud-platform-parent'
const ROOT_VERSION = '1.0.0-SNAPSHOT'
const DATA_BASE = {
    connectionLimit: 5,
    queueLimit: 5,
    host: '192.168.19.250',
    port: 3307,
    user: "root",
    password: "root",
    tablePrefix: TABLE_PREFIX
}

/**
 * The project-template file name.
 */
const PROJECT_TEMPLATE_NAME = 'project-template'

module.exports = {
    CLI_NAME,
    SUCCESS_MESSAGE,
    SPONSOR_MESSAGE,
    HIMAN_HOME,
    HIMAN_DB,
    TEMP_DIR,
    BRANCHES,
    ENVS,
    MACHINES,
    PRODUCT_CODES,
    PROJECT_TEMPLATE_NAME,
    GROUP_ID,
    ARTIFACT_ID,
    ROOT_VERSION,
    DATA_BASE,
    TABLE_PREFIX
};