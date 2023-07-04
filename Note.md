# 1. 部署本地数据库

### 1.1 克隆文件到本地

```
https://github.com/danbaixi/UAAS-API
```

### 1.2 进入文件根目录打开cmd运行本地数据库

```
npm start
```



# 2. 登录

**测试号：test  密码：123456**

**UI设计稿地址：https://github.com/danbaixi/yunxiaohui**

### 2.1 引入coloruicss

> 1. 将项目拷贝下来，拷贝地址：https://github.com/weilanwl/coloruicss
> 2. 将coloruicss->template->colorui拷贝到自己的项目style目录中
> 3. 在style中新建main.wxss作为基础样式文件，引入colorui中的三个文件，分别是main.wxss   icon.wxss  animation.wxss
> 4. 在根目录的app.wxss中引入刚刚创建的main.wxss

**可能会报错，如果报错就清除缓存重新编译**

### 2.2 使用colorui

>1. 导入项目coloruicss->demo
>2. 选择测试号
>3. 运行项目



# 3. 封装请求函数

### 3.1 封装请求拦截和响应拦截

> 1. 导出一个函数
> 2. 返回的是一个Promise，在Promise中做拦截处理
> 3. 接着拼接好发送请求的条件
> 4. 发送请求，对返回的code做处理

```javascript
export default function createRequest(options){
  // 有点类似导航守卫的功能
  return new Promise((resovel)=>{
    const token = wx.getStorageSync('token')
    // needLogin 用于判断当前操作是否需要在登录状态下发送请求
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
    const baseURL = "http://localhost:3000"
    const url =`${baseURL}${options.url}`
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
```



# 4. 微信小程序配置环境变量





# 5. 查询成绩功能

### 5.1 请求成绩

> 当用户首次进来时会判断本地是否存储了之前查询过的成绩结果，如果有就读取显示，如果没有就发送请求，点击刷新按钮可以重新发送请求刷新成绩。

```javascript
// 需要在页面加载时调用该函数
onLoad(options) {
   this.getScore()
},
getScore(){
    const cache = wx.getStorageSync(this.data.type == 1 ? 'scoreCacheKey' : 'rawScoreCacheKey')
    if(cache){
        this.setData({
            scoreList:cache
        })
        return
    }
    // 没有缓存就发送请求
    this.updataScore()
},
```



> 由于成绩分为有效成绩和原始成绩，所以需要两个请求函数，根据type的不同分别存储两个成绩的数据

在微信小程序中，wx.request({})方法调用成功或者失败之后，当使用this.setData修改初始化数据data时，如果使用this.data来获取，会出现获取不到的情况，调试页面也会报undefiend，在wx.request({})方法的回调函数中，对象已经发生改变，this已经不是wx.request({})方法对象了，data属性也不存在了，从而无法实现对data数据的修改。

```javascript
updateScore(){
    const that = this
    // 通过将函数赋值给一个变量来操作两个不同的方法
    let t = null
    if(that.data.type == 1){
      t = getScoreListRequest()
    }else{
      t = getRawScoreListRequest()
    }
    t.then((res)=>{
      that.setData({
        scoreList:res.data
      })
      // 获取到数据后存放到本地
      wx.setStorageSync(that.data.type == 1 ? 'scoreCacheKey' : 'rawScoreCacheKey', res.data)
    })
}
```



### 5.2 切换成绩类型

> 通过data-type属性绑定两个成绩类型，因为微信小程序中不能直接使用函数传参，就是用data-来绑定一个属性进行传参。通过e.target.dataset可以拿到元素data-中的属性以及对应的值。

```javascript
changeScoreType(e){
    const type = e.currentTarget.dataset.type
    this.setData(
        {
           type
        }
    )
    this.getScore()
},
```



### 5.3 切换学期

> 使用小程序自带的picker标签
>
> range：某个学期下的成绩列表
>
> range-key ：学期的唯一键，可直接放学期名
>
> value：索引值，0代表有效成绩，1代表原始成绩
>
> bindchange：绑定的函数

使用e.detail.value获取picker的value属性

```javascript
// 切换学期的成绩
changeTerm(e){
    // 获取picker中选项的索引值
    const termIndex = e.detail.value
    this.setData({
        termIndex
    })
}
```

