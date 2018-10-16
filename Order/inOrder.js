//表格渲染
var _inOrder = [], //总生产订单信息
_team = [],
_scene = [],
_product = [],
_objTable = {}
selI=3;
var addNUM = 0;
function ajax_table() {
    var jQgridData = GetHeaders(false);
    (jQgridData.colNames).push('操作');
    (jQgridData.colModel).push({
        name: 'ace',
        index: 'ace',
    });
    var grid = $("#jqgrid");
    if($("#StartTime").val()!='' && $("#FinshTime").val()!=''){
        var StartTime = $("#StartTime").val();
        var FinshTime = $("#FinshTime").val();
    }else{
        var myDate = new Date();//获取当前年
        var fYear = myDate.getFullYear();
        var fMonth = p(myDate.getMonth()+1);//获取当前月
        var fDate = p(myDate.getDate());//获取当前日
        var FinshTime = fYear+'-'+fMonth+"-"+fDate+' 23:59:59';
        var StartTime = fYear+'-'+fMonth+"-"+fDate+' 00:00:00';
        $("#StartTime").val(StartTime);
        $("#FinshTime").val(FinshTime);
    }
    var ProductNo = $('#ProductNo select').last().val() || '';
    var Status = $("#Status").val(),
        ono = $("#oNo-serach").val(),
        sno = $("#SceneNo").val();
    var path = '';
    path = _path+"porderlist/?sTime="+StartTime+"&fTime="+FinshTime+"&PNo="+ProductNo+"&ono="+ono+"&sno="+sno;
    grid.jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
	jQuery("#jqgrid").jqGrid({
		//data: jqgrid_data,
	    url: path,
	    datatype: "json",
	    mtype: 'get',
		multiselect: false,//多选框禁用
		autowidth: true,
		height: 'auto',
		search: true,
		rowNum: 10,
		rowList: [10, 20, 50],
		pager: '#pjqgrid',
		sortname: 'OrderNo',
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
		colNames: jQgridData.colNames, //'详情'],
        colModel: jQgridData.colModel,
		gridComplete: function () {//加载完之后执行
			qxC();//权限控制
		},
        loadBeforeSend: function (request) {
            request.setRequestHeader("Token",dataList.Key);
        },
		loadComplete: function (data) {//加载前执行
		    //console.log(data)
		    //console.log(data.list)//为所有数据行，具体取决于reader配置的root或者服务器返回的内容
		    var ids = grid.jqGrid('getDataIDs');
            _inOrder = [];
            _inOrder = data.rows;

            for(var item = 0; item < ids.length; item++){
                var status = data.rows[item].Status,
                    count = data.rows[item].Count,
                    Issued = data.rows[item].Issued,
                    sOrderId = data.rows[item].OrderDetailId,
                    OrderNo = data.rows[item].OrderNo;
                var CrTime = timeMat(data.rows[item].CreateTime);
                var se = '';
                var xq = `<a href="javascript:OrderSearch('${OrderNo}','');" title="点击查看订单详情" class="abtn btn btn-primary">详情</a>`;
                if(status == '已完成' || status == '禁用'){
                    se = '<a style="width:100px;" class="abtn btn btn-primary disabled" data-qx="修改"  title="订单已完成"><i class="fa fa-check"></i> 已完成</a>'; 
                }else{
                    se = '<a style="width:100px;" href="javascript:UorderStatus(\''+sOrderId+'\');" title="订单未完成，点击强制完成" data-qx="修改" class="abtn btn btn-primary"><i class="fa fa-check"></i> 完成订单</a>';
                }

                var cp = `<a class="btn btn-primary btn-sm" href="javascript:upBatch(${item},${data.rows[item].OrderId},${data.rows[item].OrderNo});">加批号</a>`;
                grid.jqGrid('setRowData', ids[item], {
                    CreateTime: CrTime,
                    ace: xq+cp+se
                });
                
                
            }
            
            var colorList = ['#2196F3','#CC3333','#CC9933','#6633CC','#333333','#FF9900','#FF0099','#336633','#FF0000','#003333']
            var bgLeft = [];
			for (let j = 0; j < ids.length; j++) {
                var OrderNo = data.rows[j].OrderNo;

                if($.inArray(OrderNo, bgLeft)<0){
                    bgLeft.push(OrderNo);
                }

				$("[title='"+OrderNo+"']").attr("onclick","tigTable("+j+",this,event)");
                $("[title='"+OrderNo+"']").css({
                    color: '#3276b1',
                    cursor: 'pointer'
                });
			}
            var bgLeftObj = [];
            bgLeft.forEach(function(val, index, array){
                bgLeftObj.push({name:val,color:getRandomColor()});
            })

            bgLeftObj.forEach(function(val, index, array){
                $("[title='"+val.name+"']").css({
                    'border-left': 'solid 15px '+val.color
                });
            })
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
        search : false,
        refreshtext:' 刷新'
	});
	//jQuery("#jqgrid").jqGrid('filterToolbar', { searchOperators: true });
	/* Add tooltips */
	$('.navtable .ui-pg-button').tooltip({
		container: 'body'
	});

	jqGridUi();//jqGrid UI
}

//生产订单查询
/**
 * [OrderSearch 查询生产单详情]
 * @AuthorHTL
 * @DateTime  2018-09-10T11:52:27+0800
 * @param     {[type]}                 No       [传入的生产订单编号]
 * @param     {[type]}                 ParentNo [上级编号，此处可为空]
 */
function OrderSearch(No,ParentNo){
    console.log(No);
    ajax({
        url: "proNo/",
        data: {
            Order:No,
            parent:ParentNo,
            permit:dataList.PermitNo
        },
        beforeSend: function(res){
            res.setRequestHeader('Token',dataList.Key)
        },
        success: function(data){
            $('#dialog-search').dialog('open');//打开弹窗
            var $dom = $('#InOrderStatus'),
            html = ``;
            if(data.length){
                data.map(function(index, elem) {
                    var Code = No;
                    if(index.ParentNo){
                        Code = index.No
                    }
                    console.log(Code);
                    html += `<tr id="Searchtr${elem}" class="addChildren">
                                <td><i title="点击查询所属码" onclick="OrderSearchProCode('${Code}','${index.ParentNo || index.No}',this)" class="fa fa-plus-square"></i><i style="display:none" onclick="clearProCode(this)" class="fa fa-minus-square"></i></td>
                                <td >${index.No}</td>
                                <td >${index.FirstStatus === true ? '是' : '否'}</td>
                                <td >${index.SecondStatus === true ? '是' : '否'}</td>
                                <td >${index.ThreeStatus === true ? '是' : '否'}</td>
                                <td >${index.FourStatus === true ? '是' : '否'}</td>
                                <td >${index.LastStatus === true ? '是' : '否'}</td>
                                <td >${index.Qty}</td>
                                <td >${index.CreateTime}</td>
                            </tr>`;
                })
                $dom.html(html);
            }

        },
        error:function(message){
           
        }
    })

}

//所属生产订单下级编码查询
function OrderSearchProCode(No,ParentNo,self) {
    var $dom = $(self).parents('tr');
    $dom.find('td:first').find('i').hide();
    if($dom.hasClass('addChildren')){
        $dom.addClass('delChildren').removeClass('addChildren');
        $dom.find('td:first').find('i:last').show();
    }else{
        $dom.addClass('addChildren').removeClass('delChildren');
        $dom.find('td:first').find('i:first').show();
    }
    
    ajax({
        url: "proNo/",
        data: {
            Order:No,
            parent:ParentNo,
            permit:dataList.PermitNo
        },
        success: function(data){
            var childrenThead = `<th>编码号</th>
                                <th>有效</th>
                                <th>检测到</th>
                                <th>采集到</th>
                                <th>完整箱跺</th>
                                <th>虚拟箱号</th>
                                <th>产品码数量</th>`;
            var html = `<div id="children${$dom.attr('id')}"><table class='table table-hover'><thead>${childrenThead}</thead><tbody>`;
            if(data.length){
                data.map(function(index, elem) {
                    html += `<tr id="ChildrenSearchtr${elem}">
                                <td>${index.No}</td>
                                <td >${index.FirstStatus === true ? '是' : '否'}</td>
                                <td >${index.SecondStatus === true ? '是' : '否'}</td>
                                <td >${index.ThreeStatus === true ? '是' : '否'}</td>
                                <td >${index.FourStatus === true ? '是' : '否'}</td>
                                <td >${index.LastStatus === true ? '是' : '否'}</td>
                                <td >${index.Qty}</td>
                            </tr>`;
                })
            }
            html += `</tbody></table></div>`;
            $dom.after(`<tr><td><i>┏</i></td><td colspan="8">${html}</td></tr>`);
        },
        error:function(message){
           
        }
    })
}

//清除下级所属生产订单
function clearProCode(self) {
    var $dom = $(self).parents('tr');
    $dom.find('td:first').find('i').hide();
    if($dom.hasClass('addChildren')){
        $dom.addClass('delChildren').removeClass('addChildren');
        $dom.find('td:first').find('i:last').show();
    }else{
        $dom.addClass('addChildren').removeClass('delChildren');
        $dom.find('td:first').find('i:first').show();
    }
    $dom.next().remove();
}

function UorderStatus(uoID){
    $("#status-text").val('');
      $("#dialog-status").dialog({
            autoOpen: false,
            modal: true,
            width: 300,
            height: 200,
            buttons : [{
                html : "<i class='fa fa-save'></i>&nbsp; 保存",
                "class" : "btn btn-primary",
                    click : function() {
                        ajax({
                            url: '/uporderDetail',
                            type: 'POST',
                            datatype:'json',
                            data: {
                                OrderDetailId: uoID,
                                Status: 1,
                                Remark: $("#status-text").val()
                            },
                            success: function(data){
                                if(data.Status==1){
                                    $("#refresh_jqgrid").click();
                                    return false;
                                }
                                else if(data.Status==2){
                                    $.errorFun("数据输入错误，请重新添加");
                                    return false;
                                }
                                else{
                                    $.errorFun("编号重复");
                                    return false;
                                }
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
        $('#dialog-status').dialog('open');  
}

function upBatch(trId,uOrderId,uOrderNo){
    $('#click-title').text('新增批号');
    formValidator();
     $("#Table1 th:last").hide();
     $("#Table1 thead th:first").hide();
    var updateJson = [];
    $("#ui-id-3").html("生产单");
    $("#wid-id-form").slideDown(300);
    $("#update,#fixedTable,#OrderNoinput").hide();
    $("#add").show();
    reset();
    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_inOrder[trId][$(item).attr("id")]);
    });

    var myDate = new Date();//获取当前年
        var fYear = myDate.getFullYear();
        var fMonth = p(myDate.getMonth()+1);//获取当前月
        var fDate = p(myDate.getDate());//获取当前日
        
        var FinshTime = fYear+'-'+fMonth+"-"+fDate+' 23:59:59';
        var StartTime = fYear+'-'+fMonth+"-"+fDate+' 00:00:00';
        $("#BeginTime").val(StartTime);
        $("#ExpireTime").val(FinshTime);

    $('#Remark').val(_inOrder[trId]['Remarks']);
    $('#PositionGuide').val(_inOrder[trId]['PositionGuide']?'1':'0');
    if(_inOrder[trId].Info){
        var InfoData = JSON.parse(_inOrder[trId].Info);
        InfoData.settings.item.map(function(index, elem) {
            $("#"+index.key).val(index.value);
        })
    }
  
    ajax({
        url:"dporderDetail/",
        data:{
            orderNo:uOrderNo
        },
        success:function(data){
            if(data){
                var json = data;//获取公共变量的 子订单信息
                var op='',oplist='';
                $("#add-tbody").children('tr').remove();//清空table
                $.each(json,function(index, el) {
                    oplist=json[index].BrandNo;
                    if(json[index].ProductCode){
                        oplist+='|'+json[index].ProductCode;
                    }
                    if(json[index].ProductNo){
                        oplist+='|'+json[index].ProductNo;
                    }
                    op=oplist.split('|');
                    var tdA = "<td><select disabled='disabled' id='Auton" + selI + "' name='Auton" + selI + "' class='form-control'><option value=0>默认码</option><option value=1>外来码</option></select></td>";
                    var td = "<tr id='tr"+ selI +"' data-Issued="+ json[index].Issued +">";
                    var td1 = "<td id='All_sel"+selI+"'><select disabled='disabled' id='cp_select" + selI + "' onchange=inOrd_info('cp_select"+selI+"') name='cp_select" + selI + "' class='product' style='height:32px;width: 90px;border: 1px solid #ccc;'></select></td>";
                    var td2 = "<td><input class='form-control' name='BatchNo" + selI + "'' id='BatchNo" + selI + "' value='"+json[index].BatchNo+"' type='text' ></td>";
                    var td3 = "<td><select disabled='disabled' id='team" + selI + "' name='team" + selI + "' class='team form-control'></select></td>";
                    var td4 = "<td><select  id='scene" + selI + "' name='scene" + selI + "' data-v='"+json[index].SceneNo+"' class='scene form-control'></select></td>";
                    var td5 = "<td><input class='form-control' name='spinner" + selI + "' id='spinner" + selI + "' value='"+json[index].Count+"' type='text' ></td>";
                    var tds = "<td ><select disabled='disabled' id='meger" + selI + "' name='meger" + selI + "' class='meger form-control'></select></td>";
                    var td6 = "<td><div class='btn btn-sm btn-danger' onclick=trDel('tr"+selI+"') class='' title='删除产品'>"
                                +"<span class='fa fa-times'></span>"
                                +"</div></td></tr>"
                    $('#add-tbody').prepend(td + td1 + td2 + td3 + td4 + td5 + tds + tdA +td6);
                    team();
                    meger();
                    scene();
                    if(json[index].Auton){
                        $("#Auton"+selI +" option:last").prop("selected", 'selected');
                    }else{
                        $("#Auton"+selI +" option:first").prop("selected", 'selected');
                    }
                    $("#team"+selI).val(json[index].TeamNo);
                    $('#scene'+selI).val(json[index].SceneNo);
                    $('#meger'+selI).val(json[index].MergeNo);
                    console.log('#meger'+selI);
                    console.log(json[index].MergeNo);
                    product(); 
                    if(op){
                        let all_sel=$('#tr'+ selI+' td:first')
                        op.map((item,i)=>{
                            let $id=all_sel.children('select').eq(i);
                            if(op.length==2&&i==1){
                                $id.val(item);
                            }else{
                                  $id.children('option[data-no="'+item+'"]').attr('selected', 'selected');
                                  $id.change(); 
                            }
                            $id.prop("disabled","disabled");
                            $id.css("background-color",'#eee');
                        })
                    }
                    selI++;
                });
                $('#add-tbody tr[data-issued!="0"]').find('input,select,div').attr('disabled',true).removeAttr('onclick');
            }
        }
    });
}

function formValidator(){
    $('#iform').data('bootstrapValidator', null);
    //表单验证 
    $('#iform').bootstrapValidator({
        feedbackIcons:{
            valid:'glyphicon glyphicon-ok',
            invalid:'glyphicon glyphicon-remove',
            validating:'glyphicon glyphicon-refresh'
        },
        fields:{
            OrderNo:{
                validators:{
                    notEmpty:{
                        message:'生产订单号为必填项',
                    },
                    regexp:{/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp:/^[a-zA-Z0-9_\.]+$/,
                        message:'只能是数字和字母'
                    }
                }
            },
            OrderName:{
                validators:{
                    notEmpty:{
                        message:'订单号名称为必填项',
                    }
                }
            }
        }
    });//表单验证end 
}

function getMyDate(str){  
    var strDa = parseInt(str.substring(6,19));
    var oDate = new Date(strDa),  
    oYear = oDate.getFullYear(),  
    oMonth = oDate.getMonth()+1,  
    oDay = oDate.getDate(),  
    oHour = oDate.getHours(),  
    oMin = oDate.getMinutes(),  
    oSen = oDate.getSeconds(),  
    oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin);//最后拼接时间  
    return oTime;  
}; 
//补0操作
function getzf(num){  
  if(parseInt(num) < 10){  
      num = '0'+num;  
  }  
  return num;  
}

//修改数据好的
function updateRow(trId,uId,uOrderNo) {
    $('#click-title').text('修改');
	formValidator();
     $("#Table1 th:last").hide();
     $("#Table1 thead th:first").hide();
    var Top_tr = $("#" + trId).children("td:not(:last),td:not(:first)");
    var updateJson = [];
    $("#ui-id-3").html("修改生产单");
    $('#fixedTable').hide();
    $("#wid-id-form").slideDown(300);
    if(_inOrder[trId].Status != '未完成' ||_inOrder[trId]['Issued']>0){
        $("#update").hide();
    }else{
        $("#update").show(); 
    }
    
    $("#add").hide();
  
    $("#OrderNo").attr("disabled",true);//禁止修改单号
    $("#OrderNoinput").show();
    reset();
    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_inOrder[trId][$(item).attr("id")]);
    });
    $('#BeginTime').val(getMyDate(_inOrder[trId]['BeginTime']));
    $('#ExpireTime').val(getMyDate(_inOrder[trId]['ExpireTime']));
    $('#Remark').val(_inOrder[trId]['Remarks']);
    $('#PositionGuide').val(_inOrder[trId]['PositionGuide']?'1':'0');
    if(_inOrder[trId].Custom){
        var InfoData = JSON.parse(_inOrder[trId].Custom);
        if(Array.isArray(InfoData.settings.item)){
            InfoData.settings.item.map(function(index, elem) {
                $("#"+index.key).val(index.value);
            })
        }else{
            var Arr=InfoData.settings.item;
            $("#"+Arr['key']).val(Arr['value']);
        }
    }
  
    ajax({
        url:"dporderDetail/",
        data:{
            orderNo:uOrderNo
        },
        success:function(data){
            if(data){
                var json = data;//获取公共变量的 子订单信息
                var op='',oplist='';
                $("#add-tbody").children('tr').remove();//清空table
                $.each(json,function(index, el) {
                    oplist=json[index].BrandNo;
                    if(json[index].ProductCode){
                        oplist+='|'+json[index].ProductCode;
                    }
                    if(json[index].ProductNo){
                        oplist+='|'+json[index].ProductNo;
                    }
                    op=oplist.split('|');
                    var tdA = "<td><select id='Auton" + selI + "' name='Auton" + selI + "' class='form-control'><option value=0>默认码</option><option value=1>外来码</option></select></td>";
                    var td = "<tr id='tr"+ selI +"' data-Issued="+ json[index].Issued +">";
                    var td1 = "<td id='All_sel"+selI+"'><select id='cp_select" + selI + "' onchange=inOrd_info('cp_select"+selI+"') name='cp_select" + selI + "' class='product' style='height:32px;width: 90px;border: 1px solid #ccc;'></select></td>";
                    var td2 = "<td><input class='form-control' name='BatchNo" + selI + "'' id='BatchNo" + selI + "' value='"+json[index].BatchNo+"' type='text' ></td>";
                    var td3 = "<td><input id='team" + selI + "' name='team" + selI + "' class='team form-control'></td>";
                    var td4 = "<td><input id='scene" + selI + "' name='scene" + selI + "' data-v='"+json[index].SceneNo+"' class='scene form-control'></td>";
                    var td5 = "<td><input class='form-control' name='spinner" + selI + "' id='spinner" + selI + "' value='"+json[index].Count+"' type='text' ></td>";
                    var tds = "<td ><input id='meger" + selI + "' name='meger" + selI + "' class='meger form-control'></td>";
                    var td6 = "<td><div class='btn btn-sm btn-danger' onclick=trDel('tr"+selI+"') class='' title='删除产品'>"
                                +"<span class='fa fa-times'></span>"
                                +"</div></td></tr>"
                    $('#add-tbody').prepend(td + td1 + td2 + td3 + td4 + td5 + tds + tdA +td6);
                    Tile('scene'+selI,{//产线智能搜索
                        url: 'scene_allInfo/',
                        field: 'v',
                        dataNo: 'SceneNo',
                        dataName: 'SceneName',
                        width:220
                    });
                    Tile('meger'+selI,{//箱跺智能搜索
                        url: 'get-megerBottominfoList/',
                        field: 'v',
                        dataNo: 'MergeNo',
                        dataName: 'MergeName',
                        width:300
                    });
                    Tile('team'+selI,{//班组智能搜索
                        url: 'Team-optionList/',
                        field: 'v',
                        dataNo: 'TeamNo',
                        dataName: 'TeamName'
                    });
                    if(json[index].Auton){
                        $("#Auton"+selI +" option:last").prop("selected", 'selected');
                    }else{
                        $("#Auton"+selI +" option:first").prop("selected", 'selected');
                    }
                    $("#team"+selI).val(json[index].TeamNo);
                    $('#scene'+selI).val(json[index].SceneNo);
                    $('#meger'+selI).val(json[index].MergeNo);
                    product(); 
                    if(op){
                        let all_sel=$('#tr'+ selI+' td:first')
                        op.map((item,i)=>{
                            let $id=all_sel.children('select').eq(i);
                            if(op.length==2&&i==1){
                                $id.val(item);
                            }else{
                                  $id.children('option[data-no="'+item+'"]').attr('selected', 'selected');
                                  $id.change(); 
                            }
                        })
                    }
                    selI++;
                });
                $('#add-tbody tr[data-issued!="0"]').find('input,select,div').attr('disabled',true).removeAttr('onclick');
            }
        }
    });
    
    $("#update").unbind("click").click(function() {
        var html='';
        var tr = $('#add-tbody').find('tr');
        var td = $('#add-tbody').children("tr").children('td');
        var tdsize = td.size()/tr.size();
        var LastVal = true;
        tr.each(function (index,item) {
            $(this).find('td').each(function (idx,i) {
                var thisVal = $(this).find('input,select,input:radio:checked');

                //判断产品信息是否选择正确
                if(thisVal.attr("id") && thisVal.attr("id").indexOf("cp_select") != -1 && thisVal.last().val() === "0"){
                    LastVal = false;
                    return false;
                }

                if(tdsize-2 > idx){
                    if(thisVal.val()){
                        html += thisVal.last().val()+"|";
                    }
                }else{
                    if(thisVal.val()){
                        html += thisVal.last().val();
                    }
                }
            })
            
            if($('#add-tbody').find('tr').size()-1 != index){
                html += ',';  
            }
        });
        if(!LastVal) {
            $.errorFun('请选择产品！')
            return false;
        }
        sel();
      if(SelArr.length>0){
             if(Array.from(new Set(SelArr)).length != SelArr.length){
                $.errorFun('生产单不能出现重复产品,请重新选择！');
                return false;
             }
        }
        if (!dataList.PermitNo) {dataList.PermitNo=null;}
        var Info = setStyles('#StylesTbody');
        if(Info && Info['Custom'].length >= 1){
            Info = JSON.stringify(Info['Custom']);
        }else{
            Info = '';
        }
	    ajax({
            url:"uporder",
            type:"POST",
            dataType:'json',
			data:{
				OrderId:uId,
                OrderNo:$('#OrderNo').val(),
	            OrderName:$("#OrderName").val(),
                BeginTime:$("#BeginTime").val(),
	            ExpireTime:$("#ExpireTime").val(),
                PositionGuide:$('#PositionGuide').val(),
	            Remark:$("#Remark").val(),
                CreateBy:_SessionUserName,
                str:html,
                Info:Info
			},
			success: function(data){
				if(data.Status==1){
					$("#refresh_jqgrid").click();
                    reset();
                   $("#wid-id-form").slideUp(300);
                    return false;
				}
				else if(data.Status==2){
                    $.errorFun("数据输入错误");
                    return false;
				}
				else{
                    $("#refresh_jqgrid").click();
                    reset();
                    $('#dialog-message').dialog('close');
				}
			},
			error: function(message){
				$.errorFun("更新操作失败，请稍后尝试");  
			}
		});
	})
    return false;
}
//产品
function product(){
   ajax({
        url: "brandlist",
        success: function (data) {
            var html='<option value="">全部</option>';
            $(data).each(function (i) {
               html+="<option data-no='"+data[i].BrandNo+"' value='"+ data[i].BrandId +"'>"+ data[i].BrandName +"</option>";
            })
            $(".product").empty().append(html)
            $(".product").removeClass('product');
            if(!$('#sel_P1').children().length){
                 $('#sel_P1').empty().append(html);
            }  
        },
        error: function (message) {
            $.errorFun("获取产品信息失败");
        }
    })
}


//班组
function team(){
	ajax({
        url: "team-option",
        success: function (data) {
            if(!data){
                return;
            }else{
                $(data).each(function (i) {
                     $(".team").append("<option value='"+ data[i].TeamNo +"'>"+ data[i].TeamName +"</option>");
                })
                $(".team").removeClass('team');
            }
            
        },
        error: function (message) {
            $.errorFun("获取班组信息失败");
        }
    })
}

//规格
function meger(){
    ajax({
        url: "get-megerBottominfoList/?v=",
        datatype:'json',
        type:'GET',
        success: function (data) {
            if(!data){
                return;
            }else{
                $(data).each(function (i) {
                     $(".meger").append("<option data-no='"+data[i].MergeNo+"' value='"+ data[i].MergeNo +"'>"+ data[i].MergeName +"</option>");
                     console.log(1535360180777);
                     if(data[i].MergeNo == 1535360180777){
                        console.log('有此箱跺');
                     }
                })
                $(".meger").removeClass('meger');
            }
            
        },
        error: function (message) {
            $.errorFun("获取箱规信息失败");
        }
    })
}

var sceneData;
function scene(){
    if(!sceneData){
        return;
    }else{
        $(sceneData).each(function (i) {
            $(".scene").append("<option value='"+ sceneData[i].SceneNo +"'>"+ sceneData[i].SceneName +"</option>");      
        })
        $(".scene").removeClass('scene');
    }
}
//生产线
function sceneAjax(){
	ajax({
        url: "scene_all",
        success: function (data) {
            sceneData = data;
            if(!data){
                return;
            }else{
                scene();
                var html = ''
                $(data).each(function (i) {
                    html+="<option  data-d='"+ data[i].SceneNo +"' value='"+ data[i].SceneNo +"'>"+ data[i].SceneName +"</option>";       
                })
                $("#SceneNo").append(html);
            }
        },
        error: function (message) {
            $.errorFun("获取生产场景失败");
        }
    })
}

function trDel(Id){
    $("#"+Id).remove();
}

function tigTable(index,e,event){
    // console.log(_inOrder[index].OrderNo);
    var thisTop = $(e).offset().top,
        thisLeft = $(e).offset().left,
        thisH = $(e).height(),
        $tableDiv = $('#fixedTable'),
        $tbody = $('#fixedTableTbody'),
        flag = true;
    $tableDiv.hide();
    $tableDiv.css({
        top: thisTop-thisH-$tableDiv.height(),
        left: thisLeft+2+'px'
    })
    $('.arrow').css({
        left: $(e).width()/2 + 'px'
    })
    var html = `
        <tr>
            <td>${_inOrder[index].OrderNo}</td>
            <td>${_inOrder[index].CreatBy}</td>
            <td>${timeMat(_inOrder[index].BeginTime)}</td>
            <td>${timeMat(_inOrder[index].ExpireTime)}</td>
        </tr>
    `;
    $tbody.html(html);
    $("#fixedBtn").attr("onclick","updateRow('" + index + "','" + _inOrder[index].OrderId + "','"+ _inOrder[index].OrderNo +"')");
    $tableDiv.fadeIn('500');

    $(document).one("click", function(eve) {
        $tableDiv.fadeOut();
    });

    event.stopPropagation();
}

function inOrd_info(id){
    let $id=$('#'+id);
    let ids=$id.val();
    let Productid=$id.find("option:selected").attr("data-no");
     $.ajax({
        type:"GET",
        url:_path+"get-product-info/",
        dataType:'json',
        async: false,
        data:{
            No:Productid,
        },
        beforeSend:function(res){
           res.setRequestHeader('Token',dataList.Key)
        },
        success: function(data){
            console.log(data)
            var html="";
            if(data.length){
                $id.parent().children('select:eq('+$id.index()+')').nextAll().remove();
                html=`<select id="sel_${selI}" onchange="inOrd_infoCode('sel_${selI}')" style="height:32px;width: 90px;margin:0 10px;border: 1px solid #ccc;"><option value="">请选择</option>`;
                data.map(p=>{
                    var codeData=JSON.parse(p.Custom),
                    RegisNo='',     //登记证号
                    Toxicity='',    //毒性
                    Contain='',     //含量
                    Dosage='';      //剂型
                    (codeData.settings.item).map((p,index)=>{
                        if(p['key']=="RegisNo"){
                           RegisNo = p.value + " / ";                                    
                        }
                        if(p['key']=="Toxicity"){
                           Toxicity = p.value + " / ";
                        }
                         if(p['key']=="Contain"){
                           Contain = p.value + " / ";  
                        }
                        if(p['key']=="Dosage"){
                           Dosage = p.value + " /";  
                        }
                    });
                    html+=`<option data-no='${p.ProductCode}' value='${p.ProductNo}'>${p.ProductName+" / "+RegisNo+Toxicity+Contain+Dosage}</option>`;
                })
                html+='</select>';
                $id.parent().append(html);
                selI++;
            }else{
                $id.parent().children('select:eq('+$id.index()+')').nextAll().remove(); 
            }           
        },
        error: function(message){
            $.errorFun("查询失败，请稍后尝试!");  
        }
    });
}

 function inOrd_infoCode(id){
        let $id=$('#'+id);
        let ids=$id.val();
        let Productid=$id.find("option:selected").attr("data-no");
         $.ajax({
            type:"GET",
            url:_path+"get-shard/",
            dataType:'json',
            async: false,
            data:{
                No:Productid,
            },
            beforeSend:function(res){
               res.setRequestHeader('Token',dataList.Key)
            },
            success: function(data){
              var html="";
              var startTime,endTime;
              $('#SpecName').val('');
                if(data.length>0){
                    $id.parent().children('select:eq('+$id.index()+')').nextAll().remove();
                    html=`<select id="sel_${selI}" style="height:32px;width: 90px;border: 1px solid #ccc;">`;
                    data.map(p=>{
                        var codeData=JSON.parse(p.Custom),Spec='',SpecCoed='',ProductNo='',PartCode='',Alias='';

                        (codeData.settings.item).map((p,index)=>{
                            
                            if(p['key']=="Spec"){
                               Spec = p.value;                                    
                            }
                            if(p['key']=="SpecCode"){
                               SpecCoed = p.value;
                            }
                             if(p['key']=="PartCode"){
                               PartCode = p.value + "/";  
                            }
                            if(p['key']=="ProductNo"){
                               ProductNo = p.value;  
                            }
                            if(p['key']=="Alias"){
                                Alias = p.value;
                            }
                            if(p['key']=="SpecName"){
                                $('#SpecName').val(p.value);
                            }
                            if(p['key']=="BeginTime"){
                                startTime = parseInt((p.value).replace(/\-/g, ""));
                            }
                            if(p['key']=="ExpireTime"){
                                endTime = parseInt((p.value).replace(/\-/g, ""));
                            }
                        });
                        html+=`<option data-no='${p.ProductNo}' value='${p.ProductNo}'>${Alias+"/"+Spec+"/"+SpecCoed+"/"+PartCode+ProductNo}</option>`;
                    })
                    if(startTime && endTime){
                        console.log(startTime);
                        console.log(endTime);
                        $("body").on("input  propertychange","input[name='BatchNo"+addNUM+"']",function(){
                            var val = this.value;
                            if(val.length >= 8){
                                var subval = parseInt(val.substring(0, 8));
                                console.log(subval);
                                if(subval < startTime){
                                    $.errorFun('批次号输入错误，早于产品起始日！');
                                }
                                if(subval > endTime){
                                    $.errorFun('批次号输入错误，超出产品有效期！');
                                }
                            }
                        });
                        $("body").on("blur","input[name='BatchNo"+addNUM+"']",function(){
                            var val = this.value;
                            if(val.length < 8){
                                $.errorFun("批次号长度少于8位");
                            }
                        });
                    }
                    html+='</select>';
                    $id.parent().append(html);
                    selI++;
                }else{
                    $id.parent().children('select:eq('+$id.index()+')').nextAll().remove(); 
                }           
            },
            error: function(message){
                $.errorFun("查询失败，请稍后尝试!");  
            }
        });
}

function contains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
} 

function sel(){
    SelArr=[];
    $('td[id*="All_sel"]').each(function(i,item){ //查询所有下拉的 产品 过滤为0的  
          if( $(item).children('select:last').val()!='0'){
              SelArr.push( $(item).children('select:last').val());
          }
    });
   
}

function iformclose(){
    $('#wid-id-form').slideToggle(300);
    return false;
}

$(function(){
    ajax_table();
    sceneAjax();
    GetStylesDom('ProduceOrder-Type');
    product();
    $('#fixedTable').on('click', function(event) {
        event.stopPropagation();
        /* Act on the event */
    });
    $('#SpecName').attr('disabled',true);
    //添加
    $("#add").click(function() {
        var iflag = true;
        $('#iform').find('input[type="text"],select').each(function(index, el) {
         if($(this).attr('id')!='OrderNo'){
            if($(this).val()){
                iflag = true;
            }else{
                iflag = false;
                return false;
            }
          }  
        });
        sel();
        console.log(SelArr)
        if(SelArr.length>0){
            if(Array.from(new Set(SelArr)).length != SelArr.length){
                $.errorFun('生产单不能出现重复产品,请重新选择！');
                return false;
             }
        }
        if(iflag){
            $('#iform').bootstrapValidator('validate');
            var options = decodeURIComponent($("#iform").serialize(),true);
            var params = $("#iform").serializeArray();
            var values = {};
            for(var item in params)
            {
                values[params[item].name] = params[item].value;
            }
            var html='';
            var tr = $('#add-tbody').find('tr');
            var td = $('#add-tbody').children("tr").children('td');
            var tdsize = td.size()/tr.size();
            var LastVal = true;
            tr.each(function (index,item) {
                $(this).find('td').each(function (idx,i) {
                    var thisVal = $(this).find('input,select,input:radio:checked');

                    //判断产品信息是否选择正确
                    if(thisVal.attr("id") && thisVal.attr("id").indexOf("cp_select") != -1 && thisVal.last().val() === "0"){
                        LastVal = false;
                        return false;
                    }

                    if(tdsize-2 > idx){
                        if(thisVal.val()){
                            html += thisVal.last().val()+"|";
                        }
                    }else{
                        if(thisVal.val()){
                            html += thisVal.last().val();
                        }
                    }
                })
                
                if($('#add-tbody').find('tr').size()-1 != index){
                    html += ',';  
                }
            });
            console.log(html);
            if(!LastVal) {
                $.errorFun('请选择产品！')
                return false;
            }
            var Info = setStyles('#StylesTbody');
            if(Info && Info['Custom'].length >= 1){
                Info = JSON.stringify(Info['Custom']);
            }else{
                Info = '';
            }
            ajax({
                url:"cporder",
                type:"POST",
                dataType:'json',
                data:{
                    OrderName:values.OrderName,
                    BeginTime:values.BeginTime,
                    ExpireTime:values.ExpireTime,
                    PositionGuide:values.PositionGuide,
                    Remark:values.Remark,
                    PositionGuide:values.PositionGuide,
                    str:html,
                    createBy:_SessionUserName,
                    Info:Info
                },
                success: function(data){
                    $("#wid-id-form").slideUp(300);
                    ReturnAjax({data:data})
                },
                error: function(message){
                    $.errorFun("数据填写错误");
                }
            });
            return false;
        }else{
            $.errorFun('信息请填写完整');
            return false;
        }
    });
    $('#modal_link').click(function () {//点击显示弹出框
        $('#click-title').text('添加');
        $("#wid-id-form").slideDown(300);
        $("#add").show();
        $("#update").hide();
        formValidator();
        reset('#iform,#StylesTbody');//清空表单
        var oDate = new Date();
        var dateVal=oDate.getFullYear()+''+p(oDate.getMonth()+1)+''+p(oDate.getDate())+""+p(oDate.getHours())+''+p(oDate.getMinutes())+''+p(oDate.getSeconds())+''+oDate.getMilliseconds();
        var myDate = new Date();//获取当前年
        var fYear = myDate.getFullYear();
        var fMonth = p(myDate.getMonth()+1);//获取当前月
        var fDate = p(myDate.getDate());//获取当前日
        var FinshTime = fYear+'-'+fMonth+"-"+fDate+' 23:59:59';
        var StartTime = fYear+'-'+fMonth+"-"+fDate+' 00:00:00';
        $("#BeginTime").val(StartTime);
        $("#ExpireTime").val(FinshTime);

        $('#OrderName').val(dateVal);
        $("#OrderNoinput").hide();
        $('#add-tbody').empty();
        $('#add-ui').click();//生成tr 用于新增数据
        return false;
    });
    
    if(IsPC()){
        $("#dialog-message").dialog({
            autoOpen: false,
            modal: true,
            width: 900,
            height: 650,
        });
        $("#dialog-search").dialog({
            autoOpen : false,
            modal : true,
            width: 1100,
            height: 650,
            buttons : [{
                html : "关闭",
                "class" : "btn btn-default",
                click : function() {
                    $(this).dialog("close");
                }
            }]
        });
    }else{
        $("#dialog-message").dialog({  //弹框
            autoOpen: false,
            modal: true,
            width: 900,
            height: 'auto',
        });
        $("#dialog-search").dialog({
            autoOpen : false,
            modal : true,
            width: 1100,
            height: 'auto',
            buttons : [{
                html : "关闭",
                "class" : "btn btn-default",
                click : function() {
                    $(this).dialog("close");
                }
            }]
        });
    }

    $("#del-ui").click(function () {
        $('#add-tbody>:first').remove();
    });
    $('#add-ui').click(function () {
        var td0 = "<tr id='tr"+selI+"'>";
        var td1 = "<td id='All_sel"+selI+"'><select id='cp_select" + selI + "' onchange=inOrd_info('cp_select"+selI+"') name='cp_select" + selI + "' class='product' style='height:32px;width: 90px;border: 1px solid #ccc;'><option value='0'>请选择</option></select></td>"
        var td2 = "<td><input class='form-control' name='BatchNo" + selI + "' id='BatchNo" + selI + "' value='' type='text' ></td>";
        var td3 = "<td><input id='team" + selI + "' name='team" + selI + "' class='team form-control'></td>";
        // var td4 = "<td><select id='scene" + selI + "' name='scene" + selI + "' class='scene form-control'></select></td>";
        var td4 = "<td><input id='scene" + selI + "' name='scene" + selI + "' class='scene form-control'></td>";
        var td5 = "<td><input class='form-control' name='spinner" + selI + "' id='spinner" + selI + "' value='1' type='text' ></td>";
        var tdA = "<td><select id='Auton" + selI + "' name='Auton" + selI + "' class='form-control'><option value='0'>默认码</option><option value='1'>外来码</option></select></td>";
        var tds = "<td><input style='width:300px;' id='meger" + selI + "' name='meger" + selI + "' class='meger form-control' placeholder='请输入箱跺编号进行查询'></td>";
        var td6 = "<td><div class='btn btn-sm btn-danger' onclick=trDel('tr"+selI+"') class='' title='删除产品'>"
                    +"<span class='fa fa-times'></span>"
                    +"</div></td></tr>";
        
        $('#add-tbody').append(td0 + td1 + td2 + td3 + td4 + td5 +tds+ tdA+ td6);
        inOrd_info('cp_select'+selI);
        
        product();
        Tile('scene'+selI,{//产线智能搜索
            url: 'scene_allInfo/',
            field: 'v',
            dataNo: 'SceneNo',
            dataName: 'SceneName',
            width:220
        });
        Tile('meger'+selI,{//箱跺智能搜索
            url: 'get-megerBottominfoList/',
            field: 'v',
            dataNo: 'MergeNo',
            dataName: 'MergeName',
            width:300
        });
        Tile('team'+selI,{//班组智能搜索
            url: 'Team-optionList/',
            field: 'v',
            dataNo: 'TeamNo',
            dataName: 'TeamName'
        });
        addNUM = selI;
        selI++;
    });
    $('#StartTime,#FinshTime').datepicker({//时间控件
        dateFormat : 'yy-mm-dd',
        prevText : '<i class="fa fa-chevron-left"></i>',
        nextText : '<i class="fa fa-chevron-right"></i>',
    });

    $('#Table1').on('click','input:radio',function(){
        $('#Table1 input:radio').removeAttr('checked');
        $(this).attr('checked');
    })
})