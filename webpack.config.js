const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { version } = require('./package.json');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        filename: 'xhr-monitor-debugger-hook.user.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'xhrMonitorDebuggerHook',
            type: 'umd',
            export: 'default'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: /@userscript/i
                    }
                },
                extractComments: false
            })
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `// ==UserScript==
// @name         XHR Monitor Debugger Hook
// @namespace    https://github.com/JSREI/js-xhr-monitor-debugger-hook
// @version      ${version}
// @description  A powerful XHR request monitor and debugger hook
// @author       JSREI
// @match        *://*/*
// @grant        none
// @license      MIT
// ==/UserScript==`,
            raw: true
        })
    ]
}; 