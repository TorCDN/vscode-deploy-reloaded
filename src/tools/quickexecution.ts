/**
 * This file is part of the vscode-deploy-reloaded distribution.
 * Copyright (c) Marcel Joachim Kloubert.
 * 
 * vscode-deploy-reloaded is free software: you can redistribute it and/or modify  
 * it under the terms of the GNU Lesser General Public License as   
 * published by the Free Software Foundation, version 3.
 *
 * vscode-deploy-reloaded is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Quick execution of JavaScript code.
 * 
 * @param {any} extension The extension context.
 * @param {any|any[]} allWorkspaces List of all workspaces.
 * @param {any|any[]} activeWorkspaces List of all active workspaces.
 */
export async function _1b87f2ee_b636_45b6_807c_0e2d25384b02_1409614337(
    extension: any,
    allWorkspaces: any | any[],
    activeWorkspaces: any | any[],
) {
    // vscode
    const $vs = require('vscode');

    // i18
    const $i18 = require('../i18');

    // helpers
    const $dl = require('../download');
    // helpers
    const $h = require('../helpers');
    // logger
    const $l = require('../log').CONSOLE;

    // all workspaces
    const $w: any[] = $h.asArray(allWorkspaces).map(ws => {
        const CLONED_WS = $h.makeNonDisposable(ws);

        // CLONED_WS.name
        Object.defineProperty(CLONED_WS, 'name', {
            enumerable: true,

            get: () => ws.name,
        });
        // CLONED_WS.rootPath
        Object.defineProperty(CLONED_WS, 'rootPath', {
            enumerable: true,

            get: () => ws.rootPath,
        });

        return CLONED_WS;
    });
    // active workspaces
    const $aw: any[] = $h.asArray(activeWorkspaces).map(aws => {
        const CLONED_AWS = $h.makeNonDisposable(aws);

        // CLONED_AWS.name
        Object.defineProperty(CLONED_AWS, 'name', {
            enumerable: true,
            
            get: () => aws.name,
        });
        // CLONED_AWS.rootPath
        Object.defineProperty(CLONED_AWS, 'rootPath', {
            enumerable: true,
            
            get: () => aws.rootPath,
        });

        return CLONED_AWS;
    });
    
    // require
    const $r = (id: any) => {
        return $h.requireFromExtension(id);
    };
    
    const $unwrap = async (val: any, maxDepth?: number, currentDepth?: number) => {
        if (isNaN(maxDepth)) {
            maxDepth = 64;
        }
        if (isNaN(currentDepth)) {
            currentDepth = 0;
        }

        if (currentDepth < maxDepth) {
            if (val) {
                if ('function' === typeof val) {
                    val = $unwrap(
                        Promise.resolve(
                            val()
                        ),
                        maxDepth, currentDepth + 1
                    );
                }
            }
        }

        return val;
    };

    const $unwrapArgs = async (args: IArguments | ArrayLike<any>): Promise<any[]> => {
        const UNWRAPPED_ARGS: any[] = [];

        args = await $unwrap(args);
        if (args) {
            for (let i = 0; i < args.length; i++) {
                UNWRAPPED_ARGS.push(
                    await $unwrap( args[i] ),
                );
            }
        }

        return UNWRAPPED_ARGS;
    };

    // resolve()
    const $res = async (val: any, ...funcs: ((v: any) => any)[]) => {
        val = await $unwrap(val);

        let lastResult: any = val;

        for (const F of $h.asArray(funcs)) {
            let result: any;
            if (F) {
                result = await Promise.resolve(
                    F(lastResult)
                );
            }

            lastResult = await $unwrap(result);
        }
        
        return lastResult;
    };

    // toStringSafe()
    const $s = async (val: any) => {
        return $h.toStringSafe(
            await $unwrap(val)
        );
    };

    // eval()
    const $e = async (code: any) => {
        return await $unwrap(
            eval(await $s(code))
        );
    };

    // toFullPath()
    const $fp = async (p: string) => {
        const Path = require('path');

        p = $h.toStringSafe(
            await $unwrap(p)
        );

        if (!Path.isAbsolute(p)) {
            p = Path.join(
                $aw[0].rootPath,
                p,
            );
        }

        return Path.resolve(p);
    };

    // executeCommand()
    const $c = async (id: string, ...cmdArgs: any[]) => {
        id = $h.toStringSafe(
            await $unwrap(id)
        );
        cmdArgs = $h.asArray(
            await $unwrap(cmdArgs),
            false,
        );

        const ARGS = [];
        if (cmdArgs) {
            for (const A of cmdArgs) {
                ARGS.push(
                    await $unwrap(A)
                );
            }
        }

        return await Promise.resolve(
            $vs.commands.executeCommand
                        .apply(null, [ <any>id ].concat( ARGS ))
        );
    };

    // showErrorMessage
    const $err = async function() {
        const ARGS = await $unwrapArgs(arguments);

        let msg = '';
        let moreParams = [];
        if (ARGS.length > 0) {
            msg = $h.toStringSafe(ARGS[0]);
            moreParams = ARGS.filter((x, i) => i > 0);    
        }

        return await $vs.window
                        .showErrorMessage
                        .apply(null, [ msg ].concat(moreParams));
    };

    const $guid = async (ver?: string, ...guidArgs: any[]) => {
        const UUID = require('uuid');

        ver = $h.normalizeString(
            await $unwrap(ver)
        );
        guidArgs = $h.normalizeString(
            await $unwrap(guidArgs)
        );
        
        const ARGS = [];
        if (guidArgs) {
            for (const A of guidArgs) {
                ARGS.push(
                    await $unwrap(A)
                );
            }
        }

        let func: (...a: any[]) => string;
        switch (ver) {
            case '1':
            case 'v1':
                func = UUID.v1;
                break;

            case '':
            case '4':
            case 'v4':
                func = UUID.v4;
                break;

            case '5':
            case 'v5':
                func = UUID.v5;
                break;
        }

        if (!func) {
            throw new Error($i18.t('tools.quickExecution.uuid.notSupported',
                                   ver));
        }

        return func.apply(null, ARGS);
    };

    const $hash = async (algo: string, val: any, asBinary?: boolean) => {
        algo = $h.normalizeString(
            await $unwrap(algo)
        );
        if ('' === algo) {
            algo = 'sha256';
        }

        val = await $unwrap(val);
        if ($h.isNullOrUndefined(val)) {
            return val;
        }

        asBinary = await $unwrap(
            $h.toBooleanSafe(asBinary)
        );

        const Crypto = require('crypto');
        
        const RESULT = Crypto.createHash(algo).update(
            await $h.asBuffer(val)
        );

        return asBinary ? RESULT.digest()
                        : RESULT.digest('hex');
    };

    // showInformationMessage
    const $info = async function() {
        const ARGS = await $unwrapArgs(arguments);

        let msg = '';
        let moreParams = [];
        if (ARGS.length > 0) {
            msg = $h.toStringSafe(ARGS[0]);
            moreParams = ARGS.filter((x, i) => i > 0);    
        }

        return await $vs.window
                        .showInformationMessage
                        .apply(null, [ msg ].concat(moreParams));
    };

    const $ip = async (v6 = false, timeout?: number, useHttps = false) => {
        const PublicIP = require('public-ip');

        v6 = $h.toBooleanSafe(
            await $unwrap(v6)
        );
        
        timeout = parseInt(
            $h.toStringSafe(
                await $unwrap(v6)
            ).trim()
        );
        if (isNaN(timeout)) {
            timeout = 5000;
        }

        useHttps = $h.toBooleanSafe(
            await $unwrap(useHttps)
        );

        const OPTS = {
            https: useHttps,
            timeout: timeout,
        };

        const GET_IP = v6 ? PublicIP.v6
                          : PublicIP.v4;

        return await GET_IP(OPTS);
    };

    const $lower = async (val: any) => {
        return $h.toStringSafe(
            await $unwrap(val)   
        ).toLowerCase();
    };

    const $md5 = async (val: any, asBinary?: boolean) => {
        return await $hash('md5',
                           val, asBinary);
    };

    const $now = async (timeZone?: string) => {
        const Moment = require('moment');
        const MomentTimezone = require('moment-timezone');  // keep sure to have
                                                            // 'tz()' method available in
                                                            // Moment instances

        const NOW = Moment();
        
        timeZone = $h.toStringSafe(
            await $unwrap(timeZone)
        ).trim();

        return '' === timeZone ? NOW
                               : NOW.tz(timeZone);
    };

    const $pwd = async (size = 20, chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') => {
        size = await $unwrap(size);

        chars = $h.toStringSafe(
            await $unwrap(chars)
        );

        let result = '';

        const BYTES: Buffer = await $h.randomBytes(size * 4);
        for (let i = 0; i < (BYTES.length / 4); i++) {
            const B = BYTES.readUInt32LE(i);

            result += chars[ B % chars.length ];
        }

        return result;
    };

    const $rand = async function (minOrMax?: number, max?: number) {
        const RandomFloat = require('random-float');

        minOrMax = parseFloat($h.toStringSafe(
            await $unwrap(minOrMax)
        ).trim());

        max = parseFloat($h.toStringSafe(
            await $unwrap(max)
        ).trim());
        
        const ARGS = [];
        if (!isNaN(max)) {
            ARGS.push(minOrMax, max);
        }
        else if (!isNaN(minOrMax)) {
            ARGS.push(minOrMax);
        }

        if (ARGS.length < 1) {
            ARGS.push(0, Number.MAX_SAFE_INTEGER);
        }

        return RandomFloat.apply(null, ARGS);
    };

    // readFile()
    const $rf = async (file: string) => {
        return await $h.readFile(
            await $fp(file)
        );
    };

    const $sha1 = async (val: any, asBinary?: boolean) => {
        return await $hash('sha1',
                           val, asBinary);
    };

    const $sha256 = async (val: any, asBinary?: boolean) => {
        return await $hash('sha256',
                           val, asBinary);
    };

    const $trim = async (val: any) => {
        return $h.toStringSafe(
            await $unwrap(val)   
        ).trim();
    };

    const $upper = async (val: any) => {
        return $h.toStringSafe(
            await $unwrap(val)   
        ).toUpperCase();
    };

    const $utc = async () => {
        return require('moment').utc();
    };

    const $uuid = async function (ver?: string, ...args: any[]) {
        return await $guid.apply(null, arguments);
    };

    // showWarningMessage
    const $warn = async function() {
        const ARGS = await $unwrapArgs(arguments);

        let msg = '';
        let moreParams = [];
        if (ARGS.length > 0) {
            msg = $h.toStringSafe(ARGS[0]);
            moreParams = ARGS.filter((x, i) => i > 0);    
        }

        return await $vs.window
                        .showWarningMessage
                        .apply(null, [ msg ].concat(moreParams));
    };

    // writeFile()
    const $wf = async (file: string, data: any, enc?: string) => {
        data = await $h.asBuffer(
            await $unwrap(data),
            await $unwrap(enc),
        );

        await $h.writeFile(
            await $fp(file),
            data
        );
    };

    // show help
    const $help = async () => {
        await require('../html').openMarkdownDocument(
            _27adf674_b653_4ee0_a33d_4f60be7859d2(),
            {
                documentTitle: '[vscode-deploy-reloaded] ' + $i18.t('tools.quickExecution.help.title'),
            }
        );
    };

    // code to execute
    const _def303d6_7db1_4511_8365_e93ed7979b92_1379012881 = await $vs.window.showInputBox(
        {
            placeHolder: $i18.t('tools.quickExecution.inputCode'),
            value: await $s(extension.workspaceState.get('vscdrLastQuickExecutionCode')),
        }
    );
    if ($h.isEmptyString(_def303d6_7db1_4511_8365_e93ed7979b92_1379012881)) {
        return;
    }

    // save last executed code
    extension.workspaceState.update('vscdrLastQuickExecutionCode',
                                    _def303d6_7db1_4511_8365_e93ed7979b92_1379012881);

    allWorkspaces = undefined;
    activeWorkspaces = undefined;
    extension = undefined;

    const RESULT = await Promise.resolve(
        $e(_def303d6_7db1_4511_8365_e93ed7979b92_1379012881)
    );

    let resultToDisplay = RESULT;

    let displayer: () => any;
    if ('undefined' !== typeof RESULT) {
        displayer = () => {
            $vs.window.showInformationMessage(
                $h.toStringSafe( resultToDisplay )
            ).then(() => {}, (err) => {
                $l.trace(err, 'quickexecution._1b87f2ee_b636_45b6_807c_0e2d25384b02_1409614337(1)');
            });
        };

        if (Buffer.isBuffer(resultToDisplay)) {
            const Hexy = require('hexy');
            const HtmlEntities = require('html-entities');

            let html = '';

            html += '<html>';
            html += '<head>';
            html += '<style type="text/css">';
            html += 'body { font-size: 1.25em; }';
            html += '</style>';
            html += '</head>';
            html += '<body>';
            html += '<pre>';
            html += (new HtmlEntities.AllHtmlEntities()).encode( Hexy.hexy(resultToDisplay) );
            html += '</pre>';
            html += '</body>';
            html += '</html>';
    
            displayer = () => {
                require('../html').openHtmlDocument(
                    html,
                    '[vscode-deploy-reloaded] ' + $i18.t('tools.quickExecution.result.title'),
                );
            };
        }
    }

    if (displayer) {
        await Promise.resolve(
            displayer()
        );
    }
}

