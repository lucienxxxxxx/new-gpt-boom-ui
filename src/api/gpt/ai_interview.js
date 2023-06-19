import request from '@/utils/request'

// iat
export function iat(file) {
    return request({
        url: '/baidu/iat',
        method: 'post',
        data: file
    })
}

// did
export function genDidClip(text) {
    return request({
        url: '/did/genDidClip/?text=' + text,
        method: 'get',
        timeout: 100000
    })
}

// did
export function genDidTalk(text) {
    return request({
        url: '/did/genDidTalk/?text=' + text,
        method: 'get',
        timeout: 100000
    })
}

// did
export function getGptResp(input, context, gptcontext) {
    return request({
        url: '/gpt/getGptResp?input=' + input + '&context=' + context + '&gptcontext=' + gptcontext,
        method: 'get',
    })
}