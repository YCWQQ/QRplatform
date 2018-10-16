// 首页JS文件
$(function(){
	$('#content').height('auto');
	pageSetUp();
	var myDate = new Date();//获取当前年
    var fYear = myDate.getFullYear();
    var fMonth = p(myDate.getMonth()+1);//获取当前月
    var fDate = p(myDate.getDate());//获取当前日
    var dataVar = 1;//时间变量  当前时间
    var sYear = myDate.getFullYear();
    var sMonth = p(myDate.getMonth()+1);//获取当前月
    var sDate = p(myDate.getDate());//获取当前日
    sMonth = p(parseInt(sMonth-dataVar));
    if(sMonth==0){
        sYear=parseInt(sYear-1);
        sMonth=12;
    }           
	var FinshTime = fYear+'-'+fMonth+"-"+fDate;
    sDate = getDaysInOneMonth(sYear,sMonth,sDate);
	var StartTime = sYear+'-'+sMonth+"-"+sDate;
	$('#outFinshTime,#inFinshTime,#VFinshTime').val(FinshTime);
	$('#outStartTime,#inStartTime,#VStartTime').val(StartTime);
    iTime('#inStartTime,#inFinshTime,#outStartTime,#outFinshTime,#VStartTime,#VFinshTime');
    // outchart();
    // inchart();
    product();
    // scene();
    // V();
})
var colorNum=function(datalist){  //对比返回数据的长度，给出相同数组长度的颜色,最多显示12种
    var op= ["#4A7B50","#314dad","#9c4343","#26cf90","#4b234e","#e47d15","#F7464A","#46BFBD","#FDB45C","#949FB1","#4D5360","#d177b6"];
     if(datalist.length<=op.length){ //判断当前数据是否大于定义的种数
        op.splice(datalist.length,op.length);
        return op;
     }else{
        console.log("超出显示的种类！");
        return false;
     }                   
}

//产品出库
function outchart(){
    var $oftime = $('#outFinshTime').val();
    var $ostime = $('#outStartTime').val();
    var $opNo = $('#outPro').val();
	var param={
       htmlid:"char0",
       urlName:_path+"voucher_list",
       chartType:"2"
    }
    if($oftime == '' || $ostime ==''){
    	
    }else{
    	param.urlValues = {
    		sTime: $ostime,
    		fTime: $oftime,
    		PNo: $opNo
    	}
    }
    chart_reveal(param);
    
}

