$(function () {
    // 定义校验规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称应该输入1-6位之间"
            }
        }
    })


    initUserInfo();
    var layer = layui.layer
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 展示用户信息
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据(只接受click事件绑定)
    $('#btnReset').on('click', function (e) {
        // 取消浏览器的默认行为(取消表单被重置功能)
        e.preventDefault();
        // 初始化用户信息
        initUserInfo();
    })

    // 提交用户修改
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交,改为ajax提交
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                //调用父页面的函数
                //刷新父框架里的用户信息
                window.parent.getUserInfo();
            }
        })
    })
})