#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const API_KEYS_FILE = path.join(os.homedir(), '.apikeys');

function generateApiKey() {
  const apiKey = crypto.randomBytes(32).toString('hex');
  fs.appendFileSync(API_KEYS_FILE, apiKey + '\n');
  console.log('API key generated:', apiKey);
}

function listApiKeys() {
  const apiKeys = fs.readFileSync(API_KEYS_FILE, 'utf-8').trim().split('\n');
  console.log('API keys:', apiKeys.join(', '));
}

require('yargs')
  .scriptName("api")
  .usage('$0 <cmd> [args]')
  .command('key', 'API keys', (yargs) => {
    yargs
      .command('generate', 'Generate a new API key', () => generateApiKey())
      .command('list', 'List all API keys', () => listApiKeys())
      .demandCommand(1, 'You need to specify a command')
      .help();
  })
  .help()
  .argv;
