//引入三个js包：
//<script src="../js/plugin/chartjs/chart.min.js"></script>
//<script src="../js/plugin/morris/raphael.min.js"></script>
//script src="../js/plugin/morris/morris.min.js"></script> 
// 参数介绍：
//{
//	htmlid: DIV的id
//	urlName:接口名字或者是返回的JSON数据
//	urlValues:接口所需的参数【对象方式传输】 
//	chartType:图形的类型
//	charName:图形名字
//	ViewVal:需要显示的字段名称{labels：名称，valNumber: 数量} (为饼形，风车图所用)
//}	   
// $(function(){
// 	var myDate = new Date();//获取当前年
//     var fYear = myDate.getFullYear();
//     var fMonth = p(myDate.getMonth()+1);//获取当前月
//     var fDate = p(myDate.getDate());//获取当前日
//     var FinshTime = fYear+'-'+fMonth+"-"+fDate;
// 	$("#StartTime").change(function(){
// 	   $("#FinshTime").val(ContrastDate($("#StartTime").val(),FinshTime));
// 	});
// 	$("#FinshTime").change(function(){
// 	   ConendDate($("#FinshTime").val(),FinshTime);
// 	});
// });  
    		          		      
var _motch,pls,diffMotch,_Time;
function chart_reveal(param){ 
 //    var myDate = new Date();//获取当前年
 //    var fYear = myDate.getFullYear();
 //    var fMonth = p(myDate.getMonth()+1);//获取当前月
 //    var fDate = p(myDate.getDate());//获取当前日
 //    var dataVar = 1;//时间变量  当前时间
 //    var sYear = myDate.getFullYear();
 //    var sMonth = p(myDate.getMonth()+1);//获取当前月
 //    var sDate = p(myDate.getDate());//获取当前日
 //    sMonth = p(parseInt(sMonth-dataVar));
 //    if(sMonth==0){
 //        sYear=parseInt(sYear-1);
 //        sMonth=12;
 //    }           
	// var FinshTime = fYear+'-'+fMonth+"-"+fDate;
	// var StartTime = sYear+'-'+sMonth+"-"+sDate;
	// if(param.urlValues==undefined||param.urlValues==""){
	// 	param.urlValues = {
	// 						"sTime":StartTime,
	// 						"fTime":FinshTime
	// 					};
	// }else{
	// 	param.urlValues['sTime']=param.urlValues['sTime']==undefined||param.urlValues['sTime']==""?StartTime:param.urlValues['sTime'];
	// 	param.urlValues['fTime']=param.urlValues['fTime']==undefined||param.urlValues['fTime']==""?FinshTime:param.urlValues['fTime'];
	// }
	// if(param.chartType=="3"||param.chartType=="4"||param.chartType=="6"){
	// 	 if(param.ViewVal==undefined){
	// 	 	$.errorFun('该图形需要展示的数据格式未确定！');
	// 		return false;
	// 	 }
	// }
    
	if(DateDiff(param.urlValues['sTime'],param.urlValues['fTime'])){		
	    var datalist=param.urlName; //定义一个接受数据的变量 typeof param.urlName=="string"?"":
	    var chartType=param.chartType||null;
	    if(chartType==null){
	    	$.errorFun('需要展示的图形类型为必传项！');
	    	return false;
	    }
	    // var srtop=function(){
	    // 	console.log("111");
			      var rendomType=()=>"";
				  var moth=()=>"rgba("+Math.round(Math.random() * 255)+","+Math.round(Math.random() * 255)+","+Math.round(Math.random() * 255)+",0.5)";
			      var jxdata=function(obj,objvalue){ //解析数据格式 obj返回的JSON数据，objvalue提取的键
						var op=[];
						$(obj).each(function(i){
							if(i<=Vuenumber){
								op.push(obj[i][objvalue]);
							}
						});
						return op;
					}				        		             
			      var colorNum=function(){  //对比返回数据的长度，给出相同数组长度的颜色,最多显示12种
			        	var op= [];
				         for(var i=0;i<datalist.length;i++){
				         	op.push(getRandomColor());
				         }	
				         return op;	         
			        } 
			        var getRandomColor = function(){     //随机生成颜色
					  return  '#' +    
					    (function(color){    
					    return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
					      && (color.length == 6) ?  color : arguments.callee(color);    
					  })('');    
					} 
				   //加载所需要的图形界面
				   apphtml(chartType,param.htmlid,param.charName);
				   switch(chartType){
				   	 case '1':
				   	      //折线开始	
					        var LineConfig = {
					            type: 'line',
					            data: { 
					                labels: _motch,
					                datasets:Analytical_data(datalist),
					            	},
					            options: {
					                responsive: true,
					                tooltips: {
					                    mode: 'label'
					                },
					                hover: {
					                    mode: 'dataset'
					                },
					                scales: {
					                    xAxes: [{
					                        display: true,
					                        scaleLabel: {
					                            show: true,
					                            labelString: 'Month'
					                        }
					                    }],
					                    yAxes: [{
					                        display: true,
					                        scaleLabel: {
					                            show: true,
					                            labelString: 'Value'
					                        },
					                        ticks: {
					                            suggestedMin: 0,
					                            suggestedMax: 100,
					                        }
					                    }]
					                }
					            }
					        };						
	 						var randomColorFactor =()=>Math.round(Math.random() * 255);
					        var randomColor=(opacity)=>'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' +randomColorFactor() + ',' + (opacity || '.3') + ')';
					        $.each(LineConfig.data.datasets, function(i, dataset) {
					            dataset.borderColor = 'rgba(0,0,0,0.15)';
					            dataset.backgroundColor = randomColor(0.5);
					            dataset.pointBorderColor = 'rgba(0,0,0,0.15)';
					            dataset.pointBackgroundColor =randomColor(0.5);
					            dataset.pointBorderWidth = 1;
					        });
			       		  //折线结束
			       		  if(1>Analytical_data(datalist).length||Analytical_data(datalist).length==undefined){
					      	 $("#"+param.htmlid).empty().append("<div style='margin:auto;width:100%;height: 45px;text-align: center;'><a style='font-size:20px;color: #2a7de2;font-weight: bold;'>当前时间段无数据展示！</a></div>");
					      }else{  
				   	 	  	window.myLine = new Chart(document.getElementById("lineChart"+param.htmlid), LineConfig);
				   	      }
				   	      break;
				   	 case '2':
				   	 	   //柱形开始 		
					        var barChartData = {   //柱形
					            labels: _motch,
					            datasets: Analytical_data(datalist),
					        };
					        //柱形结束
					       if(1>Analytical_data(datalist).length||Analytical_data(datalist).length==undefined){
					      	 $("#"+param.htmlid).empty().append("<div style='margin:auto;width:100%;height: 45px;text-align: center;'><a style='font-size:20px;color: #2a7de2;font-weight: bold;'>当前时间段无数据展示！</a></div>");
					      }else{  
					   	 	  window.myBar = new Chart(document.getElementById("barChart"+param.htmlid), {
										                type: 'bar',
										                data: barChartData,
										                options: {
										                    responsive: true,
										                }
										            });
					   	  }
				   	      break;
				   	 case '3':
				   	 	  //饼形开始		
				   	 	   var PieConfig = {
						        type: 'pie',
						        data: {
						            datasets: [{
						                data: jxdata(datalist,param.ViewVal['valNumber']),	  
						                backgroundColor: colorNum(),
						            }],
						            labels: jxdata(datalist,param.ViewVal['labels']),
						        },
						        options: {
						            responsive: true
						        }
					   		 };
					   //饼形结束
					      if(1>jxdata(datalist,param.ViewVal['valNumber']).length||jxdata(datalist,param.ViewVal['valNumber']).length==undefined){
					      	 $("#"+param.htmlid).empty().append("<div style='margin:auto;width:100%;height: 45px;text-align: center;'><a style='font-size:20px;color: #2a7de2;font-weight: bold;'>当前时间段无数据展示！</a></div>");
					      }else{
					      	   window.myPie = new Chart(document.getElementById("pieChart"+param.htmlid), PieConfig);
					      }
				   	      break;
				   	 case '4':
				   	      //风车图开始
						    var PolarConfig = {
						        data: {
						            datasets: [{
						                data:jxdata(datalist,param.ViewVal['valNumber']), 	
						                backgroundColor: colorNum(),
						                label: rendomType()
						            }],
						            labels:jxdata(datalist,param.ViewVal['labels']),
						        },
						        options: {
						            responsive: true,
						            legend: {
						                position: 'top',
						            },
						            title: {
						                display: true,
						                text: ' '
						            },
						            scale: {
						              ticks: {
						                beginAtZero: true
						              },
						              reverse: false
						            },
						            animateRotate:false
						        }
						    };
						  //风车图结束
						   if(1>jxdata(datalist,param.ViewVal['valNumber']).length||jxdata(datalist,param.ViewVal['valNumber']).length==undefined){
					      	 $("#"+param.htmlid).empty().append("<div style='margin:auto;width:100%;height: 45px;text-align: center;'><a style='font-size:20px;color: #2a7de2;font-weight: bold;'>当前时间段无数据展示！</a></div>");
					      }else{	
				   	     	 window.myPolarArea = Chart.PolarArea(document.getElementById("polarChart"+param.htmlid), PolarConfig);
				   	 	  }
				   	 	 break;
				   	 case '5':		   	      
						   var yuanx=datalist.map(item=>({label:item.CreateTime,value:item.Issued==""?0:item.Issued}));
				   	       if ($('#donut-graph'+param.htmlid).length) {			    	
								Morris.Donut({
									element : 'donut-graph',
									data :yuanx,
									formatter : function(x) {
										return x + "%"
									}
								});
							}
				   	      break;
				   	 case '6':
				   	 	   //网图开始
						     var RadarConfig = {
						        type: 'radar',
						        data: {
						            labels: jxdata(datalist,param.ViewVal['labels']),
						            datasets: [{
						                label: rendomType(),
						                backgroundColor: "rgba(220,220,220,0.2)",
						                pointBackgroundColor: "rgba(220,220,220,1)",
						                data:jxdata(datalist,param.ViewVal['valNumber'])
						            }]
						        },
						        options: {
						            legend: {
						                position: 'top',
						            },					            
						            scale: {
						              reverse: false,
						              ticks: {
						                beginAtZero: true
						              }
						            }
						        }
						    };
						   //网图结束 
						   if(1>jxdata(datalist,param.ViewVal['valNumber']).length||jxdata(datalist,param.ViewVal['valNumber']).length==undefined){
					      	 $("#"+param.htmlid).empty().append("<div style='margin:auto;width:100%;height: 45px;text-align: center;'><a style='font-size:20px;color: #2a7de2;font-weight: bold;'>当前时间段无数据展示！</a></div>");
					      }else{  
				   	 	  	window.myRadar = new Chart(document.getElementById("radarChart"+param.htmlid), RadarConfig);
				   	     } 
				   	     break;
				   	  default :
				   	  	   $.errorFun('你所显示的图形不存在！');
				   	       return false;
				   	       break;	  
				   }

				 window.onload = function() { //拖动样式加载
					 pageSetUp();	
				}
		}
	  //   if((typeof param.urlName)=="string"){
		 //    $.ajax({
			// 	url:param.urlName,
			// 	type:"GET",
			// 	dataType: "json",
			// 	data:param.urlValues, 
			// 	success: function(data){                
			// 	datalist=data;           
			// 		 srtop();
			// 	 },
			// 	error: function(message){
			// 		  console.log(message);
			// 	}
			// }); 
   //     }else{
   //     	        srtop(); 
   //     }
	//}
}	        			    		

