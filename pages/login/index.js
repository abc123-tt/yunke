// pages/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        stuId: '', // 学号
        password: '', // 密码
        accountStatus: true, // 是否记住账号，默认选中
    },

    /**
     * 生命周期函数--监听页面加载
     */
    // 初始化账号密码
    initAccount() {
        const accountCache = wx.getStorageSync('account')
        if (accountCache) {
            this.setData({
                ...accountCache
            })
        }
        
    },
    //  登录
    login() {
        const that = this
        const postData = {
            stuId: that.data.stuId,
            password: that.data.password
        }
        wx.showLoading({
            title:"登录中"
        })
        // 发送请求
        wx.request({
            url: 'http://localhost:3000/login',
            data: postData,
            method: 'POST',
            success(res) {
                wx.hideLoading()
                if (res.data.code == -1) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none"
                    })
                    return
                }
                wx.setStorageSync('token', res.data.data.cookie) // 等同于async/await
                // 登录成功后将用户保存到本地，由于此时的this指向是request这个对象，所以需要修改this的指向
                if (that.data.accountStatus) {
                    wx.setStorageSync('account', postData)
                }else{
                    wx.removeStorageSync('account')
                }
                wx.showToast({
                    title: '登录成功',
                    icon:"none"
                })
                // 成功后跳转
                setTimeout(()=>{
                    wx.navigateTo({
                      url: '/pages/index/index',
                    })
                },1500)
            }
        })

    },
    switchStatus() {
        this.setData({
            accountStatus: !this.data.accountStatus
        })
    },
    onLoad(options) {
        this.initAccount()
    },

})