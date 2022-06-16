# @salutejs/create-app
Шаблонизатор проектов

Простейший способ получить заготовку проекта это выполнить команду


```bash
npx @salutejs/create-app
```

После запуска появится визард, в котором можно указать имя проекта и прочие опции. После завершения работы скрипта в текущей рабоче директории терминала будет создана еще одна директория с именем указанным как имя проекта.


### Параметр `--templatePackage`
При запуске команды без аргументов будет выбран пакет `@salutejs/canvas-example` как пакет-шаблон. Но можно указать в качестве шаблона любой другой пакет. При отсутствии дополнительной конфигурации пакет-шаблон будет просто скопирован в целевую папку.

```bash
npx @salutejs/create-app --templatePackage any-npm-package
```

Если ваш пакет требует авторизации в npm, можно задать токен доступа в env-переменную `NPM_REGISTRY_TOKEN`.

## Создание своего шаблона


`@salutejs/create-app` создавался для шаблонов `@salutejs`, но не привязан ни к какому конкретному шаблону. Поэтому достаточно просто создавать свои шаблоны. В простейшем виде шаблоном является любой npm пакет. В этом можно убедиться вызвав `npx @salutejs/cerate-app --templatePackage lodash`. В этом случае `@salutejs/cerate-app` просто скопирует все файлы пакета в целевую папку.

