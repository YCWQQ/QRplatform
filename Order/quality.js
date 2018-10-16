var _Obj = {};
var _setTime;//延时操作全局变量

//表格渲染
function ajax_table(jQGridData) {
 var grid = $("#jqgrid");
	let batch=$("#BatchNo").val()==undefined?" ":$("#BatchNo_qua").val();
     var path = _path+"getQ_Orderlist/?stime="+$("#VStartTime").val()+"&ftime="+$("#VFinshTime").val()+"&batchno="+batch;
        grid.jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
	jQuery("#jqgrid").jqGrid({
	    url: path,
	    datatype: "json",
	    mtype: 'get',
	    multiselect: false,//多选框禁用
		autowidth: true,
		height: 'auto',
		search: true,
		rowNum: 10,
		rowList: [10, 30,50],
		pager: '#pjqgrid',
		sortname: 'PackingId',
		viewrecords: true,
		sortorder: "desc",
	    jsonReader : {  
	        root: "rows",
	        page: "page",
	        total: "total",
	        records: "records",
	        repeatitems: true,
	        cell: "cell",
	        id: "id",
	    },
	    prmNames : {
			page:"index", // 表示请求页码的参数名称
			rows:"size", // 表示请求行数的参数名称
			sort: null, // 表示用于排序的列名的参数名称
			order: null, // 表示采用的排序方式的参数名称
			search:null, // 表示是否是搜索请求的参数名称
			nd:null, // 表示已经发送请求的次数的参数名称
			id:"id", // 表示当在编辑数据模块中发送数据时，使用的id的名称
			oper:"oper", // operation参数名称
			editoper:"edit", // 当在edit模式中提交数据时，操作的名称
			addoper:"add", // 当在add模式中提交数据时，操作的名称
			deloper:"del", // 当在delete模式中提交数据时，操作的名称
			subgridid:"id", // 当点击以载入数据到子表时，传递的数据名称
			npage: null,
			totalrows:"totalrows" // 表示需从Server得到总共多少行数据的参数名称，参见jqGrid选项中的rowTotal
		},
		colNames: jQGridData.colNames,
        colModel: jQGridData.colModel,
        loadBeforeSend: function (request) {
            request.setRequestHeader("Token",dataList.Key);
        },
		gridComplete: function () {
			qxC();//权限控制
		},
		loadComplete: function (data) {
			_Obj = data;
		    var ids = jQuery("#jqgrid").jqGrid('getDataIDs');
		    
			for (var i = 0; i < ids.length; i++) {
				var status = data.rows[i].Paramsfirst;
				var sampling = data.rows[i].Sampling+'%';
				status ?status='正常':status='失效';
				var cl = ids[i];
				var CrTime = timeMat(data.rows[i].CreateTime),
				se = "<button class='btn btn-xs btn-default' title='修改' data-qx='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].OrderId + "');\"><i class='fa fa-pencil'></i></button>";
				ca = "<button style='margin:0 3px;' class='btn btn-xs btn-default' title='删除' data-qx='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].OrderId + "');\"><i class='fa  fa-trash-o'></i></button>";
				ke=`<button class="btn btn-primary btn-xs" onclick="cleaArr(${cl},${data.rows[i].OrderId})">质检</button>`;
				jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
					act: se + ca + ke,
					Paramslast: status,
					Sampling: sampling,
					CreateTime: CrTime
				});
			}
		},
	});
	//jQuery("#jqgrid").jqGrid('filterToolbar', { searchOperators: true });
	/* Add tooltips */
	var columnNames = grid.jqGrid('getGridParam','colModel');
	for (i = 0; i < columnNames.length; i++) {
		 grid.setColProp(columnNames[i].index, { sortable: false });
	}
	grid.jqGrid('navGrid', "#pjqgrid", {
		edit : false,
		add : false,
		del : false,
		search : false
	});
	$('.navtable .ui-pg-button').tooltip({
		container: 'body'
	});

	jqGridUi();//jqGrid UI
}
//质检
function cleaArr(i,uid){
	$('#dialog-Quality').dialog('open');
	$('#Levels').val(_Obj.rows[i-1]['Levels']);
	var stat=_Obj.rows[i-1]['Paramslast']?'1':'0';
	$("input[name='Status_1'][value='"+stat+"']").prop("checked",true); 
	$('#addzj').unbind("click").click(function(){
	    ajax({
	    	url:'UQ_OrderInfo',
	    	datatype:'json',
	    	type:'POST',
	    	data:{
	    		OrderId:uid,
	    		OrderNo:_Obj.rows[i-1]['OrderNo'],
	    		ProductNo:_Obj.rows[i-1]['ProductNo'],
	    		Levels:$('#Levels').val(),
	    		Status:$("input[name='Status_1']:checked").val()
	    	},
	    	success:function(data){
	    		if(data.Status=='1'){
	    			F5();
	    		}else{
	    			$.errorFun("质检失败!")
	    		}
	    	},
	    	error:function(){
	    		$.errorFun("质检失败，请稍后重试");
	    	}
	    })
	    return false;
	})
}

