module.exports = {

    // 代理配置
    devServer: {
        port: 8090,
        proxy: {
            '/api': {
                // 登陆的开源项目后端
                target: 'https://api.usuuu.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/qqbot': {
                // 手写的QQ框架功能后端
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                pathRewrite: {
                    '^/qqbot': '/'
                }
            },
            '/sohu': {
                target: 'http://pv.sohu.com',   //这里是域名，不是完整地址
                changeOrigin: true,             //是否跨域
                pathRewrite: {
                '^/sohu': '/'
                }
            },
        }
    }
};
