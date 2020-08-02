$(function () {
    // 定义layui表单验证规则
    var form = layui.form;
    // 利用 form 对象,创建规则
    form.verify({
        // 自定义pwd的校验规则
        pwd: [/^\S{6,12}$/, "密码为6-12位,不能包含空格哦"],
        // 校验新旧密码校验
        samepwd: function (value) {
            // console.log($('[name=oldPwd]').val())
            // console.log(value)
            if ($('[name=oldPwd]').val() === value) {
                return '新密码不能与原密码相同!'
            }
        },
        // 校验两次密码是否一致
        repwd: function (value) {
            if ($('[name=newPwd]').val() !== value) {
                return '两次密码不一致!'
            }
        }
    })

    // 发起请求,修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.massage)
                } else {
                    layui.layer.msg('恭喜您,更新密码成功')
                    $('.layui-form')[0].reset()
                }
            }
        })
    })

})