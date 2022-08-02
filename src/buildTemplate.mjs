import fs from 'fs';
import vinylFs from 'vinyl-fs';
import gulpIf from 'gulp-if';
import micromatch from 'micromatch';

import { mustachePlugin } from './gulpPlugins/mustachePlugin.mjs';
import { buildJsonPlugin } from './gulpPlugins/buildJsonPlugin.mjs';
import { renamePlugin } from './gulpPlugins/renamePlugin.mjs';
import { RuntimeError } from './utils.mjs';

const { src, dest } = vinylFs;

function buildTemplate(srcGlob, destFolder, config, rules) {
    let stream = src(srcGlob, { nodir: true, dot: true })
        .pipe(
            renamePlugin((file) => {
                const entry = config.rename.find((renameEntry) => micromatch.isMatch(file.path, renameEntry.glob));

                if (entry) {
                    entry.map(file);
                }
            }),
        )
        .pipe(
            renamePlugin((file) => {
                if (file.extname === '.mustache') {
                    file.extname = '';
                }
            }),
        );

    for (const rule of rules) {
        stream = stream.pipe(gulpIf(rule.test, mustachePlugin(config.featureToggles, rule.tags)));
    }

    return stream.pipe(buildJsonPlugin(config)).pipe(dest(destFolder));
}

export const buildTemplateTask = async (config, rules) => {
    const taskPromises = [];

    Object.values(config.paths).map(({ source, destination }) => {
        let resolve;
        let reject;

        const taskFinished = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });

        taskPromises.push(taskFinished);

        if (fs.existsSync(destination)) {
            throw new RuntimeError(`create-app: Cannot create '${destination}': File exists`);
        }

        return buildTemplate(source, destination, config, rules)
            .on('end', () => {
                resolve();
            })
            .on('error', (err) => {
                reject(err);
            });
    });

    await Promise.all(taskPromises);
};
