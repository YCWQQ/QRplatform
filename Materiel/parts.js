var _Obj={};
var CustomArray = [
		{type: 2, name: "Style", value: "Styles", must: 0}
	];
var StyleArray = [];
//表格渲染
function ajax_table() {
	var searchVal = $("#search-html").val();
	jQuery("#jqgrid").jqGrid({
		//data: jqgrid_data,
	    url: _path+"Materiel/get-pars/",
	    datatype: "json",
	    mtype: 'get',
		multiselect: false,//多选框禁用
		autowidth: true,
		height: 'auto',
		search: true,
		rowNum: 10,
		rowList: [10, 20, 50],
		pager: '#pjqgrid',
		sortname: 'ParsNo',
		viewrecords: true,
		sortorder: "desc",
	    jsonReader : {  
	        root: "rows",
	        page: "page",
	        total: "total",
	        records: "records",
	        repeatitems: true,
	    },
	    prmNames : {
			page:"Index", // 表示请求页码的参数名称
			rows:"Size", // 表示请求行数的参数名称
			sort: null, // 表示用于排序的列名的参数名称
			order: null, // 表示采用的排序方式的参数名称
			search:null, // 表示是否是搜索请求的参数名称
			nd:null, // 表示已经发送请求的次数的参数名称
			id:"id", // 表示当在编辑数据模块中发送数据时，使用的id的名称
			oper:"oper", // operation参数名称
			editoper:"edit", // 当在edit模式中提交数据时，操作的名称
			addoper:"add", // 当在add模式中提交数据时，操作的名称
			deloper:"del", // 当在delete模式中提交数据时，操作的名称
			subgridid:"id", // 当点击以载入数据到子表时，传递的数据名称
			npage: null,
			totalrows:"totalrows" // 表示需从Server得到总共多少行数据的参数名称，参见jqGrid选项中的rowTotal
		},
		colNames: ['部件编号', '部件代码', '部件名称','款式','颜色','备注','创建时间', '操作'],
        colModel: [{
            name: 'ParsNo',
            index: 'ParsNo',
            align:'center'
        }, {
            name: 'Code',
            index: 'Code',
        }, {
            name: 'ParsName',
            index: 'ParsName',
        },  {
            name: 'StyleName',
            index: 'StyleName',
        }, {
            name: 'ColorName',
            index: 'ColorName',
        },{
            name: 'Remark',
            index: 'Remark',
        },{
            name: 'CreateTime',
            index: 'CreateTime',
        }, {
            name: 'act',
            index: 'act',
            width:'80'
        }],
		gridComplete: function () {//加载完之后执行
			qxC();//权限控制
		},
		loadComplete: function (data) {//加载前执行
			_Obj = data;
			var ids = jQuery("#jqgrid").jqGrid('getDataIDs');   
			if('rows' in data){
				for (var i = 0; i < ids.length; i++) {
					var cl = ids[i];
					var CrTime = timeMat(data.rows[i].CreateTime);
					var html='';
					if(data.rows[i].PictureBase64){
						html=`<img style='width:50px;height:50px;' src='${data.rows[i].PictureBase64}'/>`;
					}
					se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].ParsId + "');\"><i class='fa fa-pencil'></i></button>";
					ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].ParsNo + "');\"><i class='fa  fa-trash-o'></i></button>";
					im = "<button class='btn btn-xs btn-default' data-qx='图片' title='图片详情' data-original-title='Cancel' onclick=\"imgRow('" + cl + "','" + data.rows[i].ParsId + "');\"><i class='fa fa-picture-o'></i></button>";
					jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
						act: se + ca + im,
						CreateTime: CrTime,
					});
				}
			}
		},
		
	});
	var grid = $("#jqgrid");
	var columnNames = grid.jqGrid('getGridParam','colModel');
	for (i = 0; i < columnNames.length; i++) {
		 grid.setColProp(columnNames[i].index, { sortable: false });
	}
	grid.jqGrid('navGrid', "#pjqgrid", {
		edit : false,
		add : false,
		del : false,
		search : false
	});
	//jQuery("#jqgrid").jqGrid('filterToolbar', { searchOperators: true });
	/* Add tooltips */
	$('.navtable .ui-pg-button').tooltip({
		container: 'body'
	});

	jqGridUi();//jqGrid UI
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
			Code : {
				validators : {
					notEmpty : {
						message : '部件代码为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[^\u4e00-\u9fa5]{0,}$/,
                        message: '只能是数字和字母和符号'
                    }
				}
			},
			ParsName : {
				validators : {
					notEmpty : {
						message : '部件名称为必填项'
					}
				}
			},
			
		
		}
	})//表单验证end
}
//修改数据
function updateRow(trId,uId) {	
	formValidator();
    reset();
    $("#ParsNo").attr("disabled",true);
    $("#click-title").html("修改部件");
	$("#wid-id-form").slideDown(500);
    $("#update").show();
    $("#add").hide();
    $.optionFalse('ParentId',uId);//select 不可选当前
    
    $("#iform").find("input,select,textarea").each(function(i,item){
		$("#"+$(item).attr("id")).val(_Obj['rows'][trId-1][$(item).attr("id")]);
	});
    var ParsName = _Obj['rows'][trId-1].ParsName.split('/');
    $('#ParsName').val(ParsName[0]);

    $('#file').attr('src',_Obj['rows'][trId-1].PictureBase64?_Obj['rows'][trId-1].PictureBase64:'');		
    var param={};
    param.ParsId = uId;
	param.ParsNo = _Obj['rows'][trId-1].ParsNo;
	pStyles();
    GetStyles(_Obj['rows'][trId-1].Code);

    $("#update").unbind("click").click(function() {
		
    	$("#iform").find("input[type='text'],select,textarea").each(function(i,item){
	        param[$(this).attr('id')] = $(this).val();
	    });
      	var StyleNos = [];
        CustomArray.map((Citem, Cindex) => {
		    if(Citem.type == 2){
		    	var Styles = $('#'+ Citem.value +' .parent:checked');
		    	var CStyles = $('#'+ Citem.value +' .children:checked');
		    	if(Styles.length > 0){
			    	Styles.map((index,item) => {
			    		if($(item).attr('data-parentid') != '0'){
			    			var childrenCheck = $(item).parents('span').next('ul').find('.children:checked');
			    			if(childrenCheck.length > 0){
			    				childrenCheck.map(function(Cindex, Citem) {
			    					StyleNos.push({"StyleNo":$(item).val(),"No":$(Citem).val()})
			    				})
			    			}else{
			    				StyleNos.push({"StyleNo":$(item).val(),"No":null})
			    			}
			    		}
			    	})
		    	}
		    	if(CStyles.length > 0){
		    		CStyles.map((index,item) => {
			    		if($(item).parents('ul').parents('ul').length == 1){
			    			StyleNos.push({"StyleNo":$(item).val(),"No":null});
			    		}
			    	})
		    	}
	    	}
    	})
        param.StyleNo = JSON.stringify(StyleNos);
        ajax({
        	type:"POST",
        	url:'Materiel/upt-pars',
        	data:param,
        	success:function(data){
        		if(data.Status == 1){
        			$("#wid-id-form").slideToggle(300);
	        		ReturnAjax({
	        			data:data,
	        			DiyFunction:function(){
							reset();
	        			}
	        		});
        		}else if(data.Status == 2){
        			$.errorFun(data.Values);
        		}else{
        			$.errorFun('修改异常，请重新操作或稍后尝试！');
        		}
				
        	},
        	error:function(error){
        		$.errorFun("更新失败，请稍后重试");
        	}
        })
		return false;
	})
}
//删除数据
function delRow(trId,uId) {
	$.delFun("Materiel/del-pars","ParsNo",uId);//1：接口名称  2：参数名称  3：参数值
}

