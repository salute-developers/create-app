import lodash from 'lodash';
import through2 from 'through2';
import micromatch from 'micromatch';

const { unset, merge, cloneDeep } = lodash;

function buildPackageJson(packageJson, removeList = [], mergeObj = {}) {
    const newPackageJson = cloneDeep(packageJson);

    for (const path of removeList) {
        unset(newPackageJson, path);
    }

    merge(newPackageJson, mergeObj);

    return newPackageJson;
}

export const buildJsonPlugin = (config) =>
    through2.obj((file, _, cb) => {
        for (const jsonChange of config.jsonChanges) {
            if (micromatch.isMatch(file.path, jsonChange.glob)) {
                const jsonObject = JSON.parse(file.contents.toString());
                const newJsonObject = buildPackageJson(jsonObject, jsonChange.changes.remove, jsonChange.changes.merge);
                file.contents = Buffer.from(JSON.stringify(newJsonObject, null, 4));
            }
        }

        cb(null, file);
    });
