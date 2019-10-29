const path = require('path')
const resolve = dir => path.join(__dirname,dir)

//生产环境：iview-admin,测试环境直接访问/即可
const BASE_URL = process.env.NODE_ENV === 'procution' ? '/iview-admin':'/'
module.exports = {
  lintOnSave: false,
  publicPath:"./",
  chainWebpack: config =>{
    config.resolve.alias.set('@',resolve('src')).set("_c",resolve('src/components'))
  },
  productionSourceMap:false
}
