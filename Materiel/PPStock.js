//表格渲染
function ajax_table() {
    var EndTime = $("#EndTime").val();
    jQuery("#jqgrid").jqGrid({
        //data: jqgrid_data,
        url: _path+"Materiel/bill-scannerimport/?fTime="+EndTime,
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
        colNames: ['部件编号', '部件名称','款式','颜色','状态','库存部件数量'],
        colModel: [{
            name: 'ProductNo',
            index: 'ProductNo',
        }, {
            name: 'ProductName',
            index: 'ProductName',
        }, {
            name: 'StyleName',
            index: 'StyleName',
        }, {
            name: 'ColorName',
            index: 'ColorName',
        }, {
            name: 'states',
            index: 'states',
        }, {
            name: 'Issued',
            index: 'Issued',
        }],
        gridComplete: function () {//加载完之后执行
            qxC();//权限控制
        },
        loadComplete: function (data) {//加载前执行
            PPBillOut = data;
            var ids = jQuery("#jqgrid").jqGrid('getDataIDs');   
            chartAjax(data);
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

function chartAjax(data){
    var chartObj = {
        'fTime':$('#EndTime').val()
    }
    
    chartObj['sTime'] = $("#EndTime").val();
    //产品库存
    {
        arraySop(data,'char1');
    }

    {
        opObject(data,"ProductName");
        var param={
           htmlid:"char2",
           urlName:data,
           urlValues:chartObj,
           chartType:"3",
           ViewVal:{"labels":"ProductName","valNumber":"Issued"}
        }
        chart_reveal(param);  
    }
       
    
}


$(function(){
    var myDate = new Date();//获取当前年
    var fYear = myDate.getFullYear();
    var fMonth = p(myDate.getMonth()+1);//获取当前月
    var fDate = p(myDate.getDate());//获取当前日
    $("#EndTime").val(fYear+'-'+fMonth+"-"+fDate+' 23:59:59');
    ajax_table();
    iTime('#EndTime');
    
    $("#search").click(function(event) {
        var EndTime = $('#EndTime').val();
        path = _path+"Materiel/bill-scannerimport/?fTime="+EndTime;
        jQuery("#jqgrid").jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
    });
})
 