function GetStyles(Code){
	ajax({
		url: 'Materiel/pars-code/',
		type: 'GET',
		dataType: 'json',
		data: {code: Code},
		success: function(data){
			data.map((index, elem) => {
				$('#Styles'+index.StyleNo).attr("checked",true);
				$('#Styles'+index.ColorNo).attr("checked",true);
			})
			
		},
		error: function(data){

		}
	})
}

//导出excel
function exportExcel(){
	ajax({
		url: 'distr-export',
		data: {},
		success: function(data){
			window.open(data);
		},
		error: function(error){
			console.log('error');
		}
	})
};

function allp(){
	ajax({
		url:'Materiel/pars-tree',
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
				html+='<option data-id="'+data[item].Id+'" value="'+data[item].Id+'">'+data[item].Fill+data[item].Name+data[item].Value+'（'+data[item].Id+'）</option>';
			});
			AreaNo.empty().append(html);
		}
	})
}

function pStyles(){
	var pStylesStr='',PStyles = $('#product-styles');
	PStyles.empty();
	CustomArray.map(val=>{
		pStylesStr += val.value+',';
		if(val.type == 1){
			PStyles.append(`
			<tr>
				<td>
					<label class="col-md-3 control-label" id="${val.value}-title">${val.value}：</label>
					<div class="col-md-8">
						<select class="form-control" data-No="" name="${val.name}" id="${val.value}">
							
						</select>
					</div>
				</td>
			</tr>`);
		}else if(val.type == 2){
			PStyles.append(`
			<tr>
				<td>
					<label class="col-md-3 control-label" id="${val.value}-title">${val.value}：</label>
					<div class="col-md-8">
						<div class="tree smart-form">
							<ul id="${val.value}" style="height:500px;overflow-x:auto">
								
							</ul>
						</div>
					</div>
				</td>
			</tr>`);
		}
	})
	var url = pStylesStr.substring(pStylesStr.length-1,0);
	ajax({
		url: 'profile/',
		type: 'GET',
		dataType: 'json',
		data: {name: url},
		success: function(data){
			StyleArray = data;
			var datas = [],i = 1;

			CustomArray.map((Citem, Cindex) => {
				data.map((item,index) => {
					if(item.Number == Citem.value && Citem.type == 1){
						if(item.ParentId == 0){
							$('#'+ Citem.value +'-title').text(item.TagName+'：');
						}else{
							$('#'+ Citem.value).append('<option data-No="'+index+'" value="'+item.Code+'">'+item.Fill+item.Name+item.TagName+'</option>')
						}
					}else if(item.Number == Citem.value && Citem.type == 2){
						if(item.ParentId == 0){
							$('#'+ Citem.value +'-title').text(item.TagName+'：');
						}	
						datas.push({AreaId:item.Id,ParentId:item.ParentId,Value:item.Value,No:index,TagName:item.TagName,Code:item.Code,Number:item.Number});
				        stie(Citem.value ,fn(datas,0));
				        $('#'+ Citem.value +' li input').unbind('click').on('click',function(event) {
							if($(this).parents('span').parents('ul').prev('span').length > 0){
								$(this).parents('span').parents('ul').prev('span').find('input').prop("checked",true);
							}
							if($(this).parents('span').next('ul').find('input:checked').length > 0){
								$(this).parents('span').next('ul').find('input').prop("checked",false);
							}
						});
					}
				})
			})
		},
		error: function(error){
			console.log(error);
		}
	});
}

