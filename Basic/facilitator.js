var _depot = [];

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
			FacilitatorName : {
				validators : {
					notEmpty : {
						message : '服务商名称为必填项'
					}
				}
			}
		}
	})//表单验证end
}

//修改数据
function updateRow(trId,uId) {
	formValidator();
    $("#ui-id-4").html("修改服务商");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();
    reset();
    $("#FacilitatorNoList").show();
    $('#FacilitatorNo').attr("disabled",true);//禁止修改单号
    $("#iform").find("input,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_depot[trId-1][$(item).attr("id")]);
    });
    $("#update").unbind("click").click(function() {
    	ajax({
			cache: false,
			type:"POST",
			url:"upt-facilitator",
			dataType: "json",
			data:{
				FacilitatorNo:$("#FacilitatorNo").val(),
	            FacilitatorName:$("#FacilitatorName").val(),
	            Remark:$("#Remark").val()
			},
			success: function(data){
				if(data.Status==1){
					$("#refresh_jqgrid").click();
					reset();
					$('#dialog-message').dialog('close');
				}
				else if(data.Status==-2){
					$.errorFun("该服务商已存在,不允许修改!");
				}
				else if(data.Status==-3){
					$.errorFun("该服务商已被已用，不允许修改！");
				}
				$('#dialog-message').dialog('close');
			},
			error: function(message){
				console.log("error"+message);
			}
		});
    });
}
//删除数据
function delRow(trId,uId) {
	$.delFun("del-facilitator","FacilitatorNo",uId);//1：接口名称  2：参数名称  3：参数值
}



$(function(){
	//表格渲染
	var jQGridData = GetHeaders();
	GlobaljqGrid('#jqgrid',{
		url: 'get-facilitator-list/',
		pageDom: '#pjqgrid',
		colNames: jQGridData.colNames,
	    colModel: jQGridData.colModel,
	    loadComplete: function (data) {//加载前执行
		    _depot = data.rows;
		    var ids = jQuery("#jqgrid").jqGrid('getDataIDs');
			for (var i = 0; i < ids.length; i++) {
				var cl = ids[i];
				var CrTime = timeMat(data.rows[i].CreateTime),
				se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].FacilitatorNo + "');\"><i class='fa fa-pencil'></i></button>";
				ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].FacilitatorNo + "');\"><i class='fa  fa-trash-o'></i></button>";
				jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
					CreateTime:CrTime,
					act: se + ca,
				});
			}
		}
	})

	$("#search-div").click(function(event) {
        var searchVal = $("#search-html").val(),
        path = _path+"get-facilitator-vague/?v="+searchVal;
        jQuery("#jqgrid").jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
    });

	//添加
	$("#add").click(function() {
		$('#iform').bootstrapValidator('validate');
		$('#iform').find('input.notNull').each(function(index, el) {
			if($(this).val()){
				iflag = true;
			}else{
				iflag = false;
				return false;
			}
			console.log($(this).val());
		});
		if(iflag){
	    	var options = decodeURIComponent($("#iform").serialize(),true);
	    	var params = $("#iform").serializeArray();
	    	var values = {};
	    	for(var item in params)
	    	{
	    		values[params[item].name] = params[item].value;
	    	}
	    	ajax({
				cache: false,
				type:"POST",
				url:"add-facilitator",
				dataType: "json",
				data:{
					FacilitatorNo:values.FacilitatorNo,
		            FacilitatorName:values.FacilitatorName,
		            Remark:values.Remark
				},
				success: function(data){
					if(data.Status==1){
						$("#refresh_jqgrid").click();
						reset();
						$('#dialog-message').dialog('close');
					}
					else if(data.Status==0){
						$.errorFun("该服务商已存在，不允许重复添加！");
					}
					
					$('#dialog-message').dialog('close');
				},
				error: function(message){
					console.log("error"+message);
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
	    $("#ui-id-3").html("添加服务商");
	    $('#dialog-message').dialog('open');
	    $("#add").show();
	    $("#update").hide(); 
	    reset();//清空表单
	    formValidator();
	    $('#FacilitatorNoList').hide();//允许修改单号
	    return false;
	});
	
	if(IsPC()){
		$("#dialog-message").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 630,
		    height: 360,
		});
	}else{
		$("#dialog-message").dialog({  //弹框
			autoOpen: false,
			modal: true,
			width: 'auto',
			height: 'auto',
		});
	}
})


