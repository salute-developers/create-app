#!/usr/bin/env node

import inquirer from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

import {
    cleanUp,
    downloadTemplatePackage,
    extractTemplatePackage,
    getArgv,
    printLogo,
    RuntimeError,
} from './utils.mjs';
import { buildTemplateTask } from './buildTemplate.mjs';
import { getConfigFromAnswers } from './config.mjs';
import { defaultRules } from './defaults/rules.mjs';

const CONFIG_ENTRY_POINT = '.create-app/index.mjs';
const DEFAULT_TEMPLATE = '@salutejs/canvas-example';

const checkboxInstructionsTranslation = `\n (Нажмите ${chalk.bold(
    chalk.cyan('<space>'),
)} чтобы переключить функцию, ${chalk.bold(chalk.cyan('<enter>'))} чтобы завершить выбор)\n`;

export async function run() {
    try {
        const {
            templatePath,
            output,
            runDir = process.cwd(),
            configPath = CONFIG_ENTRY_POINT,
            templatePackage = DEFAULT_TEMPLATE,
        } = getArgv();

        printLogo();

        let resolvedTemplatePath;

        if (templatePath) {
            resolvedTemplatePath = path.resolve(templatePath);

            if (!existsSync(path.resolve(resolvedTemplatePath))) {
                throw new RuntimeError(`create-app: Invalid templatePath '${templatePath}': No such file or directory`);
            }
        } else {
            const packageBuffer = await downloadTemplatePackage(templatePackage);
            resolvedTemplatePath = extractTemplatePackage(packageBuffer);
        }

        const templateConfig = existsSync(`${resolvedTemplatePath}/${configPath}`)
            ? `${resolvedTemplatePath}/${configPath}`
            : configPath;

        const templateModule = existsSync(templateConfig) ? await import(templateConfig) : {};
        const { featureToggles = [], featureConfigMap = {}, templateDescription = '', rules = [] } = templateModule;

        if (templateDescription) {
            console.log(`${chalk.bold('Описание шаблона:')} ${templateDescription}`);
            console.log('');
        }

        const featureChoices = featureToggles
            .filter((toggle) => !toggle.hidden)
            .map((toggle) => {
                return {
                    name: toggle.name,
                    checked: toggle.defaultValue,
                    value: toggle.featureId,
                    short: toggle.featureId,
                };
            });

        const questions = [
            {
                type: 'input',
                name: 'projectName',
                message: 'Название вашего проекта:',
                default: 'template-app',
            },
            {
                type: 'confirm',
                name: 'changeDefaults',
                message: 'Хотите изменить список стандартных функций проекта?',
                default: false,
                when: featureChoices.length !== 0 && Object.keys(featureConfigMap).length !== 0,
            },
            {
                type: 'checkbox',
                name: 'featureIds',
                message: 'Измените список стандартных функций',
                suffix: checkboxInstructionsTranslation,
                loop: false,
                choices: featureChoices,
                pageSize: 12,
                when: (answers) => answers.changeDefaults,
            },
            {
                type: 'confirm',
                name: 'installDependencies',
                message: 'Выполнить установку зависимостей (npm install)?',
                default: true,
            },
        ];

        const answers = await inquirer.prompt(questions);

        const defaultFeatureToggles = featureToggles
            .filter((toggle) => toggle.hidden && toggle.defaultValue)
            .map((toggle) => toggle.featureId);

        const featureIds = answers.featureIds
            ? answers.featureIds
            : featureToggles.filter((toggle) => toggle.defaultValue).map((toggle) => toggle.featureId);

        const withHiddenToggles = {
            ...answers,
            featureIds: [...new Set([...featureIds, ...defaultFeatureToggles])], // оставляем уникальное объединение
        };

        const destination = output || `${runDir}/${answers.projectName}`;
        const config = getConfigFromAnswers({
            answers: withHiddenToggles,
            featureConfigMap,
            templatePath: `${resolvedTemplatePath}/`,
            output: destination,
            runDir,
        });

        await buildTemplateTask(config, [...defaultRules, rules]);

        if (answers.installDependencies) {
            console.log('');
            console.log('ℹ️  Установка зависимостей');
            console.log('');
            execSync('npm i', {
                cwd: destination,
                encoding: 'UTF-8',
                stdio: 'inherit',
            });
            console.log('');
            console.log('ℹ️  Установка зависимостей завершена');
        }

        console.log('');
        console.log(chalk.green('✅ Готово!'));
        console.log('');
    } catch (err) {
        if (err instanceof RuntimeError) {
            console.error(err.message);

            return;
        }

        console.error(err);
    } finally {
        cleanUp();
    }
}

run();
