// 注意:每次调用$.get()或者$.post()或者$.ajax() 会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
  // 在发起ajax之前，统一进行拼接
  options.url = "http://ajax.frontend.itheima.net" + options.url;
  // 统一为有权限的接口，设置请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  // 全局统一挂 回调函数
  options.complete = function (res) {
    // 不论成功还是失败,最终都会调用complete函数
    //   console.log(res);
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败!"
    ) {
      // 强制清空token
      localStor age.removeItem("token");
      // 强制回到登陆页面
      location.href = "/login.html";
    }
  };
});