function apphtml(obtype,htmlid,charName){ // obtype加载图形的类型
let htmldb=""; 
let htmlsex=charName;
switch(obtype){
	case '1':
  		htmldb=`<canvas id='lineChart${htmlid}' height=120></canvas>`
  	break;
	case '2':
		htmldb=`<canvas id='barChart${htmlid}' height=120></canvas>`
	  break;
	case '3':
		htmldb=`<canvas id='pieChart${htmlid}' height=120></canvas>`
	 break;
	case '4':
		htmldb=`<canvas id='polarChart${htmlid}' height=120></canvas>`
	  break;
	case '5':
		htmldb=`<div id='donut-graph${htmlid}' class=chart no-padding></div>`
	break;
	case '6':
		htmldb=`<canvas id='radarChart${htmlid}'  height=120></canvas>`
	break;
	default :
		$.errorFun('你所显示的图形不存在！');
		return false;
	break;
}
	var html=`<div class="jarviswidget-editbox">				
					<input class="form-control" type="text">
				</div>								
				<div class="widget-body no-padding">
					${htmldb}
				</div>`.trim();
	$("#"+htmlid).empty().append(html);	
}

function DateBill(sDate1,sDate2){  //得到相差的月数
    var start=new Date(sDate1.replace("-", "/").replace("-", "/"));	 
	var end=new Date(sDate2.replace("-", "/").replace("-", "/"));	
   var number = 0;      
   var yearToMonth = (end.getFullYear() - start.getFullYear()) * 12;      
     number += yearToMonth;      
   var monthToMonth = end.getMonth() - start.getMonth();      
     number += monthToMonth;  
     return number; 
}   