//表单验证
function formValidator(){
    $('#iform').data('bootstrapValidator', null);
	//表单验证
	$('#iform').bootstrapValidator({
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {
			OrderNo : {
				validators : {
					notEmpty : {
						message : '生产单编号为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
				}
			},
			OrderName : {
				validators : {
					notEmpty : {
						message : '质检单名称为必填项'
					}
				}
			},
			Sampling : {
				validators : {
					notEmpty : {
						message : '采样为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
	                    regexp: /^((?!0)\d{1,2}|100)$/,
	                    message: '请输入1-100的整数'
	                }
				}
			},

		}
	})//表单验证end
}


//修改数据
function updateRow(trId,uId) {
	formValidator();
    reset();
    $('#OrderNo').attr('disabled',true);
    $("#ui-id-3").html("修改质检单");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();
    let ifromValue = $("#iform").find("input,select,textarea");
    ifromValue.each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj.rows[trId-1][$(item).attr("id")]);
    });
    $('#Status').val(_Obj.rows[trId-1]['Paramsfirst']?'1':'0')
    $("#update").unbind("click").click(function() {
    	var jsonData = {};
    	jsonData['OrderId'] = uId;
    	
    	ifromValue.each(function(index,val){
    		jsonData[$(val).attr('id')] = $(val).val();
    	})
	    ajax({
			type:"POST",
			datatype:'json',
			url:"UQ_Order",
			data:jsonData,
			success: function(data){
				ReturnAjax({data:data});
			},
			error: function(message){
				$.errorFun("修改失败，请稍后重试");
			}
		});
		return false;
	})
}
//删除数据
function delRow(trId,uId) {
	$.delFun("DQ_Order","OrderId",uId,F5);//1：接口名称  2：参数名称  3：参数值
}

//质检单统计
function V(){
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

	$('#VFinshTime').val(FinshTime);
	$('#VStartTime').val(StartTime);
    iTime('#VStartTime,#VFinshTime');//给input加上时间插件
}

//获取质检人员
function permit(){
	ajax({
		url:'get-qc-permit',
		dataType:'json',
		type:'GET',
		success:function(data){
			if(data){
				var html='<option value="0">- 请选择 -</option>';
				data.map(item=>{
					html+=`<option data-n='${item.Alias}' value='${item.EmployeeNo}'>${item.EmployeeName}</option>`
				})
				$('#PermitNo').empty().append(html);
			}
		},
		error:function(){
			$.errorFun("质检人员信息获取失败！");
		}
	})
}
//获取产品信息
function product(){
	ajax({
		url:'get-product-order',
		dataType:'json',
		type:'GET',
		success:function(data){
			if(data){
				var html='<option value="0">- 请选择 -</option>';
				data.map(item=>html+=`<option data-n='${item.BatchNo}' data-Pro='${item.ProductNo}' value='${item.OrderNo}'>${item.OrderName}${item.OrderNo}/${item.ProductName}${item.ProductNo}</option>`)
				$('#OrderNo').empty().append(html);
			}
		},
		error:function(){
			$.errorFun("质检人员信息获取失败！");
		}
	})
}

$(function(){
	
	V();
	ajax_table(GetHeaders());
	permit();
	product();
	$("#sarty").click(function(){
		ajax_table(GetHeaders());
	});

    $('#PermitNo').change(function(){
    	$('#Alias').val($(this).find("option:selected").attr('data-n'));
    })

    $('#OrderNo').change(function(){
    	$('#BatchNo').val($(this).find("option:selected").attr('data-n'));
    	$('#ProductNo').val($(this).find("option:selected").attr('data-Pro'));
    })

	//添加
	$("#add").click(function() {
		var iflag = true;
		$('#iform').find('input,select').each(function(index, el) {
			if($(this).val()){
				iflag = true;
			}else{
				iflag = false;
				return false;
			}
		});
		if(iflag){
			$('#iform').bootstrapValidator('validate');
	    	var ifromValue = $("#iform").find('input,select,textarea');
	    	let jsonData = {};
	    	ifromValue.each(function(index,val){
	    		jsonData[$(val).attr('id')] = $(val).val();
	    	})
	    	jsonData['CreateBy']=_SessionUserName;
	    	ajax({
				type:"POST",
				datatype:'json',
				url:"CQ_Order",
				data:jsonData,
				success: function(data){
					ReturnAjax({data:data});
				},
				error: function(message){
					$.errorFun("添加失败，请稍后尝试");
				}
			});
			return false;
		}else{
			$.errorFun('信息请填写完整');
			$('#iform').bootstrapValidator('validate');
			return false;
		}
	});

	$('#modal_link').click(function () {//点击显示弹出框
	    $("#ui-id-3").html("添加质检单");
	    $('#dialog-message').dialog('open');
	    $("#add").show();
	    $("#update").hide(); 
	    reset();//清空表单
	    formValidator();
	    $('#OrderNo').attr("disabled",false);
	    return false;
	});
	if(IsPC()){
		$("#dialog-message").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 730,
		    height: 600,
		});
		$("#dialog-Quality").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 550,
		    height: 280,
		});
	}else{
		$("#dialog-message").dialog({  //弹框
			autoOpen: false,
			modal: true,
			width: 'auto',
			height: 'auto',
		});
		$("#dialog-Quality").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 'auto',
			height: 'auto',
		});
	}
	
})
