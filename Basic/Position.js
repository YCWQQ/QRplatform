var _Obj = {},
datas = [],
jQGridData = {};
//表格渲染
function ajax_table() {
   ajax({
   	   url:'get-position',
   	   type:'GET',
   	   datatype:'json',
   	   success:function(data){
	   		if(data){
	   			_Obj = data;
	    		$(data).each(function (i) {
	    			var Custom = '',CustomVal = '';
					if(data[i].Custom){
						Custom = JSON.parse(data[i].Custom).settings.item;
						if(Custom.length>1){
							for(let i=0; i<Custom.length; i++){
								if(Custom[i].key == 'SimpleName'){
									CustomVal = Custom[i].value;
									//return false;
								}
							}
						}else{
							if(Custom.key == 'SimpleName'){
								CustomVal = Custom.value
							}
						}
					}
	            	datas.push({
	            		AreaId:data[i].SceneId,
            			ParentId:data[i].ParentId,
            			AreaName:data[i].SceneName,
            			AreaNo:data[i].SceneNo,
		        		SceneNo:data[i].SceneNo,
		        		SceneName:data[i].SceneName,
		        		Info:data[i].Info,
		        		Custom:CustomVal,
		        		Remark:data[i].Remark
	            	});                       
	            })

	            TableTree(datas);
	    	}else{
	    		$.errorFun('信息为空，请刷新页面重试');
	    	}
   	   },
   	   error:function(){
   	   	  $.errorFun('请刷新页面重试!');
   	   }
   })
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
			SceneNo : {
				validators : {
					notEmpty : {
						message : '区位编号为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
				}
			},
			SceneName : {
				validators : {
					notEmpty : {
						message : '区位名称为必填项'
					}
				}
			},
		}
	})//表单验证end
}

Tile('ProductNos',{//产品智能搜索
    url: 'pro-vague',
    field: 'v',
    dataNo: 'ProductNo',
    dataName: 'ProductName'
},true);


//仓库
function deptSelect(){
	ajax({
		url:'get-depot',
		type:'GET',
		dataType:"json",
		success:function(data){
			var html="<option value='0'>顶级</option>";
			data.map(item=>html+=`<option value="${item.DepotNo}">${item.DepotName}</option>`);
			$("#DepotNo").empty().append(html);
		},
		error:function(){
			$.errorFun('获取仓库列表失败');
		}
	});
}

//所属产品
function mergerSelect(){
	var $dom = $('#ParentId'),option = '';
	ajax({
		url: 'get-position-tree',
		type: 'GET',
		dataType: 'json',
		data: {},
		success: function(data){
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
			$.errorFun('获取区位树形列表失败');
		}
	});	
}
//修改数据
function updateRow(trId) {
	$('#PNos').empty();
	$('#SceneNo').attr("disabled",true);
	formValidator();
    reset('#iform,#StylesTbody');//清空表单
    $("#click-title").html("修改存储场景");
	$("#wid-id-form").slideDown(500);
	 mergerSelect();
    $("#update").show();
    $("#add").hide();


    var dataObj = {};
    ajax({
    	url: 'get-position-byid/',
    	type: 'GET',
    	dataType: 'json',
    	data: {id: trId},
    	success: function(data){
    		if(data){
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
				    $("#DefaultNo").prop('checked',data[j].DefaultNo==false||data[j].DefaultNo==undefined?false:true);
					dataObj['SceneId']=data[j].SceneId;
					dataObj['SceneNo']=data[j].SceneNo;
				}
    		}
    	}
    });
    

    $("#update").unbind("click").click(function() {
    	$("#iform").find("input,select,textarea").each(function(i,item){
	        dataObj[$(this).attr('id')] = $(this).val();
	    });
	    var PNoList = $('#PNos').find('a'),
    		PNosVal = '';
    	$.each(PNoList,function(index, el) {
    		PNosVal += $(this).attr('data-no')+',';
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
    	dataObj.DefaultNo = $("#DefaultNo").is(':checked')?'1':'0';
	    ajax({
			type:"POST",
			url:"upt_position",
			data:dataObj,
			success: function(data){
				ReturnAjax({
					data:data,
					reload:true
				});
			},
			error: function(message){
				$.errorFun("修改失败，请稍后重试");
			}
		});
		return false;
	})

}
//删除数据
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
	var flag,valMap=uNo;
	if(uId){
		valMap+=fnChild(datas,uId);
		(valMap.split(',')).length==1?flag = true:flag = false;
		if(flag){
			$.delFun("del_position","SceneNo",uNo,F5);//1：接口名称  2：参数名称  3：参数值
		}else{
			$.delFun("del_position","SceneNo",valMap,F5,"此场景下有子场景是否全部删除",true);//1：接口名称  2：参数名称  3：参数值
		}
	}
}

