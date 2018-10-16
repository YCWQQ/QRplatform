var cpdata = {},
StyleArray = [],
CustomArray,  //获取产品子信息
selI=0,
ProStylesArray = [],  //保存产品子信息提交
ProductNoArray = [],
SpecCodeArray = [],
ProStylesArrayIndex = 0,
ProState = false,//添加修改时状态
EditDataArray, //获取修改时产品数据
UpdateCustomTagNo; //编辑产品属性时TagNo

let PRODUCT_TYPE,PRODUCT_NAME;
const TABLE_NYCP_MODEL_LEFT = `
			<div class="form-group append">
				<label class="col-md-2 control-label" id="MakeType-title">生产类型: </label>
				<div class="col-md-10 ">
					<select class="form-control" type="text" data-type="0" data-name="MakeType" name="MakeType" id="MakeType">
						<option value="1">代表农药登记证持有人生产</option>
						<option value="2">代表委托加工</option>
						<option value="3">代表委托分装</option>
					</select>
				</div>
			</div>
			<div class="form-group append">
				<label class="col-md-2 control-label" id="RegisNo-title">登记证完整编号: </label>
				<div class="col-md-4 ">
					<input class="form-control" type="text" data-type="0" data-name="RegisNo" name="RegisNo" id="RegisNo">
				</div>
				<label class="col-md-2 control-label" id="CertifNo-title">证件号码: </label>
					<div class="col-md-4 NotNull">
					<input class="form-control" type="text" placeholder="" data-type="0" data-name="CertifNo" onkeyup="if(/^\\d{6}$/.test(parseInt(this.value))){$('#rulesCertifNo').hide();}else{$('#rulesCertifNo').show()};" name="CertifNo" id="CertifNo">
					<span id="rulesCertifNo" style="color:red;display:none">Ps:格式错误:只能为6位数字</span>
					<span>Ps:此处自动截取登记证完整编号后六位编号</span>
				</div>
			</div>
			<div class="form-group append" style="display:none">
				<label class="col-md-2 control-label" id="CertifType-title">请选择登记证类别: </label>
					<div class="col-md-10 NotNull">
						<select class="form-control" data-type="1" data-name="CertifType" name="CertifType" id="CertifType">
						
					<option data-type="1" data-name="CertifType" value="1">代表登记类别代码为PD</option>
					<option data-type="1" data-name="CertifType" value="2">代表登记类别代码为WP</option>
					<option data-type="1" data-name="CertifType" value="3">代表临时登记为LS</option></select>
				</div>
			</div>
			<div class="form-group append">
				<label class="col-md-2 control-label" id="Regis-title">登记证持有人: </label>
					<div class="col-md-10 NotNull">
					<input class="form-control" type="text" placeholder="请输入登记证持有人" data-type="0" data-name="Regis" name="Regis" id="Regis">
				</div>
			</div>
			<div class="form-group append">
				<label class="col-md-2 control-label" id="BeginTime-title">有效起始日: </label>
				<div class="col-md-4 ">
					<input class="form-control" type="text" data-type="0" data-name="BeginTime" name="BeginTime" id="BeginTime">
				</div>
				<label class="col-md-2 control-label" id="ExpireTime-title">有效截止日: </label>
				<div class="col-md-4 ">
					<input class="form-control" type="text" data-type="0" data-name="ExpireTime" name="ExpireTime" id="ExpireTime">
				</div>
			</div>
			<div class="form-group append">
				<label class="col-md-2 control-label" id="Contain-title">总含量: </label>
				<div class="col-md-2 ">
					<input class="form-control" type="text" data-type="0" data-name="Contain" name="Contain" id="Contain">
				</div>
				<label class="col-md-2 control-label" id="Dosage-title">剂型: </label>
				<div class="col-md-2 ">
					<input class="form-control" type="text" data-type="0" data-name="Dosage" name="Dosage" id="Dosage">
				</div>
				<label class="col-md-2 control-label" id="Toxicity-title">毒性: </label>
				<div class="col-md-2 ">
					<select class="form-control" type="text" data-type="0" data-name="Toxicity" name="Toxicity" id="Toxicity">
						<option value="">请选择</option>
						<option value="1">剧毒</option>
						<option value="2">高毒</option>
						<option value="3">中等毒</option>
						<option value="4">低毒</option>
						<option value="5">微毒</option>
					</select>
				</div>
			</div>
			<div class="form-group append">
				<label class="col-md-2 control-label" id="ElementName-title">有效成分名称: </label>
				<div class="col-md-10 ">
					<input class="form-control" type="text" data-type="0" data-name="ElementName" name="ElementName" id="ElementName">
					<span>Ps:多个请用逗号隔开</span>
				</div>
			</div>
			<div class="form-group append">
				<label class="col-md-2 control-label" id="ElementValue-title">有效成分含量: </label>
				<div class="col-md-10 ">
					<input class="form-control" type="text" data-type="0" data-name="ElementValue" name="ElementValue" id="ElementValue">
					<span>Ps:多个请用逗号隔开</span>
				</div>
			</div>`;
