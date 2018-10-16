var _Obj={};

//所属经销商select渲染
function DistrAll(){
	ajax({
		url:"DistrAll",
		success:function(data){
			var html = '';
			var ParentId = $("#ParentId");
			$.each(data,function(item, val) {
				if(data[item].Value==null && data[item].Value==undefined){
					data[item].Value='';
				}
				html+='<option data-id="'+data[item].Id+'" value="'+data[item].Id+'">'+data[item].Fill+data[item].Name+data[item].Value+'</option>';
			});
			ParentId.empty().append(html);
		},
		error:function(error){
			$.errorFun("获取经销商信息失败");
		}
	});
	
}
//获取地区信息
function AreaNo(){
	ajax({
		url:"areaOption",
		success:function(data){
			var AreaNo = $("#AreaNo");
			var html = '';
			$.each(data,function(item, val) {
				if(data[item].Value==null && data[item].Value==undefined){
					data[item].Value='';
				}
				if(data[item].Number==null && data[item].Number==undefined){
					data[item].Number=0;
				}
				html+='<option value="'+data[item].Number+'" id="'+data[item].Id+'" >'+data[item].Fill+data[item].Name+data[item].Value+'</option>';
			});
			AreaNo.empty().append(html);
		},
		error:function(error){
			$.errorFun("获取地区信息失败，请刷新页面重试！");
		}
	});
	
}

//表单验证
function formValidator(){
    $('#iform').data('bootstrapValidator', null);
	$('#iform').bootstrapValidator({
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {
			DistributorNo : {
				validators : {
					notEmpty : {
						message : '经销商编号为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
				}
			},
			DistributorName : {
				validators : {
					notEmpty : {
						message : '经销商名称为必填项'
					}
				}
			},
			AreaNo : {
				validators : {
					notEmpty : {
						message : '地区编号为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
				}
			},
			// These fields will be validated when being visible
			ParentId : {
				validators : {
					notEmpty : {
						message : '所属经销商编号为必填项'
					}
				}
			}
		}
	})//表单验证end
}
//修改数据
function updateRow(trId,uId) {
	$('#DistributorNo').attr("disabled",true);
	DistrAll();
	AreaNo();
	formValidator();
    reset();
    $("#click-title").html("修改经销商");
	$("#wid-id-form").slideDown(500);
    $("#update").show();
    $("#add").hide();
    $.optionFalse('ParentId',uId);//select 不可选当前
    
    if(_Obj){
    	$("#iform").find("input,select,textarea").each(function(i,item){
			$("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);
	    });
    	$("#finishdate").val(timeMat(_Obj[trId-1].ExpireTime));
   	 	$("#startdate").val(timeMat(_Obj[trId-1].CreateTime));
    }else{
    	$("#iform").find("input,select,textarea").each(function(i,item){
			$("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);  
	    });
    	$("#finishdate").val(timeMat(_Obj[trId-1].ExpireTime));
    	$("#startdate").val(timeMat(_Obj[trId-1].CreateTime));
    }
    var param={};
    param.DistributorId = uId;
    param.DistributorNo=$("#DistributorNo").val();
    $("#update").unbind("click").click(function() {
		$('#iform').bootstrapValidator('validate');
    	var params = $("#iform").serializeArray();
		for(var item in params){
            param[params[item].name] = params[item].value;
        }
        ajax({
        	type:"POST",
        	url:"uDistr",
        	data:param,
        	success:function(data){
				$("#wid-id-form").slideUp(300);
        		ReturnAjax({
        			data:data,
        			DiyFunction:function(){
						reset();
						DistrAll();
						
        			}
        		});
        	},
        	error:function(error){
        		$.errorFun("更新失败，请稍后重试");
        	}
        })
		return false;
	})
}
//删除数据
function delRow(trId,uId) {
	$.delFun("DeDistr","DistributorId",uId);//1：接口名称  2：参数名称  3：参数值
}

//导出excel
function exportExcel(){
	ajax({
		url: 'distr-export',
		data: {},
		success: function(data){
			window.open(data);
		},
		error: function(error){
			console.log('error');
		}
	})
};

$(function(){
	//表格渲染
	var jQGridData = GetHeaders();
	GlobaljqGrid('#jqgrid',{
		url: 'Distr/',
		pageDom: '#pjqgrid',
		colNames: jQGridData.colNames,
		colModel: jQGridData.colModel,
	    loadComplete:function (data) {//加载前执行
			_Obj = data.rows;
			var ids = jQuery("#jqgrid").jqGrid('getDataIDs');   
			if('rows' in data){
				for (var i = 0; i < ids.length; i++) {
					var cl = ids[i];
					var CrTime = timeMat(data.rows[i].CreateTime);
					var endTime = timeMat(data.rows[i].ExpireTime);
					se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].DistributorId + "');\"><i class='fa fa-pencil'></i></button>";
					ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].DistributorId + "');\"><i class='fa  fa-trash-o'></i></button>";
					jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
						act: se + ca,
						CreateTime: CrTime,
						ExpireTime: endTime
					});
				}
			}else{
				for (var i = 0; i < ids.length; i++) {
					var cl = ids[i];
					se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data[i].DistributorId + "');\"><i class='fa fa-pencil'></i></button>";
					ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data[i].DistributorId + "');\"><i class='fa  fa-trash-o'></i></button>";
					jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
						act: se + ca
					});
				}
			}
		    
			
		}
	})
	//搜索
	$("#search-div").click(function(event) {
		var searchVal = $("#search-html").val(),
		path = _path+"dis_select/?disno="+searchVal;
    	jQuery("#jqgrid").jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
	});

	var myDate = new Date();//获取当前年
    var fYear = myDate.getFullYear();
    var fMonth = p(myDate.getMonth()+1);//获取当前月
    var fDate = p(myDate.getDate());//获取当前日
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
			var day = parseInt(fYear+fMonth+fDate);
			var DIYday = parseInt($('#finishdate').val().replace(/[^0-9]/ig,""));
			if(DIYday>day){
				formValidator();
				$('#iform').bootstrapValidator('validate');
		    	var params = $("#iform").serializeArray();
		    	var param={};
		    	for(var item in params){
		            param[params[item].name] = params[item].value;
		        }
		    	ajax({
					type:"POST",
					url:"cDistr",
					data:param,
					success: function(data){
						$("#wid-id-form").slideUp(1000);
						ReturnAjax({
		        			data:data,
		        			DiyFunction:function(){
								reset();
								DistrAll();
								
		        			}
		        		});
					},
					error: function(message){
						$.errorFun("添加失败，请稍后重试");
					}
				});
			}else{
				$.errorFun('到期时间必须晚于当前时间');
			}
			return false;
		}else{
			$.errorFun('信息请填写完善');
			$('#iform').bootstrapValidator('validate');
			return false;
		}
	});
	$('#modal_link').click(function () {//点击显示弹出框
	    $("#click-title").html("添加经销商");
	    $("#wid-id-form").slideToggle(1000)
	    $("#add").show();
	    $("#update").hide();
	    reset();//清空表单
	    formValidator();
	    $.optionClear('ParentId');
	    $('#DistributorNo').attr("disabled",false);
		DistrAll();
		AreaNo();
	    return false;
	});
	$("#dialog-message").dialog({//弹出框设置
	    autoOpen: false,
	    modal: true,
	    width: 650,
	    height: 470,
	});
	iTime('#finishdate');

})

function iformclose(){
	$('#wid-id-form').slideToggle(1000);
	return false;
}