//箱采集检测率
function V(){
    var $vftime = $('#VFinshTime').val();
    var $vstime = $('#VStartTime').val();
    var $vpNo = $('#VPro').val();
    // pie chart example
    if($vftime == '' || $vstime ==''){
        console.log('时间为空');
    }else{
        $.ajax({
            url: _path+'c_collection/',
            type: 'GET',
            dataType: 'json',
            data: {
                stime: $vstime,
                ftime: $vftime,
                sNo: $vpNo
            },
            success: function(data){
                //箱码采集率
                var sum = 100.00;
                if(data.checkCollection){
                    let num = sum-data.checkCollection;
                    var PieConfig1 = {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: [
                                    data.checkCollection,
                                    num.toFixed(2)
                                ],
                                backgroundColor:[
                                    "#314dad",
                                    "#666666"
                                ]
                            }],
                            labels: [
                                "成功率",
                                "失败率"
                            ]
                        },
                        options: {
                            responsive: true
                        }
                    };
                    $('#pieChart1').remove();
                    $('#Chart1').append('<canvas id="pieChart1" height="120"></canvas>');
                    window.myPie1 = new Chart(document.getElementById("pieChart1"), PieConfig1);
                }
                //箱码检测率
                if(data.Collectedtion){
                    let num = sum-data.Collectedtion;
                    console.log(num);
                    var PieConfig2 = {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: [
                                    data.Collectedtion,
                                    num.toFixed(2)
                                ],
                                backgroundColor:[
                                    "#26cf90",
                                    "#666666"
                                ]
                            }],
                            labels: [
                                "成功率",
                                "失败率"
                            ]
                        },
                        options: {
                            responsive: true
                        }
                    };
                    $('#pieChart2').remove();
                    $('#Chart2').append('<canvas id="pieChart2" height="120"></canvas>');
                    window.myPie2 = new Chart(document.getElementById("pieChart2"), PieConfig2);
                }
                
            },
            error: function(error){

            }
        })
        $.ajax({
            url: _path+'p_collection/',
            type: 'GET',
            dataType: 'json',
            data: {
                stime: $vstime,
                ftime: $vftime,
                sNo: $vpNo
            },
            success: function(data){
                //瓶码采集率
                var sum = 100.00;
                if(data.checkCollection){
                    let num = sum-data.checkCollection;
                    var PieConfig3 = {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: [
                                    data.checkCollection,
                                    num.toFixed(2)
                                ],
                                backgroundColor:[
                                    "#4A7B50",
                                    "#666666"
                                ]
                            }],
                            labels: [
                                "成功率",
                                "失败率"
                            ]
                        },
                        options: {
                            responsive: true
                        }
                    };
                    $('#pieChart3').remove();
                    $('#Chart3').append('<canvas id="pieChart3" height="120"></canvas>');
                    window.myPie3 = new Chart(document.getElementById("pieChart3"), PieConfig3);
                }
                //箱码检测率
                if(data.Collectedtion){
                    let num = sum-data.Collectedtion;
                    console.log(num);
                    var PieConfig4 = {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: [
                                    data.Collectedtion,
                                    num.toFixed(2)
                                ],
                                backgroundColor:[
                                    "#F7464A",
                                    "#666666"
                                ]
                            }],
                            labels: [
                                "成功率",
                                "失败率"
                            ]
                        },
                        options: {
                            responsive: true
                        }
                    };
                    $('#pieChart4').remove();
                    $('#Chart4').append('<canvas id="pieChart4" height="120"></canvas>');
                    window.myPie4 = new Chart(document.getElementById("pieChart4"), PieConfig4);
                }
                
            },
            error: function(error){

            }
        })
    }
    return false;
}

//产品入库
function inchart(){
	var param2={
       htmlid:"char1",
       urlName:_path+"order_list",

       chartType:"2"
    }
    var $iftime = $('#inFinshTime').val();
    var $istime = $('#inStartTime').val();
    var $ipNo = $('#inPro').val();
    if($iftime == '' || $istime ==''){
    	
    }else{
    	param2.urlValues = {
    		sTime: $istime,
    		fTime: $iftime,
    		PNo: $ipNo
    	}
    }
    chart_reveal(param2);
}

//产品
function product(){
	var html = '<option value="">全部</option>';
	ajax({
        cache: false,
        type: "get",
        url: "productlist",
        dataType: "json",
        data: {},
        success: function (data) {
            $(data).each(function (i) {
            	html += "<option value='"+ data[i].ProductNo +"'>"+ data[i].ProductName +"</option>";
            })
            $('.product').append(html);
        },
        error: function (message) {
            $.errorFun("获取产品信息失败");
        }
    })
}
//产线
function scene(){
    var html = '<option value="">全部</option>';
    ajax({
        cache: false,
        type: "get",
        url: "scene",
        dataType: "json",
        data: {},
        success: function (data) {
            data.shift();
            if(!data){
                return;
            }else{
                $(data).each(function (i) {
                    var data_val = data[i].Value;
                    data_val == null ? data_val='':data_val;
                    var data_value = data[i].Fill+data[i].Name+data_val;
                    html += "<option value='"+ data[i].Number +"'>"+ data_value +"</option>";
                })
                $("#VPro").append(html);
            }
            
        },
        error: function (message) {
            $.errorFun("获取产线信息失败，请刷新页面！");
        }
    })
}