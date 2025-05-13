const path = require('path');
const webpack = require('webpack');
const webpackPackageJson = require('./package.json');
const fs = require('fs');

module.exports = {
    entry: {
        index: './src/index.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    optimization: {},
    plugins: [
        new webpack.BannerPlugin({
            entryOnly: true,
            raw: true,
            banner: () => {
                let userscriptHeaders = fs.readFileSync('./userscript-headers.js').toString('utf-8');
                userscriptHeaders = userscriptHeaders.replaceAll('${name}', webpackPackageJson['name'] || '');
                userscriptHeaders = userscriptHeaders.replaceAll('${namespace}', webpackPackageJson['namespace'] || '');
                userscriptHeaders = userscriptHeaders.replaceAll('${version}', webpackPackageJson['version'] || '');
                userscriptHeaders = userscriptHeaders.replaceAll('${description}', webpackPackageJson['description'] || '');
                userscriptHeaders = userscriptHeaders.replaceAll('${document}', webpackPackageJson['document'] || '');
                userscriptHeaders = userscriptHeaders.replaceAll('${author}', webpackPackageJson['author'] || '');
                userscriptHeaders = userscriptHeaders.replaceAll('${repository}', webpackPackageJson['repository'] || '');

                const bannerFilePath = './banner.txt';
                if (fs.existsSync(bannerFilePath)) {
                    let banner = fs.readFileSync(bannerFilePath).toString('utf-8');
                    banner = banner.replaceAll('${name}', webpackPackageJson['name'] || '');
                    banner = banner.replaceAll('${namespace}', webpackPackageJson['namespace'] || '');
                    banner = banner.replaceAll('${version}', webpackPackageJson['version'] || '');
                    banner = banner.replaceAll('${description}', webpackPackageJson['description'] || '');
                    banner = banner.replaceAll('${document}', webpackPackageJson['document'] || '');
                    banner = banner.replaceAll('${author}', webpackPackageJson['author'] || '');
                    banner = banner.replaceAll('${repository}', webpackPackageJson['repository'] || '');
                    userscriptHeaders += '\n' + banner.split('\n').join('\n//    ') + '\n';
                }

                return userscriptHeaders;
            }
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    }
}; 