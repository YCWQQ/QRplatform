var PPBillOut={};
//表格渲染
function ajax_table() {
	var StartTime = $("#StartTime").val();
	var EndTime = $("#EndTime").val();
	var Permitno = $("#Permitno").val();
	var type = $('#Type').val();
	jQuery("#jqgrid").jqGrid({
		//data: jqgrid_data,
	    url: _path+"Materiel/bill-storage/?Stime="+StartTime+"&ftime="+EndTime+"&permitno="+Permitno+'&type='+type,
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
		colNames: ['部件编号', '部件名称','人员编号','状态','入库部件数量', '月份'],
        colModel: [{
            name: 'ProductNo',
            index: 'ProductNo',
        }, {
            name: 'ProductName',
            index: 'ProductName',
        },{
            name: 'PermitNo',
            index: 'PermitNo',
        },{
            name: 'states',
            index: 'states',
        }, {
            name: 'Issued',
            index: 'Issued',
        }, {
            name: 'CreateTime',
            index: 'CreateTime',
        }],
		gridComplete: function () {//加载完之后执行
			qxC();//权限控制
		},
		loadComplete: function (data) {//加载前执行
			PPBillOut = data;
			if(data){
				chartAjax(data);
			}
			var ids = jQuery("#jqgrid").jqGrid('getDataIDs');   
			
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
        'sTime':$('#StartTime').val(),
        'fTime':$('#EndTime').val(),
    }
    
	{
		let param={
	       htmlid:"char1",
	       urlName:data,
	       urlValues:chartObj,
	       chartType:"2"
	    }
	    chart_reveal(param);
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

iTime('#StartTime,#EndTime');
$(function(){
	var myDate = new Date();//获取当前年
    var fYear = myDate.getFullYear();
    var fMonth = p(myDate.getMonth()+1);//获取当前月
    var fDate = p(myDate.getDate());//获取当前日
    $("#StartTime").val(fYear+'-'+fMonth+"-"+fDate+' 00:00:00');
    $("#EndTime").val(fYear+'-'+fMonth+"-"+fDate+' 23:59:59');

	ajax_table();
	
	//搜索
	$("#search").click(function(event) {
		var StartTime = $("#StartTime").val(),
			EndTime = $('#EndTime').val(),
			Permitno = $("#Permitno").val(),
			type = $('#Type').val();
		path = _path+"Materiel/bill-storage/?sTime="+StartTime+"&fTime="+EndTime+"&permitno="+Permitno+'&type='+type;
    	jQuery("#jqgrid").jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
	});
})
