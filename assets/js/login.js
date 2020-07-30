$(function () {
    // 点击"去注册"的链接
    $('#link_reg').on('click', function () {
        // console.log(123)
        $('.login-box').hide();
        $('.reg-box').show()
    })
    // 点击"去登录"的链接
    $('#link_login').on('click', function () {
        // console.log(456)
        $('.login-box').show();
        $('.reg-box').hide()
    })
    // 定义layui表单验证规则
    var form = layui.form;
    // 利用 form 对象,创建规则
    form.verify({
        // 自定义pwd的校验规则
        pwd: [/^\S{6,12}$/, "密码为6-12位,不能包含空格"],
        // 校验两次密码是否一致
        repwd: function (value) {
            if ($('#reg-pwd').val() !== value) {
                return '两次密码不一致'
            }
        }
    })
    // 监听注册表单的提交事件
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // ajax发送异步提交
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                // 注册校验失败
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                $('#link_login').click();
                // 清空表单
                $('#form_reg')[0].reset();
            }
        })
    })
    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // ajax发送异步提交
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 注册校验失败
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功');
                //将登录成功得到的token字符串保存到localstorage中
                localStorage.setItem('token', res.token);
                // 跳转到后台首页
                location.href = '/index.html'

            }
        })
    })
})