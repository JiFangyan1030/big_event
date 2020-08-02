$(function () {
    // 获取用户信息
    getUserInfo();

    var layer = layui.layer;
    // 点击实现退出功能
    $('#btnLogout').on('click', function () {
        // layui的弹出提示框
        layer.confirm('是否确认退出', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 先关闭提示框
            console.log(111);
            layer.close(index);
            // 然后删除本地的token
            localStorage.removeItem('token');
            location.href = '/login.html'

        });
    })
})

// 必须是全局的,后面user_info.js要用
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        //jQuery中的ajax headers专门用于设置请求头信息的原生js中是Request Headers
        // headers属性区分大小写
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        // 在baseAPI中统一使用complete函数,complete函数无论执行成功或者失败都会执行
        success: function (res) {
            // token可能24小时就失效;所以需要重新登录
            // console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用renderAvatar渲染用户头像
            // console.log(res)
            renderAvatar(res.data)
        }
        // complete: function (res) {
        //     console.log(res)
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
        //         // 强制清空token
        //         localStorage.removeItem('token');
        //         // 强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }

    })
}
// 用户渲染函数
function renderAvatar(user) {
    // 1.渲染用户名
    var uname = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + uname)
    // console.log(uname[0])
    // 渲染用户头像
    // 判断,用户头像信息.有就渲染图片.没有就渲染文字
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        $('.text-avatar').show().html(uname[0].toUpperCase());
    }

}