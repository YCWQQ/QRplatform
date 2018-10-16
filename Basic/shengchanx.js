//-----------------------------公共控件-------------------------------
var datas = [], sceneList = {},jQGridData = {};
//生产线渲染
function scx_table() {
	ajax({
		url:"scene",
		success:function(data){
			data.shift();
			sceneList = data;
			var html='<option value="0">顶级</option>';
			$.each(data,function(item, val) {
				if(data[item].Value==null && data[item].Value==undefined){
					data[item].Value='';
				}
				if(data[item].Number==null && data[item].Number==undefined){
					data[item].Number=0;
				}
				html+='<option data-id="'+data[item].Id+'" value="'+data[item].Id+'">'+data[item].Fill+data[item].Name+data[item].Value+'</option>';
			});
		 	$("#ParentId").html(html);
		},
		error:function(error){
			$.errorFun("获取生产场景失败，请重新加载页面");
		}
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
			SceneNo : {
				validators : {
					notEmpty : {
						message : '生产线编号为必填项'
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
						message : '生产线名称为必填项'
					}
				}
			},
			SceneCode : {
				validators : {
					notEmpty : {
						message : '生产线Code编号为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
				}
			},
			// These fields will be validated when being visible
		}
	})//表单验证end
}

//修改信息
function updateRow(uId) {
	$('#SceneNo').attr("disabled",true);
	formValidator();
    $("#click-title").html("修改生产场景");
	$("#wid-id-form").slideDown(500);
    $("#update").show();
    $("#add").hide();
    $.optionFalse('ParentId',uId);//select 不可选当前
    reset('#iform,#StylesTbody');//清空表单
    var param = {};

    ajax({
    	url:"scene_check/",
    	data:{id: uId},
    	success:function(data){
    		for(var j=0;j<data.length;j++){
				$("#iform").find('input,select,textarea').each(function(i,item){
			        var $DomId = $(item).attr("id");
			        if(data[j][$DomId]!=undefined){
			            $("#"+$DomId).val(data[j][$DomId]);
			        }
			    });
				param['SceneId']=data[j].SceneId;
				param['SceneNo']=data[j].SceneNo;
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
			}
    	},
    	error:function(error){
    		$.errorFun("获取失败，请稍后重试");
    	}
    })

    $("#update").unbind("click").click(function() {	
    	var params = $("#iform").serializeArray();
    	for(var item in params)
    	{
    		param[params[item].name] = params[item].value;
    	}
    	var Custom = setStyles('#StylesTbody');
        if(Custom){
            if(Custom.Custom.length >= 1){
                param.Custom = JSON.stringify(Custom.Custom);
            }else{
                param.Custom = '';
            }
        }else{
            return Custom;
        }
    	ajax({
	    	url: "uscene",
	    	type: "POST",
	    	data: param,
	    	success:function(data){
	    		ReturnAjax({
					data:data,
					reload:true
				});
			},
			error: function(message){
				$.errorFun("修改失败，请稍后重试");
			}
	    })
	    return false;
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
		(valMap.split(',')).length==1?$.delFun("dscene","SceneNo",uNo,F5,"是否删除",true)
		:$.delFun("dscene","SceneNo",valMap,F5,"此场景下有子场景是否全部删除",true);
	}
}

function getStore(){
	let $dom = $('#StoreOption'), optionData,optionDom = '<option value="">未配置</option>';
	ajax({
		url: 'get-position-last',
		type: 'GET',
		dataType: 'JSON',
		success: function(data){
			optionData = data;
			if(optionData.length > 0){
				optionData.map(function(index, elem) {
					optionDom += `<option value="${index.SceneNo}">${index.SceneName}</option>`;
				})
				$dom.html(optionDom);
			}
		}
	});
}

function editStore(Info,uNo){
	$('#StoreOption').val('');
	if(Info){
		$('#StoreOption').val(Info);
	}
    $("#dialog-Store").dialog({
        autoOpen: false,
        modal: true,
        width: 300,
        height: 200,
        buttons : [{
            html : "<i class='fa fa-save'></i>&nbsp; 保存",
            "class" : "btn btn-primary",
                click : function() {
                	var $dialog = $(this);
                	var val = $("#StoreOption").val();
                	
                    ajax({
                        url:'upt_scene_position',
                        type: 'POST',
                        data: {
                           SceneNo: uNo,
                           StoreSceneNo: val
                        },
                        success: function(data){
                            if(data.Status == 1){
                            	$dialog.dialog("close");
                            	scx_table();
                            	SetTableTree();
                            }else{
                            	$.errorFun('配置默认库位失败！');
                            }
                        },
                        error: function(){
                            $.errorFun("配置默认库位失败！请稍后重试");
                        }
                    })
                }
            }, 
            {
                html : "<i class='fa fa-times'></i>&nbsp; 关闭",
                "class" : "btn btn-danger",
                click : function() {
                    $(this).dialog("close");
                },
            }]
    }); 
    $('#dialog-Store').dialog('open');
}

function SetTableTree(){
	if(sceneList){
		datas = [];
		$(sceneList).each(function (i) {
			var Custom = '',CustomVal = '';
			if(sceneList[i].Custom){
				Custom = JSON.parse(sceneList[i].Custom).settings.item;
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
        	datas.push({
        		AreaId:sceneList[i].Id,
        		ParentId:sceneList[i].ParentId,
        		AreaNo:sceneList[i].Number,
        		SceneNo:sceneList[i].Number,
        		SceneName:sceneList[i].Value,
        		Info:sceneList[i].Info,
        		Custom:CustomVal,
        		Remark:sceneList[i].Remark
        	});                       
        })  
        TableTree(datas);
        
	}else{
		$.errorFun('产线信息为空，请刷新页面重试');
	}
}


function TableTree(data){
	jQGridData = GetHeaders(false);
	var jQThead = jQGridData.colModel.map(function(v) {return v.index});

	new table_Tree({
	    tableId: 'example-basic-expandable',
	    thead:jQGridData.colNames,
	    tbodydata: jQThead,
	    data: fn(data,0),
	    addType: 1
	});
}

$(function(){
	scx_table();
	qxC();//权限控制
	GetStylesDom('ProduceScene-Type');
	getStore();
	SetTableTree();

	//搜索
	$("#search-div").click(function(event) {
		var searchVal = $("#search-html").val();
		ajax({
			url: 'scene-vague/',
			data: {v: searchVal},
			success: function(data){
				if(data){
					let vague = [];
	        		$(data).each(function (i) {
	        			if(data[i].ParentId >= 0){
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
		            	}
		            })
		            TableTree(vague);
	        	}else{
	        		$.errorFun('产线信息为空，请刷新页面重试');
	        	}
			}
		})
	});

	//Tree容器高度
    $("#diqu-fixed,#diqu-tree").height($(window).height()-161);
    $("#lv-form").height($(window).height()-161);
    
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
	    	ajax({
				type:"POST",
				url:"cscene",
				data:values,
				success: function(data){
					ReturnAjax({
						data:data,
						reload:true
					})
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
	$('#modal_link').click(function () {
	    $("#click-title").html("添加生产场景");
	    $("#wid-id-form").slideDown(300)
	    $("#add").show();
	    $("#update").hide();
	    reset('#iform,#StylesTbody');//清空表单
	    formValidator();
	    $.optionClear('ParentId');
	    $('#SceneNo').attr("disabled",false);
	    return false;
	});
	
	
	$("#dialog-messagename").dialog({
	    autoOpen: false,
	    modal: true,
	    width: 550,
	    height: 180,
	});
})

function iformclose(){
	$('#wid-id-form').slideToggle(1000);
	return false;
}