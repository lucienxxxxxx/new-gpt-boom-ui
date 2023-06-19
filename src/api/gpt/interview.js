import request from '@/utils/request'

// 查询interview列表
export function listInterview(query) {
  return request({
    url: '/gpt/interview/list',
    method: 'get',
    params: query
  })
}

// 查询interview详细
export function getInterview(id) {
  return request({
    url: '/gpt/interview/' + id,
    method: 'get'
  })
}

// 新增interview
export function addInterview(data) {
  return request({
    url: '/gpt/interview',
    method: 'post',
    data: data
  })
}

// 修改interview
export function updateInterview(data) {
  return request({
    url: '/gpt/interview',
    method: 'put',
    data: data
  })
}

// 删除interview
export function delInterview(id) {
  return request({
    url: '/gpt/interview/' + id,
    method: 'delete'
  })
}
