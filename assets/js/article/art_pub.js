$(function () {

    initCate()
    // 加载文章分类
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlStr)
                // 调用form,render()layui重渲染页面
                layui.form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()

    // 
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
        $('#coverFile').click();
    })
    $('#coverFile').on('change', function (e) {
        // console.log(e)
        // 获取用户选择的文件
        var files = e.target.files;
        if (files.length === 0) {
            return layui.layer.msg('请选择图片')
        } else {
            // 拿到用户选择的文件
            // 将文件转化为路径
            // 原生js方法,在内存中生成一个图片路径
            var newImgURL = URL.createObjectURL(files[0]);
            // 3. 重新初始化裁剪区域/渲染到裁剪区域
            $image
                .cropper('destroy') // 销毁旧的裁剪区域//这个方法需要引入cropper插件
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        }
    })

    // 定义文章的发布状态
    var art_state = ''
    $('#btnSave1').on('click', function () {
        art_state = '已发布'
    })
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 添加文章(两个按钮点击哪个都会触发)
    $('#form-add').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append('state', art_state)

        // 封面裁剪后的图片输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(...fd)
                // ajax要放在回调函数里面
                // 因为生成文件是耗时操作,异步,发送ajax的时候图片已经生成,所以必须写到回调函数中
                publisherArticle(fd)


            })

        function publisherArticle(fd) {
            $.ajax({
                type: 'POST',
                url: '/my/article/add',
                data: fd,
                // 如果想服务器提交是formData格式的数据,必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    // console.log(res)
                    if (res.status !== 0) {
                        return layui.layer.msg('发布文章失败!')
                    } else {
                        layui.layer.msg('发布文章成功!')
                        // location.href = '/article/art_list.html'
                        window.parent.document.querySelector('#a2').click()
                    }
                }
            })
        }

    })

})