function ContrastDate(sDate1, sDate2) {  //sDate1和sDate2是yyyy-MM-dd格式
    var iDays="",aDate,aDate2,start,end,isDay=false;
     start=new Date(sDate1.replace("-", "/").replace("-", "/"));	 
	 end=new Date(sDate2.replace("-", "/").replace("-", "/"));
	if(end<start){  
		$("#StartTime").val(sDate2);
	}
   aDate  =  sDate1.split("-")  //起始时间	
   aDate2  =  sDate2.split("-")   //结束时间
  
    if(DateBill(sDate1, sDate2)>"3"){  //起始时间跟当前时间 间隔超过三个月
    	let moths=parseInt(aDate[1])+3;
    	let years=aDate[0];
    	let days=parseInt(aDate[2].substring(0,2));
    	if(moths>12){
    		years=parseInt(aDate[0])+1;
    		moths=moths-12;
    	}
    	iDays= years+"-"+p(moths)+"-"+p(getDaysInOneMonth(years,moths,days));
    }else{
    	iDays=sDate2;
    }

   	return iDays;
}

function ConendDate(sDate1, sDate2){
    var start,end,aDate,aDate2,iDays;
	 start=new Date(sDate1.replace("-", "/").replace("-", "/"));  				 
	 end=new Date(sDate2.replace("-", "/").replace("-", "/"));  
	if(end<start){  
		$("#FinshTime").val(sDate2);
	}
   // aDate  =  sDate1.split("-")  //起始时间	
   // aDate2  =  sDate2.split("-")   //结束时间
   // if($("#StartTime").val()){  //判断起始时间不为空
   // 		if(DateBill($("#StartTime").val(),iDays)>3||1>DateBill($("#StartTime").val(),iDays)){  //起始时间跟结束时间差距为3个月或者相差不到一个月
   // 			aDate2=$("#FinshTime").val().split("-");
   // 		}else{
   // 			iDays=$("#StartTime").val();
   // 		}
   // }
   //   		let moths=parseInt(aDate2[1])-1;
	  //   	let years=aDate[0];
	  //   	let days=parseInt(aDate2[2].substring(0,2));
	  //   	if(1>moths){
	  //   		years=parseInt(aDate2[0])-1;
	  //   		moths=12-moths;
	  //   	}
	  //   	iDays= years+"-"+p(moths)+"-"+p(getDaysInOneMonth(years,moths,days));
}

