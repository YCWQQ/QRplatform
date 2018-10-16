var _Obj={},
partsArray = [],
selI=1,
SelArr=[]; //产品选择状态

Tile('ProductName',{//产品智能搜索
    url: 'pro-vague',
    field: 'v',
    dataNo: 'ProductNo',
    dataName: 'ProductName',
    GetValId: 'ProductNo'
});

//表格渲染
function ajax_table() {
	var searchVal = $("#search-html").val();
	jQuery("#jqgrid").jqGrid({
		//data: jqgrid_data,
	    url: _path+"Materiel/get-BomPage/",
	    datatype: "json",
	    mtype: 'get',
		multiselect: false,//多选框禁用
		autowidth: true,
		height: 'auto',
		search: true,
		rowNum: 10,
		rowList: [10, 20, 50],
		pager: '#pjqgrid',
		sortname: 'BomNo',
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
			page:"pageIndex", // 表示请求页码的参数名称
			rows:"pageSize", // 表示请求行数的参数名称
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
		colNames: ['组件编号', '组件名称', '产品名称', '状态','部件数量','备注','创建时间', '操作'],
        colModel: [{
            name: 'BomNo',
            index: 'BomNo',
            align:'center'
        }, {
            name: 'BomName',
            index: 'BomName',
        }, {
            name: 'ProductName',
            index: 'ProductName',
        }, {
            name: 'Paramts',
            index: 'Paramts',
        }, {
            name: 'Count',
            index: 'Count',
        },{
            name: 'Remark',
            index: 'Remark',
        },{
            name: 'CreateTime',
            index: 'CreateTime',
        },{
            name: 'act',
            index: 'act',
            width:'80'
        }],
		gridComplete: function () {//加载完之后执行
			qxC();//权限控制
		},
		loadComplete: function (data) {//加载前执行
			_Obj = data.rows;
			var ids = jQuery("#jqgrid").jqGrid('getDataIDs');   
			if('rows' in data){
				for (var i = 0; i < ids.length; i++) {
					var cl = ids[i];
					var CrTime = timeMat(data.rows[i].CreateTime);
					var Paramts = data.rows[i].Paramts[0];
					Paramts == 0 ? Paramts='失效' : Paramts='正常';
					se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + data.rows[i].BomNo + "','" + data.rows[i].BomId + "');\"><i class='fa fa-pencil'></i></button>";
					ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + data.rows[i].BomNo + "');\"><i class='fa  fa-trash-o'></i></button>";
					jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
						act: se + ca,
						CreateTime: CrTime,
						Paramts: Paramts
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
			BomNo : {
				validators : {
					notEmpty : {
						message : '组件单编号为必填项'
					},
					regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
				}
			},
			BomName : {
				validators : {
					notEmpty : {
						message : '组件单名称为必填项'
					}
				}
			}
		}
	})//表单验证end
}
//修改数据
function updateRow(No,uId) {
	formValidator();
	$('#BomNo').attr("disabled",true);
    reset();
    parts();
    $("#click-title").html("修改组件");
	$("#wid-id-form").slideDown(500);
    $("#update").show();
    $("#add").hide();
    $("#add-tbody").children('tr').remove();//清空table
    $("#add-tbody").html('<tr><td colspan="3" style="color:red">您未添加部件，请点击智能索引来选择您需要添加的部件然后点击修改！</td></tr>');
    ajax({
    	url: 'Materiel/get-BomInfo',
    	type: 'GET',
    	dataType: 'json',
    	data: {BomNo: No},
    	success: function(data){
    		var DetailList = data.DetailList;//部件详细信息
    		$("#iform").find("input,select,textarea").each(function(i,item){
		        $("#"+$(item).attr("id")).val(data[$(item).attr("id")]);
		    });

    		//部件信息还原
    		if(DetailList.length){
    			$('#add-tbody').empty();
    			$.each(DetailList,function(index, el) {
    				var td1 = "<tr class='trueVal' id='tr"+selI+"'><td><select id='cp-select" + selI + "' name='cp_select" + selI + "' class='parts form-control'><option value='"+el.ParsNo+"'>"+el.ParsName+" ("+el.ParsNo+")</option></select></td>"
			        var td2 = "<td><input class='form-control' name='spinner" + selI + "' min='1'  id='spinner" + selI + "' mi value='"+el.Count+"' type='number' ></td>";
			        var td3 = "<td><div class='btn btn-sm btn-danger' onclick=trDel('tr"+selI+"') class='' title='删除产品'>"
			                    +"<span class='fa fa-times'></span>"
			                    +"</div></td></tr>";
			        selI++;
			        $('#add-tbody').append(td1 + td2 + td3);
			        parts();
			        chang();
    			});
    		}
    	}
    });
    
    
    var param={};
    param.BomNo = No;
    var Count = 0;
    $("#update").unbind("click").click(function() {
    	var params = $("#iform").serializeArray();
		for(var item in params){
            param[params[item].name] = params[item].value;
        }
        var ParsNo = [];
        var tr = $('#add-tbody').find('tr.trueVal');
        tr.each(function(index, el) {
        	var val1 = $(this).children('td:nth-child(1)').children().val();
        	var val2 = $(this).children('td:nth-child(2)').children().val();
        	var ParsObj = {PartNo:val1,Count:val2};
        	Count = Count+Number(val2);
        	ParsNo.push(ParsObj);
        });
        param.Count = Count;
        param.ParsNoInfo = JSON.stringify(ParsNo);
        ajax({
        	type:"POST",
        	url:"Materiel/upt-bom",
        	data:param,
        	success:function(data){
				$("#wid-id-form").slideToggle(1000);
        		ReturnAjax({
        			data:data,
        			DiyFunction:function(){
						reset();
						
        			}
        		});
        	},
        	error:function(error){
        		$.errorFun("更新失败，请稍后重试");
        	}
        })
		return false;
	})
}
//删除数据
function delRow(No) {
	$.delFun("Materiel/del-bom","BomNo",No);//1：接口名称  2：参数名称  3：参数值
}

//部件下拉
function parts(){
	var option = "";
    ajax({
        url: "Materiel/get-pars/?Size=1000&Index=1",
        success: function (data) {
             if(data){
             	partsArray = data.rows;
                $(data.rows).each(function (i) {
                    option += "<option value='"+ data.rows[i].ParsNo +"'>"+ data.rows[i].ParsName +" （"+data.rows[i].ParsNo+"）</option>";
                })
                $(".parts").append(option);
                $(".parts").removeClass('parts');
            }
        },
        error: function (message) {
            $.errorFun("获取产品信息失败，请刷新页面！");
        }
    })
}

$(function(){
	ajax_table();

	//搜索
	$("#search-div").click(function(event) {
		var searchVal = $("#search-html").val(),
		path = _path+"Materiel/get-bom-vague/?v="+searchVal;
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

	        var ParsNo = [];
	        var tr = $('#add-tbody').find('tr');
	        tr.each(function(index, el) {
	        	var val1 = $(this).children('td:nth-child(1)').children().val();
	        	var val2 = $(this).children('td:nth-child(2)').children().val();
	        	var ParsObj = {PartNo:val1,Count:val2};
	        	ParsNo.push(ParsObj);
	        });

	        param.ParsNoInfo = JSON.stringify(ParsNo);

	    	ajax({
				type:"POST",
				url:"Materiel/add-bom",
				data:param,
				success: function(data){
					$("#wid-id-form").slideToggle(1000);
					ReturnAjax({
	        			data:data,
	        			DiyFunction:function(){
							reset();
	        			}
	        		});
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
	    $("#click-title").html("添加组件单");
	    $("#wid-id-form").slideToggle(1000)
	    $("#add").show();
	    $("#update").hide();
	    reset();//清空表单
	    formValidator();
	    $('#BomNo').attr("disabled",false);
	    $("#add-tbody").children('tr').remove();//清空table
	    $('#add-ui').click();
	    parts();
	    return false;
	});
	$("#dialog-message").dialog({//弹出框设置
	    autoOpen: false,
	    modal: true,
	    width: 650,
	    height: 470,
	});

	$('#add-ui').click(function () {
        var td1 = "<tr class='trueVal' id='tr"+selI+"'><td><select id='cp-select" + selI + "' name='cp_select" + selI + "' class='parts form-control'><option value='0'>请选择</option></select></td>"
        var td2 = "<td><input class='form-control' name='spinner" + selI + "' min='1'  id='spinner" + selI + "' mi value='1' type='number' ></td>";
        var td3 = "<td><div class='btn btn-sm btn-danger' onclick=trDel('tr"+selI+"') class='' title='删除产品'>"
                    +"<span class='fa fa-times'></span>"
                    +"</div></td></tr>";
        selI++;
        $('#add-tbody').append(td1 + td2 + td3);
        parts();
        chang();
    })

})

function iformclose(){
	$('#wid-id-form').slideToggle(1000);
	return false;
}

function chang(){
    sel();
    $('#add-tbody select').unbind('change').change(function(){
      if(SelArr.length>0){
            if(SelArr.includes($(this).val())){
                $.errorFun('发货单不能出现重复产品,请重新选择！','#add-tbody');
                return false;
            }
        }
        sel();
    });
}

function sel(){
    SelArr=[];
    $('#add-tbody select').each(function(i,item){ //查询所有下拉的 产品 过滤为0的
          if($(item).val()!='0'){
              SelArr.push($(item).val());
          }
    });
}

function PartsIntelligence(){
	var thisval = $('#BomNo').val();
	var option = '';
	var num = selI;//记录自增
	if(thisval){
		console.log(thisval);
		$('#add-tbody').empty();
		//生成相关索引部件
		partsArray.forEach(function(val,index,array){ //这里定义的item与上面each的index作用一样 名字
			if(val.ParsNo.indexOf(thisval)>-1){
				var td1 = "<tr class='trueVal' id='tr"+selI+"'><td><select id='cp-select" + selI + "' name='cp_select" + selI + "' class='parts form-control'><option value='0'>请选择</option></select></td>"
		        var td2 = "<td><input class='form-control' name='spinner" + selI + "' min='1'  id='spinner" + selI + "' mi value='1' type='number' ></td>";
		        var td3 = "<td><div class='btn btn-sm btn-danger' onclick=trDel('tr"+selI+"') class='' title='删除产品'>"
		                    +"<span class='fa fa-times'></span>"
		                    +"</div></td></tr>";
		        selI++;
		        $('#add-tbody').append(td1 + td2 + td3);
			}
		})

		//生成后组件下拉
		$(partsArray).each(function (i) {
            option += "<option value='"+ partsArray[i].ParsNo +"'>"+ partsArray[i].ParsName +"（"+partsArray[i].ParsNo+"）</option>";
        })
        $(".parts").append(option);
        $(".parts").removeClass('parts');

        //智能索引组件赋值
        partsArray.forEach(function(val,index,array){ //这里定义的item与上面each的index作用一样 名字
			if(val.ParsNo.indexOf(thisval)>-1){
		        $('#cp-select'+num).val(val.ParsNo);
		        num++;
			}
		})
	}else{
		$('[data-bv-for="BomNo"]').show();
	}
	return false;
}

function trDel(Id){
    $("#"+Id).remove();
}

function PartsIntelligenceS(){
	var val = $('#BomNo').val();
	ajax({
		url: 'Materiel/get-ParsListByBom/',
		type: 'GET',
		dataType: 'JSON',
		data: {BomNo: val},
		success: function(data){
			if(data.length){
				$('#add-tbody').empty();
				data.forEach(function(val,index,array){
					var td1 = "<tr class='trueVal' id='tr"+selI+"'><td><select id='cp-select" + selI + "' name='cp_select" + selI + "' class='parts form-control'><option value='0'>请选择</option></select></td>"
			        var td2 = "<td><input class='form-control' name='spinner" + selI + "' min='1'  id='spinner" + selI + "' mi value='1' type='number' ></td>";
			        var td3 = "<td><div class='btn btn-sm btn-danger' onclick=trDel('tr"+selI+"') class='' title='删除产品'>"
			                    +"<span class='fa fa-times'></span>"
			                    +"</div></td></tr>";

			        $('#add-tbody').append(td1 + td2 + td3);
			        var option = '';
			        //生成后组件下拉
					$(partsArray).each(function (i) {
			            option += "<option value='"+ partsArray[i].ParsNo +"'>"+ partsArray[i].ParsName +"（"+partsArray[i].ParsNo+"）</option>";
			        })
			        $(".parts").append(option);
			        $(".parts").removeClass('parts');

			        
			        $('#cp-select' + selI).val(val.ParsNo);

			        selI++;
				})
			}else{
				$("#add-tbody").html('<tr><td colspan="3" style="color:red">没有匹配的部件，请点加号按钮进行添加部件！</td></tr>')
			}
		},
		error: function(data){
			$.errorFun('暂无部件信息');
		}
	});
	return false;
}