const TABLE_NYCP_MODEL_RIGHT = `
	<tr style="display:none">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="ProductNo-title">物料编号: </label>
			<div class="col-md-8">
				<input class="form-control" type="text" placeholder="必填项" data-type="0" data-name="ProductNo" onkeyup="if(/^[a-zA-Z0-9]{5,10}$/.test(this.value)){$('#rulesProductNo').hide();$('#ProStylesReturnBtn,#ProStylesUpdateBtn').prop('disabled',false)}else{$('#rulesProductNo').show();$('#ProStylesReturnBtn,#ProStylesUpdateBtn').prop('disabled',true)}" name="ProductNo" id="ProductNo">
				<span id="rulesProductNo" style="color:red;display:none">Ps:物料编号:格式错误</span>
			</div>
		</td>
	</tr>
	<tr class="append">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="PartCode-title">成品代号: </label>
			<div class="col-md-8">
				<input class="form-control" type="text" placeholder="请输入数子和字母组成成品代号！" data-type="0" data-name="PartCode" onkeyup="if(/^[a-zA-Z0-9]+$/.test(this.value)){$('#rulesPartCode').hide();$('#ProStylesReturnBtn,#ProStylesUpdateBtn').prop('disabled',false)}else{$('#rulesPartCode').show();$('#ProStylesReturnBtn,#ProStylesUpdateBtn').prop('disabled',true)}" name="PartCode" id="PartCode">
				<span id="rulesPartCode" style="color:red;display:none">Ps:成品代号:格式错误只输入字母和数字</span>
			</div>
		</td>
	</tr>
	<tr class="append">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="Alias-title">成品名称: </label>
			<div class="col-md-8">
				<input class="form-control" type="text" data-type="0" data-name="Alias" name="Alias" id="Alias">
			</div>
		</td>
	</tr>
	<tr class="append">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="SpecCode-title">规格编码: </label>
			<div class="col-md-8 NotNull">
				<input class="form-control" type="text" placeholder="请输入三位规格编码，企业自定义，不可重复！" data-type="0" data-name="SpecCode" onkeyup="if(/^\\d{3}$/.test(this.value)){$('#rulesSpecCode').hide();$('#ProStylesReturnBtn,#ProStylesUpdateBtn').prop('disabled',false)}else{$('#rulesSpecCode').show();$('#ProStylesReturnBtn,#ProStylesUpdateBtn').prop('disabled',true)}" name="SpecCode" id="SpecCode">
				<span id="rulesSpecCode" style="color:red;display:none">Ps:规格编码:格式错误</span>
			</div>
		</td>
	</tr>
	<tr class="append">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="Spec-title">规格名称: </label>
			<div class="col-md-8 NotNull">
				<input class="form-control" type="text" placeholder="必填项" data-type="0" data-name="Spec" name="Spec" id="Spec">
				<span id="rulesSpec" style="color:red;display:none">Ps:规格必须填写</span>
			</div>
		</td>
	</tr>
	<tr class="append">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="GrossWeight-title">毛重: </label>
			<div class="col-md-8 NotNull">
				<input class="form-control" type="text" placeholder="必填项" data-type="0" data-name="GrossWeight" name="GrossWeight" id="GrossWeight">
				<span id="rulesGrossWeight" style="color:red;display:none">Ps:毛重必须填写</span>
			</div>
		</td>
	</tr>
	<tr class="append">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="NetWeight-title">净重: </label>
			<div class="col-md-8 NotNull">
				<input class="form-control" type="text" placeholder="必填项" data-type="0" data-name="NetWeight" name="NetWeight" id="NetWeight">
				<span id="rulesNetWeight" style="color:red;display:none">Ps:净重必须填写</span>
			</div>
		</td>
	</tr>
	<tr class="append">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="SpecName-title">装箱规格: </label>
			<div class="col-md-8 NotNull">
				<input class="form-control" type="text" placeholder="必填项" data-type="0" data-name="SpecName" name="SpecName" id="SpecName">
				<span id="rulesSpecName" style="color:red;display:none">Ps:装箱规格必须填写</span>
			</div>
		</td>
	</tr>`;
const TABLE_OTHER_MODEL_RIGHT = `
	<tr class="append">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="aaa-title">测试其他产品A: </label>
			<div class="col-md-8 NotNull">
				<input class="form-control" type="text" placeholder="必填项" data-type="0" data-name="aaa" name="aaa" id="aaa">
				
			</div>
		</td>
	</tr>
			<tr class="append">
		<td>
			<label style="margin-right:5px" class="col-md-3 control-label" id="CertifType-title">测试其他产品B: </label>
			<div class="col-md-8 NotNull">
				<input class="form-control" type="text" placeholder="必填项" data-type="0" data-name="bbb" name="bbb" id="bbb">
			</div>
		</td>
	</tr>
`;


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
			ProductName : {
				validators : {
					notEmpty : {
						message : '产品名称为必填项'
					}
				}
			},
			ProductCode : {
				validators : {
					notEmpty : {
						message : '母件料品编号为必填项'
					}
					// regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
     //                    regexp: /^\d{5}$/,
     //                    message: '只能是5位数字'
     //                }
				}
			},
			Expire : {
				validators : {
					notEmpty : {
						message : '失效天数为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[0-9]+$/,
                        message: '只能是数字'
                    }
				}
			},
			UnitNo : {
				validators : {
					notEmpty : {
						message : '计量单位编号为必填项'
					}
				}
			},BrandNo : {
				validators : {
					notEmpty : {
						message : '所属大类为必填项'
					},
					
				}
			}
		}
	})//表单验证end
}

//显示产品属性
function selectProStyles(trId){
	ajax({
		url: 'get-shard/',
		type: 'GET',
		dataType: 'JSON',
		data: {No: cpdata.rows[trId-1]['ProductCode']},
		success: function(data){
			if(data){
				var SStyleArray = [];
				var flag = true;
				data.map(function(index, elem) {
					var item = JSON.parse(index.Custom);
					if(item){
						SStyleArray.push(item.settings.item)
					}else{
						$.errorFun('此产品无额外产品属性！')
						flag = false;
					}
					
				})
				if(!flag){return false}
				var tr = '';
				SStyleArray.map(function(index, elem) {
					var html = '';
					index.map(function(_index, _elem) {
						html += '<td >'+ _index.text +'：'+ _index.value +'</td>'
					})
					tr += '<tr>'+html+'</tr>'
				})
				$('#StylesMessageTable').html(tr);
				$("#dialog-StylesMessage").dialog({
			        autoOpen: false,
			        modal: true,
			        width: 'auto',
			        height: 'auto',
			        buttons : [
			            {
			                html : "<i class='fa fa-times'></i>&nbsp; 关闭",
			                "class" : "btn btn-danger",
			                click : function() {
			                    $(this).dialog("close");
			                },
			            }]
			    }); 
			    $('#dialog-StylesMessage').dialog("open");
			}
		},
		error: function(error){

		}
	})
}

