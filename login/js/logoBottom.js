var Name="华美龙溯源演示系统";
$(function(){

    var NV = {};  
    var UA = navigator.userAgent.toLowerCase();  
    try  
    {  
        NV.name=!-[1,]?'ie':  
        (UA.indexOf("firefox")>0)?'firefox':  
        (UA.indexOf("chrome")>0)?'chrome':  
        window.opera?'opera':  
        window.openDatabase?'safari':  
        'unkonw';  
    }catch(e){};  
    try  
    {  
        NV.version=(NV.name=='ie')?UA.match(/msie ([\d.]+)/)[1]:  
        (NV.name=='firefox')?UA.match(/firefox\/([\d.]+)/)[1]:  
        (NV.name=='chrome')?UA.match(/chrome\/([\d.]+)/)[1]:  
        (NV.name=='opera')?UA.match(/opera.([\d.]+)/)[1]:  
        (NV.name=='safari')?UA.match(/version\/([\d.]+)/)[1]:  
        '0';  
    }catch(e){};
    // console.log(NV.name);
    // console.log(parseInt(NV.version));
    if(NV.name != 'chrome' && NV.name != 'firefox'){
      // console.log(NV.name);
      g_alert('error','请使用谷歌、QQ、火狐任意一款浏览器浏览本网页，下载按钮在本页面下方<br/>'+
        ' <a target="_blank"href="https://www.mozilla.org/zh-CN/firefox/new/" title="点击下载火狐浏览器"><img class="vfix" src="login/img/vfix.png"></a> '+
        ' <a target="_blank" href="http://browser.qq.com" title="点击下载QQ浏览器"><img class="vqq" src="login/img/vQQ.png"></a>'+
        ' <a target="_blank" href="http://www.google.cn/chrome/browser/desktop/" title="点击下载谷歌浏览器"><img class="vchrom" src="login/img/vChrom.png"></a>'+
        '<div><a target="_blank" href="../QQVersion.jpg">如果QQ浏览器不能正常访问请点击此处！</a></div>');
    }else if(parseInt(NV.version)<53){
      g_alert('error','请使用谷歌、QQ、火狐任意一款浏览器浏览本网页，下载按钮在本页面下方<br/>'+
        ' <a target="_blank"href="https://www.mozilla.org/zh-CN/firefox/new/" title="点击下载火狐浏览器"><img class="vfix" src="login/img/vfix.png"></a> '+
        ' <a target="_blank" href="http://browser.qq.com" title="点击下载QQ浏览器"><img class="vqq" src="login/img/vQQ.png"></a>'+
        ' <a target="_blank" href="http://www.google.cn/chrome/browser/desktop/" title="点击下载谷歌浏览器"><img class="vchrom" src="login/img/vChrom.png"></a> '+
        '<div><a target="_blank" href="../QQVersion.jpg">如果QQ浏览器不能正常访问请点击此处！</a></div>');
    }

    // console.log(HTMLElement);
    
    $("h1").empty().append(_LoginName);
    $("title").empty().append(_title);

    var selectList = [
      {"name":"Smart Default","value":"smart-style-0"},
      {"name":"Dark Elagance","value":"smart-style-1"},
      {"name":"Ultra Light","value":"smart-style-2"},
      {"name":"Google Skin","value":"smart-style-3"},
      {"name":"PixelSmash","value":"smart-style-4"},
      {"name":"Glass","value":"smart-style-5"},
      {"name":"MaterialDesign","value":"smart-style-6"},
      {"name":"ng-style","value":"ng"},
    ],
    selectDom = '';

    selectList.forEach(function(val, index, array) {
      selectDom += '<option value='+ val.value +'>'+ val.name +'</option>'
    });
    $("#classVue").html(selectDom);
    $("#classVue").change(function(){
        var vue = $(this).val();
        switch(vue){
           case "smart-style-0": window.sessionStorage.setItem("selected",vue);  location.href="login.html"; break;
           case "ng":  window.sessionStorage.setItem("selected",vue); location.href="login.html"; break;
           case "smart-style-1": window.sessionStorage.setItem("selected",vue); location.href="login3.html"; break;
           case "smart-style-2": window.sessionStorage.setItem("selected",vue);  location.href="login2.html"; break;
           case "smart-style-3": window.sessionStorage.setItem("selected",vue);  location.href="login4.html"; break;
           case "smart-style-4": window.sessionStorage.setItem("selected",vue);  location.href="login6.html"; break;
           case "smart-style-5": window.sessionStorage.setItem("selected",vue);  location.href="login1.html"; break;
           case "smart-style-6": window.sessionStorage.setItem("selected",vue);  location.href="login5.html"; break;
        }
    });

    if(window.sessionStorage.getItem("selected")){
       $("#classVue").find("option[value='"+window.sessionStorage.getItem("selected")+"']").attr("selected",true);
    }

    
    

    $(document).keyup(function(event){
      if(event.keyCode ==13){
        $("#Login").trigger("click");
      }
    });
});

function g_alert(type,cont){
  //html  
  $('body').append('<div id="TCK_div"></div>')
  var html = '<div id="g_all"></div><div id="g_box" style="z-index:1; position:fixed"><div id="g_title">提示 <span id="colse" style="margin-left:80%;cursor: pointer;">X</span></div><div id="g_cont"><img style="display:block;float:left;" width="100px" height="100px"><span id="g_msg">'+cont+'</span></div><div id="g_buttom"><div id="g_button"><a class="butt" id="ok">确定</a></div></div></div>';
  $('#TCK_div').empty().append(html);
  //css
  var css = "<style id='g_css'>#g_title{height:60px; background:#fff;border-radius:5px 5px 0 0; border-bottom:1px solid #eef0f1;line-height:60px;padding-left:25px; font-size:18px; font-weight:700; color:#535e66}";
  css += "#g_cont{height:120px; background:#fff;padding-top:15px; text-align:center;}";
  css += "#g_all{width:100%; height:100%; z-index:1; position:fixed;filter:Alpha(opacity=50); background:#666666;top:0;left:0;opacity: 0.6}";
  css += "#g_msg{color: #151515;font-size:14px;margin-left: 5px;}";
  css += "#g_msg>img{width:50px;margin-left:5px;margin-right:5px}";
  css += "#g_buttom{height:60px; border-top:1px solid #eef0f1; border-radius:0px 0px 5px 5px; background:#fff; line-height:60px;}";
  css += "#g_button{width:200px; height:100%; margin-right:10px; float:right;}";
  css += ".butt{display:block; margin-top:12px;cursor:pointer; float:left;width:95px;height:35px;line-height:35px;text-align:center;color:#FFFFFF;border-radius:5px;}"
  css += "#ok{background:#0095d9; color:#FFFFFF; float:right;}";
  css += "#false{background:#546a79; color:#FFFFFF; float:left;}";
  css += "#g_box{width:440px;}</style>";  
  $('head').append(css);

  if(type == 'error'){
    $('#g_cont>img').attr('src','login/img/fail.png');
    $('#false').hide();
  }

  //点击OK
  $('#ok,#colse').click(function(){
    $('#g_all').remove();
    $('#g_box').remove();
    $('#g_css').remove();
    return true;
  });

  //居中
  var _widht = document.documentElement.clientWidth; //屏幕宽
  var _height = document.documentElement.clientHeight; //屏幕高

  var boxWidth = $("#g_box").width();
  var boxHeight = $("#g_box").height();

  $("#g_box").css({ top: (_height - boxHeight) / 4 + "px", left: (_widht - boxWidth) / 2 + "px" });
}