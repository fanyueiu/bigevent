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
  // 设置自定义
  var form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 设置再次确认密码必须两次一致
    repwd: function (value) {
      var repassword = $(".reg-box [name=password]").val();
      if (repassword !== value) {
        return "您输入的两次密码不一致";
      }
    },
  });
  // 注册提交
  $("#register").on("submit", function (e) {
    e.preventDefault();
    var data = {
      username: $(".reg-box [name=username]").val(),
      password: $(".reg-box [name=password]").val(),
    };
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功，请登陆");
      // 模拟人的点击行为
      $(".gologin").click();
    });
  });
  // 监听登录表单提交事件
  $("#form_login").on("submit", function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/api/login",
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("登录成功");
        // 将登录成功得到的token字符串，存到本地存储
        localStorage.setItem("token", res.token);
        // 跳转到后台主页
        location.href = "/index.html";
      },
    });
  });
});
