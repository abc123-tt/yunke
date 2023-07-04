import {getScoreListRequest,getRawScoreListRequest} from '../../api/main'
// 两个成绩设置两个缓存
const scoreCacheKey = "scores"
const rawScoreCacheKey = "rawScore"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:1, // 1为有效成绩，其他为原始成绩
    scoreList:[], // 成绩列表
    termIndex:0, // 当前学期索引
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getScore()
  },
  // 获取成绩列表
  getScore(){
    const cache = wx.getStorageSync(this.data.type == 1 ? 'scoreCacheKey' : 'rawScoreCacheKey')
    if(cache){
      this.setData({
        scoreList:cache
      })
      return
    }
    this.updataScore()
  },
  updataScore(){
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
      wx.setStorageSync(that.data.type == 1 ? 'scoreCacheKey' : 'rawScoreCacheKey', res.data)
    })
  },
  // 切换成绩类型
  changeScoreType(e){
    const type = e.currentTarget.dataset.type
    this.setData(
      {
        type
      }
    )
    this.getScore()
  },
  // 切换学期的成绩
  changeTerm(e){
    // 获取picker中选项的索引值
    const termIndex = e.detail.value
    this.setData({
      termIndex
    })
  }
})