//修改数据
function updateRow(trId, uId, uNo, uCode) {
	formValidator();
	$("#iform").show();
	$('#product-buttons').hide();
	$("#ProductCode").attr("readonly",true);
	$('#TagNo').attr("disabled",true);
	$('#product-styles').empty();
	$('#ProStyleSec').hide();
    $("#click-title").html("修改产品");

    $("#update").show();
    $("#add").hide();
    $("#wid-id-form").slideDown(300);
    $('#product-styles-submit').empty();

    reset();

	$("#iform").find("input[type='text'],select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(cpdata.rows[trId-1][$(item).attr("id")]);
    });

	var Custom_Item = [];
 	ajax({
		url: 'get-shard/',
		type: 'GET',
		dataType: 'JSON',
		data: {No: uCode},
		success: function(data){
			if(data){
				if(data[0].Custom){
					var ObjCustom = JSON.parse(data[0].Custom).settings;
					
					Custom_Item = ObjCustom.item;
					if(ObjCustom.tag == 'FARMING_PRO'){
				    	LeftModelJQUI();//生成农药基础属性模版并追加inputJQUI事件
				    	Custom_Item.map(function(index, elem) {
				    		$('#'+index.key).val(index.value);
				    	})
				    }else if(ObjCustom.tag == 'PPP2_PRO'){
				    	$('#Table1').empty();
				    }
				}
			}
		},
		error: function(error){
			$.errorFun('获取产品子信息失败，此产品无子级或数据库异常！');
		}
	})
    var dataObj = {};
    dataObj.ProductId = uId;
    dataObj.ProductNo = uNo;
    
    $("#update").unbind("click").click(function() {
    	var inputList = $('#iform .default').find('input,select,textarea');
		$.each(inputList,function(index,item){
			dataObj[$(item).attr('id')] = $(item).val();
		})

	    var appendList = $('.append').find('input,select,textarea');
		
		var appendChirenList = [];
		$.each(appendList,function(index,item){
			var appendChirenObj = {};
			if($(item).val()){
				appendChirenObj.name = $(item).attr('data-name');
				appendChirenObj.type = $(item).attr('data-type');
				appendChirenObj.id = $(item).attr('id');
				appendChirenObj.value = $(item).val();
				appendChirenList.push(appendChirenObj);
			}
			
		})
		if(appendChirenList.length){
			appendChirenList.map(function(index, elem) {
				var CKey = index.name;
				
				Custom_Item.map(function(aindex, aelem) {
					if(CKey == aindex.key){
						aindex.value = index.value;
					}
				})
				
				if(JSON.stringify(Custom_Item).indexOf('"'+CKey+'"') == -1){
					Custom_Item.push({
						key: index.id,
						value: index.value,
						text: ''
					})
				}
			})
			dataObj.Custom = JSON.stringify(Custom_Item);
		}else{
			dataObj.Custom = '';
		}
	   
    	ajax({
			type:"POST",
			url: "uproduct",
			data:dataObj,
			success: function(data){
				if(data.Status){
					$("#wid-id-form").slideUp(300);
					ReturnAjax({data:data});
				}else{
					$.errorFun("修改信息失败，请稍后尝试！");
				}
				
			},
			error: function(message){
				$.errorFun("修改信息失败，请稍后尝试！");
			}
		});
		return false;
	});
}

//修改产品属性
function updateStyle(trId,uCode) {
	ProStylesArray = [];  //初始化产品属性
	ProductNoArray = [];
	SpecCodeArray = [];
	ProState = true;
	$('#product-styles').empty();
	$('#iform').hide();
    $("#add").hide();
    $("#wid-id-form").slideDown(300);
    $('#closeSection').show();
    $("#click-title").html("修改产品属性");
    $('#product-styles-submit').empty();

	EditDataArray = cpdata.rows[trId-1];
	$('#TagNo').attr("disabled",true);
	$('#ProStyleSec').css('width','100%');
	getChildrenProduct(uCode);
	ProStylesBtnSecInfo(false);
}

