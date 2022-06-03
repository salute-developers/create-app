export const featureToggles = {
    characterPrerender: {
        featureId: 'characterPrerender',
        name: `Пререндер по персонажам
    Если у вы одновременно хотите пререндер и страницы для разных персонажей
    рисуются по-разному`,
        defaultValue: true,
        hidden: true,
    },
    createApp: {
        featureId: 'createApp',
        name: `createApp
    Временный технический тогл, отвечает за то, попадут ли в итоговый проект
    файлы и скрипты отвечающие непосредственно за шаблонизацию`,
        defaultValue: false,
        hidden: true,
    },
    filterPackageJson: {
        featureId: 'filterPackageJson',
        name: `filterPackageJson
    package.json в опубликованном пакете отличается от того, который
    лежит в исходных файлах, проводим дополнительную подготовку файла чтобы
    убрать это различие`,
        defaultValue: true,
        hidden: true,
    },
    graphql: {
        featureId: 'graphql',
        name: `GraphQL
    В проекте будет пример клиентского кода для общения с GraphQL-сервером`,

    },
    nextServer: {
        featureId: 'nextServer',
        name: `next-сервер
    ❗️ Если отключить потеряется возможность использования ряда фич, подробно
    описанных тут https://nextjs.org/docs/advanced-features/static-html-export.
    В первую очередь SSR и серверную логику
    ❗️ Если отключить отпадет необходимость собирать docker-образ (нужно будет
    деплоить собранную фронтовую статику на CDN)`,
        defaultValue: true,
    },
    platformPrerender: {
        featureId: 'platformPrerender',
        name: `Пререндер по платформам
    Если у вы одновременно хотите пререндер и страницы для разных платформ
    рисуются по-разному`,
        defaultValue: true,
        hidden: true,
    },
    imageOptimization: {
        featureId: 'imageOptimization',
        name: `Оптимизация изображений
    Для более быстрой загрузки изображений next использует изображения
    правильного формата и размера. В примере так же используется аватарница
    sberdevices, что является целевой картиной для использования изображений`,
        defaultValue: true,
    },
    prefetchDemo: {
        featureId: 'prefetchDemo',
        name: `Пример с пред-запросом страниц
    В примере показано как сделать так, чтобы после загрузки текущей страницы
    next начал загружать следующие целевые страницы для их более быстрой
    загрузки`,
        defaultValue: true,
    },
    saluteJsScenario: {
        featureId: 'saluteJsScenario',
        name: `Подключение ручки сценария saluteJs
    Пример как получать данные из сценария, проксируя запрос через next-сервер`,
        defaultValue: true,
    },
    ssgDemo: {
        featureId: 'ssgDemo',
        name: `Пример SSG
    Будут включены страница и вспомогательный код с настроенным SSG`,
        defaultValue: true,
    },
    ssrDemo: {
        featureId: 'ssrDemo',
        name: `Пример SSR
    Будут включены страница и вспомогательный код с настроенным SSR`,
        defaultValue: true,
    }
};
