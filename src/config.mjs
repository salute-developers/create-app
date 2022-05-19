export function getConfigFromAnswers({ answers, featureConfigMap, templatePath, output, runDir }) {
    const enabledFeatureIds = Object.entries(featureConfigMap)
        .filter(([, feature]) => feature.test(answers.featureIds))
        .map(([key]) => key);

    const defaultFeatureToggles = Object.fromEntries(Object.keys(featureConfigMap).map((key) => [key, false]));
    const featureToggles = [...enabledFeatureIds, ...answers.featureIds].reduce((acc, id) => {
        acc[id] = true;

        return acc;
    }, {});

    const configDiff = Object.keys(defaultFeatureToggles).reduce(
        (acc, featureId) => {
            const state = enabledFeatureIds.includes(featureId) ? 'on' : 'off';
            const featureConfig = featureConfigMap[featureId].config({ templatePath });

            acc.jsonChanges.push(...(featureConfig[state].jsonChanges || []));
            acc.sourceAddons.push(...(featureConfig[state].sourceAddon || []));
            acc.rename.push(...(featureConfig[state].rename || []));

            return acc;
        },
        {
            jsonChanges: [],
            sourceAddons: [],
            rename: [],
        },
    );

    return {
        featureToggles: {
            ...defaultFeatureToggles,
            ...featureToggles,
        },
        paths: {
            default: {
                source: [
                    `${templatePath}**/*`,
                    `!${templatePath}node_modules/**`,
                    `!${templatePath}build/**`,
                    `!${templatePath}.next/**`,
                    ...configDiff.sourceAddons,
                ],
                destination: output || `${runDir}/${answers.projectName}`,
            },
        },
        rename: configDiff.rename,
        jsonChanges: [
            {
                glob: `${templatePath}package.json`,
                changes: {
                    merge: {
                        name: answers.projectName,
                    },
                },
            },
            ...configDiff.jsonChanges,
        ],
    };
}
