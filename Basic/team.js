var _Obj = {};

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
			TeamNo : {
				validators : {
					notEmpty : {
						message : '箱编号为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
				}
			},
			TeamName : {
				validators : {
					notEmpty : {
						message : '名称为必填项'
					}
				}
			},
			Status : {
				validators : {
					notEmpty : {
						message : '状态为必选项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[0-9]+$/,
                        message: '只能是数字'
                    }
				}
			}

		}
	})//表单验证end
}
//修改数据
function updateRow(trId,uId) {
	formValidator();
	$('#TeamNo').attr("disabled",true);
    var Top_tr = $("#" + trId).children("td:not(:last)");
    var updateJson = [];
    $(Top_tr).each(function (i, o) {
        updateJson.push($(this).html());
    })
    $("#ui-id-3").html("修改班组");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();
    reset();
    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);
    });
    var dataObj = {};
    dataObj.TeamId = uId;
    $("#update").unbind("click").click(function() {
    	$("#iform").find("input,select,textarea").each(function(i,item){
	        dataObj[$(this).attr('id')] = $(this).val();
	    });
	    ajax({
			type:"POST",
			url:"uteam",
			data:dataObj,
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
	$.delFun("dteam","TeamId",uId);//1：接口名称  2：参数名称  3：参数值
}


$(function(){
	//表格渲染
	var jQGridData = GetHeaders();
	GlobaljqGrid('#jqgrid',{
		url: 'team/',
		pageDom: '#pjqgrid',
		colNames: jQGridData.colNames,
		colModel: jQGridData.colModel,
	    loadComplete: function (data) {
			_Obj = data.rows;
		    var ids = jQuery("#jqgrid").jqGrid('getDataIDs');
		    for(var item = 0; item < ids.length; item++){
		    	var status = data.rows[item].Status;
		    	status == 0?status='失效':status='正常';
		    	jQuery("#jqgrid").jqGrid('setRowData', ids[item], {
					Status: status
				});
		    }
			for (var i = 0; i < ids.length; i++) {
				var cl = ids[i];
				se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].TeamId + "');\"><i class='fa fa-pencil'></i></button>";
				ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].TeamId + "');\"><i class='fa  fa-trash-o'></i></button>";
				jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
					act: se + ca
				});
			}
		},
	})

	$("#search-div").click(function(event) {
        var searchVal = $("#search-html").val(),
        path = _path+"teamvague/?v="+searchVal;
        jQuery("#jqgrid").jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
    });
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
	    	var options = decodeURIComponent($("#iform").serialize(),true);
	    	var params = $("#iform").serializeArray();
	    	var values = {};
	    	for(var item in params)
	    	{
	    		values[params[item].name] = params[item].value;
	    	}
	    	ajax({
				type:"POST",
				url:"cteam",
				data:values,
				success: function(data){
					ReturnAjax({data:data});
				},
				error: function(message){
					$.errorFun("添加失败，请稍后重试");
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
	    $("#ui-id-3").html("添加班组");
	    $('#dialog-message').dialog('open');
	    $("#add").show();
	    $("#update").hide(); 
	    reset();//清空表单
	    formValidator();
	    $('#TeamNo').attr("disabled",false);
	    return false;
	});
	
	if(IsPC()){
		$("#dialog-message").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 550,
		    height: 375,
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
