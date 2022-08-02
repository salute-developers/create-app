import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch';

import { fetchOptions } from './defaults/network.mjs';

export function getArgv() {
    return yargs(hideBin(process.argv)).argv;
}

export function getDirname() {
    // eslint-disable-next-line no-underscore-dangle
    const __filename = fileURLToPath(import.meta.url);

    return path.dirname(__filename);
}

export async function downloadTemplatePackage(name) {
    process.stdout.write('ℹ️  Загрузка шаблона');
    const response = await fetch(`https://registry.npmjs.org/${name}/latest`, fetchOptions);

    const packageInfo = await response.json();
    const packageResponse = await fetch(packageInfo.dist.tarball, fetchOptions);

    const contentLength = +packageResponse.headers.get('Content-Length');
    let byteCounter = 0;

    if (!process.env.INSIDE_CLI_TEST_RUNNER) {
        packageResponse.body.on('data', function progress(chunk) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`ℹ️  Загрузка шаблона ${byteCounter}/${contentLength}`);
            byteCounter += chunk.length;

            if (byteCounter >= contentLength) {
                packageResponse.body.off('data', progress);
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                console.log('ℹ️  Шаблон загружен');
                console.log('');
            }
        });
    }

    const blob = await packageResponse.blob();
    const arrayBuffer = await blob.arrayBuffer();

    return Buffer.from(arrayBuffer);
}

export function cleanUp() {
    if (existsSync('.template-package')) {
        rmdirSync('.template-package', { recursive: true, force: true });
    }
}

export function extractTemplatePackage(packageBuffer) {
    cleanUp();
    mkdirSync('.template-package');
    writeFileSync('./.template-package/package.tgz', packageBuffer);
    execSync('tar -xzf ./.template-package/package.tgz -C ./.template-package');
    unlinkSync('./.template-package/package.tgz');

    return path.resolve('./.template-package/package');
}

export function printLogo() {
    const jsonLogo = readFileSync(`${getDirname()}/asciiLogo.json`);
    const strLogo = JSON.parse(jsonLogo);
    console.log(strLogo);
}

export class RuntimeError extends Error {}
