Tile('ProductNo',{//产品智能搜索
    url: 'pro-vague',
    field: 'v',
    dataNo: 'ProductNo',
    dataName: 'ProductName',
    GetValId: 'ProductNoGet'
});

Tile('BatchNo',{//产品智能搜索
    url: 'batch_vague',
    field: 'bid',
    dataNo: 'BatchNo',
    dataName: 'BatchName'
});

function chartAjax(){
    var chartObj = {
        'fTime':$('#FinshTime').val(),
        'batch':$('#BatchNo').val(),
        'proNo':$('#ProductNoGet').val()
    }
    ajax({
        url: 'scanimport',
        data: chartObj,
        success: function(data){
            chartObj['sTime'] = $("#FinshTime").val();
            //产品库存
            {
                arraySop(data.StockIssued,'char1');
            }
            //产品库存入库
            {
                opObject(data.VoucherIssued,"ProductName");
                let param={
                   htmlid:"char2",
                   urlName:data.StorageIssued,
                   urlValues:chartObj,
                   chartType:"3",
                   ViewVal:{"labels":"ProductName","valNumber":"Issued"}
                }
                chart_reveal(param);  
            }
            //产品库存出库
            {
                opObject(data.VoucherIssued,"ProductName");
                var param={
                   htmlid:"char3",
                   urlName:data.VoucherIssued,
                   urlValues:chartObj,
                   chartType:"3",
                   ViewVal:{"labels":"ProductName","valNumber":"Issued"}
                }
                chart_reveal(param);  
            }
        },
        error: function(message){
            $.errorFun('获取图表信息失败');
        }
    })
    
}

//产品
function product(){
    ajax({
        url: "productlist",
        dataType: "json",
        success: function (data) {
             if(!data){
                return;
            }else{
                 $(data).each(function (i) {
                    $("#ProductNo").append("<option value='"+ data[i].ProductNo +"'>"+ data[i].ProductName +"</option");
                })
            }
        },
        error: function (message) {
            $.errorFun("获取产品信息失败，请刷新页面！");
        }
    })
}

var tabTitle = "";//TAB导航名称
var tabContent = "";//TAB内容
// Dynamic tabs
var tabCounter = 1;

var tabs = $("#tabs2").tabs();
// actual addTab function: adds new tab using the input from the form above
function addTab() {
    var tabTemplate = "<li style='position:relative;' onclick=removeLi('tabs-"+tabCounter+"')> <span class='air air-top-left delete-tab' style='top:7px; left:7px;'><button class='btn btn-xs font-xs btn-default hover-transparent'><i class='fa fa-times'></i></button></span></span><a href='#{href}'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; #{label}</a></li>";
    var label = tabTitle || "Tab " + tabCounter;
    id = "tabs-" + tabCounter;
    li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));
    tabContentHtml = tabContent || "Tab " + tabCounter + " content.";

    tabs.find(".ui-tabs-nav").append(li);
    tabs.append("<div id='" + id + "'>" + tabContentHtml + "</div>");
    tabs.tabs("refresh");
    $('#'+id).addClass('tablediv');
    $("[aria-controls='tabs-"+tabCounter+"'").addClass('ui-tabs-active ui-state-active').siblings('li').removeClass('ui-tabs-active ui-state-active');
    $("#tabs-"+tabCounter).fadeIn(200).siblings('div').fadeOut(200);
    tabCounter++;
}

function more(pNo,pName,pBto) {
    //创建弹框
    if(IsPC()){
        var detailWidth = 700;
        var detailHeight = 600;
    }else{
        var detailWidth = '100%';
        var detailHeight = 300;
    }
    $("#dialog-detail").dialog({
        autoOpen: false,
        modal: true,
        width: detailWidth,
        height: detailHeight,
        buttons : [{
            html : "<i class='fa fa-remove'></i>&nbsp; 关闭",
            "class" : "btn btn btn-danger",
            click : function() {
                $(this).dialog("close");
                $("#tabs2 ul").html('');
                $("#tabs2 div").remove();
            }
        }]
    });
    $(".ui-dialog-titlebar-close").click(function(event) {
        $("#tabs2 ul").html('');
        $("#tabs2 div").remove();
    });
    //打开弹框
    $('#dialog-detail').dialog('open');
    $('#tabs2').show();
    tabTitle=pName+' | 订单号';
    ajax({
        url: 'storage_batch/',
        data: {
            PNo:pNo
        },
        success: function(data) {
            if(data.length>0){
                $.each(data,function(index, el) {
                    tabContent+=`<tr>
                        <td>${index+1}</td>
                        <td>${pName}</td>
                        <td>${pBto}</td>
                        <td><a  title="点击查看跺码" class="btn btn-primary btn-sm" href="javascript:oStack('${data[index].OrderNo}');">${data[index].OrderNo}</a></td>
                        <td>${timeMat(data[index].CreateTime)}</td>
                    </tr>`;
                });
                tabContent = `
                    <table id="dt_basic" class="table table-striped table-bordered table-hover" width="100%">
                        <thead>                         
                            <tr>
                                <th>ID</th>
                                <th>产品名称</th>
                                <th>批次</th>
                                <th>订单号</th>
                                <th>入库时间</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${tabContent}
                        </tbody>
                    </table>
                `;
                addTab();
                tabContent='';
            }else{
                tabContent='该订单没有跺码';
                addTab();
                tabContent='';
            }
        },
        error: function(error) {
            console.log(error);
        }
    })
}

