export const featureConfigs = {
    characterRedirectOnly: {
        id: 'redirectsCharacter',
        getConfig: ({ templatePath }) => {
            return {
                on: {
                    sourceAddon: [
                        `!${templatePath}config-utils/redirects/common.js`,
                        `!${templatePath}src/pages/\\[character\\]/@portal/**`,
                        `!${templatePath}src/pages/\\[character\\]/@sberbox/**`,
                    ],
                    rename: [
                        {
                            glob: `${templatePath}config-utils/redirects/redirectsCharacter.js`,
                            map: (file) => {
                                file.basename = 'redirects.js';
                            },
                        },
                        {
                            glob: `${templatePath}src/pages/\\[character\\]/@mobile/**`,
                            map: (file) => {
                                const [start, end] = file.dirname.split('/@mobile');
                                file.dirname = start + end;
                            },
                        },
                    ],
                },
                off: {
                    sourceAddon: [`!${templatePath}config-utils/redirects/redirectsCharacter.js`],
                },
            };
        }
    },
    createApp: {
        id: 'createApp',
        getConfig: ({ templatePath }) => ({
            on: {},
            off: {
                sourceAddon: [`!${templatePath}.create-app/**`, `!${templatePath}package-lock.json`],
                jsonChanges: [
                    {
                        glob: `${templatePath}meta.json`,
                        changes: {
                            remove: ['ci.jobs.canary', 'ci.kits'],
                        },
                    },
                    {
                        glob: `${templatePath}package.json`,
                        changes: {
                            remove: [
                                'main',
                                'files',
                                'bundleDependencies',
                                'bundledDependencies',
                                '_args',
                                '_from',
                                '_id',
                                '_inBundle',
                                '_integrity',
                                '_location',
                                '_phantomChildren',
                                '_requested',
                                '_requiredBy',
                                '_resolved',
                                '_spec',
                                '_where',
                                '_shasum',
                            ],
                            merge: {
                                private: true,
                                version: '0.1.0',
                            },
                        },
                    },
                ],
            },
        })
    },
    filterPackageJson: {
        id: 'filterPackageJson',
        getConfig: ({ templatePath }) => ({

            off: {},
            on: {
                jsonChanges: [
                    {
                        glob: `${templatePath}package.json`,
                        changes: {
                            remove: [
                                'main',
                                'files',
                                'bundleDependencies',
                                'bundledDependencies',
                                '_args',
                                '_from',
                                '_id',
                                '_inBundle',
                                '_integrity',
                                '_location',
                                '_phantomChildren',
                                '_requested',
                                '_requiredBy',
                                '_resolved',
                                '_spec',
                                '_where',
                            ],
                            merge: {
                                version: '0.1.0',
                            },
                        },
                    },
                ],
            },
        })
    },
    getServerData: {
        id: 'getServerData',
        getConfig: ({ templatePath }) => ({

            off: {
                sourceAddon: [
                    `!${templatePath}src/utils/server-data.ts`,
                ],
                jsonChanges: [],
            },
            on: {},
        })
    },
    graphql: {
        id: 'graphql',
        getConfig: ({ templatePath }) => ({
            on: {},
            off: {
                sourceAddon: [
                    `!${templatePath}src/graphql/**`,
                    `!${templatePath}src/components/PageIndex/dataCy.ts`,
                    `!${templatePath}src/components/PageGraphql/**`,
                    `!${templatePath}src/pages/api/graphql*`,
                    `!${templatePath}src/pages/api/GRAPHQL*`,
                    `!${templatePath}src/pages/\\[character\\]/*/graphql-demo/**`,
                    `!${templatePath}cypress/integration/graphql*`,
                    `!${templatePath}__generated__/**`,
                ],
                jsonChanges: [
                    {
                        glob: `${templatePath}package.json`,
                        changes: {
                            remove: [
                                'dependencies.@apollo/client',
                                'dependencies.graphql',
                                'dependencies.micro',
                                'dependencies.apollo-server-micro',

                                'devDependencies.apollo',
                                'devDependencies.graphqldoc',

                                'scripts.graphql:watch-types',
                                'scripts.graphql:build-doc',
                            ],
                            merge: {
                                scripts: {
                                    dev: "DEVICE=sberbox NODE_OPTIONS='--inspect' next dev",
                                },
                            },
                        },
                    },
                ],
            },
        })
    },
    imageOptimization: {
        id: 'imageOptimization',
        getConfig: ({ templatePath }) => ({

            off: {
                sourceAddon: [
                    `!${templatePath}src/components/PageImageOptimization.tsx`,
                    `!${templatePath}src/components/PageImageOptimization.tsx`,
                    `!${templatePath}src/utils/Image.tsx`,
                    `!${templatePath}src/pages/\\[character\\]/*/image-optimization.tsx`,
                ],
                jsonChanges: [],
            },
            on: {},
        })
    },
    nextServer: {
        id: 'nextServer',
        getConfig: ({ templatePath }) => ({

            off: {
                sourceAddon: [
                    `!${templatePath}src/pages/SSR.tsx`,
                    `!${templatePath}src/components/PageSSR.tsx`,
                    `!${templatePath}src/pages/\\[character\\]/*/graphql-demo/ssr-query.tsx`,
                    `!${templatePath}src/pages/api/**`,
                    `!${templatePath}Dockerfile`,
                    `!${templatePath}nginx/**`,
                ],
                jsonChanges: [
                    {
                        glob: `${templatePath}package.json`,
                        changes: {
                            remove: ['scripts.build:static'],
                            merge: {
                                scripts: {
                                    build: 'next build && next export',
                                },
                            },
                        },
                    },
                    {
                        glob: `${templatePath}meta.json`,
                        changes: {
                            merge: {
                                ci: {
                                    enabled: true,
                                    jobs: {
                                        'build-docker': { enabled: false },
                                        'build-docker-ift': { enabled: false },
                                        'build-docker-prom': { enabled: false },
                                        'deploy-docker': { enabled: false },
                                        'deploy-docker-ift': { enabled: false },
                                        'deploy-docker-prom': { enabled: false },
                                        'deploy-nginx-pre-prom': { enabled: false },
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            on: {},
        })
    },
    platformAndCharacterRedirect: {
        id: 'platformAndCharacterRedirect',
        getConfig: ({ templatePath }) => ({

            on: {},
            off: {
                sourceAddon: [`!${templatePath}config-utils/redirects/redirects.js`],
            },
        })
    },
    redirectsPlatform: {
        id: 'redirectsPlatform',
        getConfig: ({ templatePath }) => ({

            on: {
                rename: [
                    {
                        glob: `${templatePath}config-utils/redirects/redirectsPlatform.js`,
                        map: (file) => {
                            file.basename = 'redirects.js';
                        },
                    },
                    {
                        glob: `${templatePath}src/pages/\\[character\\]/**`,
                        map: (file) => {
                            const [start, end] = file.dirname.split('/[character]');
                            file.dirname = start + end;
                        },
                    },
                ],
            },
            off: {
                sourceAddon: [`!${templatePath}config-utils/redirects/redirectsPlatform.js`],
            },
        })
    },
    prefetchDemo: {
        id: 'prefetchDemo',
        getConfig: ({ templatePath }) => ({

            off: {
                sourceAddon: [
                    `!${templatePath}src/components/PagePrefetch.tsx`,
                    `!${templatePath}src/components/PagePrefetchWithLink.tsx`,
                    `!${templatePath}src/components/PagePrefetchWithRouter.tsx`,
                    `!${templatePath}src/pages/\\[character\\]/*/prefetch.tsx`,
                    `!${templatePath}src/pages/\\[character\\]/*/prefetch-with-link.tsx`,
                    `!${templatePath}src/pages/\\[character\\]/*/prefetch-with-router.tsx`,
                ],
                jsonChanges: [],
            },
            on: {},
        })
    },
    redirects: {
        id: 'redirects',
        getConfig: ({ templatePath }) => ({

            on: {},
            off: {
                sourceAddon: [
                    `!${templatePath}config-utils/redirects/**`,
                    `!${templatePath}src/pages/\\[character\\]/@portal/**`,
                    `!${templatePath}src/pages/\\[character\\]/@sberbox/**`,
                ],
                rename: [
                    {
                        glob: `${templatePath}src/pages/\\[character\\]/@mobile/**`,
                        map: (file) => {
                            const [start, end] = file.dirname.split('/[character]/@mobile');
                            file.dirname = start + end;
                        },
                    },
                ],
            },
        })
    },
    saluteJsScenario: {
        id: 'saluteJsScenario',
        getConfig: ({ templatePath }) => ({

            off: {
                sourceAddon: [
                    `!${templatePath}src/pages/api/hook.ts`,
                    `!${templatePath}src/scenario/handlers.ts`,
                    `!${templatePath}src/scenario/scenario.ts`,
                ],
                jsonChanges: [
                    {
                        glob: `${templatePath}package.json`,
                        changes: {
                            remove: [
                                'dependencies.@salutejs/scenario',
                                'dependencies.@salutejs/storage-adapter-memory',
                            ],
                        },
                    },
                ],
            },
            on: {},
        })
    },
    ssgDemo: {
        id: 'ssgDemo',
        getConfig: ({ templatePath }) => ({

            off: {
                sourceAddon: [
                    `!${templatePath}src/components/PageSSG.tsx`,
                    `!${templatePath}src/pages/\\[character\\]/*/SSG.tsx`,
                ],
                jsonChanges: [],
            },
            on: {},
        })
    },
    ssrDemo: {
        id: 'ssrDemo',
        getConfig: ({ templatePath }) => ({

            off: {
                sourceAddon: [
                    `!${templatePath}src/pages/SSR.tsx`,
                    `!${templatePath}src/components/PageSSR.tsx`,
                ],
                jsonChanges: [],
            },
            on: {},
        })
    },
};
