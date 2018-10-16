var _setTime;//延时操作全局变量
var _outOrder = [];
var selI=3;
var SelArr=[]; //产品选择状态
//表格渲染
function ajax_table() {
    var jQGridData = GetHeaders(false);
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
    var ProductNo = $('#ProductNo select').last().val()!=undefined && $('#ProductNo select').last().val()!='0' ? $('#ProductNo select').last().val():'';
    var ono = $("#oNo-serach").val(),
        dno = $("#Dis-serach").val()?$("#Dis-serach-Get").val():"",
        path = '';
    path = _path+"dorderlist/?sTime="+StartTime+"&fTime="+FinshTime+"&PNo="+ProductNo+"&ono="+ono+"&dno="+dno;
    grid.jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
    jQuery("#jqgrid").jqGrid({
        //data: jqgrid_data,
        url: path,
        datatype: "json",
        mtype: 'get',
        multiselect: false,//多选框禁用
        autowidth: true,
        height: 'auto',
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
        colNames: jQGridData.colNames,
        colModel: jQGridData.colModel,
        loadError: function(xhr,status,error){  
            $.errorFun("表格数据加载失败，请刷新页面");
        }, 
        loadBeforeSend: function (request) {
            request.setRequestHeader("Token",dataList.Key);
        }, 
        gridComplete: function () {//加载完之后执行
            qxC();//权限控制
        },
        loadComplete: function (data) {//加载前执行
            //console.log(data)
            //console.log(data.list)//为所有数据行，具体取决于reader配置的root或者服务器返回的内容
            var ids = jQuery("#jqgrid").jqGrid('getDataIDs');
            _outOrder = [];
            _outOrder = data.rows;
            for(var item = 0; item < ids.length; item++){
                var OrderNo = data.rows[item].OrderNo;
                var count = data.rows[item].Count;
                var Issued = data.rows[item].Issued;
                var sOrderId = data.rows[item].OrderDetailId;
                var status = data.rows[item].Status;
                var cl = ids[item];

                var CrTime = timeMat(data.rows[item].CreateTime);

                grid.jqGrid('setRowData', ids[item], {
                    CreateTime: CrTime,
                    act: se
                });
                var se = '';
                if(status){
                    se = '<a class="abtn btn btn-primary disabled" data-qx="修改" title="订单已完成" ><i class="fa fa-check"></i> 已完成</a>'; 
                }else{
                    se = '<a href="javascript:UorderStatus(\''+sOrderId+'\');" title="订单未完成，点击强制完成" data-qx="修改" class="abtn btn btn-primary"><i class="fa fa-check"></i> 完成订单</a>';
                }
                jQuery("#jqgrid").jqGrid('setRowData', ids[item], {
                    Status: se
                });
            }
            var bgLeft = [];
            var colorList = ['#2196F3','#CC3333','#CC9933','#6633CC','#333333','#FF9900','#FF0099','#336633','#FF0000','#003333']
            for (let j = 0; j < ids.length; j++) {
                var OrderName = data.rows[j].OrderName;

                if($.inArray(OrderName, bgLeft)<0){
                    bgLeft.push(OrderName);
                }

                $("[title='"+OrderName+"']").attr("onclick","tigTable("+j+",this,event)");
                $("[title='"+OrderName+"']").css({
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
    jqGridUi();
}
//状态修改
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
                        url:'UorderDetail',
                        type: 'POST',
                        data: {
                            OrderDetailId: uoID,
                            Status: 1,
                            Remark: $("#status-text").val()
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
    $('#dialog-status').dialog('open');
}

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
            OrderNo : {
                validators : {
                    notEmpty : {
                        message : '订单编号为必填项'
                    },
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
                }
            },
            OrderName : {
                validators : {
                    notEmpty : {
                        message : '订单名称为必填项'
                    }
                }
            },
            DistributorNo : {
                validators : {
                    notEmpty : {
                        message : '经销商编号'
                    }
                }
            },
            spinner: {
                validators : {
                    notEmpty : {
                        message : '数量为必填项'
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


//产品
function product(){
   ajax({
        url: "brandlist",
        success: function (data) {
            var html='<option value="0">全部</option>';
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
            $.errorFun("获取品牌信息失败");
        }
    })
}

//修改数据
function updateRow(trId,uId,uOrderNo) {
    $('#click-title').text('修改');
    formValidator();
    var Top_tr = $("#" + trId).children("td:not(:last),td:not(:first)");
    var updateJson = [];
    $(Top_tr).each(function (i, o) {
        updateJson.push($(this).html());
    })
    $("#ui-id-3").html("修改发货单");
    $("#wid-id-form").slideDown(300);
    $("#update,#OrderNoinput").show();
    if(_outOrder[trId].Status||_outOrder[trId]['Issued']>0){
        $("#update").hide();
    }
    $("#add,#fixedTable").hide();
    reset('#iform,#StylesTbody');//清空表单
    $("#DistributorNo").removeAttr('data-no');
    $("#OrderNo").attr("disabled",true);//禁止修改单号
    //暂替经销商编号后面
    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_outOrder[trId][$(item).attr("id")]);
    });
    $("#DistributorNo").attr('data-no',_outOrder[trId]['DistributorNo']);
    var Distributor = $("#DistributorNo").attr('data-no');
    $('#ExpireTime').val(timeMat(_outOrder[trId]['ExpireTime']));
    $('#Remark').val(_outOrder[trId]['Remarks']);
    ajax({
        url:"dorderDetail/",
        data:{
            orderNo:uOrderNo
        },
        success: function(data){
            if(data.length>0){
                var json = data;//获取公共变量的 子订单信息
                $("#add-tbody").children('tr').remove();//清空table
                
                $.each(json,function(index, el) {
                    var  oplist=json[index].BrandNo;
                    if(json[index].ProductCode){
                        oplist+='|'+json[index].ProductCode;
                    }
                    if(json[index].ProductNo){
                        oplist+='|'+json[index].ProductNo;
                    }
                    console.log(oplist)
                   var op=oplist.split('|');
                    var td = "<tr id='tr"+ selI +"' data-Issued="+ json[index].Issued +">";
                    var td1 = "<td id='All_sel"+selI+"'><select id='cp_select" + selI + "' onchange=inOrd_info('cp_select"+selI+"') name='cp_select" + selI + "' class='product'  style='height:32px;width:90px;border: 1px solid #ccc;'></select></td>"
                    var td2 = "<td><input class='form-control' name='spinner" + selI + "' id='spinner" + selI + "' value='"+ json[index].Count +"' type='text' ></td>";
                    var td3 = "<td><input class='form-control' name='Remark" + selI + "' id='Remark" + selI + "' value='"+ json[index].Remark +"' type='text' ></td>";
                    var td4 = "<td><div class='btn btn-sm btn-danger' onclick=trDel('tr"+selI+"') class='' title='删除产品'>"
                    +"<span class='fa fa-times'></span>"
                    +"</div></td></tr>"
                  
                    $('#add-tbody').prepend(td + td1 + td2 + td3 + td4); 
                    product(); 
                    if(op){
                        let all_sel=$('#tr'+ selI+' td:first')
                        op.map((item,i)=>{
                            let $id=all_sel.children().eq(i);
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
        },
        error:function(){
            $.errorFun("查询子订单失败，请稍后尝试");
        }
    });

    if(_outOrder[trId].Info){
        var InfoData = JSON.parse(_outOrder[trId].Info);
        InfoData.settings.item.map(function(index, elem) {
            $("#"+index.key).val(index.value);
        })
    }
    
    $("#update").unbind("click").click(function() {
        var html='';
        var tr = $('#add-tbody').find('tr');
        var td = $('#add-tbody').children("tr").children('td');
        if(tr.size()>0){
            var tdsize = td.size()/tr.size();
        }
        var LastVal = true;
        tr.each(function (index,item) {
            $(this).find('td').each(function (idx,i) {
                if($(this).children().last().val() === "0"){
                    LastVal = false;
                    return false;
                }
                if(tdsize-2 > idx){
                    html += $(this).children().last().val()+"|";
                }else{
                    html += $(this).children().last().val();
                }
            })
            
            if($('#add-tbody').find('tr').size()-1 != index){
                html += ',';  
            }
        });
        if(!LastVal) {
            $.errorFun('请选择产品款式颜色！')
            return false;
        }
        sel();
        if(SelArr.length>0){
             if(Array.from(new Set(SelArr)).length != SelArr.length){
                $.errorFun('发货单不能出现重复产品,请重新选择！');
                return false;
             }
        }
        //  var sotk=[];
        //  $("#adds-tbody").find("input,select").each(function(){
        //     sotk.push({"name":$(this).attr("id").slice(4),"value":$(this).val()});
        //  })
        // var Custom=sotk.length>0?JSON.stringify(sotk):"";
        if (!dataList.PermitNo) {dataList.PermitNo=null;}
        if($("#DistributorNo").attr("data-no")==""||$("#DistributorNo").attr("data-no")==undefined){
            $("#DistributorNo").parent().parent().addClass("has-feedback has-error");
            $.errorFun('请填写正确的经销商！');
            return false;  
        }
        var Custom = setStyles('#StylesTbody');
        
        if(Custom){
            if(Custom.Custom.length >= 1){
                Custom = JSON.stringify(Custom.Custom);
            }else{
                Custom = '';
            }
        }else{
            return Custom;
        }
        ajax({
            type:"POST",
            url:"Udorder",
            data:{
                OrderId:uId,
                OrderNo:$('#OrderNo').val(),
                OrderName:$("#OrderName").val(),
                DistributorNo:$("#DistributorNo").val(),
                Remark:$("#Remark").val(),
                ExpireTime:$("#ExpireTime").val(),
                CreateBy:dataList.PermitNo,
               // Custom,Custom,
                TagNo:$('#TagNo').val(),
                CreateBy:_SessionUserName,
                str:html,
                Info: Custom
            },
            //data:{values},
            success: function(data){
                if(data.Status==1){
                    $("#refresh_jqgrid").click();
                    reset();
                    $('#wid-id-form').slideToggle(300);
                    return false;
                }
                else if(data.Status==2){
                    $.errorFun("数据填写错误");  
                }
                else{
                    $("#refresh_jqgrid").click();
                    reset();
                    $('#dialog-message').dialog('close');
                    $.errorFun("该订单已开始生产 子订单无法修改"); 
                }
            },
            error: function(message){
                $.errorFun("更新操作失败，请稍后尝试");  
            }
        });
        return false;
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
            <td>${_outOrder[index].OrderNo}</td>
            <td>${_outOrder[index].DistributorNo}</td>
            <td>${_outOrder[index].DistributorName}</td>
            <td>${timeMat(_outOrder[index].ExpireTime)}</td>
        </tr>
    `;
    $tbody.html(html);
    $("#fixedBtn").attr("onclick","updateRow('" + index + "','" + _outOrder[index].OrderId + "','"+ _outOrder[index].OrderNo +"')");
    $tableDiv.fadeIn('500');

    $(document).one("click", function(eve) {
        $tableDiv.fadeOut();
    });

    event.stopPropagation();
}

Tile('Dis-serach',{//经销商智能搜索
    url: 'dis_vague/',
    field: 'disno',
    dataNo: 'DistributorNo',
    dataName: 'DistributorName',
    GetValId: 'Dis-serach-Get'
});

Tile('DistributorNo',{//经销商智能搜索
    url: 'dis_vague/',
    field: 'disno',
    dataNo: 'DistributorNo',
    dataName: 'DistributorName'
});




$(function(){
    ajax_table();
    $("#DistributorM").fadeOut();
    GetStylesDom('DeliverOrder-Type');
    product();
	//添加

    $('#fixedTable').on('click', function(event) {
        event.stopPropagation();
        /* Act on the event */
    });

    $("#add").click(function() {
        var iflag = true;
        $('#iform').find('input,select').each(function(index, el) {
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
        if(SelArr.length>0){
             if(Array.from(new Set(SelArr)).length != SelArr.length){
                $.errorFun('发货单不能出现重复产品,请重新选择！');
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
            var Custom = setStyles('#StylesTbody');
        
            if(Custom){
                if(Custom.Custom.length >= 1){
                    Custom = JSON.stringify(Custom.Custom);
                }else{
                    Custom = '';
                }
            }else{
                return Custom;
            }
            var html='';
            var tr = $('#add-tbody').find('tr');
            var td = $('#add-tbody').children("tr").children('td');
            var tdsize = td.size()/tr.size();
            var LastVal = true;
            tr.each(function (index,item) {
                $(this).find('td').each(function (idx,i) {
                    if($(this).children().last().val() === "0"){
                        LastVal = false;
                        return false;
                    }
                    if(tdsize-2 > idx){
                        html += $(this).children().last().val()+"|";
                    }else{
                        html += $(this).children().last().val();
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

            // if($("#DistributorNo").attr("data-no")==""||$("#DistributorNo").attr("data-no")==undefined){
            //      $("#DistributorNo").parent().parent().addClass("has-feedback has-error");
            //        $.errorFun('请填写正确的经销商！');
            //     return false;  
            // }
            // var sotk=[];
            //  $("#adds-tbody").find("input,select").each(function(){
            //     sotk.push({"name":$(this).attr("id").slice(4),"value":$(this).val()});
            //  })
            // var Customss=sotk.length>0?JSON.stringify(sotk):"";

            ajax({
                url:"Cdorder",
                type:"POST",
                dataType:'json',
                data:{
                    OrderName:values.OrderName,
                    DistributorNo:values.DistributorNo,
                    ExpireTime:values.ExpireTime,
                    Remark:values.Remark,
                    CreateBy:dataList.PermitNo,
                   // Custom:Customss,
                    TagNo:$("#TagNo").val(),
                    CreateBy:_SessionUserName,
                    str:html,
                    Info:Custom
                },
                beforeSend:function(res){
                    res.setRequestHeader('Token',dataList.Key)
                },
                success: function(data){
                    ReturnAjax({data:data})
                    $('#wid-id-form').slideToggle(300);
                },
                error: function(message){
                    $.errorFun("添加操作失败，请稍后尝试！");
                }
            });
            return false;
        }else{
            $.errorFun('信息请填写完整');
            return false;
        }
    });

	$('#modal_link').click(function () {//点击显示弹出框
        $("#Table1 th:last").show();
        $('#click-title').text('添加');
        $("#wid-id-form").slideDown(300);
        $("#Tablest").hide();
        $("#add").show();
        $("#update").hide();     
        formValidator();
        reset('#iform,#StylesTbody');//清空表单
        var oDate = new Date();
        var dateVal=oDate.getFullYear()+''+p(oDate.getMonth()+1)+''+p(oDate.getDate())+""+p(oDate.getHours())+''+p(oDate.getMinutes())+''+p(oDate.getSeconds())+''+oDate.getMilliseconds();
        $('#OrderName').val(dateVal);
        $("#OrderNoinput").hide();
        $('#add-tbody').empty();
        $('#add-ui').click();//生成tr 用于新增数据
        return false;
    });
    
    $("#dialog-message").dialog({
        autoOpen: false,
        modal: true,
        width: 650,
        height: 660,
    });
    
    $("#del-ui").click(function () {
        $('#add-tbody>:first').remove();
    })


  
    $('#add-ui').click(function () {
        var td1 = "<tr id='tr"+selI+"'><td id='All_sel"+selI+"'><select id='cp-select" + selI + "' onchange=inOrd_info('cp-select"+selI+"') name='cp_select" + selI + "' class='product' style='height:32px;width:90px;border: 1px solid #ccc;'><option value='0'>请选择</option></select></td>"
        var td2 = "<td><input class='form-control' name='spinner" + selI + "' id='spinner" + selI + "' value='1' type='text' ></td>";
        var td3 = "<td><input class='form-control' name='Remark" + selI + "' id='Remark" + selI + "' value='' type='text' ></td>";
        var td4 = "<td><div class='btn btn-sm btn-danger' onclick=trDel('tr"+selI+"') class='' title='删除产品'>"
                    +"<span class='fa fa-times'></span>"
                    +"</div></td></tr>";
        var tds = "<td style=display:none><input class='form-control' name='status" + selI + "' id='status" + selI + "' value='0' type='text' ></td>";
        selI++;
        $('#add-tbody').append(td1 + td2 + td3 + td4);
        product();
       
    })
    iTime('#startdate,#ExpireTime,#StartTime,#FinshTime');
})

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
                var html="";
                if(data.length){
                    $id.parent().children('select:eq('+$id.index()+')').nextAll().remove();
                    html=`<select id="sel_${selI}" onchange="inOrd_infoCode('sel_${selI}')" style="height:32px;width: 90px;margin:0 10px;border: 1px solid #ccc;"><option value="0">请选择</option>`;
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
                                 });
                                 html+=`<option data-no='${p.ProductNo}' value='${p.ProductNo}'>${Alias+"/"+Spec+"/"+SpecCoed+"/"+PartCode+ProductNo}</option>`;
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