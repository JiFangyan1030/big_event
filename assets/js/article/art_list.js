$(function () {
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var p = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    }


    initTable()
    // 获取文章列表的方法
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败')
                }
                // 模板引擎渲染页面
                var htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)
                renderPage(res.total)
            }

        })
    }
    // 优化时间格式
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initCase()
    // 初始化文章分类
    function initCase() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为删选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中的值
        var cate_id = $('[name="cate_id"]').val()
        var state = $('[name="state"]').val()
        // 为查询参数对象q中对应的属性赋值
        console.log(cate_id)
        p.cate_id = cate_id
        p.state = state
        // 根据最新的筛选条件重新渲染表格数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: p.pagesize, // 每页显示几条数据
            curr: p.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候触发jump函数
            // 触发jump回调函数有两种
            // 1.点击页码值的时候会触发jump回调函数
            // 2.只要调用了laypage.render()方法就会触发jump回调2
            jump: function (obj, frist) {
                // 可以通过frist的值来判断是通过哪种方式触发的jump回调
                // 如果jump的值是true就证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(frist)
                // console.log(obj.curr)
                // 把最新的条目数,赋值到p查询参数对象的pagesize属性中
                p.pagesize = obj.limit
                // 把最新的页码值赋值给P查询页码的参数对象中
                p.pagenum = obj.curr
                if (!frist) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式,为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 获取本页面删除按钮的个数
        var length = $('.btn-delete').length;
        // console.log(length)
        // 提示用户是否要删除
        layui.layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 发起请求获取对应分类的数据
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除分类失败')
                    }
                    layui.layer.msg('删除分类成功')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    if (length == 1) {
                        p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
                    }
                    // 与上面if语句等价
                    // $('.btn-delete').length===1 && p.pagenum >1&&p.pagenum --
                    initTable()

                }
            })
            layui.layer.close(index)
        });

    })


})