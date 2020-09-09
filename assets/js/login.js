$(function () {
  // 点击去注册账号的链接
  $(".reg").on("click", function () {
    $(".reg-box").show();
    $(".login-box").hide();
  });
  //   点击去登陆的链接
  $(".gologin").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });
});
