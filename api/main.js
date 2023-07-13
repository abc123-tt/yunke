import createRequest from '../utils/request'

export function loginRequest(data){
  return createRequest({
    url: '/login',
    method: 'POST',
    data,
    // 无需在登录状态下发送请求
    needLogin: false,
  })
}
export function getScoreListRequest(data){
  return createRequest({
    url: '/scores',
    data,
  })
}
export function getRawScoreListRequest(data){
  return createRequest({
    url: '/raw-scores',
    data,
  })
}
export function getCoursesListRequest(data){
  return createRequest({
    url: '/courses',
    data,
  })
}