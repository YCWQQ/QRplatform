var _ruku = [];

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

Tile('OrderNo',{//产品智能搜索
    url: 'order-vague',
    field: 'v',
    dataNo: 'OrderNo',
    dataName: 'OrderNames'
});

function chartAjax(){
    var chartObj = {
        'sTime':$('#StartTime').val(),
        'fTime':$('#FinshTime').val(),
        'PNo':$('#ProductNoGet').val(),
        'BNo':$('#BatchNo').val(),
        'orderNo':$('#OrderNo').val(),
        'SNo':$('#SceneNo').val(),
        'tno':$('#TeamNo').val()
    }
    ajax({
        url: 'order_list',
        data: chartObj,
        success: function(data){
            //产品入库
            {
                let param={
                   htmlid:"char0",
                   urlName:data.DeliveryIssued,
                   urlValues:chartObj,
                   chartType:"2"
                }
                chart_reveal(param);
            }
            //产线入库
            {
                let param={
                   htmlid:"char1",
                   urlName:data.DistrbutorIssued,
                   urlValues:chartObj,
                   chartType:"2"
                }
                chart_reveal(param);
            }
            //产线批次入库
            {
                opObject(data.BatchIssued,"BatchNo")
                let param={
                   htmlid:"char2",
                   urlName:data.BatchIssued,
                   urlValues:chartObj,
                   chartType:"3",
                   ViewVal:{"labels":"BatchNo","valNumber":"Issued"}
                }
                chart_reveal(param);
            }

            //产线订单入库
            {
                opObject(data.OrderIssued,"OrderNo")
                let param={
                   htmlid:"char3",
                   urlName:data.OrderIssued,
                    urlValues:chartObj,
                   chartType:"3",
                   ViewVal:{"labels":"OrderNo","valNumber":"Issued"}
                }
                chart_reveal(param);
            }

        },
        error: function(message){
            $.errorFun('获取图表信息失败');
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
                     $("#TeamNo").append("<option value='"+ data[i].TeamNo +"'>"+ data[i].TeamName +"</option");
                })
            }
            
        },
        error: function (message) {
            $.errorFun("获取班组信息失败，请刷新页面！");
        }
    })
}

