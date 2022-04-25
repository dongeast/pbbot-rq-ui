// module.export = {
//
//     //设置代理
//     proxyTable: {
//         '/qqbot': {
//             target: 'http://127.0.0.1:3000', // 你请求的第三方接口
//             changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
//             pathRewrite: { // 路径重写，
//                 '^/qqbot': '/' // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
//             }
//         },
//         '/sohu': {
//             target: 'http://pv.sohu.com', // 你请求的第三方接口
//             changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
//             pathRewrite: { // 路径重写，
//                 '^/sohu': '/' // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
//             }
//         },
//     },
//
// };
module.exports = {
    publicPath: './',
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
