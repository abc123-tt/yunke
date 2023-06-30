const app = getApp()
export default function createRequest(options){
  // 有点类似导航守卫的功能
  return new Promise((resovel)=>{
    const token = wx.getStorageSync('token')
    if(options.needLogin !== false && !token){
      wx.showToast({
        title: '请先登录',
        icon:"none"
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/login/index',
        })
      },2000)
      return 
    }
    // 发送请求的必要条件
    // const baseUrl = "http://localhost:3000"
    // 获取环境变量
    const baseUrl = app.getConfig("baseUrl")
    const url =`${baseUrl}${options.url}`
    // 请求头
    const header = {token}
    // 显示加载的动画
    let showLoading = false
    if(options.loading !== false){
      showLoading = true
      wx.showLoading({
        title:"正在加载中...",
        mask:true
      })
    }

    // 发送请求
    wx.request({
      url,
      method:options.method || 'GET',
      timeout:options.timeout || 10000,
      header,
      data:options.data || {},
      // 成功
      success(res){
        // code = 0    成功
        // code = -1   异常
        // code = 403  教务系统cookie失效，需要重新登录
        // 其他

        // 判断code
        res = res.data
        switch(res.code){
          // 登录成功
          case 0:
            // 把请求成功的数据返回出去
            return resovel(res)
          // 登录异常
          case -1:
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
            break;
          // 登录失效，需要重新登录 
          case 403:
            wx.showToast({
              title: '登录已失效，请重新登陆',
              icon:'none'
            })
            setTimeout(()=>{
              wx.redirectTo({
                url: '/pages/login/index',
              })
            },2000)
            break;
          default:
            wx.showToast({
              title: '服务开小差啦！',
              icon:'none'
            })
            break;
        }
      },
      // 失败
      fail(err){
        wx.showToast({
          title: '服务开小差啦！',
          icon:'none'
        })
      },
      // 不管成功与否
      complete(res){
        // 如果有loading就隐藏
        if(showLoading){
          wx.hideLoading()
        }
      }

    })
  })
}