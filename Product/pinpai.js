var _Obj = {},
CustomArray;  //获取产品子信息

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
            BrandName : {
                validators : {
                    notEmpty : {
                        message : '品牌名称为必填项'
                    }
                }
            },
            // These fields will be validated when being visible
            Status : {
                validators : {
                    notEmpty : {
                        message : '品牌规格为必填项'
                    }
                }
            }
        }
    })//表单验证end
}
//获取修改数据填到表单
function updateRow(trId,uId) {
    formValidator();
    reset('#iform,#StylesTbody');//清空表单
    $("#click-title").html("修改大类");
    $("#update").show();
    $("#add").hide();
    $("#wid-id-form").slideDown(300);
    $("#BrandNo").attr("disabled",true);
    var Top_tr = $("#" + trId).children("td:not(:last)");
    var updateJson = [];
    $(Top_tr).each(function (i, o) {
        updateJson.push($(this).html());
    })
    console.log(_Obj[trId-1]);
    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);
    });
    if(_Obj[trId-1].Custom){
        var CustomData = JSON.parse(_Obj[trId-1].Custom),
            CustomItem = CustomData.settings.item;   
        if(CustomData && CustomItem.length > 1){
            CustomItem.map(function(index, elem) {
                $("#"+index.key).val(index.value);
            })
        }else{
            $("#"+CustomItem.key).val(CustomItem.value); 
        }
    }
    //修改品牌
	$("#update").unbind("click").click(function() {
    	var options = decodeURIComponent($("#iform").serialize(),true);
    	var params = $("#iform").serializeArray();
    	var values = {};
        values.BrandId = uId;
        values.BrandNo = _Obj[trId-1].BrandNo;
        for(var item in params)
        {
            values[params[item].name] = params[item].value;
        }
        
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
    	
    	ajax({
			type:"POST",
			url:"ubrand",
			data:values,
			success: function(data){
                if(data.Status){
                    $("#wid-id-form").slideUp(300);
                    ReturnAjax({data:data});
                }else{
                    $.errorFun("修改信息失败，请稍后尝试！");
                }
			},
			error: function(message){
				$.errorFun("修改失败，请稍后重试");  
			}
		});
		return false;
	});

}
//删除数据
function delRow(trId,uNo) {
    $.delFun("dbrand","BrandNo",uNo);//1：接口名称  2：参数名称  3：参数值
}



$(function(){
    GetStylesDom('Brand-Type');
    var jQGridData = GetHeaders();
    GlobaljqGrid('#jqgrid',{
        url: 'brand/',
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
                var status = datalist[item].Status;
                status == 0?status='<span class="label label-default">已禁用</span>':status='<span class="label label-success">已启用</span>';
                jQuery("#jqgrid").jqGrid('setRowData', ids[item], {
                    Status: status
                });
            }
            for (var i = 0; i < ids.length; i++) {
                var cl = ids[i];
                
                se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + datalist[i].BrandId + "');\"><i class='fa fa-pencil'></i></button>";
                ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + datalist[i].BrandNo + "');\"><i class='fa  fa-trash-o'></i></button>";
                jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
                    act: se + ca
                });
            }
        }
    })

    $("#search-div").click(function(event) {
        var searchVal = $("#search-html").val(),
        path = _path+"brandvague/?v="+searchVal;
        jQuery("#jqgrid").jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
    });
	//添加品牌
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
        	var options = decodeURIComponent($("#iform").serialize(),true);
        	var params = $("#iform").serializeArray();
        	var values = {};
            for(var item in params)
            {
                values[params[item].name] = params[item].value;
            }

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
            
        	
        	ajax({
    			type:"POST",
    			url:"cbrand",
    			data:values,
    			success: function(data){
                    if(data.Status){
                        $("#wid-id-form").slideUp(300);
                        ReturnAjax({data:data});
                    }else{
                        $.errorFun("编号或编码重复，请确认信息后添加！");
                    }
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
		$("#add").show();
		$("#update").hide();
        $("#click-title").html("添加大类");
        $("#wid-id-form").slideDown(300);
        reset('#iform,#StylesTbody');//清空表单
        formValidator();
        $("#BrandNo").attr("disabled",false);
        return false;
    });

})

function iformclose(){
    $('#wid-id-form').slideToggle(300);
    return false;
}