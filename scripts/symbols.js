const { BugSplatApiClient, SymbolsApiClient } = require('@bugsplat/symbol-upload');
const packageJson = require('../package.json');
const fs = require('fs');

const email = process.env.SYMBOL_UPLOAD_EMAIL;
if (!email) {
    throw new Error('Please set environment variable SYMBOL_UPLOAD_EMAIL');
}

const password = process.env.SYMBOL_UPLOAD_PASSWORD;
if (!email) {
    throw new Error('Please set environment variable SYMBOL_UPLOAD_PASSWORD');
}

const database = packageJson.database;
const application = packageJson.name;
const version = packageJson.version;

const buildDirectory = `./dist/src`;
const files = fs.readdirSync(buildDirectory)
    .filter(file => file.endsWith('.js.map'))
    .map(file => (`${buildDirectory}/${file}`));

const bugsplat = new BugSplatApiClient();
const symbolsApiClient = new SymbolsApiClient(bugsplat);
return bugsplat.login(email, password)
    .then(() => symbolsApiClient.delete(
        database,
        application,
        version
    ))
    .then(() => symbolsApiClient.post(
        database,
        application,
        version,
        files
    ))
    .then(() => console.log('done!'));