var _Obj = {};
$(function(){
  GetGroup();//获取角色
  getUser();//获取用
  $('#modal_link').click(function () {
    formValidator();
    $("#add").show();
    $("#update").hide();
    $('#dialog-message').dialog('open');
    reset();
    $("#ui-id-3").text("新增自定义权限");
    return false;
  });   
  $("#dialog-message").dialog({
    autoOpen: false,
    modal: true,
    width: 580,
    height: 280,
    
  });
})
function table(){
  var grid = $("#jqgrid");
    grid.jqGrid({
    //data: jqgrid_data,
      url: _path+"role/getAction?ActionId=",
      datatype: "json",
      mtype: 'get',
      multiselect: false,//多选框禁用
      autowidth: true,
      height: 'auto',
      search: true,
      rowNum: 10,
      rowList: [10, 20, 50],
      pager: '#pjqgrid',
      sortname: 'ActionId',
      viewrecords: true,
      sortorder: "desc",
      jsonReader : {  
          root: "DistributorList",
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
      colNames: ['ID', '所属用户','所属用户ID', '角色ID', '状态', '操作'],
          colModel: [{
              name: 'ActionId',
              index: 'ActionId',
          }, {
              name: 'PermitName',
              index: 'PermitName',
          }, {
              name: 'PermitId',
              index: 'PermitId',
          }, {
              name: 'RoleId',
              index: 'RoleId',
          }, {
              name: 'Options',
              index: 'Options',
          }, {
              name: 'act',
              index: 'act',
              width:'50'
          }],
      gridComplete: function () {//加载完之后执行
          qxC();
      },
      loadComplete: function (data) {//加载前执行
        _Obj = data;
        var ids = grid.jqGrid('getDataIDs');   
        for (var i = 0; i < ids.length; i++) {
          var Opt = data[i].Options;
          Opt == true ? Opt = '启用' : Opt = '失效';
          var cl = ids[i];
          se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data[i].ActionId + "');\"><i class='fa fa-pencil'></i></button>";
          ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data[i].ActionId + "');\"><i class='fa  fa-trash-o'></i></button>";
          grid.jqGrid('setRowData', ids[i], {
            act: se + ca,
            Options: Opt
          });
        }
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
      PermitId : {
        validators : {
          notEmpty : {
            message : '用户ID必选'
          },
          
        }
      },
      RoleId : {
        validators : {
          notEmpty : {
            message : '角色ID为必填'
          }
        }
      },
      Options : {
        validators : {
          notEmpty : {
            message : '状态必选'
          },
        }
      },
    }
  })//表单验证end
}

$("#add").unbind('click').click(function(event) {
    formValidator();
  var inputList = $("#iform").find("input,select,textarea"),
  dataObj = {};
  $.each(inputList,function(index, val) {
    dataObj[$(val).attr('id')] = $(val).val();
  });
  $.ajax({
    url: _path+'role/CreateAction',
    type: 'POST',
    dataType: 'json',
    data: dataObj,
    success: function(data){
      $("#refresh_jqgrid").click();
      reset();
      $('#dialog-message').dialog('close');
      return false;
    },
    error: function(error){
      $.errorFun("添加失败，请重新添加");
    }
  })

  return false;
});

function updateRow(trId,uId) {
    reset();
    formValidator();
    $("#ui-id-1").html("修改部门");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();

    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);
    });

    var Opt = _Obj[trId-1].Options;
    Opt == true ? Opt = 'true':Opt = 'false';
    $("#Options").val(Opt);
    $("#update").unbind("click").click(function() {
      var inputList = $("#iform").find("input,select,textarea"),
      dataObj = {};
      dataObj['ActionId'] = uId;
      $.each(inputList,function(index, val) {
        dataObj[$(val).attr('id')] = $(val).val();
      });
      $.ajax({
      type:"POST",
      url:_path+"role/UpdateAction",
      dataType: "json",
      data:dataObj,
      success: function(data){
        if(data.Status==1){
          $("#refresh_jqgrid").click();
          reset();
          $('#dialog-message').dialog('close');
          return false;
        }
        else if(data.Status==2){
          $.errorFun("数据填写错误");
        }
        else{
          $.errorFun("编号重复");
        }
      },
      error: function(message){
        $.errorFun("更新失败，请稍后重试");
      }
    });
    return false;
  })
}
//删除数据
function delRow(trId,uId) {
  $.delFun("role/DelAction","ActionId",uId);//1：接口名称  2：参数名称  3：参数值
}

function getUser(){
  $.ajax({
    url: _path+'role/getUser',
    type: 'GET',
    dataType: 'json',
    data: {},
    success: function(data){
      var $PermitId = $("#PermitId"),
      html = '<option value="0">请选择</option>';
      $.each(data,function(index, el) {
        html += '<option value="'+el.PermitId+'">'+el.PermitName+'</option>';
      });
      $PermitId.empty().append(html);
    },
    error: function(error){
      $.errorFun("获取用户信息失败，请刷新页面尝试");
    }
  })
}

function GetGroup(){
  $.ajax({
    url: _path+'role/GetGroup',
    type: 'GET',
    dataType: 'json',
    data: {},
    success: function(data){
      var $RoleId = $("#RoleId"),
      html = '<option value="0">请选择</option>';
      $.each(data,function(index, el) {
        html += '<option value="'+el.GroupId+'">'+el.GroupName+'</option>';
      });
      $RoleId.empty().append(html);
    },
    error: function(error){
      $.errorFun("获取角色信息失败，请刷新页面尝试");
    }
  })
}

