const path = require('path');

const srcPath = __dirname + "/src/main";
const buildPath = __dirname + "/build";

const CopyWebpackPlugin = require('copy-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

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
                    from: 'src/main/resources/static/index.html',
                    to: buildPath,
                }
            ]),
            new InjectManifest({
                swSrc: "src/main/js/sw.js",
            }),
            new WebpackPwaManifest({
                filename: "manifest.json",
                name: "Workbox Webpack Template",
                short_name: "wwt",
                description: "none",
                background_color: "#ffffff",
                icons: [
                    {
                        src: path.resolve('src/main/resources/static/icons/paw.png'),
                        sizes: [96, 128, 192, 256, 384, 512],
                        destination: path.join('icons')
                    }
                ]
            }),
        ],
        devServer: {
            contentBase: 'build',
            port: 3000,
        },
    };
};
