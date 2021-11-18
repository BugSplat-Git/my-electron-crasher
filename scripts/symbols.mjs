import { OAuthClientCredentialsClient, SymbolsApiClient } from '@bugsplat/symbol-upload';
import dotenv from 'dotenv';
import { createReadStream, statSync } from 'fs';
import { readFile } from 'fs/promises';
import glob from 'glob-promise';
import { basename } from 'path';
dotenv.config();

(async() => {
    const clientId = process.env.SYMBOL_UPLOAD_CLIENT_ID;
    const clientSecret = process.env.SYMBOL_UPLOAD_CLIENT_SECRET;
    const packageJson = JSON.parse(await readFile('./package.json'));
    
    if (!clientId) {
        throw new Error('SYMBOL_UPLOAD_CLIENT_ID env variable not set')
    }
    
    if (!clientSecret) {
        throw new Error('SYMBOL_UPLOAD_CLIENT_SECRET env variable not set')
    }

    const client = await OAuthClientCredentialsClient.createAuthenticatedClient(
        clientId,
        clientSecret
    );
    const symbols = new SymbolsApiClient(client);
    const database = packageJson.database;
    const application = packageJson.name;
    const version = packageJson.version;
    const buildPath = `./dist/src`;
    const filePaths = await glob(`${buildPath}/*.js.map`);
    const files = filePaths
        .map(path => {
            const name = basename(path);
            const size = statSync(path).size;
            const file = createReadStream(path);
            return {
                name,
                size,
                file
            };
        });

    console.log(`Found files:`, filePaths);
    console.log(`About to upload symbols for ${database}-${application}-${version}...`);

    await symbols.postSymbols(
        database,
        application,
        version,
        files
    );

    console.log('Symbols uploaded successfully!');
})().catch(error => console.error(error));