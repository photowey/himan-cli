#!/usr/bin/env node

'use strict';

/**
 * $ himan create cmd handler.
 */

const program = require('commander');
const {logger} = require('../lib/logger');
const path = require('path');

const himan = require('../lib/cmds/create/index.cjs');

// Define the options with default values.
program
    .usage(
        logger.cyan('\n$ himan create:\n') +
        logger.green('$ himan create <project> -p <project> -e <environment> -m <machineRoom>\n') +
        logger.green('$ himan create himanapp -e dev -m uphicoo\n') +
        logger.red('OR\n') +
        logger.green('$ himan create -p himanapp -e dev -m uphicoo')
    )
    .option('-p,--project <project>', 'the name of project', 'himanapp')
    .option('--path <project-path>', 'the path of the will be created project')
    .option('-e,--env <environment>', 'the environment when deploy the project')
    .option('-m,--machine <machineRoom>', 'the machine room when deploy the project, at first')

// Parse argv.
program.parse(process.argv)

// The cmd name.
const cmd = program.name().replace('-', ' ')

// Get options.
const options = program.opts();

// Retrieve single option with default value.
let project = program.args[0] ? program.args[0] : options.project;

let env = options.env;
const machineRoom = options.machine;
const projectPath = options.path;

const projectDir = projectPath ? path.resolve(process.cwd(), path.normalize(projectPath)) : process.cwd();

const config = {
    cmd,
    env,
    project,
    projectDir,
    machineRoom
}

// Run create()
himan.create(config)