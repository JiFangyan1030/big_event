$(function () {
    // 1.1获取裁剪区域的DOM元素
    var $image = $('#image');
    // 1.2配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2.修改上传图片
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })
    $('#file').on('change', function (e) {
        // console.log(e)
        // 获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layui.layer.msg('请选择图片')
        } else {
            // 拿到用户选择的文件
            var file = e.target.files[0];
            // 将文件转化为路径
            // 原生js方法,在内存中生成一个图片路径
            var imgURL = URL.createObjectURL(file);
            // 3. 重新初始化裁剪区域/渲染到裁剪区域
            $image
                .cropper('destroy') // 销毁旧的裁剪区域//这个方法需要引入cropper插件
                .attr('src', imgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        }
    })

    // 3.为确定按钮绑定点击事件,实现图片上传
    $('#btnUpload').on('click', function () {
        // console.log(123)
        // 获取base64的裁剪获取
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res)
                // 返回校验
                if (res.status !== 0) {
                    return layui.layer.msg('res.message')
                }
                layui.layer.msg('头像上传成功')
                // 刷新父框架中的个人资料信息
                window.parent.getUserInfo();
            }
        })
    })
})