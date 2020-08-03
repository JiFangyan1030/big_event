$(function () {

    // 初始化富文本编辑器
    initEditor()

    // 获取裁剪区域的DOM元素
    var $image = $('#image');
    // 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 创建裁剪区域
    $image.cropper(options)

    // 根据ID获取文章信息
    // console.log(location)
    // console.log(location.search.split("=")[1])
    var Id = location.search.split("=")[1]
    $.ajax({
        // method: 'get',
        url: '/my/article/' + Id,
        success: function (res) {
            // console.log(res)
            // 5.根据文章信息渲染页面;
            // 5.1 文章标题
            // 5.2 文章分类
            // 5.3 文章内容
            // 5.4 文章封面
            // 5.5 Id

            // 5.5 Id
            $('[name=Id]').val(res.data.Id);
            // 5.1 文章标题
            $('[name=title]').val(res.data.title);
            // 5.4 文章封面
            $('#image').attr('src', baseURL + res.data.cover_img);
            // 5.3 文章内容
            setTimeout(function () {
                tinyMCE.activeEditor.setContent(res.data.content)
            }, 1000)
            // 5.2 文章分类
            initCate(res.data.cate_id)
        }
    })
    // 加载文章分类
    function initCate(cate_id) {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类失败')
                }
                // layui.layer.msg('获取文章分类成功')
                // 调用模板引擎渲染下拉菜单
                res.cate_id = cate_id;
                console.log(res.cate_id)
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('[name="cate_id"]').html(htmlStr)
                // 调用form,render()layui重渲染页面
                layui.form.render()
            }
        })
    }

    // 定义文章的发布状态
    var art_state = ''
    $('#btnSave1').on('click', function () {
        art_state = '已发布'
    })
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 添加文章(两个按钮点击哪个都会触发)
    $('#form-edit').on('submit', function (e) {
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
                // console.log(...fd)
                // ajax要放在回调函数里面
                // 因为生成文件是耗时操作,异步,发送ajax的时候图片已经生成,所以必须写到回调函数中
                editArticle(fd)


            })

        function editArticle(fd) {
            $.ajax({
                type: 'POST',
                url: '/my/article/edit',
                data: fd,
                // 如果想服务器提交是formData格式的数据,必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    // console.log(res)
                    if (res.status !== 0) {
                        return layui.layer.msg('修改文章失败!')
                    } else {
                        layui.layer.msg('修改文章成功!')
                        // location.href = '/article/art_list.html'
                        window.parent.document.querySelector('#a2').click()
                    }
                }
            })
        }

    })

})