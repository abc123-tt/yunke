import {getCoursesListRequest} from '../../api/main'
import {
  getNowWeek
} from '../../utils/util'
// 缓存课表
const courseCacheKey = 'courses'
const courseColorCacheKey = 'courseColor'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowWeek: 1, // 当前周
    totalWeek: 20, // 周总数
    showSwitchWeek: false,
    weekDayCount:7, // 一周的总天数
    startDate:'2023/02/20', // 开始日期
    weekIndexText:['一','二','三','四','五','六','日'],
    nowMonth:1, // 当前周的月份
    coursesList:[], // 课表数据
    colorList: [
      '#e74c3c',
      '#1abc9c',
      '#3498db',
      '#f39c12',
      '#8e44ad',
      '#f368e0',
      '#badc58',
      '#22a6b3',
      '#4834d4',
      '#ffda79',
      '#227093',
      '#ffcccc',
      '#fff200',
      '#cf6a87'
    ],
    courseColor:{},
    weekCalendars:[1,2,3,4,5,6,7],
    firstEntry:true // 首次进入页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const windowWidth = wx.getSystemInfoSync().windowWidth
    this.setData({
      windowWidth
    })
    this.getWeekDate()
    this.getNowWeek()
    this.getData()
    this.getTodayDate()
    
  },

  onClose() {
    this.setData({
      showSwitchWeek: false
    })
  },
// 切换周
  switchWeek(e) {
    const model = e.currentTarget.dataset.switchmodel
    if (model == 'select') {
      this.setData({
        showSwitchWeek: true
      })
    } else if (model == 'selected') {
      const week = e.currentTarget.dataset.week
      this.setData({
        showSwitchWeek: false
      })
      this.switchWeekFn(week)
    }
    
  },
  // 切换周数的公共函数
  switchWeekFn(week){
    this.setData({
      nowWeek: week,
    })
    this.getWeekDate()
  },
// 获取当前周的日期
  getWeekDate(){
    const startDate = new Date(this.data.startDate)
    const addTime = (this.data.nowWeek - 1) * 7 * 24 * 60 * 60 * 1000
    const firstDate = startDate.getTime() + addTime 
    // month命名为nowMonth
    const {month: nowMonth} = this.getDateObj(new Date(firstDate))
    const weekCalendars = []
    for(let i = 0; i < this.data.weekDayCount;  i++){
      const date = new Date(firstDate + i * 24 * 60 * 60 * 1000)
      const {day} = this.getDateObj(date)
      weekCalendars.push(day)
    }
    this.setData({
      nowMonth,
      weekCalendars
    })
  },
  // 处理日期
  // date = new Date() 是函数 getDateObject() 的默认参数，如果没有参数传入就用当前时间
  getDateObj(date = new Date()){
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return {
      year,
      month,
      day
    }
  },
  // 这个方法的意思是根据当前时间来设置当前周数，来设置上方日期栏，否则默认第一周
  getNowWeek(){
    const nowWeek = getNowWeek(this.data.startDate,this.data.totalWeek)
    if(nowWeek > 20){
      nowWeek = 20
    }
    this.setData({
      nowWeek
    })
    // 获取到周的时候日期也要跟着变化
    this.getWeekDate()
  },

  getData(){
    const that = this
    const cache = wx.getStorageSync(courseCacheKey)
    const courseColorCache = wx.getStorageSync(courseColorCacheKey)
    if(cache){
      that.setData({
        courseList:cache,
      })
    }
    if(!courseColorCache){
      this.buildCourseColor()
    }else {
      this.setData({
        courseColor:courseColorCache
      })
    }
    this.updateFn(true)
  },
  // 更新的按钮
  updateCourseList(){
   this.updateFn()
  },
  // 更新的公共方法
  updateFn(firstEntry = false){
    const that = this
    getCoursesListRequest().then(res => {
      that.setData({
        coursesList:res.data
      })
      that.buildCourseColor()
      if(!firstEntry){
        wx.showToast({
          title: '更新成功',
          icon:'success'
        })
      }
      wx.setStorageSync(courseCacheKey, res.data)
    })
  },
  swiperSwitchWeek(e){
    if(e.detail.source == ''){
      this.setData({
        firstEntry:false
      })
      return
    }
    const index = e.detail.current
    this.switchWeekFn(index+1)
  },
  // 创建颜色公共的方法
  buildCourseColor(){
    const courseColor = {}
    let colorIndex = 0
    this.data.coursesList.map(item=>{
      if(courseColor[item.name] === undefined){
        courseColor[item.name] = this.data.colorList[colorIndex]
        colorIndex++
      }
    })
    wx.setStorageSync(courseColorCacheKey, courseColor)
    this.setData({
      courseColor
    })
  },
  // 获取今天日期
  getTodayDate(){
    const {
      month:todayMonth,
      day:todayDate
    } = this.getDateObj()
    this.setData({
      todayMonth,
      todayDate
    })
  },
// 课表详情
navCourseDetail(e){
const index = e.currentTarget.dataset.index
wx.navigateTo({
  url: `/pages/course-detail/index?info=${JSON.stringify(this.data.coursesList[index])}`,
})
}





})