var datas=[];
$(function(){
	AreaNo();
	qxC();//权限控制
	getOrganization();

	//Tree容器高度
    $("#diqu-fixed,#diqu-tree").height($(window).height()-161);
    $("#lv-form").height($(window).height()-161);

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
	    	if(values.AreaNo==""||values.AreaNo==undefined){
	    		return false;
	    	}
	    	values.ParentId=$("#ParentId").val();
	    	ajax({
				type:"POST",
				url:"role/CreateArea",
				data:{
					AreaNo:values.AreaNo,
		            AreaName:values.AreaName,
		            ParentId:values.ParentId,
		            OrganizationNo:values.OrganizationNo,
		            Status:values.Status,
		            Remark:values.Remark
		        },
				success: function(data){
					ReturnAjax({data:data});
				},
				error: function(message){
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
	    reset();
		tab_yz();
		$.optionClear('ParentId');
		$('#AreaNo').attr("disabled",false);
		return false;
	});
	if(IsPC()){
		$("#dialog-message").dialog({  //弹框
			autoOpen: false,
			modal: true,
			width: 590,
			height: 480,
		});

		$("#dialog-messagedq").dialog({
		    autoOpen: false,
		    modal: true,
		    width: 550,
		    height: 180,
		});
	}else{
		$("#dialog-message").dialog({  //弹框
			autoOpen: false,
			modal: true,
			width: 'auto',
			height: 'auto',
		});

		$("#dialog-messagedq").dialog({
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

function fn(data,pid){
    var result = [] , temp;
    for(var i in data){  	
	        if(data[i].ParentId==pid){
	            result.push(data[i]);
	            temp = fn(data,data[i].AreaId);           
	            if(temp.length>0){
	                data[i].children=temp;              
	            }           
	        }      
    }
    return result;
}


function stie(obj, arr) {
    var str = "";
    (function insertNode (data) {
        if (data.length>0) {
            data.map(function (item) {
            	var updateBtn = "<a title='详细信息' onclick=updq_info('"+item.AreaId+"')  class='btn btn-default btn-circle'><i class='fa fa-pencil-square-o'></i></a>";
            	var deleteBtn = "<a title='删除场景' onclick=delDq('"+item.AreaId+"','"+item.AreaId+"')  class='btn btn-default btn-circle'><i class='fa fa-times txt-color-red'></i></a>";
                if (item.children) {
                    str += "<li data-no="+ item.AreaNo +"><span>"+
                        "<label>"+item.AreaName + "</label></span>"+updateBtn+deleteBtn+"<ul>";                
                    insertNode(item.children);
                    str += "</ul></li>";
                 
                } else {
                    str +="<li data-no="+ item.AreaNo +"><span>"+
                        "<label>"+item.AreaName + "</label></span>"+updateBtn+deleteBtn+"</li>"; 
                  
                }
            });
        }
    })(arr);
    $("#"+obj).empty().html(str);
};

//获取地区信息
function AreaNo(){
	ajax({
		url:'role/GetAreaOptions',
		success: function(data){
			var AreaNo = $("#ParentId");
			var html = '',tbody="";
			if(data){
        		$(data).each(function (i) {
        			if(i>0){
        				datas.push({AreaId:data[i].Id,ParentId:data[i].ParentId,AreaName:data[i].Value,AreaNo:data[i].Number});
        			}
	            	                       
	            })  
	            stie("areaTree",fn(datas,0));
        	}else{
        		$.errorFun('地区信息为空，请刷新页面重试');
        	}
			$.each(data,function(item, val) {
				if(data[item].Value==null && data[item].Value==undefined){
					data[item].Value='顶级';
				}
				if(data[item].Name==null && data[item].Name==undefined){
					data[item].Name='';
				}
				if(data[item].Number==null && data[item].Number==undefined){
					data[item].Number=0;
				}
				html+='<option data-id="'+data[item].Id+'" value="'+data[item].Id+'">'+data[item].Fill+data[item].Name+data[item].Value+'</option>';
			});
			AreaNo.empty().append(html);
		},
		error: function(error){
			$.errorFun("获取地区信息失败，请刷新页面重试！");
		}
	})
}
//删除信息
function delDq(uId,uNo) {
	var flag,valMap=uNo;
	if(uId){
		$.each(datas,function(index2, el2) {
			if(uId!=datas[index2].ParentId){
				flag = true;
			}else{
				flag = false;
				return false;
			}
		});
		if(flag){
			$.delFun("role/DelArea","AreaId",uNo,fnc,"是否删除",true);//1：接口名称  2：参数名称  3：参数值
		}else{
			$.delFun("role/DelArea","AreaId",uNo,fnc,"此地区下有子地区是否全部删除",true);//1：接口名称  2：参数名称  3：参数值
		}
	}
}

function fnc(){
	window.location.reload();
}

//修改地区
function updq_info(uId){
	$('#AreaNo').attr("disabled",true);
	tab_yz();
    $("#ui-id-3").html("修改地区");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();
    $.optionFalse('ParentId',uId);//select 不可选当前
    var param={};
    ajax({
    	url: "role/GetArea",
    	data: {
    		AreaId: uId,
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
		},
		error: function(message){
			$.errorFun("获取失败，请稍后重试");
		}
    })
    //修改点击事件
    $("#update").unbind("click").click(function() {
    	$('#iform').bootstrapValidator('validate');
    	 var params = $("#iform").serializeArray();
    	 for(var item in params){
            param[params[item].name] = params[item].value;
        }
        param.ParentId=$("#ParentId").val();
    	ajax({
	    	url: "role/UpdateArea",
	    	type: "POST",
	    	data: param,
	    	success:function(data){
				ReturnAjax({data:data});
			},
			error: function(message){
				$.errorFun("修改失败，请稍后重试");
			}
	    })
	    return false;
    })
}

function up_dq(name,pid){
 $('#dialog-messagedq').dialog('open');
 $("#AreaNamess").val(name);
	$("#up_dq").unbind("click").click(function(){
		ajax({
		    	url: "upt_area",
		    	type: "POST",
		    	data: {
		    		AreaId: pid,
		    		AreaName:$("#AreaNamess").val()
		    	},
		    	success:function(data){
		    		if(data.Status==1){
						F5();
						reset();
						$('#dialog-messagedq').dialog('close');	
					}	
				},
				error: function(message){
					$.errorFun("修改失败，请稍后重试");
				}
		  })
		 return false;
	 })
}

//获取企业信息
function getOrganization(){
    var $OrganizationNo = $("#OrganizationNo"),
    html = '<option value="0">请选择</option>';
    ajax({
        url: "role/getOrganization?OrganizationNo=",
        success: function(data){
            $.each(data,function(index, el) {
                html += '<option value="'+el.OrganizationNo+'">'+el.OrganizationName+'</option>';
            });
            $OrganizationNo.empty().append(html);
        },
        error: function(error){
            $.errorFun("获取企业信息失败请刷新页面重试");
        }
    });
}