$(function(){
	ajax_table();
	allp();
	//搜索
	$("#search-div").click(function(event) {
		var searchVal = $("#search-html").val(),
		path = _path+"Materiel/get-pars-vague/?v="+searchVal;
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
			formValidator();
			$('#iform').bootstrapValidator('validate');
	    	var params = $("#iform").serializeArray();
	    	var param={};
	    	for(var item in params){
	            param[params[item].name] = params[item].value;
	        }
	        var StyleNos = [];
	        CustomArray.map((Citem, Cindex) => {
			    if(Citem.type == 2){
			    	var Styles = $('#'+ Citem.value +' .parent:checked');
			    	var CStyles = $('#'+ Citem.value +' .children:checked');
			    	if(Styles.length > 0){
				    	Styles.map((index,item) => {
				    		if($(item).attr('data-parentid') != '0'){
				    			var childrenCheck = $(item).parents('span').next('ul').find('.children:checked');
				    			if(childrenCheck.length > 0){
				    				childrenCheck.map(function(Cindex, Citem) {
				    					StyleNos.push({"StyleNo":$(item).val(),"No":$(Citem).val()})
				    				})
				    			}else{
				    				StyleNos.push({"StyleNo":$(item).val(),"No":null})
				    			}
				    		}
				    	})
			    	}
			    	if(CStyles.length > 0){
			    		CStyles.map((index,item) => {
				    		if($(item).parents('ul').parents('ul').length == 1){
				    			StyleNos.push({"StyleNo":$(item).val(),"No":null});
				    		}
				    	})
			    	}
		    	}
	    	})
	    	param.StyleNo = JSON.stringify(StyleNos);
	    	ajax({
				type:"POST",
				url:'Materiel/add-pars',
				data:param,
				success: function(data){
					$("#wid-id-form").slideUp(300);
					$("#refresh_jqgrid").click();
					 return false;
				},
				error: function(message){
					$.errorFun("添加失败，请稍后重试");
				}
			});
			return false;
		}else{
			$.errorFun('信息请填写完善');
			$('#iform').bootstrapValidator('validate');
			return false;
		}
	});
	$('#modal_link').click(function () {//点击显示弹出框
	    $("#click-title").html("添加部件");
	    $("#wid-id-form").slideToggle(1000)
	    $("#add").show();
	    $("#update").hide();
	    pStyles();
	    reset();//清空表单
	    $('#file').attr('src','');
	    formValidator();
	    $("#ParsNo").attr("disabled",false);
	    return false;
	});
	$("#dialog-message").dialog({//弹出框设置
	    autoOpen: false,
	    modal: true,
	    width: 650,
	    height: 470,
	});
	$("#dialog-img").dialog({//弹出框设置
	    autoOpen: false,
	    modal: true,
	    width: 550,
	    height:380,
	});
})

