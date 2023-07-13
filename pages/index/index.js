const app = getApp()
// import {
//   getNowWeek
// } from '../../utils/util'
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
      fail() {
        wx.switchTab({
          url: path,
        })
      }
    })
  },


})