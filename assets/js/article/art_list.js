$(function () {
  var form = layui.form;
  var laypage = layui.laypage;
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    // 年月日
    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());
    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };
  //   定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }
  // 定义一个查询的参数对象，将来请求的数据
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //页码值
    pagesize: 2, //	每页显示多少条数据
    cate_id: "", //文章分类的 Id
    state: "", //文章的发布状态
  };
  initTable();
  initCate();
  //   获取文章数据的方法
  function initTable() {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败");
        }
        // 使用模板引擎渲染页面的数据
        // console.log(res);
        var str = template("tpl-table", res);
        $("tbody").html(str);
        // 调用渲染分页的方法
        renderPage(res.total);
      },
    });
  }
  //   初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败");
        }
        // 调用模板引擎渲染分类的可选项
        var str = template("tpl-cate", res);
        // console.log(str);
        $("[name=cate_id]").html(str);
        // 通知layui，重新渲染表单区域的UI结构
        form.render();
      },
    });
  }
  //   为表单绑定submit事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  //   定义渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    // 调用laypage.render() 方法来渲染分页
    laypage.render({
      elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示多条数据
      curr: q.pagenum, //设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      //   分页发生切换的时候，触发---点击页面页码值或者只要调用laypage.render方法就会触发
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        q.pagenum = obj.curr;
        // 把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
        q.pagesize = obj.limit;
        // 根据最新的获取对应的数据列表
        // initTable();直接掉会发生死循环
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 删除
  $("tbody").on("click", ".btn-del", function () {
    // 获取删除按钮的个数
    var length = $(".btn-del").length;
    var id = $(this).attr("data-id");
    // console.log("ok");
    layer.confirm("确认删除？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        type: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章失败");
          }
          layer.msg("删除文章成功");
          // 当数据删除完成后，需要判断当前这一页，是否还有剩余的数据，如果没有剩余的数据了，则让页面值-1之后，再重新调用initTable方法
          if (length === 1) {
            //等于1 表示删除完毕之后，页面上没有数据了
            // 页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });
});
