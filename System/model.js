$(function(){
    $('#modal_link').click(function () {
        $('#dialog-message').dialog('open');
        $("#ui-id-3").text("新增模块");
        $("#upsub").hide();
        $("#addsub").show();
        reset();
        formValidator();
        return false;
    });
    if(IsPC()){
      $("#dialog-message").dialog({
          autoOpen: false,
          modal: true,
          width: 580,
          height: 460,
      });
    }else{
      $("#dialog-message").dialog({
          autoOpen: false,
          modal: true,
          width: 'auto',
          height: 'auto',
      });
    }
    
    table();
})
function table(){
  var grid = $("#jqgrid");
    grid.jqGrid({
    //data: jqgrid_data,
      url: _path+"role/GetModule?ModuleId=&types=2",
      datatype: "json",
      mtype: 'get',
      multiselect: false,//多选框禁用
      autowidth: true,
      height: 'auto',
      search: true,
      rowNum: 50,
      rowList: [50],
      pager: '#pjqgrid',
      sortname: 'ModuleId',
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
      colNames: ['ID', '模块名称', '模块信息','状态' , '备注', '操作'],
          colModel: [{
              name: 'ModuleId',
              index: 'ModuleId',
          }, {
              name: 'ModuleName',
              index: 'ModuleName',
          }, {
              name: 'Info',
              index: 'Info',
          }, {
              name: 'Status',
              index: 'Status',
          }, {
              name: 'Remark',
              index: 'Remark',
          }, {
              name: 'act',
              index: 'act',
              width: '60px'
          }],
      gridComplete: function () {//加载完之后执行
          qxC();
      },
      loadComplete: function (data) {//加载前执行
        _Obj = data;
        var ids = grid.jqGrid('getDataIDs');
        var PidHtml = '<option value="0">顶级</option>'; 
        for (var i = 0; i < ids.length; i++) {
          if(data[i].ParentId == 0){
            PidHtml += '<option data-id="'+data[i].ModuleId+'" value="'+data[i].ModuleId+'">'+　data[i].ModuleName+'</option>';
          }else{
          }
          
          
          var urlJson = eval(data[i].Info);
          urlJson != null ? info = urlJson[0].url : info = null;
          
          var cl = ids[i];
          var status = data[i].Status;
          status == true ? status = '正常' : status = '失效';
          se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"Modular_info('" + cl + "','" + data[i].ModuleId + "');\"><i class='fa fa-pencil'></i></button>";
          ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"Modular_del('" + cl + "','" + data[i].ModuleId + "');\"><i class='fa  fa-trash-o'></i></button>";
          grid.jqGrid('setRowData', ids[i], {
            act: se + ca,
            Status: status,
            Info: info
          });
        }
        $("#ParentId").append(PidHtml);
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
      search:false,
    });
    //jQuery("#jqgrid").jqGrid('filterToolbar', { searchOperators: true });
    /* Add tooltips */
    $('.navtable .ui-pg-button').tooltip({
      container: 'body'
    });

    jqGridUi();//jqGrid UI
}
function formValidator(){
    $('#iform').data('bootstrapValidator', null);
    $('#iform').bootstrapValidator({
      feedbackIcons : {
        valid : 'glyphicon glyphicon-ok',
        invalid : 'glyphicon glyphicon-remove',
        validating : 'glyphicon glyphicon-refresh'
      },
      fields : {
        ModuleName : {
          validators : {
            notEmpty : {
              message : '模块名称为必填项'
            },
            
          }
        },
        Status : {
          validators : {
            notEmpty : {
              message : '状态为必选项'
            }
          }
        }
      }
    })//表单验证end
}

    $("#addsub").unbind('click').click(function(){
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
          var inputList = $("#iform").find("input,select,textarea"),
          dataObj = {};
          $.each(inputList,function(index, val) {
              dataObj[$(val).attr('id')] = $(val).val();
          });
          ajax({
          	url:"role/CreateModule",
              type:"POST",        
              data:dataObj,
              success: function(data){                
                  ReturnAjax({data:data});
              },
              error: function(message){
                  $.errorFun("新增模块失败，请稍后重试！");
              }
          }); 
          return false;
        }else{
          $.errorFun('信息请填写完善');
          $('#iform').bootstrapValidator('validate');
          return false;
        }
    })

//删除数据
function Modular_del(trId,uId) {
    $.delFun("role/DelModule","ModuleId",uId);//1：接口名称  2：参数名称  3：参数值
}

function Modular_info(trId,uId){  //修改
    reset();
    formValidator();
	  $('#dialog-message').dialog('open');
    $("#ui-id-3").text("修改模块");
    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);
    });
    $("#addsub").hide();
    $("#upsub").show();
    $.optionFalse('ParentId',uId);//select 不可选当前
    var URL = eval(_Obj[trId-1].Info);
    $("#Info").val(URL[0].url);
    // var EnB = _Obj[trId-1].Status;
    // console.log(EnB);
    // EnB == true ? EnB = 'true':EnB = 'false';
    // $("#Status").val(EnB);
    $("#upsub").unbind('click').click(function(){
        var inputList = $("#iform").find("input,select,textarea"),
        dataObj = {};
        dataObj['ModuleId'] = uId;
        $.each(inputList,function(index, val) {
            dataObj[$(val).attr('id')] = $(val).val();
        });
        ajax({
            type:"POST",
            url:"role/UpdateModule",
            data:dataObj,
            success: function(data){
                ReturnAjax({data:data});
            },
            error: function(message){
                $.errorFun("修改失败，请稍后重试");
            }
        });
        return false;  
    }); 
}
