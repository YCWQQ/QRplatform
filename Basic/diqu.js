var datas=[];
$(function(){
	AreaNo();
	qxC();//权限控制

	//搜索
	$("#search-div").click(function(event) {
		var searchVal = $("#search-html").val();
		ajax({
			url: 'area-vague/',
			data: {v: searchVal},
			success: function(data){
				if(data){
					let vague = [];
	        		$(data).each(function (i) {
		            	vague.push({AreaId:data[i].AreaId,ParentId:data[i].ParentId,AreaName:data[i].AreaName,AreaNo:data[i].AreaNo});                       
		            })		     
		            new table_Tree({
					      tableId: 'example-basic-expandable',
					      thead:['编号','名称'],
					      tbodydata: ['AreaNo','AreaName'],
					      data: fn(vague,0),
					});
	        	}else{
	        		$.errorFun('地区信息为空，请刷新页面重试');
	        	}
			}
		})
	});

	//树形结构渲染
	ajax({
		url:"area",
		success:function(data){
			if(data){

        		$(data).each(function (i) {
	            	datas.push({AreaId:data[i].AreaId,ParentId:data[i].ParentId,AreaName:data[i].AreaName,AreaNo:data[i].AreaNo});                       
	            })
	            new table_Tree({
				      tableId: 'example-basic-expandable',
				      thead:['编号','名称'],
				      tbodydata: ['AreaNo','AreaName'],
				      data: fn(datas,0),
				});
        	}else{
        		$.errorFun('地区信息为空，请刷新页面重试');
        	}
		},
		error:function(error){
			$.errorFun('地区信息获取失败，请刷新页面重试');
		}
	});
	//Tree容器高度
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
	    	var inputList = $("#iform").find("input,select,textarea"),
		    dataObj = {};
		    $.each(inputList,function(index, val) {
		      dataObj[$(val).attr('id')] = $(val).val();
		    });
		    ajax({
		    	type:"POST",
		    	url:"carea",
		    	data:dataObj,
		    	success:function(data){
		    		ReturnAjax({
		    			data:data,
		    			reload:true
		    		});
		    	},
		    	error:function(error){
		    		$.errorFun("添加地区失败，请稍后重试");
		    	}
		    });
			return false;
		}else{
			$.errorFun('信息请填写完善');
			$('#iform').bootstrapValidator('validate');
			return false;
		}
		
	});
	$('#modal_link').click(function () {
		$("#ui-id-3").html("添加地区");
	    $('#dialog-message').dialog('open');
	    $("#add").show();
	    $("#update").hide(); 
		tab_yz();
		$.optionClear('ParentId');
		$('#AreaNo').attr("disabled",false);
		reset();
		return false;
	});
	if(IsPC()){
		$("#dialog-message").dialog({  //弹框
			autoOpen: false,
			modal: true,
			width: 600,
			height: 470,
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

//表单验证
function tab_yz(){
	$('#iform').data('bootstrapValidator', null);
	$('#iform').bootstrapValidator({
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {
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
			AreaName : {
				validators : {
					notEmpty : {
						message : '地区名称为必填项'
					},
					stringLength: {
                         min: 2,
                         max: 30,
                         message: '地区名称长度必须在2到30之间'
                     },
				}
			}
		}
	})//表单验证end
}

//获取地区信息
function AreaNo(){
	ajax({
		url:"areaOption",
		success:function(data){
			var AreaNo = $("#ParentId");
			var html = '',tbody="";
			$.each(data,function(item, val) {
				if(data[item].Value==null && data[item].Value==undefined){
					data[item].Value='';
				}
				if(data[item].Number==null && data[item].Number==undefined){
					data[item].Number=0;
				}
				html+='<option data-id="'+data[item].Id+'" value="'+data[item].Id+'">'+data[item].Fill+data[item].Name+data[item].Value+'</option>';
			});
			AreaNo.empty().append(html);
		},
		error:function(error){
			$.errorFun("获取地区信息失败，请刷新页面重试！");
		}
	})
}
//删除信息
function fnChild(data,pid){
		    var result ='';
		    for(var i in data){     
		            if(data[i].ParentId==pid){
		                result+=','+data[i].AreaNo;
		                fnChild(data,data[i].AreaId);           	                   
		            }     
		    }
		    return result;
}
function delRow(uId,uNo) {
	var valMap=uNo;
	if(uId){
		valMap+=fnChild(datas,uId);
		(valMap.split(',')).length==1?$.delFun("darea","AreaNo",uNo,F5):$.delFun("darea","AreaNo",valMap,F5,"此地区下有子地区是否全部删除",true);
	}
}

//修改地区
function updateRow(uId){
	tab_yz();
	$('#AreaNo').attr("disabled",true);
    $("#ui-id-3").html("修改地区");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();
    $.optionFalse('ParentId',uId);//select 不可选当前
    var param={};
    ajax(params={
    	url:"area_check/",
    	data: {
    		aid: uId
    	},
    	success:function(data){
    		for(var j=0;j<data.length;j++){
				 $("#iform").find('input,select,textarea').each(function(i,item){
			        var $DomId = $(item).attr("id");
			        if(data[j][$DomId]!=undefined){
			            $("#"+$DomId).val(data[j][$DomId]);
			        }
			    });
				param['AreaId']=data[j].AreaId;
				param['AreaNo']=data[j].AreaNo;
			}
    	},error:function(error){
    		$.errorFun("获取失败，请稍后重试");
    	}
    });
    //修改点击事件
    $("#update").unbind("click").click(function() {
    	$('#iform').bootstrapValidator('validate');
    	var params = $("#iform").serializeArray();
    	for(var item in params){
            param[params[item].name] = params[item].value;
        }
        param.ParentId=$("#ParentId").val();
        ajax({
        	url:"uarea",
        	type:"POST",
        	data:param,
        	success:function(data){
        		ReturnAjax({
	    			data:data,
	    			reload:true
	    		});
        	},
        	error:function(error){
        		$.errorFun("修改失败，请稍后重试");
        	}
        });
	    return false;
    })
}