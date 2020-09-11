$(function () {
  // 获取用户信息
  getUserInfo();
  //   点击按钮实现退出功能
  $("#btnLogout").on("click", function () {
    layer.confirm("确定退出登录?", { icon: 3, title: "提示" }, function (
      index
    ) {
      // 清空本地存储中的token
      localStorage.removeItem("token");
      // 重新跳转到登录页面
      location.href = "/login.html";
      layer.close(index);
    });
  });
});
// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // 在baseApi中
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      //   渲染用户的头像
      renderImg(res.data);
    },
    // 失败
    // error:function(res){

    // }

  });
}
// 渲染用户头像
function renderImg(user) {
  var name = user.nickname || user.username;
  $("#welcome").html("欢迎 &nbsp;&nbsp;" + name);
  //   按需渲染用户的头像
  if (user.user_pic != null) {
    //   渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-img").hide();
  } else {
    // 渲染文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-img").html(first).show();
  }
}