function getChildrenProduct(ProductCode){
	ProductNoArray = [];
	SpecCodeArray = [];
	ajax({
		url: 'get-shard/',
		type: 'GET',
		dataType: 'JSON',
		data: {No: ProductCode},
		success: function(data){
			if(data){
				$('#TagDiv').show();
				$('#ProStyleSec').show();
				var ProductStyleArray = [];
				if(data[0].Custom){
					var TagNoVal = JSON.parse(data[0].Custom);
					$('#TagNo').val(JSON.parse(data[0].Custom).settings.tag)
					$('#TagNo').change();
					$('#product-styles').hide();
					ProStylesBtnInfo('ProStylesAddsBtn');

					//获取产品属性
					data.map(function(index, elem) {
						var item = JSON.parse(index.Custom);
						ProductStyleArray.push(item.settings.item);
						ProductNoArray.push(index.ProductNo);
						item.settings.item.map(function(Iindex, Ielem) {
							if(Iindex.key == 'SpecCode'){
								SpecCodeArray.push(Iindex.value);
							}
						})
					})
					console.log(SpecCodeArray);
					// 根据企业信息组合产品属性
					var ParentProStyleArray = [];
					if(JSON.stringify(ProductStyleArray).indexOf('ProductNo') > -1){
						
					}else{
						// ProductStyleArray.map(function(index, elem) {
						// 	index.unshift({
						// 		key:"ProductNo",
						// 		value:ProductNoArray[elem]
						// 	})
						// })
					}
					ProductStyleArray.map(function(index, elem) {
						var ChildrenProStyleArray = [];
						
						if(index.length){
							index.map(function(_index, _elem) {
								var type;
								CustomArray.map(function(Cindex, Celem) {
									if(_index.key == Cindex.name){
										type = Cindex.type;
									}
								})
								var obj = {};
								obj.name = _index.key;
								obj.type = type;
								obj.id = '';
								obj.value = _index.value;
								obj.text = _index.text || '编号';
								ChildrenProStyleArray.push(obj);
							})
						}else{

						}
						
						ParentProStyleArray.push(ChildrenProStyleArray);
					})
					$('#product-styles-submit').empty(); //产品属性初始化
					ProStylesArray = ParentProStyleArray;
					ProStylesArray.map(function(index, elem) {
						var ProStylesString = '';
						for(var key in index){
							ProStylesString += index[key].text+'：' + index[key].value+' / '
						}
						var btn = `<div style='float:right;width:10%;text-align:right;'><button  onclick="GetupdateProStyles(${elem},false)" class="btn btn-primary">修改</button><button onclick="DelProStyles(${elem})" class="btn btn-danger">删除</button></div>`
						var ProStylesHtml = `<td><div style="float:left;width:90%"><span style="display:block;width:40px;float:left;font-size:24px;">${elem+1}.</span> <span style="display:block;width:90%;float:left;">${ProStylesString}</span></div> ${btn} </td>`;
						$('#product-styles-submit').append(`<tr id="style${elem}">${ProStylesHtml}</tr>`);
					})
				}else{
					$('#TagDiv').hide();
				}
			}
		},
		error: function(error){
			$.errorFun('获取产品子信息失败，此产品无子级或数据库异常！');
		}
	});
}

