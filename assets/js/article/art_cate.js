$(function () {
    // 1.获取文章分类列表
    initArtCateList();

    //2. 添加类别增加点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            // layer提供了5种层类型。可传入的值有：
            // 0（信息框，默认）
            // 1（页面层）
            // 2（iframe层）
            // 3（加载层）
            // 4（tips层)
            type: 1,
            // 设置弹出层的宽高,数组,前面宽后面高
            // 在默认状态下，layer是宽高都自适应的
            area: [
                '500px',
                '250px'
            ],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    })

    var indexAdd = null;
    // 文章分类添加
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('添加文章分类失败')
                } else {
                    initArtCateList()
                    layui.layer.msg('恭喜您,添加文章分类成功')
                    layui.layer.close(indexAdd)
                }
            }
        })
    })

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                // 模板引擎渲染(传递对象,使用属性)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 修改文章分类
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // console.log(123)
        indexEdit = layer.open({
            type: 1,
            area: [
                '500px',
                '250px'
            ],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res.data)
                layui.form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式,为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改分类失败')
                }
                layui.layer.msg('修改分类成功')
                layui.layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    // 通过代理的形式,为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layui.layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 发起请求获取对应分类的数据
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除分类失败')
                    }
                    layui.layer.msg('删除分类成功')
                    layui.layer.close(index)
                    initArtCateList();
                }
            })
        });

    })
})