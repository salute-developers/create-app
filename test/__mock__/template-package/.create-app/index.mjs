const characterPrerenderFeatureId = 'characterPrerender';
const platformPrerenderFeatureId = 'platformPrerender';

import { featureConfigs } from './featureConfigs.mjs';
import { featureToggles as featureTogglesRaw } from './featureToggles.mjs';

export const featureToggles = Object.values(featureTogglesRaw);

export const featureConfigMap = {
    [featureConfigs.graphql.id]: {
        config: featureConfigs.graphql.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.graphql.id),
    },
    [featureConfigs.createApp.id]: {
        config: featureConfigs.createApp.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.createApp.id),
    },
    [featureConfigs.nextServer.id]: {
        config: featureConfigs.nextServer.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.nextServer.id),
    },
    [featureConfigs.redirects.id]: {
        config: featureConfigs.redirects.getConfig,
        test: (featureIds) =>
            featureIds.some(
                (featureId) => featureId === characterPrerenderFeatureId || featureId === platformPrerenderFeatureId,
            ),
    },
    [featureConfigs.characterRedirectOnly.id]: {
        config: featureConfigs.characterRedirectOnly.getConfig,
        test: (featureIds) =>
            featureIds.includes(characterPrerenderFeatureId) && !featureIds.includes(platformPrerenderFeatureId),
        id: featureConfigs.characterRedirectOnly.id,
    },
    [featureConfigs.redirectsPlatform.id]: {
        config: featureConfigs.redirectsPlatform.getConfig,
        test: (featureIds) =>
            !featureIds.includes(characterPrerenderFeatureId) && featureIds.includes(platformPrerenderFeatureId),
        id: featureConfigs.redirectsPlatform.id,
    },
    [featureConfigs.platformAndCharacterRedirect.id]: {
        config: featureConfigs.platformAndCharacterRedirect.getConfig,
        test: (featureIds) =>
            featureIds.includes(characterPrerenderFeatureId) && featureIds.includes(platformPrerenderFeatureId),
        id: featureConfigs.platformAndCharacterRedirect.id,
    },
    [featureConfigs.filterPackageJson.id]: {
        config: featureConfigs.filterPackageJson.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.filterPackageJson.id),
    },
    [featureConfigs.ssrDemo.id]: {
        config: featureConfigs.ssrDemo.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.ssrDemo.id) && featureIds.includes(featureConfigs.nextServer.id),
    },
    [featureConfigs.ssgDemo.id]: {
        config: featureConfigs.ssgDemo.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.ssgDemo.id),
    },
    [featureConfigs.getServerData.id]: {
        config: featureConfigs.getServerData.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.ssgDemo.id) || featureIds.includes(featureConfigs.ssrDemo.id),
    },
    [featureConfigs.prefetchDemo.id]: {
        config: featureConfigs.prefetchDemo.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.prefetchDemo.id)
    },
    [featureConfigs.imageOptimization.id]: {
        config: featureConfigs.imageOptimization.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.imageOptimization.id)
    },
    [featureConfigs.saluteJsScenario.id]: {
        config: featureConfigs.saluteJsScenario.getConfig,
        test: (featureIds) => featureIds.includes(featureConfigs.saluteJsScenario.id) && featureIds.includes(featureConfigs.nextServer.id),
    },
};

export const templateDescription = '@sberdevices/create-canvas-app – визард для быстрого создания canvas-app c нуля на базе nextjs';

const JS_COMMENT_EXTENSIONS = ['.ts', '.tsx', '.json', '.js', '.jsx', '.mustache', '.css'];
const HTML_COMMENT_EXTENSIONS = ['.md', '.html'];

export const rules = [
    {
        test: (path) => JS_COMMENT_EXTENSIONS.includes(path.extname),
        tags: ['/* <|', '|> */'],
    },
    {
        test: (path) => HTML_COMMENT_EXTENSIONS.includes(path.extname),
        tags: ['<!-- <|', '|> -->'],
    },
    {
        test: (file) => ['.env.production', '.env.development', '.gitignore'].includes(file.basename),
        tags: ['# <|', '|> #'],
    },
];
