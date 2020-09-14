$(function () {
  var form = layui.form;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称名称必须在1-6位之间";
      }
    },
  });
  //   初始化用户的基本信息
  function initUser() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败!");
        }
        // console.log(res);
        // 调用form.val()快速为表单赋值
        form.val("formUser", res.data);
      },
    });
  }
  initUser();
  //   实现重置
  $("#btnReset").on("click", function (e) {
    //   阻止默认重置
    e.preventDefault();
    initUser();
  });
  //   监听表单的提交
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新用户信息失败");
        }
        layer.msg("更新用户信息成功");
        // console.log(res);
        // 调用父页面中的方法,重新渲染用户的头像和用户的信息
        // 通过iframe调用
        window.parent.getUserInfo();
      },
    });
  });
});