function iformclose(){
	$('#wid-id-form').slideToggle(1000);
	return false;
}

//图片上传及显示
var cpId="",
    output = document.getElementById('output');
function imgRow(trId,uId){
	$("#upImg").hide();

	cpId=uId;
    $('#dialog-img').dialog('open');
    $.ajax({
    	url:_path+"Materiel/get-file-pars",
    	dataType:"jsonp",
    	type:"GET",
    	data:{
           id:cpId
    	},
    	success:function(data){
            if(data){
            	
            	output.src=data.replace(/\\/g, "");
            }else{
            	output.src="../img/Noimg.png";
            }
    	},
    	error:function(){
    		console.log("获取失败！");
    	}
    });

    $("#addImg").unbind("click").click(function(){
    	  $("#file").unbind("click").click();
    	  return false;
    });
    return false;
}


var openFile = function(event) {
   var input = event.target;
   var param=$("#file")[0].files[0];
        console.log(param)
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
         if(ImgSize>1024*1024*0.2){
              alert("图片大小超过1M！");
              return false;
         }

    var reader = new FileReader();
    reader.onload = function(){
	    var dataURL = reader.result;
	     var param={
                "picture": dataURL
              };
	    	output.src=dataURL;
	    	
	    	$("#upImg").show();
	    	$("#upImg").unbind("click").click(function(){
	    		$.ajax({
			      	url:_path+"Materiel/file-pars?id="+cpId,
			      	type:"POST",
			      	dataType:"json",
			      	async: false,
		            cache: false,
		            contentType: false,
			      	data: param,
			      	success:function(data){
			      		if(data.Status=="-1"){
			      			alert("图片已存在,请重新上传!");
			      			return false;
			      		}else{
			      			alert("上传成功！");
							$("#refresh_jqgrid").click();
							$('#dialog-img').dialog('close');
	                        return false;
			      		}
						
					},
					error: function(message){
						alert("上传失败，请稍后尝试");
					}
		      });
	    		return false;
	    	})
    };
    reader.readAsDataURL(input.files[0]);
  };

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
            	if (item.children) {
                    str += `<li><span>
                        	<label style="padding-top:0px" class="checkbox inline-block">
								<input type="checkbox" class="parent" data-ParentId=${item.ParentId} id="${item.Number+item.Code}" data-No="${item.No}" value="${item.Code}" name="checkbox-inline">
								<i></i>${item.TagName}</label></span><ul>`;                
                    insertNode(item.children);
                    str += "</ul></li>";
                 
                } else {
                    str +=`<li><span>
                        <label style="padding-top:0px" class="checkbox inline-block">
								<input type="checkbox" class="children" data-ParentId=${item.ParentId} id="${item.Number+item.Code}" data-No="${item.No}" value="${item.Code}" name="checkbox-inline">
								<i></i>${item.TagName}</label></span></li>`; 
                  
                }
            });
        }
    })(arr);
    $("#"+obj).empty().html(str);
};