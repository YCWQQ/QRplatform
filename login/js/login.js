
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
$(function(){
    window.sessionStorage.removeItem('user');
    $("#Login").click(function () {
       if($("#userName").val()&&$("#userPwd").val()){
        window.sessionStorage.setItem('classVue',$("#classVue option:selected").val());
        var userName = $("#userName").val();
        var userPwd = $("#userPwd").val();
        var UserUrl = _path+"login/";
        $.ajax({
            dataType: "json",
            url: UserUrl,
            type: "GET",
            data: {
                name: userName,
                key: userPwd
            },
            success: function (result) {
                if (result) {
                    if(IsPC()){//判断是否是手机端浏览器
                        window.sessionStorage.setItem('user',JSON.stringify(result));
                        window.sessionStorage.setItem('userName',userName);
                    }{
                        localStorage.setItem('user',JSON.stringify(result));
                        localStorage.setItem('userName',userName);
                    }
                    if (result.Status == 1) {
                        GetMenu(result.Key);
                        location.href = "index.html";
                    } else if (result.Status == 0) {

                        g_alert('error','用户名或密码错误！');
                    }
                } else {
                    var msg = result != null && result.msg != null ? result.msg : "";
                     g_alert('error','输入的信息有误，请重新输入!');
                }
            },
            error: function (ex) {
               g_alert('error','用户名或密码错误！');
            }
        });
        return false;
    }
    });
});