function getDaysInOneMonth(year, month,day){  //判断某年某月的天数
  month = parseInt(month, 10);  
  var d= new Date(year, month, 0); 
  var days=day<d.getDate()?day:d.getDate();
  return days;  
} 

function DateDiff(sDate1, sDate2) {  //sDate1和sDate2是yyyy-MM-dd格式
	_motch=[],pls=[],_Time=[];
    var iDays,aDate,aDate2,start,end,isDay=false;
     start=new Date(sDate1.replace("-", "/").replace("-", "/"));  				 
	 end=new Date(sDate2.replace("-", "/").replace("-", "/"));  
	if(end<start){
		$.errorFun('起始时间不能大于结束时间！');
		return isDay=false;  
	}  	
	 aDate  =  sDate1.split("-")  
   let oDate1  =  new  Date(aDate[1]  +  '-'  + aDate[2].substring(0,2)  +  '-'  +  aDate[0])    //转换为12-18-2006格式  
     aDate2  =  sDate2.split("-")  
   let oDate2  =  new  Date(aDate2[1]  +  '-'  +  aDate2[2].substring(0,2)  +  '-'  +  aDate2[0])  
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
    if(iDays<Daynumber-1){
		$.errorFun('查询天数最少为'+Daynumber+'天！');
    	return isDay=false;
     }else if(iDays>93){
        $.errorFun('查询时间最多为三个月！');
    	return isDay=false;
    }else{
    	let	startmotch=parseInt(aDate[1]);
	     if(parseInt(aDate[0])==parseInt(aDate2[0])){   //判断在同一年内查询
		    	diffMotch=aDate2[1]-startmotch+1; //获取查询多少个月
			    for(;startmotch<=aDate2[1];startmotch++){ //获取月份
			    	_motch.push(aDate2[0]+"年"+startmotch+"月");
			    	pls.push(0);
			    	_Time.push(aDate2[0]+"-"+startmotch);
			    }
		    }else{
		    	diffMotch=12-startmotch+parseInt(aDate2[1])+1;
		    	for(;startmotch<=12;startmotch++){ //获取月份
			    	_motch.push(aDate[0]+"年"+startmotch+"月");
			    	pls.push(0);
			    	_Time.push(aDate[0]+"-"+startmotch)
			    }
			    for(var i=1;i<=parseInt(aDate2[1]);i++){
			    	_motch.push(aDate2[0]+"年"+i+"月");
			    	pls.push(0);
			    	_Time.push(aDate2[0]+"-"+i);
			    } 
	   		}
	   	return isDay=true; 
	}
}

