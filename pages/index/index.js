const app = getApp()
import {
  getNowWeek
} from '../../utils/util'
Page({
  data: {
    navList: [{
        title: '查课表',
        icon: '/assets/imgs/course.png',
        path: '/pages/course/index'
      },
      {
        title: '查成绩',
        icon: '/assets/imgs/score.png',
        path: '/pages/score/index'
      },
      {
        title: '查考勤',
        icon: '/assets/imgs/attendance.png',
        path: '/pages/attendance/index'
      },
      {
        title: '校历',
        icon: '/assets/imgs/calendar.png',
        path: '/pages/calendar/index'
      },
    ],
    startDate: '2023/02/20', // 开学日期
    totalWeek: 20,
    todayCourseList: []
  },
  onLoad() {
    this.getTodayCourseList()
  },

  nav(e) {
    const index = e.currentTarget.dataset.index
    const path = this.data.navList[index].path
    wx.navigateTo({
      url: path,
      // 跳转失败
      fail() {
        // 如果是tabbar页面就执行以下
        wx.switchTab({
          url: path,
        })
      }
    })
  },
  getTodayCourseList(){
    const todayWeek = new Date().getDay() // 获取今天是周几，0-6,0表示周日
    // const todayWeek = 2
    const nowWeek = getNowWeek(this.data.startDate,this.data.totalWeek)
    // const nowWeek = 16
    this.setData({
      todayWeek,
      nowWeek,
    })
    const courseList = wx.getStorageSync('courses')
    if(!courseList) return
    const todayCourseList = courseList.filter(item=>{
      item.rawSection = item.rawSection.slice(2,5)
      return item.week == todayWeek && item.weeks.indexOf(nowWeek) > -1
    })
    this.setData({
      todayCourseList
    })
    todayCourseList.sort((a,b)=>{
      return a.section - b.section
    })
  }
})