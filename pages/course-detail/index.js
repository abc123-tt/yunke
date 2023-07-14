const app = getApp()
// import {
//   getNowWeek
// } from '../../utils/util'
Page({
  data: {
    infoRef:[
      {
        key:'rawWeeks',
        title:'周数'
      },
      {
        key:'rawSection',
        title:'节数'
      },
      {
        key:'address',
        title:'地址'
      },
      {
        key:'teacher',
        title:'老师'
      },
      {
        key:'credit',
        title:'学分'
      },
      {
        key:'category',
        title:'类型'
      },
      {
        key:'method',
        title:'考查'
      }
    ]
  },
  onLoad(options) {
    let info = options.info || ''
    if(info == ''){
      wx.showToast({
        title: '页面不存在',
        icon:'none'
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta:1,
        })
      },1500)
      return 
    }
    info = JSON.parse(info)
    info.rawSection = '周' + info.rawSection
    this.setData({
      info
    })
  },


})