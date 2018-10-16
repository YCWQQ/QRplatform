//-----------------------------权限管理-------------------------------

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
var dataList;
var _SessionuserName = '';
var SetMenuStorage;

// Check browser support
if (typeof(Storage) !== "undefined") {
} else {
    $('body').html("抱歉！您的浏览器不支持 Web Storage ...");
}
if(IsPC()){
    dataList = $.parseJSON(window.sessionStorage.getItem('user'));  //获取用户登录信息
    SetMenuStorage = $.parseJSON(window.sessionStorage.getItem('MenuStorage'));
    _SessionUserName = window.sessionStorage.getItem('userName');
}else{
    dataList = $.parseJSON(localStorage.getItem("user"));
    _SessionUserName = localStorage.getItem("userName");
    SetMenuStorage = $.parseJSON(localStorage.getItem("MenuStorage"));
}
if(dataList && dataList.Status == 1){
    dataList.PermitNo = _SessionUserName;
    $("#cookie").html(dataList.PermitNo)
    if(dataList.Config){
        // console.log($.parseJSON(dataList.Config))
    }
    
}else{
    alert("请登录后进行操作");
    location.href = "../login.html";
}