//修改数据
function updateName(trId,uId) {
	$("#UProductName").val(cpdata.rows[trId-1]['ProductName']);
    $("#dialog-upName").dialog({
        autoOpen: false,
        modal: true,
        width: 300,
        height: 200,
        buttons : [{
            html : "<i class='fa fa-save'></i>&nbsp; 保存",
            "class" : "btn btn-primary",
                click : function() {
                    ajax({
                        url:'upt-product-name',
                        type: 'POST',
                        data: {
                           ProductNo: cpdata.rows[trId-1]['ProductNo'],
                           ProductName: $("#UProductName").val()
                        },
                        success: function(data){
                            ReturnAjax({data:data});
                        },
                        error: function(){
                            $.errorFun("修改失败，请稍后重试");
                        }
                    })
                    $(this).dialog("close");
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
    $('#dialog-upName').dialog('open');
}
//修改数据
function updateCode(Code,ProductNo) {
	$("#UProductCode").val(Code);
    $("#dialog-upCode").dialog({
        autoOpen: false,
        modal: true,
        width: 300,
        height: 200,
        buttons : [{
            html : "<i class='fa fa-save'></i>&nbsp; 保存",
            "class" : "btn btn-primary",
                click : function() {
                    ajax({
                        url:'upt-product-code',
                        type: 'POST',
                        data: {
                           ProductNo: ProductNo,
                           ProductCode: $("#UProductCode").val()
                        },
                        success: function(data){
                            ReturnAjax({data:data});
                        },
                        error: function(){
                            $.errorFun("修改失败，请稍后重试");
                        }
                    })
                    $(this).dialog("close");
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
    $('#dialog-upCode').dialog('open');
}
//删除数据
function delRow(trId,uId) {
	$.delFun("dproduct","ProductCode",uId);//1：接口名称  2：参数名称  3：参数值
}

function unit(){
	ajax({
        url: "unitlist",
        success: function (data) {
            $(data).each(function (i) {
                 $("#UnitNo").append("<option value='"+ data[i].UnitNo +"'>"+ data[i].UnitName +"</option");
            })
        },
        error: function (message) {
            $.errorFun("计量单位查询失败");
        }
    })
}

function Parent(){
	ajax({
		url:"brandlist",
		success:function(data){
            $(data).each(function(item) {
                $("#BrandNo").append('<option value="'+ data[item].BrandNo +'">'+ data[item].BrandName +'</option>');
                $("#Brand").append('<option value="'+ data[item].BrandNo +'">'+ data[item].BrandName +'</option>');
            });
			
		},
		error:function(message) {
			$.errorFun("查询大类信息失败");
		},
	});
	
}


//初始化按钮容器
function ProStylesBtnSecInfo(flag){
	if(flag){
		$('#product-buttons').hide();
	}else{
		$('#product-buttons').show();
	}
}

function ProStylesBtnInfo(ID){
	$('#ProStylesAddsBtn').hide();
	$('#ProStylesReturnBtn').hide();
	$('#ProStylesUpdateBtn').hide();
	$('#ProStylesUpdateDBBtn').hide();
	$('#ProStylesReturnAjaxBtn').hide();
	$('#'+ID).show();
}
//产品类型子信息Dom渲染
function productSel(){
	if(!dataList.Config){
        return false;
    }
	var dataInfo = $.parseJSON(dataList.Config),
		data = dataInfo.settings.item,
		html = '';

	var Selint = 0;
	data.map(function(p){ 
		if(p.key == 'Product-Type'){
			Selint ++;
			html += `<option value="${p.value}">${p.text}</option>`
		}
	});
	//判断是否有产品动态数据，无则隐藏产品类型下拉框
	if(!Selint){
		$('#Tagdiv').hide();
		return;
	}else{}

	var ParentId = $("#TagNo");
	ParentId.html(html);
	//公共产品TYPE赋值

	ParentId.change((e)=>{
    	PRODUCT_NAME = $('#TagNo option:checked').text();
		PRODUCT_TYPE = $('#TagNo').val();
		$("#click-title").html('编辑'+PRODUCT_NAME);

		if(PRODUCT_TYPE == 'FARMING_PRO'){
	    	LeftModelJQUI();//生成农药基础属性模版并追加inputJQUI事件
	    	$('#product-styles').html(TABLE_NYCP_MODEL_RIGHT).show();
	    }else if(PRODUCT_TYPE == 'PPP2_PRO'){
	    	$('#Table1').empty();
	    	$('#product-styles').html(TABLE_OTHER_MODEL_RIGHT).show();
	    }

	    let t=e.target.value;
	    var pStylesStr='';
	    $('#product-buttons').hide();
	    data.map(item=>{
	      	if(item.value==t && item.add){
	      		CustomArray = item.add;
	      		
	      	}else{

	      	}
	    });
	    if(t == 0){
	    	$('#product-buttons').hide();
	    }else{

	    }
	    
	});	
}

//修改产品类型子信息时过去数据函数
function GetupdateProStyles(index){
	$('#product-styles').find('input').val('');
	ProStylesArrayIndex = index;
	$('#product-styles').show();
	if(ProState){
		ProStylesBtnInfo('ProStylesUpdateDBBtn');
	}else{
		ProStylesBtnInfo('ProStylesUpdateBtn');
	}
	
	
	if(UpdateCustomTagNo == 'FARMING_PRO'){
		$('#product-styles').html(TABLE_NYCP_MODEL_RIGHT).show();
		$("#ProductNo").attr("readonly",true);
	}
	$('#SpecCode').attr("readonly",true);
	ProStylesArray[index].map(function(index, elem) {
		if(index.type == 0 || index.type == undefined){
			if(index.id){
				$('#'+index.id).val(index.value)
			}else{
				$('#'+index.name).val(index.value)
			}
		}else if(index.type == 1){
			if(index.id){
				$('#'+index.id).val(index.value)
			}else{
				$('#'+index.name).val(index.value)
			}
		}else if(index.type == 2){
			if(index.id){
				$('#'+index.id).attr('checked', true)
			}else{
				$('#product-styles input:checkbox[value='+index.value+']').attr('checked', true)
			}
			
		}else if(index.type == 3){
			$('#product-styles input:radio[value='+index.value+']').prop('checked', true)
		}
	})
	ProStylesBtnSecInfo(false);
}

//产品属性更新直接更新到数据库
//更新产品类型子信息函数 并重新渲染已添加DOM视图
function ProStylesUpdate(){
	var validateList = $('#product-styles .NotNull'),
		validateFlag = true,
		validateText = '';
	$.each(validateList,function(index, el) {
		if(!$(el).find('input:text,select,input:checkbox:checked,input:radio:checked').val()){
			validateText += $(el).prev().text()+'，';
			validateFlag = false;
		}
		
	});
	if(!validateFlag){
		$.errorFun(validateText+'数据请填写完整');
		return validateFlag;
	}

	var NowPNO = ProductNoArray[ProStylesArrayIndex];//获取初始ProductNO

	var valArray = $('#product-styles').find('input:text,select,input:checkbox:checked,input:radio:checked');
	if(valArray.length){
		var obj = [];
		var PNoFlag = true,SpecCFlag = true;
		valArray.map(function(index, elem) {
			var domObj = {}
			
				domObj.name = $(elem).attr('data-name');
				domObj.type = $(elem).attr('data-type');
				domObj.id = $(elem).attr('id');
				domObj.value = $(elem).val();
				obj.push(domObj);
				if(domObj.name == 'ProductNo'){
					if($.inArray(domObj.value, ProductNoArray) >= 0 && ProStylesArrayIndex!= $.inArray(domObj.value, ProductNoArray)){
						PNoFlag = false;
					}else{
						ProductNoArray[ProStylesArrayIndex] = domObj.value;
					}
				}
				if(domObj.name == 'SpecCode'){
					if($.inArray(domObj.value, SpecCodeArray) >= 0 && ProStylesArrayIndex!= $.inArray(domObj.value, SpecCodeArray)){
						SpecCFlag = false;
					}
				}
			
		})//产品属性重新赋值

		if(PNoFlag){
			if(JSON.stringify(obj).indexOf('ProductNo') > -1){
				//农药产品
			}else{
				//其他产品
				NowPNO = ProductNoArray[ProStylesArrayIndex];
			}
			
			obj.map(function(index, elem) {
				var CKey = index.name;
				ProStylesArray[ProStylesArrayIndex].map(function(aindex, aelem) {
					if(CKey == aindex.name){
						aindex.type = index.type;
						aindex.value = index.value;
					}
				})
				if(JSON.stringify(ProStylesArray[ProStylesArrayIndex]).indexOf('"'+CKey+'"') == -1){
					ProStylesArray[ProStylesArrayIndex].push({
						name: index.id,
						value: index.value,
						text: ''
					})
				}
			})
		}else{
			$.errorFun('物料编号有重复不允许更新！');
			return false;
		}
		if(!SpecCFlag){
			$.errorFun('规格编码有重复不允许更新！');
			return false;
		}
	}
	if(ProState){
		ajax({
			url: 'upt-attribute',
			type: 'POST',
			dataType: 'json',
			data: {
				ProductNo: NowPNO,
				Custom:JSON.stringify(ProStylesArray[ProStylesArrayIndex])
			},
			success:function(data){
				if(data.Status == 1){
					$('#ProductNo').attr('readonly', false);
					getChildrenProduct(EditDataArray.ProductCode);
					$('#product-buttons').show();
				}
			},
			error:function(data){
				$.errorFun('修改产品属性失败！请检查参数是否正确!')
			}
		});
	}else{
		$('#product-styles-submit').html('');
		ProStylesArray.map(function(index, elem) {
			var ProStylesString = '';
			for(var key in index){
				ProStylesString += index[key].value+' / '
			}
			var btn = `<div style='float:right;'><button  onclick="GetupdateProStyles(${elem})" class="btn btn-primary">修改</button><button onclick="DelProStyles(${elem})" class="btn btn-danger">删除</button></div>`
			var ProStylesHtml = `<td>${elem+1}. ${ProStylesString + btn} </td>`;
			$('#product-styles-submit').append(`<tr id="style${elem}">${ProStylesHtml}</tr>`);
		})

		$('#product-styles').hide();
		ProStylesBtnInfo('ProStylesAddsBtn');
	}
	
}

//继续添加子信息时显示输入表格并显示隐藏按钮函数
function ProStylesAdds(){
	$('#product-styles').show();
	if(UpdateCustomTagNo == 'FARMING_PRO'){
		$('#product-styles').html(TABLE_NYCP_MODEL_RIGHT).show();
		$("#ProductNo").attr("readonly",false);
	}
	// $("#TagNo").change();
	ProStylesBtnInfo('ProStylesReturnBtn');
}

//保存产品类型子信息 传入公共Array数组进行保存
function setProStyles(){
	var validateList = $('#product-styles .NotNull'),
		validateFlag = true,
		validateText = '';
	$.each(validateList,function(index, el) {
		if(!$(el).find('input:text,select,input:checkbox:checked,input:radio:checked').val()){
			validateText += $(el).prev().text()+'，';
			validateFlag = false;
		}
	});
	if(!validateFlag){
		$.errorFun(validateText+'数据请填写完整');
		return validateFlag;
	}
	var valArray = $('#product-styles').find('input:text,select,input:checkbox:checked,input:radio:checked');
	var obj = [];
	if(valArray.length){
		
		var PNoFlag = true,SpecCFlag = true;
		valArray.map(function(index, elem) {
			var domObj = {}
			
				domObj.name = $(elem).attr('data-name');
				domObj.type = $(elem).attr('data-type');
				domObj.id = $(elem).attr('id');
				domObj.value = $(elem).val();
				obj.push(domObj);
				if(domObj.name == 'ProductNo'){
					if($.inArray(domObj.value, ProductNoArray) >= 0){
						PNoFlag = false;
					}else{
						if(ProState){

						}else{
							ProductNoArray.push(domObj.value);
						}
					}
				}
				if(domObj.name == 'SpecCode'){
					if($.inArray(domObj.value, SpecCodeArray) >= 0){
						SpecCFlag = false;
					}else{
						if(ProState){

						}else{
							SpecCodeArray.push(domObj.value);
						}
					}
				}
			
		})
		if(PNoFlag){
			ProStylesArray.push(obj)
		}else{
			$.errorFun('物料编号有重复不允许添加！');
			return false;
		}
		if(SpecCFlag){
			SpecCodeArray.push(obj)
		}else{
			$.errorFun('规格编码有重复不允许添加！');
			return false;
		}
	}

	if(ProState){
		var outData = EditDataArray;
		if(JSON.parse(outData.Custom).settings){
			var outCustom = JSON.parse(outData.Custom).settings.item;
		}else{
			var outCustom = JSON.parse(outData.Custom);
		}

		obj.map(function(index, elem) {
			var CKey = index.name;
			outCustom.map(function(aindex, aelem) {
				if(CKey == aindex.key){
					aindex.type = index.type;
					aindex.value = index.value;
				}
			})
			if(JSON.stringify(outCustom).indexOf('"'+CKey+'"') == -1){
				outCustom.push({
					key: index.id,
					value: index.value,
					text: ''
				})
			}
		})
	    outData.Custom = JSON.stringify(outCustom);
		ajax({
			url: 'add-attribute',
			type: 'POST',
			dataType: 'JSON',
			data: outData,
			success: function(data){
				if(data.Status == 1){
					getChildrenProduct(EditDataArray.ProductCode);
					$('#product-buttons').show();
				}else{
					$.errorFun('新增产品属性失败，请稍后尝试！');
				}
			},
			error: function(error){
				$.errorFun('新增产品属性失败，请稍后尝试！');
			}
		});
		
	}else{
		$('#product-styles-submit').html('');
		ProStylesArray.map(function(index, elem) {
			var ProStylesString = '';
			for(var key in index){
				ProStylesString += index[key].value+' / '
			}
			var btn = `<div style='float:right;'><button  onclick="GetupdateProStyles(${elem})" class="btn btn-primary">修改</button><button onclick="DelProStyles(${elem})" class="btn btn-danger">删除</button></div>`
			var ProStylesHtml = `<td>${elem+1}. ${ProStylesString + btn} </td>`;
			$('#product-styles-submit').append(`<tr id="style${elem}">${ProStylesHtml}</tr>`);
		})

		$('#product-styles').hide();
		ProStylesBtnInfo('ProStylesAddsBtn');
	}
	
}

function DelProStyles(index){
	$('#dialog_Prodel').remove();
	if(ProState){
		jQuery("body").append('<div id="dialog_Prodel" title="删除"><p>Ps:如最后一条产品属性删除，此产品也被删除！是否删除！</p></div>');
	}else{
		jQuery("body").append('<div id="dialog_Prodel" title="删除"><p>Ps:是否删除！</p></div>');
	}
    
    if(IsPC()){
        var delwidth = 600;
    }else{
        var delwidth = 'auto';
    }
    $('#dialog_Prodel').dialog({
        autoOpen : false,
        width : delwidth,
        resizable : false,
        modal : true,
        title : '删除操作',
        buttons : [{
            html : "<i class='fa fa-trash-o'></i>&nbsp; 删除",
            "class" : "btn btn-danger",
            click : function(e) {
            	var dialogThis = $(this);
            	if(ProState){
            		ajax({
            			url: 'del-attribute',
            			type: 'POST',
            			dataType: 'json',
            			data: {ProductNo: ProductNoArray[index]},
            			success: function(data){
            				if(data.Status){
            					if(ProductNoArray.length > 1){  //如果此产品子编号只剩一位删除成功之后此产品就不存在
            						getChildrenProduct(EditDataArray.ProductCode);
            						
            					}else{
            						$("#wid-id-form").slideUp(300);
            						$("#refresh_jqgrid").click();
            					}
            					
            					dialogThis.dialog("close");
            				}
            			},
            			error: function(error){
            				$.errorFun('删除失败！请稍后尝试！')
            			}
            		});
            	}else{
            		ProStylesArray.splice(index,1);
					ProductNoArray.splice(index,1)
					$('#product-styles-submit').html('');
					ProStylesArray.map(function(index, elem) {
						var ProStylesString = '';
						for(var key in index){
							ProStylesString += index[key].value+' / '
						}
						var btn = `<div style='float:right;'><button  onclick="GetupdateProStyles(${elem})" class="btn btn-primary">修改</button><button onclick="DelProStyles(${elem})" class="btn btn-danger">删除</button></div>`
						var ProStylesHtml = `<td>${elem+1}. ${ProStylesString + btn} </td>`;
						$('#product-styles-submit').append(`<tr id="style${elem}">${ProStylesHtml}</tr>`);
					})
					$('#product-styles').hide();
					ProStylesBtnInfo('ProStylesAddsBtn');
					$(this).dialog("close");
            	}
            	$('#product-buttons').show();
            }
        }, {
            html : "<i class='fa fa-times'></i>&nbsp; 取消",
            "class" : "btn btn-default",
            click : function() {
                $(this).dialog("close");
            }
        }]
    });
    $('#dialog_Prodel').dialog("open");
	
}

function RegisNoBlur(){
	$('#Table1').on('blur','#RegisNo',function(event) {
		var $this = $('#RegisNo');
		if($this.val() && $this.val() != '' && $this.val().length >= 6){
			var subVal = $this.val().substr($this.val().length-6,$this.val().length);
			var subCType = $this.val().substr(0,2);
			if(subCType == 'PD'){
				$('#CertifType').val(1);
			}else if(subCType == 'WP'){
				$('#CertifType').val(2);
			}else if(subCType == 'LS'){
				$('#CertifType').val(3);
			}
			if(/^\d{6}$/.test(subVal)){
				$('#CertifNo').val(subVal);
				$('#rulesCertifNo').hide();
			}else{
				$('#CertifNo').val('');
				$('#rulesCertifNo').show();
			}
			
		}
	});
}

function LeftModelJQUI(){
	$('#Table1').html(TABLE_NYCP_MODEL_LEFT);
	iTime('#ExpireTime,#BeginTime')
}

//var vimg=document.getElementById('cpimg');
$(function(){
	var jQGridData = GetHeaders();
	console.log(jQGridData.colModel);

	var colModel = jQGridData.colModel.map(function(index, elem) {
		if(index.name != 'ProductCode' && index.name != 'ProductName' && index.name != 'CreateTime'){
			console.log(index.name);
			index.sortable = false;
		}
		return index;
	})
	console.log(colModel);
	jQuery('#jqgrid').jqGrid({
        sortable: false,
        url: _path + 'productvague/?v=',
        datatype: "json",
        mtype: 'get',
        multiselect: false,//多选框禁用
        autowidth: true,
        height: 'auto',
        search: true,
        rowNum: 10,
        rowList: [10, 20, 50],
        pager: '#pjqgrid',
        viewrecords: true,
        sortorder: "desc",
        sortname: "ProductCode",
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
            sort: 'sort', // 表示用于排序的列名的参数名称
            order: 'rise', // 表示采用的排序方式的参数名称
            search:null, // 表示是否是搜索请求的参数名称
        },
		colNames: jQGridData.colNames,
	    colModel: jQGridData.colModel,
	    loadBeforeSend: function (request) {
            request.setRequestHeader("Token",dataList.Key);
        },
		gridComplete: function () {
			qxC();//权限控制
		},
		loadComplete: function (data) {
		    //console.log(data)
		    //console.log(data.list)//为所有数据行，具体取决于reader配置的root或者服务器返回的内容
		    cpdata = data;
		    var ids = jQuery("#jqgrid").jqGrid('getDataIDs'),
		    	SupplierNameU,se,ca;
		    if('rows' in data){
				for (var i = 0; i < ids.length; i++) {
					var CrTime = timeMat(data.rows[i].CreateTime),
					ProductName = data.rows[i].ProductName,
					ProductCode = data.rows[i].ProductCode,
					cl = ids[i];
					var upName = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' style='float:right;' data-original-title='Save Row' onclick=\"updateName('" + cl + "','" + data.rows[i].ProductId + "');\"> <i class='fa fa-pencil'></i> </button>";
					var upCode = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' style='float:right;' data-original-title='Save Row' onclick=\"updateCode('" + data.rows[i].ProductCode + "','" + data.rows[i].ProductNo + "');\"> <i class='fa fa-pencil'></i> </button>";
					var se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].ProductId + "','" + data.rows[i].ProductNo + "','" + data.rows[i].ProductCode + "');\"> <i class='fa fa-pencil'></i> </button>";
					var styleUP = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改产品属性' data-original-title='Save Row' onclick=\"updateStyle('" + cl + "','" + data.rows[i].ProductCode + "');\"> <i class='fa fa-wrench'></i> </button>";
					var ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].ProductCode + "');\"> <i class='fa  fa-trash-o'></i> </button>";
					var sps = "<button class='btn btn-xs btn-default' data-qx='查看' title='产品属性' data-original-title='Cancel' onclick=\"selectProStyles('" + cl + "','" + data.rows[i].ProductId + "');\"> <i class='fa fa-tags'></i> </button>";
				    
				    jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
						act: se + styleUP + ca + sps,
						CreateTime: CrTime,
						ProductName: ProductName + upName,
						ProductCode: ProductCode + upCode 
					});
				}
			}else{
				$.errorFun('数据格式错误!');
			}
		}
	})
	var grid = $('#jqgrid');

    var columnNames = grid.jqGrid('getGridParam','colModel');
    // for (i = 0; i < columnNames.length; i++) {
    //      grid.setColProp(columnNames[i].index, { sortable: false });
    // }
    grid.jqGrid('navGrid', '#pjqgrid', {
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

	RegisNoBlur();
    unit();
	Parent();
	productSel();
    
	$("#search-div").click(function(event) {
		var searchVal = $("#search-html").val(),
		brand = $('#Brand').val(),
		path = _path+"productvague/?v="+searchVal+'&brand='+brand;
    	jQuery("#jqgrid").jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
	});

	
	//添加产品
	$("#add").click(function() {
		var iflag = true;
		$('#iform .default').find('input:not(.noNull),select').each(function(index, el) {
			if($(this).val()){
				iflag = true;
			}else{
				iflag = false;
				return false;
			}
		});

		if(iflag){
			formValidator();
			var validateList = $('#product-styles .NotNull'),
				validateFlag = true,
				validateText = '';
			$.each(validateList,function(index, el) {
				if(!$(el).find('input:text,select,input:checkbox:checked,input:radio:checked').val()){
					validateText += $(el).prev().text()+'，';
					validateFlag = false;
				}
			});
			if(!validateFlag){
				$.errorFun(validateText+'数据请填写完整');
				return validateFlag;
			}
			var values = {};
			$('#iform').bootstrapValidator('validate');
			var inputList = $('#iform .default').find('input,select,textarea');
			$.each(inputList,function(index,item){
				values[$(item).attr('id')] = $(item).val();
			})
			
			var appendList = $('.append').find('input,select,textarea');
			if(PRODUCT_TYPE == 'FARMING_PRO'){
				var firstObj = {
					name : $('#ProductNo').attr('data-name'),
					type : $('#ProductNo').attr('data-type'),
					id : $('#ProductNo').attr('id'),
					value : $('#ProductNo').val()
				}
				var appendChirenList = [firstObj];
			}else{
				var appendChirenList = [];
			}
			$.each(appendList,function(index,item){
				var appendChirenObj = {};
				if($(item).val()){
					appendChirenObj.name = $(item).attr('data-name');
					appendChirenObj.type = $(item).attr('data-type');
					appendChirenObj.id = $(item).attr('id');
					appendChirenObj.value = $(item).val();
					appendChirenList.push(appendChirenObj);
				}
			})

			values.TagNo = PRODUCT_TYPE;
			if(appendChirenList.length){
				values.Custom = JSON.stringify(appendChirenList);
			}else{
				values.Custom = '';
			}
			
			$('#TagNo').val();
	    	if($('#TagNo').val() == 'FARMING_PRO' && values.Custom == ''){
	    		$.errorFun('请输入产品详细信息');
	    		return false;
	    	}
		    
			ajax({
				type: "POST",
				url: "cproduct",
				data: values,
				success: function(data){
					if(data.Status){
						ProStylesArray = [];  //初始化产品属性
						ProductNoArray = [];
						SpecCodeArray = [];
						$("#wid-id-form").slideUp(300);
						ReturnAjax({data:data});
					}else{
						$.errorFun("编号或编码重复，请确认信息后添加！");
					}
				},
				error: function(message){
					$.errorFun("添加产品失败，请稍后尝试");
				}
			});
			return false;
			
		}else{
			$.errorFun('信息请填写完整');
			$('#iform').bootstrapValidator('validate');
			return false;
		}
		return false;
	});
	$('#modal_link').click(function () {//点击显示弹出框
		$('#TagNo').attr("disabled",false);
		$('#SpecCode').attr("readonly",true);
		PRODUCT_NAME = $('#TagNo option:checked').text();
		PRODUCT_TYPE = $('#TagNo').val();
		$("#click-title").html('添加'+PRODUCT_NAME);
		$('#ProStyleSec').css('width','48%').show();
		ProState = false;

		$('#closeSection').hide();
		
	    $("#wid-id-form").slideDown(300);

	    $("#add").show();
	    $("#update").hide();
	    $('#product-buttons').hide();
		$('#product-styles,#product-styles-submit').empty();
	    if(PRODUCT_TYPE == 'FARMING_PRO'){
	    	LeftModelJQUI();//生成农药基础属性模版并追加inputJQUI事件
	    	$('#product-styles').html(TABLE_NYCP_MODEL_RIGHT).show();
	    }else if(PRODUCT_TYPE == 'PPP2_PRO'){
	    	$('#Table1').empty();
	    	$('#product-styles').html(TABLE_OTHER_MODEL_RIGHT).show();
	    }
	    
		$('#iform').show();
		// ProStylesBtnInfo('ProStylesReturnBtn');
	    reset();//清空表单
	    $('#TagNo').val(PRODUCT_TYPE);
	    formValidator();
	    $("#ProductCode").attr("readonly",false);
	    ProStylesArray = [];
	    ProductNoArray = [];
	    SpecCodeArray = [];
	    return false;
	});
	
	if(IsPC()){
        $("#dialog-message").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 740,
		    height: 550,
		});

		$("#dialog-StylesMessage").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 740,
		    height: 550,
		});

		$("#dialog-img").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 800,
		    height: 470,
		});
		$("#dialog-upName").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 'auto',
		    height: 'auto',
		});
    }else{
    	$("#dialog-message").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 'auto',
		    height: 'auto',
		});

		$("#dialog-StylesMessage").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 'auto',
		    height: 'auto',
		});

		$("#dialog-img").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 'auto',
		    height: 'auto',
		});

		$("#dialog-upName").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 'auto',
		    height: 'auto',
		});
    }
})

function iformclose(){
	$('#wid-id-form').slideToggle(300);
	ProStylesArray = [];  //初始化产品属性
	ProductNoArray = [];
	SpecCodeArray = [];
	return false;
}