function oStack(oName){
    tabTitle=oName+' | 箱';
    ajax({
        url:"proNo",
        data:{pNo:oName},
        success:function(data){
            if(data.length>0){
                $.each(data,function(index, el) {
                    tabContent+='<a  title="点击查看箱码" class="btn btn-primary btn-sm" href="javascript:oPacking(\''+data[index].No+'\');">'+parseInt(index+1)+'：'+data[index].No+'</a>';
                });
                addTab();
                tabContent='';
            }else{
                tabContent='该订单没有跺码';
                addTab();
                tabContent='';
            }
            
        },
        error:function(){
            $.errorFun("查询跺码失败请稍后尝试！"); 
        }
    })
}

function oPacking(CodeNo){
    tabTitle=CodeNo+' | 产品';
    ajax({
        url:"StackNo/",
        data:{SNo:CodeNo},
        success:function(data){
            if(data.length>0){
                $.each(data,function(index, el) {
                    tabContent+='<a class="btn btn-default btn-sm">'+parseInt(index+1)+'：'+ el.No +'</a>';
                });
                addTab();
                tabContent='';
            }else{
                tabContent='该跺里没有箱码';
                addTab();
                tabContent='';
            }
            
        },
        error:function(){
            $.errorFun("查询箱码失败请稍后尝试！"); 
        }
    })
}

function oProduct(ProNo){
    tabTitle=ProNo+' | 瓶';
    ajax({
        url:"PNo",
        data:{PNo:ProNo},
        success:function(data){
            if(data.length>0){
                $.each(data,function(index, el) {
                    tabContent+='<div class="col-md-2">'+parseInt(index+1)+'：'+ data[index].ProductCodeNo +'</div>';
                });
                tabContent = "<section class='row show-grid'>"+tabContent+"</section>";
                addTab();
                tabContent='';
            }else{
                tabContent='该箱里没有瓶码';
                addTab();
                tabContent='';
            }
            
        },
        error:function(){
            $.errorFun("查询瓶码失败请稍后尝试！"); 
        }
    })
}

function removeLi(rID){
    $("[aria-controls='"+rID+"']").addClass('ui-tabs-active ui-state-active').siblings('li').removeClass('ui-tabs-active ui-state-active')
    $("#"+rID).fadeIn(200).siblings('div').fadeOut(200);
}

$(function(){
    $("#search").click(function() {
        var grid = $("#jqgrid");
        if($("#StartTime").val()!='' && $("#FinshTime").val()!=''){
            //var StartTime = $("#StartTime").val();
            var FinshTime = $("#FinshTime").val();
        }else{
            var myDate = new Date();//获取当前年
            var fYear = myDate.getFullYear();
            var fMonth = p(myDate.getMonth()+1);//获取当前月
            var fDate = p(myDate.getDate());//获取当前日
            
            var FinshTime = fYear+'-'+fMonth+"-"+fDate+' 23:59:59';
            $("#FinshTime").val(FinshTime);
        }

        chartAjax();
        var ProductNo = $("#ProductNoGet").val();
        var batch = $('#BatchNo').val();
        
        var path = '';
        path = _path+"QueryP?fTime="+FinshTime+"&PNo="+ProductNo+"&batch="+batch;
        grid.jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
        jQuery("#jqgrid").jqGrid({
            //data: jqgrid_data,
            url: path,
            datatype: "json",
            mtype: 'GET',
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
            colNames: ['产品编号','产品名称','批次','出库量','入库量','库存量','计量单位','操作'],
            colModel: [{
                name: 'ProductNo',
                index: 'ProductNo',
            }, {
                name: 'ProductName',
                index: 'ProductName',
            }, {
                name: 'BatchNo',
                index: 'BatchNo',
            }, {
                name: 'VoucherQty',
                index: 'VoucherQty',
                width: '80'
            }, {
                name: 'StorageQty',
                index: 'StorageQty',
                width: '80'
            }, {
                name: 'Issued',
                index: 'Issued',
                width: '80'
            }, {
                name: 'UnitName',
                index: 'UnitName',
            }, {
                name: 'sec',
                index: 'sec',
            }],
            gridComplete: function (data) {//加载完之后执行
                qxC();//权限控制
            },
            loadComplete: function (data) {//加载前执行
                var ids = jQuery("#jqgrid").jqGrid('getDataIDs');
                for(var item = 0; item < ids.length; item++){
                    var ProductNo = data.rows[item].ProductNo,
                        ProductName = data.rows[item].ProductName.replace(/\s/g,''),
                        BatchNo = data.rows[item].BatchNo,
                        sec = `<button class="btn btn-primary" onclick=more('${ProductNo}','${ProductName}','${BatchNo}')>详情</button>`;
                     switch (status) {
                        case (1):
                            status='正常';
                            break;
                        case (4):
                            status='已完成';
                            break;
                        default:
                           status='失效';
                    }
                    grid.jqGrid('setRowData', ids[item], {
                        Status: status,
                        sec: sec
                    });
                }
            },
            
        }).trigger("reloadGrid");
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
        
     });
    $('#FinshTime').datepicker({//时间控件
        dateFormat : 'yy-mm-dd',
        prevText : '<i class="fa fa-chevron-left"></i>',
        nextText : '<i class="fa fa-chevron-right"></i>'
    });
})
 