// generate help document
function _27adf674_b653_4ee0_a33d_4f60be7859d2() {
    let help = '';

    help += "# Quick execution help\n";


    help += "## Constants\n";
    // $aw
    help += "### $aw\n";
    help += "An array of active workspaces.\n";
    help += "```javascript\n";
    help += "$aw[0].name\n";
    help += "$aw[0].rootPath\n";
    help += "```\n";
    help += "\n";
    // $l
    help += "### $l\n";
    help += "A [logger](https://mkloubert.github.io/vscode-deploy-reloaded/interfaces/_log_.logger.html).\n";
    help += "```javascript\n";
    help += "$l.warn('Test')\n";
    help += "```\n";
    help += "\n";
    // $w
    help += "### $w\n";
    help += "An array of all available workspace.\n";
    help += "```javascript\n";
    help += "$w[0].name\n";
    help += "$w[0].rootPath\n";
    help += "```\n";
    help += "\n";


    help += "## Functions\n";
    // $c
    help += "### $c\n";
    help += "Executes a Visual Studio Code command.\n";
    help += "```javascript\n";
    help += "$c('editor.action.selectAll')\n";
    help += "```\n";
    help += "\n";
    // $e
    help += "### $e\n";
    help += "Executes code.\n";
    help += "```javascript\n";
    help += "$e(\"require('vscode').window.showWarningMessage('Test')\")\n";
    help += "```\n";
    help += "\n";
    // $err
    help += "### $err\n";
    help += "Shows an error popup.\n";
    help += "```javascript\n";
    help += "$err('Test')\n";
    help += "```\n";
    help += "\n";
    // $fp
    help += "### $fp\n";
    help += "Keeps sure to return a full path.\n";
    help += "```javascript\n";
    help += "$fp('./myFile.txt')\n";
    help += "$fp('E:/test/myFile.txt')\n";
    help += "```\n";
    help += "\n";
    // $guid
    help += "### $s\n";
    help += "Generates a GUID.\n";
    help += "```javascript\n";
    help += "$guid\n";
    help += "$guid('v4')\n";
    help += "```\n";
    help += "\n";
    // $help
    help += "### $help\n";
    help += "Shows this help.\n";
    help += "```javascript\n";
    help += "$help\n";
    help += "```\n";
    help += "\n";
    // $hash
    help += "### $hash\n";
    help += "Hashes data.\n";
    help += "```javascript\n";
    help += "$hash('md5', 'abc')\n";
    help += "$hash('md5', 'abc', true)\n";
    help += "```\n";
    help += "\n";
    // $info
    help += "### $info\n";
    help += "Shows an info popup.\n";
    help += "```javascript\n";
    help += "$info('Test')\n";
    help += "```\n";
    help += "\n";
    // $ip
    help += "### $ip\n";
    help += "Tries to detect the public IP address.\n";
    help += "```javascript\n";
    help += "$ip\n";
    help += "$ip(true)  // IPv6\n";
    help += "$ip(false, 2000)  // IPv4 and 2000ms timeout\n";
    help += "```\n";
    help += "\n";
    // $lower
    help += "### $lower\n";
    help += "Handles a value as string and converts all characters to lower case.\n";
    help += "```javascript\n";
    help += "$lower\n";
    help += "```\n";
    help += "\n";
    // $md5
    help += "### $md5\n";
    help += "Hashes data with MD5.\n";
    help += "```javascript\n";
    help += "$md5('abc')\n";
    help += "$md5('abc', true)\n";
    help += "```\n";
    help += "\n";
    // $now
    help += "### $utc\n";
    help += "Returns the current time.\n";
    help += "```javascript\n";
    help += "$now\n";
    help += "$now('America/New_York')\n";
    help += "```\n";
    help += "\n";
    // $pwd
    help += "### $pwd\n";
    help += "Generates a password.\n";
    help += "```javascript\n";
    help += "$pwd()\n";
    help += "$pwd(10)\n";
    help += "$pwd(15, 'Ab_d67,')\n";
    help += "```\n";
    help += "\n";
    // $r
    help += "### $r\n";
    help += "Includes a module.\n";
    help += "```javascript\n";
    help += "$r('vscode').window.showWarningMessage('Test')\n";
    help += "```\n";
    help += "\n";
    // $rand
    help += "### $rand\n";
    help += "Generates a random float number.\n";
    help += "```javascript\n";
    help += "$rand\n";
    help += "$rand(59.1979)\n";
    help += "$res( $rand(5979, 23979), (n) => Math.floor(n) )\n";
    help += "```\n";
    help += "\n";
    // $res
    help += "### $res\n";
    help += "Resolves a wrapped value.\n";
    help += "```javascript\n";
    help += "$res( $dl.download('https://example.com'), (data) => data.toString('utf8') )\n";
    help += "$res( $dl.download('https://example.com'), (data) => data.toString('utf8'), (str) => str.toUpperCase() )\n";
    help += "```\n";
    help += "\n";
    // $rf
    help += "### $rf\n";
    help += "Reads the content of a file.\n";
    help += "```javascript\n";
    help += "$rf('./myFile.txt')\n";
    help += "```\n";
    help += "\n";
    // $s
    help += "### $s\n";
    help += "Converts a value / object to a string that is not `(null)` and not `(undefined)`.\n";
    help += "```javascript\n";
    help += "$s(123)\n";
    help += "```\n";
    help += "\n";
    // $sha1
    help += "### $sha1\n";
    help += "Hashes data with SHA-1.\n";
    help += "```javascript\n";
    help += "$sha1('abc')\n";
    help += "$sha1('abc', true)\n";
    help += "```\n";
    help += "\n";
    // $sha256
    help += "### $sha256\n";
    help += "Hashes data with SHA-256.\n";
    help += "```javascript\n";
    help += "$sha256('abc')\n";
    help += "$sha256('abc', true)\n";
    help += "```\n";
    help += "\n";
    // $trim
    help += "### $trim\n";
    help += "Handles a value as string and removes whitespaces from the beginning and the end.\n";
    help += "```javascript\n";
    help += "$trim\n";
    help += "```\n";
    help += "\n";
    // $upper
    help += "### $upper\n";
    help += "Handles a value as string and converts all characters to upper case.\n";
    help += "```javascript\n";
    help += "$upper\n";
    help += "```\n";
    help += "\n";
    // $utc
    help += "### $utc\n";
    help += "Returns the current UTC time.\n";
    help += "```javascript\n";
    help += "$utc\n";
    help += "```\n";
    help += "\n";
    // $uuid
    help += "### $uuid\n";
    help += "Generates a GUID.\n";
    help += "```javascript\n";
    help += "$uuid\n";
    help += "$uuid('v5')\n";
    help += "```\n";
    help += "\n";
    // $warn
    help += "### $warn\n";
    help += "Shows a warning popup.\n";
    help += "```javascript\n";
    help += "$warn('Test')\n";
    help += "```\n";
    help += "\n";
    // $wf
    help += "### $wf\n";
    help += "Writes data to a file.\n";
    help += "```javascript\n";
    help += "$wf('./myFile1.txt', 'Test')\n";
    help += "$wf('./myFile2.txt', 'Täst', 'utf8')\n";
    help += "$wf('./myFile3.txt', new Buffer('Test'))\n";
    help += "```\n";
    help += "\n";


    help += "## Modules\n";
    // $dl
    help += "### $dl\n";
    help += "Download [helpers](https://mkloubert.github.io/vscode-deploy-reloaded/modules/_download_.html).\n";
    help += "```javascript\n";
    help += "$dl.download('http://localhost/')\n";
    help += "```\n";
    help += "\n";
    // $h
    help += "### $h\n";
    help += "Extension [helpers](https://mkloubert.github.io/vscode-deploy-reloaded/modules/_helpers_.html).\n";
    help += "```javascript\n";
    help += "$h.normalizeString('Abcd Efgh  ')\n";
    help += "```\n";
    help += "\n";
    // $vs
    help += "### $vs\n";
    help += "Visual Studio Code [namespace](https://code.visualstudio.com/docs/extensionAPI/vscode-api).\n";
    help += "```javascript\n";
    help += "$vs.window.showWarningMessage('Test')\n";
    help += "```\n";
    help += "\n";

    return help;
}