//
function AddPNos(no,name,dom){
	var $dom = $('#PNos');
	if(no!='undefined'&& name!='undefined'){
	  $dom.append(' <a title="点击移除" onclick=DelPNos(this) class="btn btn-default" data-no="'+no+'"><i class="fa fa-remove"></i> '+name+'</a> ');
	}
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
	ajax_table();
	qxC();
	GetStylesDom('StorageScene-Type');
	$("#search-div").click(function(event) {

        var searchVal = $("#search-html").val();
		ajax({
			url: 'get-position-vagueinfo/',
			data: {v: searchVal},
			success: function(data){
				if(data){
					let vague = [];
		        	$(data).each(function (i) {
		        		var Custom = '',CustomVal = '';
						if(data[i].Custom){
							Custom = JSON.parse(data[i].Custom).settings.item;
							if(Custom.length>1){
								for(let i=0; i<Custom.length; i++){
									if(Custom[i].key == 'SimpleName'){
										CustomVal = Custom[i].value;
										return false;
									}
								}
							}else{
								if(Custom.key == 'SimpleName'){
									CustomVal = Custom.value
								}
							}
						}
		            	vague.push({
		            		AreaId:data[i].SceneId,
							ParentId:data[i].ParentId,
							AreaName:data[i].SceneName,
							AreaNo:data[i].SceneNo,
							SceneNo:data[i].SceneNo,
							SceneName:data[i].SceneName,
							Info:data[i].Info,
							Custom:CustomVal,
							Remark:data[i].Remark
		            	});                       
		            })
		            TableTree(vague);
	        	}else{
	        		$.errorFun('产线信息为空，请刷新页面重试');
	        	}
			}
		})
       
    });

	//添加
	$("#add").click(function() {
		var iflag = true;
		$('#iform').find('input[type="text"],select').each(function(index, el) {
			if($(this).val()){
				iflag = true;
			}else{
				iflag = false;
				return false;
			}
		});
		if(iflag){
			formValidator();  
			$('#iform').bootstrapValidator('validate');
			var options = decodeURIComponent($("#iform").serialize(),true);
	    	var params = $("#iform").serializeArray();
	    	var values = {};

	    	var Custom = setStyles('#StylesTbody');
	    	if(Custom){
	            if(Custom.Custom.length >= 1){
	                values.Custom = JSON.stringify(Custom.Custom);
	            }else{
	                values.Custom = '';
	            }
	        }else{
	            return Custom;
	        }

	    	for(var item in params)
	    	{
	    		values[params[item].name] = params[item].value;
	    	}
	    	var PNoList = $('#PNos').find('a'),
	    		PNosVal = '';
	    	$.each(PNoList,function(index, el) {
	    		PNosVal += $(this).attr('data-no')+',';
	    	});
	    	values.ProductNos = PNosVal.substring(0,PNosVal.length-1);
	    	values.DefaultNo = $("#DefaultNo").is(':checked')?'1':'0';
	    	ajax({
				type:"POST",
				url:"add_position",
				data:values,
				success: function(data){
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
	    $("#click-title").html("添加存储场景");
	    $("#wid-id-form").slideToggle(1000);
	    mergerSelect();
	    $("#add").show();
	    $("#update").hide(); 
	    reset('#iform,#StylesTbody');//清空表单
	    formValidator();
	    $('#SceneNo').attr("disabled",false);
	});
	$("#dialog-message").dialog({//弹出框设置
	    autoOpen: false,
	    modal: true,
	    width: 650,
	    height: 560,
	});
	
})
function iformclose(){
	$('#treedivProductNos').hide();
	$('#wid-id-form').slideToggle(1000);
	return false;
}
