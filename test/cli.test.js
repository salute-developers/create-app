/* eslint-disable @typescript-eslint/no-var-requires, global-require */
const fs = require('fs');
const path = require('path');

const cmd = require('./runner');

const defaultInputs = [
    {
        regexpToWait: /Название вашего проекта/,
        textToInput: `template-app${cmd.ENTER}`,
    },
    {
        regexpToWait: /Хотите изменить список стандартных функций проекта/,
        textToInput: `n${cmd.ENTER}`,
    },
    {
        regexpToWait: /Выполнить установку зависимостей \(npm install\)/,
        textToInput: `n${cmd.ENTER}`,
    },
];

async function runCli(inputs = [], ...args) {
    const cliProcess = cmd.create();

    return cliProcess.execute(
        ['./src/cliWizard.mjs', '--runDir', path.dirname(__dirname), ...args], // args
        inputs,
        {
            env: {
                ...process.env,
                INSIDE_CLI_TEST_RUNNER: true,
            },
        },
    );
}

describe('cli', () => {
    afterEach(() => {
        fs.rmdirSync('./template-app/', { recursive: true, force: true });
    });

    it('default case of template', async () => {
        const response = await runCli(defaultInputs, '--templatePath', './test/__mock__/template-package');

        console.log(response);
        expect(response).toMatchSnapshot();

        const packageJsonExists = fs.existsSync('./template-app/package.json');
        expect(packageJsonExists).toBe(true);
    });

    it('template without feature toggles', async () => {
        const inputs = [defaultInputs[0], defaultInputs[2]];

        const response = await runCli(inputs);

        console.log(response);
        expect(response).toMatchSnapshot();

        const packageJsonExists = fs.existsSync('./template-app/package.json');
        expect(packageJsonExists).toBe(true);
    });

    it('mustache applied to PageIndex', async () => {
        await runCli(defaultInputs, '--templatePath', './test/__mock__/template-package');

        const filePathToCheck = './template-app/src/components/PageIndex.tsx';
        const fileExists = fs.existsSync(filePathToCheck);

        expect(fileExists).toBe(true);

        const fileContent = fs.readFileSync(filePathToCheck).toString();

        expect(fileContent).toMatchSnapshot();
    });
});
