const path = require('path');

const srcPath = __dirname + "/src/main";
const buildPath = __dirname + "/build";

const CopyWebpackPlugin = require('copy-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');

module.exports = (env = {}, argv) => {
    const isProduction = argv.mode === 'production';
    return {
        context: __dirname,
        entry: srcPath + "/js/app.js",
        output: {
            path: buildPath,
            filename: "js/app.js",
        },
        devtool: isProduction ? '' : 'source-map',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'src/main/resources/static/',
                    to: buildPath,
                }
            ]),
            new InjectManifest({
                swSrc: "src/main/js/sw.js",
            }),
        ],
        devServer: {
            contentBase: 'build',
            port: 3000,
            proxy: {
                '/api/*': {
                    target: 'http://localhost:8080',
                    secure: false
                }
            }
        },
    };
};
