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
			LableNo : {
				validators : {
					notEmpty : {
						message : '标签编号为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
				}
			},
			LableName : {
				validators : {
					notEmpty : {
						message : '标签名称为必填项'
					}
				}
			},
			Qty : {
				validators : {
					notEmpty : {
						message : '标签数量'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[0-9]+$/,
                        message: '只能是数字和字母'
                    }
				}
			}
		}
	})//表单验证end
}
//修改数据
function updateRow(trId,uId) {
	$('#PNos').empty();
	PNosLabels = [];
	PNosLabelsIndex = 0;
	formValidator();
    reset();
    $("#ui-id-4").html("修改标签");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();

    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);
    });
    var dataObj = {};
    dataObj.LableId = uId;
    if(_Obj[trId-1].ProductNos && _Obj[trId-1].ProductName){
	    var PNos = _Obj[trId-1].ProductNos.split(','),
	    PNames = _Obj[trId-1].ProductName.split(',');

	    $.each(PNos,function(index, el) {
	    	PNosLabels.push(el);
	    	$('#PNos').append(' <a title="点击移除" onclick=DelPNos(this,"'+el+'") class="btn btn-default" data-no="'+el+'"><i class="fa fa-remove"></i> '+PNames[index]+'</a> ');
	    	PNosLabelsIndex++;
	    });
	}
    $("#update").unbind("click").click(function() {
    	$("#iform").find("input,select,textarea").each(function(i,item){
	        dataObj[$(this).attr('id')] = $(this).val();
	    });
	    dataObj.ProductNos = PNosLabels.join(',');
	    ajax({
			type:"POST",
			url:"upt-lable",
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

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

//删除数据
function delRow(trId,uId) {
	$.delFun("del-lable","LableId",uId);//1：接口名称  2：参数名称  3：参数值
}

var PNosLabels = [];
var PNosLabelsIndex = 0;
//
function AddPNos(no,name,dom){
	if(PNosLabels.indexOf(no) > -1){
		$.errorFun('已添加过该产品');
	}else{
		PNosLabels.push(no);
		var $dom = $('#PNos');
		$dom.append(' <a title="点击移除" onclick=DelPNos(this,"'+no+'") class="btn btn-default" data-no="'+no+'"><i class="fa fa-remove"></i> '+name+'</a> ');
		$('#ProductNos').val(PNosLabels.join(','));
		$('#'+ dom).html('').hide();
		PNosLabelsIndex++;
	}	
}

function DelPNos(self,no){
	$(self).remove();
	PNosLabels.remove(no);
	PNosLabelsIndex--;
	console.log(PNosLabels);
	$('#ProductNos').val(PNosLabels.join(','));
}

//图片上传及显示
var cpId="",
    output = document.getElementById('output');
function imgRow(trId,uId){
	console.log(_Obj[trId-1]);
	var picUrl = _Obj[trId-1].LableUrl;
    $('#wid-id-form').slideUp(100);
	setTimeout(function(){
		$("#upImg").hide();
		cpId=uId;
		$('#dialog-img').dialog('open');
		if(picUrl){
			output.src=picUrl;
		}else{
			output.src = ''
		}
	},200);
}

var IMGsum=2;  //最多放多少张图片
var ImgNum=0;  //图片总数
var openFile = function(event) {
    var input = event.target;
    var param=$("#file")[0].files[0];    
    var ImgName=param.name||"",
        ImgType=param.type||"",
        ImgSize=param.size||"";

    if(ImgType.slice(0,5)!=='image'){
        $.errorFun("错误的文件类型！");
        return false;
    }
    if(ImgType!=='image/bmp'&&ImgType!=='image/jpg'&&ImgType!=='image/jpeg'&&ImgType!=='image/png'){
        $.errorFun("错误的图片类型！");
        return false;

    }
    if(ImgSize>1024*1024*2){
        alert("图片大小超过2M！");
        return false;
    }

    var reader = new FileReader();
    reader.onload = function(){
	    var dataURL = reader.result,fd = new FormData();

            fd.append("file", param); //文件流
            fd.append("name", ImgName); //文件名字
            fd.append("type", ImgType.slice(6,ImgType.length)); //文件类型

	    	output.src=dataURL;
	    	$("#upImg").show();

	    	$("#upImg").unbind("click").click(function(){
	    		console.log(fd)
	    		$.ajax({
			      	url:_path+"inport-picture-lable/?no="+cpId+"&name="+("."+ImgType.slice(6,ImgType.length)),
			      	type:"POST",
			        data: fd,
			      	async: false,
		            cache: false,
		            contentType: false,
		            processData: false,  
			      	beforeSend:function(res){
			            res.setRequestHeader('Token',dataList.Key)
			        },
			      	success:function(data){
			      		if(data.Status=="-1"){
			      			alert("图片已存在,请重新上传!");
			      			return false;
			      		}else if(data.Status==0){
			      			alert('文件不存在！')
			      			return false;
			      		}else if(data.Status==1){
			      			alert("上传成功！");
			      			$("#upImg").hide();
	                        return false;
			      		}else{
			      			alert('上传出错！')
			      			return false;
			      		}
						
					},
					error: function(message){
						alert("上传失败，请稍后尝试");
					}
		      });
	    		return false;
	    	});
    };
    reader.readAsDataURL(input.files[0]);
  };

$(function(){

	Tile('ProductNos',{//产品智能搜索
	    url: 'pro-vague',
	    field: 'v',
	    dataNo: 'ProductNo',
	    dataName: 'ProductName'
	},true);

	var jQGridData = GetHeaders();
	GlobaljqGrid('#jqgrid',{
	    url: 'get-lable-list/?v=',
	    pageDom: '#pjqgrid',
	    colNames: jQGridData.colNames,
	    colModel: jQGridData.colModel,
	    gridComplete: function (data) {
	        qxC();
	    },
	    loadComplete: function (data) {
	        _Obj = data.rows;
		    var ids = jQuery("#jqgrid").jqGrid('getDataIDs');
			for (var i = 0; i < ids.length; i++) {
				var cl = ids[i];
				var CrTime = timeMat(data.rows[i].CreateTime);
				var Tag = data.rows[i].Tag;
				if(Tag == 1){
					Tag = '常规混标';
				}else if(Tag == 2){
					Tag = '双联袋标签';
				}else{
					Tag = '';
				}
				var im = "<button class='btn btn-xs btn-default' data-qx='修改' title='图片详情' data-original-title='Cancel' onclick=\"imgRow('" + cl + "','" + data.rows[i].LableNo + "');\"><i class='fa fa-picture-o'></i></button>",
				se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].LableId + "');\"><i class='fa fa-pencil'></i></button>",
				ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].LableId + "');\"><i class='fa  fa-trash-o'></i></button>";
				jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
					act: se + ca + im,
					CreateTime: CrTime,
					Tag: Tag
				});
			}
	    }
	})

	$("#search-div").click(function(event) {
        var searchVal = $("#search-html").val(),
        path = _path+"get-lable-list/?v="+searchVal;
        jQuery("#jqgrid").jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
    });

	//添加
	$("#add").click(function() {
		var iflag = true;
		$('#iform').find('input:not(.noNull),select').each(function(index, el) {
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
	    	values.ProductNos = PNosLabels.join(',');
	    	console.log(PNosLabels.join(','))
	    	ajax({
				type:"POST",
				url:"add-lable",
				data:values,
				success: function(data){
					ReturnAjax({data:data});
					PNosLabels = [];
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
	$('#addImg').click(function(){
    	$('#file').click();
    	return false;
    })
	$('#modal_link').click(function () {//点击显示弹出框
	    $("#ui-id-4").html("添加标签");
	    $('#dialog-message').dialog('open');
	    $("#add").show();
	    $("#update").hide(); 
	    reset();//清空表单
	    formValidator();
	    $('#PNos').empty();
		PNosLabels = [];
		PNosLabelsIndex = 0;
	    return false;
	});
	
	if(IsPC()){
		$("#dialog-message").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 600,
		    height: 500,
		});
		$("#dialog-img").dialog({
			autoOpen: false,
		    modal: true,
		    width: 800,
		    height: 550,
		})
	}else{
		$("#dialog-message").dialog({  //弹框
			autoOpen: false,
			modal: true,
			width: 'auto',
			height: 'auto',
		});
	}
})
