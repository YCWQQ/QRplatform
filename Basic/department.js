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
			DepartmentNo : {
				validators : {
					notEmpty : {
						message : '部门编号为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
				}
			},
			DepartmentName : {
				validators : {
					notEmpty : {
						message : '部门名称为必填项'
					}
				}
			}
		}
	})//表单验证end
}
//修改数据
function updateRow(trId,uId) {
	$('#DepartmentNo').attr("disabled",true);
	formValidator();
    reset();
    $("#ui-id-3").html("修改部门");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();

    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);
    });
    var dataObj = {};
    dataObj.DepartmentId = uId;
    $("#update").unbind("click").click(function() {
    	$("#iform").find("input,select,textarea").each(function(i,item){
	        dataObj[$(this).attr('id')] = $(this).val();
	    });
	    ajax({
			type:"POST",
			url:"upt-department",
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
function delRow(trId,uNo) {
	$.delFun("del-department","DepartmentNo",uNo);//1：接口名称  2：参数名称  3：参数值
}

$(function(){
	var jQGridData = GetHeaders();
	GlobaljqGrid('#jqgrid',{
	    url: 'get-department-list/',
	    pageDom: '#pjqgrid',
	    colNames: jQGridData.colNames,
	    colModel: jQGridData.colModel,
	    gridComplete: function (data) {
	        qxC();
	    },
	    loadComplete: function (data) {
	        _Obj = data.rows;
	        var datalist = data.rows;
	        //console.log(data)//为所有数据行，具体取决于reader配置的root或者服务器返回的内容
	        var ids = jQuery("#jqgrid").jqGrid('getDataIDs');

	        for(var item = 0; item < ids.length; item++){
	            var CrTime = timeMat(datalist[item].CreateTime);
	            jQuery("#jqgrid").jqGrid('setRowData', ids[item], {
	                CreateTime: CrTime
	            });
	        }
	        for (var i = 0; i < ids.length; i++) {
	            var cl = ids[i];
	            se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + datalist[i].DepartmentNo + "');\"><i class='fa fa-pencil'></i></button>";
	            ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + datalist[i].DepartmentNo + "');\"><i class='fa  fa-trash-o'></i></button>";
	            jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
	                act: se + ca
	            });
	        }
	    }
	})

	$("#search-div").click(function(event) {
        var searchVal = $("#search-html").val(),
        path = _path+"unitvague/?v="+searchVal;
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
				url:"add-department",
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
	    $("#ui-id-3").html("添加部门");
	    $('#dialog-message').dialog('open');
	    $("#add").show();
	    $("#update").hide(); 
	    reset();//清空表单
	    formValidator();
	    $('#DepartmentNo').attr("disabled",false);
	    return false;
	});
	
	if(IsPC()){
		$("#dialog-message").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 550,
		    height: 390,
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
