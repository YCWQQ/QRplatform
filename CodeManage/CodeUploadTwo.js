Tile('ProductNo',{//产品智能搜索
    url: 'pro-vague/',
    field: 'v',
    dataNo: 'ProductNo',
    dataName: 'ProductName',
    GetValId: 'ProductNoGet'
});

function GetScene(){
	ajax({
		url: 'scene_all',
		type: 'GET',
		dataType: 'json',
		success: function(data){
			if(data){
				var $DOM = $('#SceneNo');
				data.forEach(function(index){
					$DOM.append(`<option value="${index.SceneNo}">${index.SceneName}</option>`)
				})
			}
		},
		error: function(error){
			$.errorFun('获取产线信息失败');
		}
	});
}

function GetPermit(){
	ajax({
		url: 'get-qc-permit',
		type: 'GET',
		dataType: 'json',
		success: function(data){
			if(data){
				var $DOM = $('#PermitNo');
				data.forEach(function(index){
					$DOM.append(`<option value="${index.EmployeeNo}">${index.EmployeeName}</option>`)
				})
			}
		},
		error: function(error){
			$.errorFun('获取质检人员信息失败');
		}
	});
}

function GetTeam(){
	ajax({
		url: 'team-option',
		type: 'GET',
		dataType: 'json',
		success: function(data){
			if(data){
				var $DOM = $('#TeamNo');
				data.forEach(function(index){
					$DOM.append(`<option value="${index.TeamNo}">${index.TeamName}</option>`)
				})
			}
		},
		error: function(error){
			$.errorFun('获取班组信息失败');
		}
	});
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
			ProductNo : {
				validators : {
					notEmpty : {
						message : '产品为必填项'
					}
				}
			},
			SceneNo : {
				validators : {
					notEmpty : {
						message : '生产场景为必选项'
					}
				}
			},
			TeamNo : {
				validators : {
					notEmpty : {
						message : '班组为必选项'
					}
				}
			},
			PermitNo : {
				validators : {
					notEmpty : {
						message : '质检人员为必选项'
					}
				}
			},
			BatchNo : {
				validators : {
					notEmpty : {
						message : '批次号为必填项'
					}
				}
			},
			QcTime : {
				validators : {
					notEmpty : {
						message : '质检时间为必填项'
					}
				}
			},
			beginNo : {
				validators : {
					notEmpty : {
						message : '起始编码为必填项'
					},
					numeric: {
					 	message: '起始编码只能输入数字'
					},
					stringLength: {
						min: 32,
					    max: 32,
					    message: '起始编码必须为32位'
					}
				}	
			},
			endNo : {
				validators : {
					notEmpty : {
						message : '结束编码为必填项'
					},
					numeric: {message: '结束编码只能输入数字'},
					stringLength: {
						min: 32,
					    max: 32,
					    message: '结束编码必须为32位'
					}
				}
			},
			pmTime : {
				validators : {
					notEmpty : {
						message : '生产时间为必填项'
					}
				}
			}
			
		}
	}).on('success.form.bv', function (e) { //点击提交验证通过之后
        e.preventDefault();
        $('[type="submit"]').removeAttr("disabled");
        //TODO
    }).on('error.form.bv', function (e) { //点击提交验证失败之后
        $('[type="submit"]').removeAttr("disabled");
    });//表单验证end
}

$(function(){
	GetScene();
	GetPermit();
	GetTeam();
	formValidator();
	iTime('#QcTime');
	iTime('#pmTime');
	Add();
})


function Add(){ 
	
	$("#add").unbind('click').click(function(){
		$('#iform').bootstrapValidator('validate');
		if($("#iform").data('bootstrapValidator').isValid()){
			var ProductNo = $('#ProductNoGet').val();
			var SceneNo = $('#SceneNo').val();
			var TeamNo = $('#TeamNo').val();
			var PermitNo = $('#PermitNo').val();
			var BatchNo = $('#BatchNo').val();
			var QcTime = $('#QcTime').val();
			var beginNo = $('#beginNo').val();
			var endNo = $('#endNo').val();
			var pmTime = $('#pmTime').val();
			$.ajax({
		         url:_path+"Inport-file-produce",
		         type:"POST",
		         dataType:"json",
		         data:{
		         	ProductNo:ProductNo,
		         	SceneNo:SceneNo,
		         	TeamNo:TeamNo,
		         	PermitNo:PermitNo,
		         	BatchNo:BatchNo,
		         	QcTime:QcTime,
		         	beginNo:beginNo,
		         	endNo:endNo,
		         	pmTime:pmTime
		         },
		         beforeSend: function(res){
		            res.setRequestHeader('Token',dataList.Key);	         		        
		         }, 
		         success: function(data){
		             if(data.Status=='1'){       	   
		             	    ReturnAjax({
			        			data:data,
			        			DiyFunction:function(){
									reset();		
			        			}
			        		});
		             }else{
		             	$.errorFun(data.Value);
		             }
		            
		         },
		         error:function(){
		         	$.errorFun("激活错误，请稍后重试");
		         }
		    });
	        return false;
		}else{
			$.errorFun('信息请填写完整');
			$('#iform').bootstrapValidator('validate');
			return false;
		}
	});	
}