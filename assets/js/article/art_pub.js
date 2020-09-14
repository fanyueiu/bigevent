$(function () {
  var layer = layui.layer;
  var form = layui.form;
  // 定义加载文章分类的方法
  initCate();
  // 初始化富文本编辑器
  initEditor();
  function initCate() {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败");
        }
        // 调用模板引擎
        var str = template("tpl-cate", res);
        // console.log(str);
        $("[name=cate_id]").html(str);
        // 一定要调用
        form.render();
      },
    });
  }
  //   图片裁剪
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);
  //   上传
  $("#btnChoses").on("click", function () {
    $("#coverFile").click();
  });
  //   监听cover的change事件
  $("#coverFile").on("change", function (e) {
    var files = e.target.files;
    if (files.length === 0) {
      return;
    }
    // 根据文件，创建对应的URL地址
    var newImgURL = URL.createObjectURL(files[0]);
    // 为裁剪区域重新设置图片
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //   发布和存为草稿
  var art_state = "已发布";

  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    // 创建formData对象
    var fd = new FormData($(this)[0]);
    fd.append("state", art_state);
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append("cover_img", blob);
        // 6.发起ajax请求
        publish(fd);
      });
  });
  //   定义发布文章的方法
  function publish(fd) {
    $.ajax({
      type: "POST",
      url: "/my/article/add",
      data: fd,
      //   fd配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败");
        }
        layer.msg("发表文章成功");
        location.href = "/article/art_list.html";
      },
    });
  }
});
