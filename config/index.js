// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../publish/index.html'),
        assetsRoot: path.resolve(__dirname, '../publish'),
        assetsSubDirectory: 'res',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: 'res',
        assetsPublicPath: '/',
        proxyTable: {
            '/rest': {
                // target: 'http://10.120.54.47/rest',
                target: 'http://m.tcl.com/rest',
                changeOrigin: true,
                pathRewrite: {
                    '^/rest': '',
                    // '^/item/(\w+)$': '/#/goods/detail?uuid=$1',
                    // '/front/product/toProduct/(\w+)$': '/#/goods/detail?uuid=$1'
                }
            }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}