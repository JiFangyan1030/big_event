// 设置路径(测试/生产)
var baseURL = 'http://ajax.frontend.itheima.net'
// 拦截/过滤每一次的ajax请求.配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    // console.log(options)
    // console.log(options.url)
    // 在发起整整的Ajax请求之前同意拼接请求的路径
    options.url = baseURL + options.url
    // 统一为有权限的接口,设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }

    // 全局统一挂载complete回调函数
    // complete函数就是无论成功或是是否都会调用这个函数

    options.complete = function (res) {
        // console.log(res)
        // console.log(res.responseJSON.status)
        // console.log(res.responseJSON.message)
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 强制清空token
            localStorage.removeItem('token');
            // 强制跳转到登录页面
            location.href = '/login.html';
        }
    }

})