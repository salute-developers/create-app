// MIT License
// Copyright © 2019 Andrés Zorro

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * Integration test helper
 * Author: Andrés Zorro <zorrodg@gmail.com>
 */
/* eslint-disable */
const spawn = require('cross-spawn');
const concat = require('concat-stream');

const { PATH } = process.env;

/**
 * Creates a child process with script path
 * @param {Array} args Arguments to the command
 * @param {Object} env (optional) Environment variables
 */
function createProcess(args = [], env = null) {
    // This works for node based CLIs, but can easily be adjusted to
    // any other process installed in the system
    return spawn('node', args, {
        env: {
            NODE_ENV: 'test',
            preventAutoStart: false,
            PATH, // This is needed in order to get all the binaries in your current terminal
            ...env,
        },
        stdio: [null, null, null, 'ipc'], // This enables interprocess communication (IPC)
    });
}

/**
 * Creates a command and executes inputs (user responses) to the stdin
 * Returns a promise that resolves when all inputs are sent
 * Rejects the promise if any error
 * @param {Array} args Arguments to the command
 * @param {Array} inputs (Optional) Array of inputs (user responses)
 * @param {Object} opts (optional) Environment variables
 */
function executeWithInput(args = [], inputs = [], opts = {}) {
    if (!Array.isArray(inputs)) {
        opts = inputs;
        inputs = [];
    }

    const { env = null, timeout = 100, maxTimeout = 10000 } = opts;
    const childProcess = createProcess(args, env);
    childProcess.stdin.setEncoding('utf-8');

    let intermediateConsoleOutput = [];
    let inputIndex = 0;

    const promise = new Promise((resolve, reject) => {
        // Get errors from CLI
        childProcess.stderr.on('data', (data) => {
            // Log debug I/O statements on tests
            if (env && env.DEBUG) {
                console.log('error:', data.toString());
            }
        });

        // Get output from CLI
        childProcess.stdout.on('data', (data) => {
            // Log debug I/O statements on tests
            if (env && env.DEBUG) {
                console.log('output:', data.toString());
            }

            intermediateConsoleOutput.push(data);

            if (!inputs[inputIndex]) {
                return;
            }

            const consoleOutputAsString = Buffer.concat(intermediateConsoleOutput).toString();

            if (consoleOutputAsString.match(inputs[inputIndex].regexpToWait)) {
                intermediateConsoleOutput = [];
                childProcess.stdin.write(inputs[inputIndex].textToInput);
                inputIndex++;
            }
        });

        childProcess.stderr.once('data', (err) => {
            childProcess.stdin.end();
            reject(err.toString());
        });

        childProcess.on('error', reject);

        childProcess.stdout.pipe(
            concat((result) => {
                resolve(result.toString());
            }),
        );
    });

    // Appending the process to the promise, in order to
    // add additional parameters or behavior (such as IPC communication)
    promise.attachedProcess = childProcess;

    return promise;
}

module.exports = {
    createProcess,
    create: () => {
        const fn = (...args) => executeWithInput(...args);

        return {
            execute: fn,
        };
    },
    DOWN: '\x1B\x5B\x42',
    UP: '\x1B\x5B\x41',
    ENTER: '\x0D',
    SPACE: '\x20',
};
