//-----------------------------配置文件-------------------------------
var myDate = new Date();
var fYear = myDate.getFullYear();//获取当前年
var _path = 'http://172.26.153.57:9091/mms/',
    _copy = '广西田园物流管理系统 © 2009-'+fYear,
    _title = '广西田园物流管理系统';
    var _LoginName='广西田园物流管理系统';

$(function(){
	if($('title').html()==''){
		$('title').html(_title);//设置页面title
	}
    
    $('#copy').html(_copy);//设置底部版权信息
})

var Daynumber=1;    //图形界面时间差距最少查多少天
var Vuenumber=20;   //图形界面数据最多展示多少数量