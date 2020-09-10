// 注意:每次调用$.get()或者$.post()或者$.ajax() 会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
  // 在发起ajax之前，统一进行拼接
  options.url = "http://ajax.frontend.itheima.net" + options.url;
});
