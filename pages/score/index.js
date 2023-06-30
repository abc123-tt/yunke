import {getScoreListRequest,getRawScoreListRequest} from '../../api/main'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1, // 1为有效成绩，其他为原始成绩
    scoreList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getScore()
  },
  getScore(){
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
    })
  }
})