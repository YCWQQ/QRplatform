var _Obj = {};
var vague = [];

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
			MergeName : {
				validators : {
					notEmpty : {
						message : '垛名称为必填项'
					}
				}
			},
			Qty : {
				validators : {
					notEmpty : {
						message : '跺数量为必填项'
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

Tile('ProductNos',{//产品智能搜索
    url: 'pro-vague',
    field: 'v',
    dataNo: 'ProductNo',
    dataName: 'ProductName'
},true);

Tile('ParentName',{//箱跺智能搜索
    url: 'get-meger-vague/',
    field: 'v',
    dataNo: 'Id',
    dataName: 'MergeName',
    GetValId: 'ParentId'
});

//所属箱跺
function mergerSelect(){
	var $dom = $('#ParentId'),option = '<option value="0">顶级</option>';
	ajax({
		url: 'get-meger-tree',
		type: 'GET',
		dataType: 'json',
		data: {},
		success: function(data){
			if(data.length > 1){
				data.shift();
			}
			$.each(data,function(item, val) {
				if(data[item].Value==null && data[item].Value==undefined){
					data[item].Value='';
				}
				if(data[item].Number==null && data[item].Number==undefined){
					data[item].Number=0;
				}
				option+='<option data-id="'+data[item].Id+'" value="'+data[item].Id+'">'+data[item].Fill+data[item].Name+data[item].Value+'</option>';
			});
			$dom.html(option);
		},
		error: function(error){
			$.errorFun('获取箱跺树形列表失败');
		}
	});
	
	
}
//修改数据
function updateRow(uId) {
	$("#click-title").html("修改箱跺");
	$('#PNos').empty();
	$('#MergeNo').attr("disabled",true);
	formValidator();
    reset('#iform,#StylesTbody');//清空表单
    $("#wid-id-form").slideDown(500);
    $("#update").show();
    $("#add").hide();

    $.optionFalse('ParentId',uId);//select 不可选当前
    var dataObj = {};
    ajax({
    	url:"area_meger/",
    	data: {
    		MId: uId
    	},
    	success:function(data){
    		for(var j=0;j<data.length;j++){
				 $("#iform").find('input,select,textarea').each(function(i,item){
			        var $DomId = $(item).attr("id");
			        if(data[j][$DomId]!=undefined){
			            $("#"+$DomId).val(data[j][$DomId]);
			        }
			    });
				if(data[j].Custom){
			        var CustomData = JSON.parse(data[j].Custom),
			            CustomItem = CustomData.settings.item;   
			        if(CustomData && CustomItem.length > 1){
			            CustomItem.map(function(index, elem) {
			                $("#"+index.key).val(index.value);
			            })
			        }else{
			            $("#"+CustomItem.key).val(CustomItem.value); 
			        }
			    }
				dataObj['MergeNo']=data[j].MergeNo;
			}
			
    	},error:function(error){
    		$.errorFun("获取失败，请稍后重试");
    	}
    });

    dataObj.Id = uId;
    
    $("#update").unbind("click").click(function() {

    	$("#iform").find("input,select,textarea").each(function(i,item){
	        dataObj[$(this).attr('id')] = $(this).val();
	    });
    	var Custom = setStyles('#StylesTbody');            
        if(Custom){
            if(Custom.Custom.length >= 1){
                dataObj.Custom = JSON.stringify(Custom.Custom);
            }else{
                dataObj.Custom = '';
            }
        }else{
            return Custom;
        }
        dataObj.ParentId = dataObj.ParentId == '' ? 0 : dataObj.ParentId;
        if(dataObj.Id == dataObj.ParentId){
        	$.errorFun('不能选择自己作为所属箱跺');
        	return false;
        }
	    ajax({
			type:"POST",
			url:"upt-meger",
			data:dataObj,
			success: function(data){
				if(data.Status > 0){
					$("#wid-id-form").slideUp(500);
					$('#treedivProductNos').hide();
					ReturnAjax({
		    			data:data,
		    			reload:true
	    		    });
				}else{
					$.errorFun(data.Value);
				}
			},
			error: function(message){
				$.errorFun("修改失败，请稍后重试");
			}
		});
		return false;
	})

}


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
//删除信息
function delRow(uId,uNo) {
	var valMap=uNo;
	if(uId){
		valMap+=fnChild(vague,uId);
		(valMap.split(',')).length==1?$.delFun("del-meger","MergeNo",uNo,F5):$.delFun("del-meger","MergeNo",valMap,F5,"此箱垛下有子箱垛是否全部删除",true);
	}
}


//
function AddPNos(no,name,dom){
	var $dom = $('#PNos');
	$dom.append(' <a title="点击移除" onclick=DelPNos(this) class="btn btn-default" data-no="'+no+'"><i class="fa fa-remove"></i> '+name+'</a> ');
	$('#ProductNos').val(no);
	$('#'+ dom).html('').hide();
}

function DelPNos(self){
	$(self).remove();
}


function TableTree(data){
	jQGridData = GetHeaders(false);
	var jQThead = jQGridData.colModel.map(function(v) {return v.index});

	new table_Tree({
	    tableId: 'example-basic-expandable',
	    thead:jQGridData.colNames,
	    tbodydata: jQThead,
	    data: fn(data,0)
	});
}

$(function(){
	GetStylesDom('Merge-Type');
    GetHeaders();
	ajax({
		url:'get-meger',
		datatype:'json',
		type:'get',
		success: function(data){
			if(data['rows']){
					var data=data['rows'];
	        		$(data).each(function (i) {
		            	vague.push({AreaId:data[i].Id,
		            		ParentId:data[i].ParentId,
		            		AreaName:data[i].MergeName,
		            		AreaNo:data[i].MergeNo,
		            		MergeNo:data[i].MergeNo,
		            		MergeName:data[i].MergeName,
		            		Qty:data[i].Qty||"",
		            		ParentName:data[i].ParentName||"",
		            		Rules:data[i].Rules||"",
		            		Remark:data[i].Remark||""
		            	});                       
		            })
		            
		            TableTree(vague);
			}
		},
		error:function(){
			$.errorFun('信息为空，请刷新页面重试');
		}
	})
	//搜索
	$("#search-div").click(function(event) {
		var searchVal = $("#search-html").val();
		ajax({
			url: 'getList-meger-vague/',
			data: {v: searchVal},
			success: function(data){
				if(data){
					let vague = [];
	        		$(data).each(function (i) {
		            	vague.push({AreaId:data[i].Id,
		            		ParentId:data[i].ParentId,
		            		AreaName:data[i].MergeName,
		            		AreaNo:data[i].MergeNo,
		            		MergeNo:data[i].MergeNo,
		            		MergeName:data[i].MergeName,
		            		Qty:data[i].Qty||"",
		            		ParentName:data[i].ParentName||"",
		            		Rules:data[i].Rules||"",
		            		Remark:data[i].Remark||""
		            	});     
		            })
		            TableTree(vague);
		           
	        	}else{
	        		$.errorFun('信息为空，请刷新页面重试');
	        	}
			}
		})
    });

	//添加垛
	$("#add").click(function() {
		formValidator();  
		$('#iform').bootstrapValidator('validate');
		if($("#iform").data('bootstrapValidator').isValid()){
			var options = decodeURIComponent($("#iform").serialize(),true);
        	var params = $("#iform").serializeArray();
        	var values = {};
            var Custom = setStyles('#StylesTbody');
        	for(var item in params)
        	{
        		values[params[item].name] = params[item].value;
        	}
            if(Custom){
	            if(Custom.Custom.length >= 1){
	                values.Custom = JSON.stringify(Custom.Custom);
	            }else{
	                values.Custom = '';
	            }
	        }else{
	            return Custom;
	        }
	        values.ParentId = values.ParentId == '' ? 0 : values.ParentId;
	    	ajax({
				type:"POST",
				url:"add-meger",
				data:values,
				success: function(data){
					$("#wid-id-form").slideUp(500);
					$('#treedivProductNos').hide();
					ReturnAjax({
	    			  data:data,
	    			  reload:true
	    		    });
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
		$('#PNos').empty();
	    $("#click-title").html("添加箱跺");
	    $("#wid-id-form").slideDown(500);
	    $("#add").show();
	    $("#update").hide(); 
	    reset('#iform,#StylesTbody');//清空表单
	    formValidator();
	    $('#MergeNo').attr("disabled",false);
	});
	
	if(IsPC()){
		$("#dialog-message").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 650,
		    height: 560,
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
function iformclose(){
	$('#wid-id-form').slideToggle(1000);
	return false;
}