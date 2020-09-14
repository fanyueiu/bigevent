$(function () {
  var layer = layui.layer;
  var form = layui.form;
  // 获取文章分类列表
  initArtcate();
  function initArtcate() {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        // console.log(res);
        // 模板引擎
        var str = template("tpl-table", res);
        $("tbody").html(str);
      },
    });
  }
  //   为添加类别按钮绑定点击事件
  var index = null;
  var indexEdit = null;
  $("#btnAddCate").on("click", function () {
    index = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });
  //   通过代理得形式 为表单绑定submit事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    // console.log("ok");
    $.ajax({
      type: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增分类失败");
        }
        initArtcate();
        layer.msg("新增分类成功");
        // 根据索引关闭弹框
        layer.close(index);
      },
    });
  });
  // 编辑
  $("tbody").on("click", ".btn-edit", function () {
    // console.log("ok");
    // 弹出一个修改信息的层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    var id = $(this).attr("data-id");
    // 发起请求
    $.ajax({
      type: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        // console.log(res);
        form.val("form-edit", res.data);
      },
    });
  });
  // 通过代理绑定submit
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新分类数据失败");
        }
        layer.msg("更新分类数据成功");
        initArtcate();
        // 根据索引关闭弹框
        layer.close(indexEdit);
      },
    });
  });
  // 删除
  $("tbody").on("click", ".btn-del", function () {
    // console.log("ok");
    var id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        type: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除分类失败");
          }
          layer.msg("删除分类成功");
          layer.close(index);
          initArtcate();
        },
      });
    });
  });
});