Но такие шаблоны не имеют особого смысла, они лишь упрощают копирование пакета. Поэтому существует специальный API, позволяющий более тонко настраивать шаблоны. Для использования этого API необходимо создать папку `./.create-app/` в корне пакета-шаблона и файл `index.mjs` в этой папке. В простейшем виде это может быть пустой файл. Помимо этого все файлы прогоняются через [mustache](https://mustache.github.io/mustache.5.html).

![2](https://user-images.githubusercontent.com/17454987/172394436-996e6b30-874e-49ec-b11a-fa2b2cbbb685.png)

### Директивы шаблонизации

Все копируемые из шаблона файлы прогоняются через [mustache](https://mustache.github.io/mustache.5.html). При этом mustache директивы переопределены таким образом, чтобы оставаться просто комментариями для исходного кода. Это позволяет оставить исходные файлы валидным JS кодом (префикс директивы `{{` заменен на `/* <|`, а постфикс `}}` на `|> */`), чтобы шаблон можно было запускать и тестировать без шага предварительной шаблонизации. Также можно задать и свои правила для любых файлов при помощи [поля rules](#rules) конфига.

Например, строка, обернутая в приведенные ниже директивы, будет присутствовать в конечном файле если включен `featureToggle` с `id` равным `imageOptimization` или отсутствовать в противном случае.

```js
    /* <|#imageOptimization|> */
    { href: `${basePath}/image-optimization`, content: 'Оптимизация изображений' },
    /* <|/imageOptimization|> */
```

На оригинальном синтаксисе mustache это выглядело бы так

```js
    {{#imageOptimization}}
    { href: `${basePath}/image-optimization`, content: 'Оптимизация изображений' },
    {{/imageOptimization}}
```

### Описание конфига

Более тонкая настройка (например описание шаблона, правила включения и исключения файлов и так далее) осуществляется с помощью экспортирования переменных из файла конфига, их более подробное описание ниже, а [развернутый пример можно посмотреть в этом репозитории](./test/__mock__/template-package/.create-app/index.mjs).

#### templateDescription

Текстовое описание шаблона. Будет показано пользователю сразу после запуска `@salutejs/create-app`.
```js
export templateDescription = "Описание шаблона";
```

#### featureToggles

Если необходимо, чтобы пользователь мог выбрать из некого списка дополнительных возможностей (`featureToggle`) шаблона, нужно экспортировать переменную featureToggles, которая представляет из себя массив объектов вида.

```js
{
    featureId: 'imageOptimization',
    name: `Оптимизация изображений
    Для более быстрой загрузки изображений next использует изображения
    правильного формата и размера. В примере так же используется аватарница
    sberdevices, что является целевой картиной для использования изображений`,
    defaultValue: true,
    hidden: false,
}
```

![1](https://user-images.githubusercontent.com/17454987/172394448-d4ba47ac-e710-4773-be83-063bdbc31451.png)

При этом сам по себе массив ничего не делает, лишь отвечает за показанный пользователю интерфейс и сбор ответов пользователя. На этапе выполнения визарда появится вопрос про изменение дефолтных опций, если пользователь ответит на него положительно, то тогда он сможет переключать состояния различных `featureToggle`.

 * **featureId** - произвоьлный уникальный идентификатор `featureToggle`
 * **name** - название `featureToggle`, для большей ясности можно добавить к нему дополнительное описание через символ переноса строки. Важно помнить про то, что ширина терминала пользователя может быть достаточно маленькой, желательно форматировать описание так, чтобы длина каждой отдельной сртоки была не больше 80 символов
 * **defaultValue** - должен ли `featureToggle` быть включенным или выключенным по умолчанию
 * **hidden** - если `true`, то скрывает от пользователя `featureToggle` (нужен, если мы всегда хотим применять некую логику шаблониазции вне зависимости от выбора пользователя, но не применять ее заранее к исходным файлам)

#### featureConfigMap

Основная часть конфига. После того как пользователь выбрал необходимые ему `featureToggle`, эта часть конфига позволяет `@salutejs/create-app` на основе этих ответов принять решение, какие модификаторы (`featureConfig`) необходимо применить к шаблону.

В простом случае достаточно соотвествия "один к одному", то есть одному `featureToggle` соответсвует один `featureConfig`. Но в реальных примерах это не всегда так, поэтому `featureConfigMap` позволяет установить более сложные правила соответствия. Переменная `featureConfigMap` представляет из себя объект, ключами которого являются уникальные идентификаторы `featureConfig`, а значениями другой объект вида

```js
{
    'imageOptimizationConfigId' :{
        config: (options) => getImageOptimizationConfig(options),
        test: (selectedFeatureToggleIds) => selectedFeatureToggleIds.includes('imageOptimization'),
    }
    /* ... */
}
```
 * **imageOptimizationConfigId** - в данном примере это произвольный уникальный идентификатор `featureConfig`
 * **config** - функция, принимающая набор некоторых опций и возвращающая готовый featureConfig (должна быть определена автором шаблона)
    * **options.templatePath** - абсолютный путь до текущей папки пакета-шаблона, можно использовать как префикс для всех путей, которые хотелось бы не указвать как абсолютный (см. пример ниже).
 * **test** - функция, которая по выбранным `featureToggle` определяет, нужно ли применить текущий `featureConfig` к шаблону в состоянии `on` или нет состоянии `off`. В простейшем соответствии "один к одному" можно проверить, что выбранный `featureToggle` есть в массиве `selectedFeatureToggleIds`.

`featureConfig`, который возвращается функцией `config`, имеет вид:

```js
{
    off: {
        sourceAddon: [
            `!${templatePath}src/components/PageImageOptimization.tsx`,
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
        ],
    },
    on: {
        sourceAddon: [],
        jsonChanges: [],
    },
}

```

Основной упор в `@salutejs/create-app` сделан на то, что пакет-шаблон может оставаться запускаемым пакетом и валидным с точки зрения JS. Поэтому в объекте конфига есть 2 способа повлиять на состав файлов проекта, который получится после шаблонизации: если конфиг включен (`on`) и если конфиг выключен (`off`).

 * **off** - это та часть конфига, которая будет применена, если функция `test` вернула `false`.
    * `sourceAddon` - массив `glob`-паттернов, который говорит какие файлы нужно добавить или исключить при применении этой части конфига. В примере выше из общего списка файлов убирается файл `PageImageOptimization.tsx`.
    * `jsonChanges` - это поле необходимо только потому, что JSON как формат лишен комментариев и невозможно добавить внутрь JSON-файла [директивы шаблонизации](#директивы-шаблонизации) с помощью комментариев. Принимает массив объектов в которых 
        * **glob** - `glob`-паттерн который выбирает файлы, к которым будут применены изменения из поля `changes`
        * **changes** - объект, описывающий, какие поля в JSON-файле надо удалить (поле `remove`), а какие изменить/добавить (поле `merge`). Поле `remove` подразумевает массив строк, каждая из которых задает путь до поля. В примере удаляется поле `build:static` из объекта `scripts` в `package.json`. Поле `merge` предоставляет объект для объединения с определенным в JSON объектом ([lodash merge](https://lodash.com/docs/#merge)).
 * **on** - часть конфига, которая будет применена, если функция `test` вернула `true` (такие же поля как и для `off`)

На практике шаблон часто представляет из себя максимальный пример со всеми файлами. И важнее убирать из него файлы, когда какая-то функциональность не нужна, чем наоборот.

#### rules
В случае если нужно переопределить для каких-то файлов стиль комментария, служащим директивой шаблонизации (например для файлов без расширения), необходимо экспортировать переменную rules, представляющую из себя массив объектов вида

```js
{
    test: (file) => ['.env.production', '.env.development', '.gitignore']
        .includes(file.basename),
    tags: ['# <|', '|> #'],
},
```

 * **test** - функция, принимающая в себя файл (`file`) в терминах [vinyl-fs](https://github.com/gulpjs/vinyl#instance-methods) и возвращающая `true`, для файлов, к которым нужно применять указанные тэги как префикс/постфикс директивы шаблонизации.
 * **tags** - префикс (первый элемент) и постфикс (второй элемнет) директив шаблониазции
