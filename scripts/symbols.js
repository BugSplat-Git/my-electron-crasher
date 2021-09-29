const { BugSplatApiClient, SymbolsApiClient } = require('@bugsplat/symbol-upload');
const packageJson = require('../package.json');
const fs = require('fs');
const path = require('path');

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
    .map(file => {
        const filePath = `${buildDirectory}/${file}`;
        const stat = fs.statSync(filePath);
        const name = path.basename(filePath);
        const size = stat.size;
        return {
            name,
            size,
            file: fs.createReadStream(filePath)
        };
    });

const bugsplat = new BugSplatApiClient();
const symbolsApiClient = new SymbolsApiClient(bugsplat);
return bugsplat.login(email, password)
    .then(() => symbolsApiClient.deleteSymbols(
        database,
        application,
        version
    ))
    .then(() => symbolsApiClient.postSymbols(
        database,
        application,
        version,
        files
    ))
    .then(() => console.log(`Source maps uploaded to BugSplat ${database}-${application}-${version} successfully!`));