function Analytical_data(sp){
var moth=()=>"rgba("+Math.round(Math.random() * 255)+","+Math.round(Math.random() * 255)+","+Math.round(Math.random() * 255)+",0.5)";
var pool=[],data_list=[];          
	for(var i=0;i<sp.length;i++){
		if(pool.indexOf(sp[i].ProductNo)==-1&&parseInt(sp[i].Issued)>0){ //过滤掉为0的数据
			pool.push(sp[i].ProductNo);
			pls = new Array(diffMotch);  //初始化数组
			pls.fill(0);
			data_list.push({label:sp[i].ProductName,ProductNo:sp[i].ProductNo,backgroundColor:moth(),data:pls});
		}	
	   for(var j=0;j<data_list.length;j++){
	   		if(data_list[j]['ProductNo']==sp[i].ProductNo){
	   			data_list[j]['data'][arrio(_Time,sp[i].CreateTime)]=sp[i].Issued;	
	   		}
	   }
	}
	console.log(data_list)
	return data_list;
}

function arrio(arr,obj){  //获取数组起始位置
	for(var i=0;i<arr.length;i++){
		   if(arr[i]==obj){
		   		return i;
		   }
	}
}


function opObject(obj,vel){
     var sum=0;
     if(obj.length>Vuenumber){
         for(var i=Vuenumber;i<obj.length;i++){
              sum +=parseInt(obj[i]['Issued']);
          }
         var opet={};
             opet[vel]="其他";
             opet.Issued=sum;
    	return obj.splice(Vuenumber,obj.length,opet);
    }else{
    	return obj
    }

}



//解析单个数据
function arraySop(data,htmlid){
    var html=`<div class="jarviswidget-editbox">				
					<input class="form-control" type="text">
				</div>								
				<div class="widget-body no-padding">
					<canvas id='barChart${htmlid}' height=120></canvas>
				</div>`.trim();
	$("#"+htmlid).empty().append(html);	
	var moth=()=>"rgba("+Math.round(Math.random() * 255)+","+Math.round(Math.random() * 255)+","+Math.round(Math.random() * 255)+",0.5)";
	var ob=data.map(item=>({label:item.ProductName,backgroundColor: moth(),data:[item.Issued]}));
	
    var barChartData = {
		            labels: [" "],
		            datasets: ob
		        };
      if(1>data.length){
      	 $("#"+htmlid).empty().append("<div style='margin:auto;width:100%;height: 45px;text-align: center;'><a style='font-size:20px;color: #2a7de2;font-weight: bold;'>当前时间段无数据展示！</a></div>");
      }else{
      	window.myBar = new Chart(document.getElementById("barChart"+htmlid), {
		                type: 'bar',
		                data: barChartData,
		                options: {
		                    responsive: true,
		                }
		            });
		            
      }	        
     window.onload = function() { //拖动样式加载
					 pageSetUp();	
				}
}