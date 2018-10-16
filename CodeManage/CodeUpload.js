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
			file: {
                validators: {
                    notEmpty: {
                        message: '上传文件不能为空'
                    },
                    file: {
                        extension: 'txt',
                        message: '请重新选择后缀为txt的编码文件'
                    }
                }
            }
        
			// These fields will be validated when being visible
		}
	}).on('success.form.bv', function (e) { //点击提交验证通过之后
        e.preventDefault();
        $('[type="submit"]').removeAttr("disabled");
        //TODO
    }).on('error.form.bv', function (e) { //点击提交验证失败之后
        $('[type="submit"]').removeAttr("disabled");
    });//表单验证end
}

//文件上传
const BYTES_PER_CHUNK = 1024 * 1024; // 每个文件切片大小定为1MB .
var slices;
var totalSlices;

$(function(){
	GetScene();
	GetPermit();
	GetTeam();
	formValidator();
	iTime('#QcTime');
	$('#CodeUpload').unbind("click").click(function() {
		$('#iform').bootstrapValidator('validate');
		if ($("#iform").data('bootstrapValidator').isValid()) {
			$('#progress').show();
			var blob = document.getElementById('file').files[0]; //file流      
	        var start = 0;
	        var end;
	        var index = 0;
	        if(blob){
	            // 计算文件切片总数
	            slices = Math.ceil(blob.size / BYTES_PER_CHUNK); //切割多少次
	            totalSlices= slices; //总切割次数
	  
	            while(start < blob.size) {
	                end = start + BYTES_PER_CHUNK; //切片位置
	                if(end > blob.size) { //判断是否完结
	                    end = blob.size;
	                }
		                 
	                uploadFile(blob, index, start, end);             

	                start = end;//记录切割位置
	                index++;
				}
			}else{
				$.errorFun("请选择需要上传的文件！");
			}
		}else{
			$.errorFun("信息请填写完整");
		}
		return false;
	})
})

//上传文件
function uploadFile(blob, index, start, end) { //文件流，第几个，从哪里开始，从哪里结束
	var ProductNo = $('#ProductNoGet').val();
	var SceneNo = $('#SceneNo').val();
	var TeamNo = $('#TeamNo').val();
	var PermitNo = $('#PermitNo').val();
	var BatchNo = $('#BatchNo').val();
	var QcTime = $('#QcTime').val();
    var fd;
    var chunk;

    //进度条
     var progress=100/totalSlices;
         progress=(index+1)*progress+'%';
        $("#progress_text").text(progress);
        $('#progress_div').css('width',progress);   

         
    chunk =blob.slice(start,end);//切割文件
  
    //构造form数据
    fd = new FormData();
    fd.append("file", chunk);
    fd.append("name", blob.name);
    fd.append("index", index);

   	$.ajax({
   	  	 //url:"http://172.26.153.222:9091/mms/uploadFileNumber/?orderNo="+billcode+"&sum="+totalSlices,
         url:_path+"upload-file-produce/?pno="+ProductNo+"&sno="+SceneNo+"&tno="+TeamNo+"&permitno="+PermitNo+"&bno="+BatchNo+"&sum="+totalSlices+"&QcTime="+QcTime,
         type: "POST",
         data: fd,
     	 async: false,
         cache: false,
         processData: false,  
         contentType: false,  
         beforeSend: function(res){
            res.setRequestHeader('Token',dataList.Key);	         		        
         }, 
         success: function(data){
             if(data.Status=='1'){
             	    slices--;
             	    if(slices == 0) {
             	    	$("#progress_text").text('100%');
                        $('#progress_div').css('width','100%');
                        setTimeout(function(){                                   
                        	$('#progress').hide();
                    	    F5();
                        },700);                     	    	                     
                    }
             }else{
             	$.errorFun(data.Value);
             }
            
         },
         error:function(){
            $.errorFun("上传错误！");
         }
    });
}