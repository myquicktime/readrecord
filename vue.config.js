module.exports = {
  // 核心：把绝对路径 / 改为相对路径 ./
  publicPath: './',
  
  // 可选：如果是多环境打包，也可以这样写
  // publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
}