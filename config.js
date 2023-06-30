let env = "develop"
// 防止在上传代码时忘记将env改成production
//  小程序的版本分为开发版，体验版，正式版
const envVersion = wx.getAccountInfoSync().miniProgram.envVersion
// 如果为正式版并且不等于production就更改env为production
if(envVersion === "release" && env !== "production"){
  env = "production"
}
export default{
  // 当前环境
  env,
  // 请求接口域名
  baseUrl:{
    develop:"http://localhost:3000",
    production:"http://api.xxx.com"
  }
}