//生产线
function scene(){
    ajax({
        url: "scene_all",
        success: function (data) {
            if(!data){
                return;
            }else{
                $(data).each(function (i) {
                     $("#SceneNo").append("<option value='"+ data[i].SceneNo +"'>"+ data[i].SceneName +"</option");
                })
            }
            
        },
        error: function (message) {
            $.errorFun("获取产线信息失败，请刷新页面！");
        }
    })
}
function detail(OrderNo){
    //创建弹框
    $("#dialog-detail").dialog({
        autoOpen: false,
        modal: true,
        width: 1300,
        height: 'auto',
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
    var grid = $("#jqgrid-detail");
    if(OrderNo){
        ajax({
            url: "dporderDetail/",
            data: {orderNo: OrderNo},
            success: function(data){
                var json = eval(data);
                var jqgrid_data = [];
                jqgrid_data.length = 0;
                $(json).each(function (i) {
                    jqgrid_data.push({
                        OrderNo: json[i].OrderNo,
                        OrderDetailNo: json[i].OrderDetailNo,
                        OrderDetailName: json[i].OrderDetailName,
                        ProductName: json[i].ProductName,
                        ProductNo: json[i].ProductNo,
                        BatchNo: json[i].BatchNo,
                        TeamNo: json[i].TeamName,
                        SceneName: json[i].SceneName,
                        Count: json[i].Count,
                        Issued: json[i].Issued,
                        CreateTime: timeMat(json[i].CreateTime),
                        Remark: json[i].Remark
                    });
                })
                //表格插件start
                grid.jqGrid('clearGridData');
                grid.jqGrid('setGridParam', {data: jqgrid_data});
                grid.trigger('reloadGrid');
                grid.jqGrid({
                    data: jqgrid_data,
                    datatype: "local",
                    height: 'auto',
                    search:true,
                    rowNum: 10,
                    rowList: [10, 20, 30],
                    pager: '#pjqgrid-detail',
                    sortname: 'OrderNo',
                    viewrecords: true,//显示总数信息
                    multiselect: false,//表格多选框
                    autowidth: true,
                    colNames: ['子单号','产品名称','产品代码','批次','班组','产线','建单生产量','实际生产量','建单时间','备注'],
                    colModel: [{
                        name: 'OrderDetailNo',
                        index: 'OrderDetailNo',
                        width:'150'
                    },{
                        name: 'ProductName',
                        index: 'ProductName',
                        width:'300'
                    },{
                        name: 'ProductNo',
                        index: 'ProductNo'
                    },{
                        name: 'BatchNo',
                        index: 'BatchNo'
                    },{
                        name: 'TeamNo',
                        index: 'TeamNo',
                        width: '100'
                    },{
                        name: 'SceneName',
                        index: 'SceneName',
                        width: '100'
                    },{
                        name: 'Count',
                        index: 'Count',
                        width:'100'
                    },{
                        name: 'Issued',
                        index: 'Issued',
                        width:'100'
                    },{
                        name: 'CreateTime',
                        index: 'CreateTime'
                    },{
                        name: 'Remark',
                        index: 'Remark'
                    }],
                    loadComplete: function (data) {
                        var ids = grid.jqGrid('getDataIDs');
                        // for(var item = 0; item < ids.length; item++){
                        //     var OrderDetailNo = data.rows[item].OrderDetailNo;
                        //     $("[title='"+OrderDetailNo+"']").attr("onclick","oStack('"+OrderDetailNo+"')");
                        //     $("[title='"+OrderDetailNo+"']").css({
                        //         color: '#3276b1',
                        //         cursor: 'pointer'
                        //     });
                        // }
                    },
                    
                });
                $('.navtable .ui-pg-button').tooltip({
                    container: 'body'
                });
                // remove classes
                jqGridUi();//jqGrid UI
                //表格插件end
            },
            error: function(){
                $.errorFun("获取生产单子单信息失败，请刷新页面！");
            }
        })
    }
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

    $("[aria-controls='tabs-"+tabCounter+"'").addClass('ui-tabs-active ui-state-active').siblings('li').removeClass('ui-tabs-active ui-state-active');
    $("#tabs-"+tabCounter).fadeIn(200).siblings('div').fadeOut(200);
    tabCounter++;
}


function removeLi(rID){
    $("[aria-controls='"+rID+"']").addClass('ui-tabs-active ui-state-active').siblings('li').removeClass('ui-tabs-active ui-state-active')
    $("#"+rID).fadeIn(200).siblings('div').fadeOut(200);
}
function oStack(oName){
    tabTitle=oName+' | 跺';
    ajax({
        url:"proNo",
        data:{pNo:oName},
        success:function(data){
            if(data.length>0){
                $.each(data,function(index, el) {
                    tabContent+='<a  title="点击查看箱码" class="btn btn-primary btn-sm" href="javascript:oPacking(\''+data[index].StackCodeNo+'\');">'+parseInt(index+1)+'：'+data[index].StackCodeNo+'</a>';
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
            tabContent='该订单没有跺码';
            addTab();
            tabContent='';
        }
    })
}

function oPacking(CodeNo){
    tabTitle=CodeNo+' | 箱';
    ajax({
        url:"StackNo",
        data:{SNo:CodeNo},
        success:function(data){
            if(data.length>0){
                $.each(data,function(index, el) {
                    tabContent+='<a title="点击查看瓶码" class="btn btn-default btn-sm" href="javascript:oProduct(\''+data[index].PackingCodeNo+'\');">'+parseInt(index+1)+'：'+ data[index].PackingCodeNo +'</a>';
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
            tabContent='该跺里没有箱码';
            addTab();
            tabContent='';
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
            tabContent='该箱里没有瓶码';
            addTab();
            tabContent='';
        }
    })
}

$(function(){
    scene();
    team();
    $("#search").click(function(event) {    
        var grid = $("#jqgrid");
        if($("#StartTime").val()!='' && $("#FinshTime").val()!=''){
            var StartTime = $("#StartTime").val();
            var FinshTime = $("#FinshTime").val();
        }else{
            var myDate = new Date();//获取当前年
            var fYear = myDate.getFullYear();
            var fMonth = p(myDate.getMonth()+1);//获取当前月
            var fDate = p(myDate.getDate());//获取当前日

            var dataVar = 1;//时间变量  当前时间

            var sYear = myDate.getFullYear();
            var sMonth = p(myDate.getMonth()+1);//获取当前月
            var sDate = p(myDate.getDate());//获取当前日
            sMonth = p(parseInt(sMonth-dataVar));
            if(sMonth==0){
                sYear=parseInt(sYear-1);
                sMonth=12;
            }
            
            var FinshTime = fYear+'-'+fMonth+"-"+fDate+' 23:59:59';
            sDate = getDaysInOneMonth(sYear,sMonth,sDate);
            var StartTime = sYear+'-'+sMonth+"-"+sDate+' 00:00:00';
            $("#StartTime").val(StartTime);
            $("#FinshTime").val(FinshTime);
        }

        chartAjax();

        var OrderNo = $("#OrderNo").val();
        var BatchNo = $("#BatchNo").val();
        var ProductNo = $("#ProductNoGet").val();
        var TeamNo = $("#TeamNo").val();
        var SceneNo = $("#SceneNo").val();
        var path = '';
        path = _path+"Query?sTime="+StartTime+"&fTime="+FinshTime+"&ONo="+OrderNo+"&BNo="+BatchNo+"&PNo="+ProductNo+"&TNo="+TeamNo+"&SNo="+SceneNo;
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
            colNames: ['主订单号','产品名称','批次','班组','产线','建单生产量','实际生产量','建单时间','备注'],
                    colModel: [{
                        name: 'OrderNo',
                        index: 'OrderNo',
                        width: '200'
                    },{
                        name: 'ProductName',
                        index: 'ProductName',
                        width:'300'
                    },{
                        name: 'BatchNo',
                        index: 'BatchNo'
                    },{
                        name: 'TeamName',
                        index: 'TeamName',
                        width: '100'
                    },{
                        name: 'SceneName',
                        index: 'SceneName',
                        width: '100'
                    },{
                        name: 'Count',
                        index: 'Count',
                        width:'100'
                    },{
                        name: 'Issued',
                        index: 'Issued',
                        width:'100'
                    },{
                        name: 'CreateTime',
                        index: 'CreateTime'
                    },{
                        name: 'Remark',
                        index: 'Remark'
                    }],
            gridComplete: function () {//加载完之后执行
                qxC();//控制权限
            },
            loadComplete: function (data) {//加载前执行
               
                var ids = jQuery("#jqgrid").jqGrid('getDataIDs');
                for (var i = 0; i < ids.length; i++) {
                    var detailId = ids[i];
                    var cl = ids[i];
                    var CrTime = timeMat(data.rows[i].CreateTime);
                    grid.jqGrid('setRowData', ids[i], {
                        CreateTime: CrTime
                    });
                }

                var colorList = ['#2196F3','#CC3333','#CC9933','#6633CC','#333333','#FF9900','#FF0099','#336633','#FF0000','#003333']
                var bgLeft = [];
                for (let j = 0; j < ids.length; j++) {
                    var OrderNo = data.rows[j].OrderNo;

                    if($.inArray(OrderNo, bgLeft)<0){
                        bgLeft.push(OrderNo);
                    }
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
            loadError: function(xhr,status,error){  
                $.errorFun("获取生产单信息失败，请刷新页面");   
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
            search : false
        });
        $('.navtable .ui-pg-button').tooltip({
            container: 'body'
        });
        // remove classes
        jqGridUi();//jqGrid UI
        
    });
    iTime('#StartTime,#FinshTime');
})  
 