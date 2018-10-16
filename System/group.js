$(function(){
  $('#ExpireTime').datepicker({//时间控件
      dateFormat : 'yy-mm-dd',
      prevText : '<i class="fa fa-chevron-left"></i>',
      nextText : '<i class="fa fa-chevron-right"></i>'
  });
  $('#modal_link').click(function () {
    formValidator();
    $("#add").show();
    $("#update").hide();
    $('#dialog-message').dialog('open');
    $("#ui-id-3").text("新增组");
    reset();
    return false;
  });   
  $("#dialog-message").dialog({
    autoOpen: false,
    modal: true,
    width: 580,
    height: 480,
  });
  table();
  RoleId();
  OrganizationId();
})
var _Obj = {};
function table(){
  var grid = $("#jqgrid");
    grid.jqGrid({
    //data: jqgrid_data,
      url: _path+"role/GetGroupInfoPage",
      datatype: "json",
      mtype: 'get',
      multiselect: false,//多选框禁用
      autowidth: true,
      height: 'auto',
      search: true,
      rowNum: 10,
      rowList: [10, 20, 50],
      pager: '#pjqgrid',
      sortname: 'GroupId',
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
      colNames: ['ID', '组名称', '角色名称', '企业ID','创建时间','备注', '操作'],
          colModel: [{
              name: 'GroupId',
              index: 'GroupId',
          }, {
              name: 'GroupName',
              index: 'GroupName',
          }, {
              name: 'RoleName',
              index: 'RoleName',
          }, {
              name: 'OrganizationId',
              index: 'OrganizationId',
          }, {
              name: 'StartTime',
              index: 'StartTime',
          }, {
              name: 'Remark',
              index: 'Remark',
          }, {
              name: 'act',
              index: 'act',
              width:'50'
          }],
      gridComplete: function () {//加载完之后执行
        
      },
      loadComplete: function (data) {//加载前执行
        _Obj = data;
        var ids = grid.jqGrid('getDataIDs');   
        for (var i = 0; i < ids.length; i++) {
          var cl = ids[i];
          se = "<button class='btn btn-xs btn-default' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].GroupId + "');\"><i class='fa fa-pencil'></i></button>";
          ca = "<button class='btn btn-xs btn-default' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].GroupId + "');\"><i class='fa  fa-trash-o'></i></button>";
          grid.jqGrid('setRowData', ids[i], {
            act: se + ca
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
      GroupName : {
        validators : {
          notEmpty : {
            message : '组名称为必填项'
          },
          
        }
      },
      RoleId : {
        validators : {
          notEmpty : {
            message : '所属角色为必选'
          }
        }
      },
      OrganizationId : {
        validators : {
          notEmpty : {
            message : '所属企业为必选'
          },
        }
      },
      // These fields will be validated when being visible
      ExpireTime : {
        validators : {
          notEmpty : {
            message : '服务时间必填'
          }
        }
      },
      Enabled : {
        validators : {
          notEmpty : {
            message : '状态必选'
          }
        }
      },
      Secret : {
        validators : {
          notEmpty : {
            message : '密码为必填项'
          }
        }
      }
    }
  })//表单验证end
}

$("#add").unbind('click').click(function(event) {
  var inputList = $("#iform").find("input,select,textarea"),
  dataObj = {};
  $.each(inputList,function(index, val) {
    dataObj[$(val).attr('id')] = $(val).val();
  });
  $.ajax({
    url: _path+'role/CreateGroup',
    type: 'POST',
    dataType: 'json',
    data: dataObj,
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
    error: function(error){
      $.errorFun("添加失败，请重新添加");
    }
  })
  return false;
});

function updateRow(trId,uId) {
    reset();
    formValidator();
    $("#ui-id-3").html("修改组");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();

    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);
    });
    $("#update").unbind("click").click(function() {
      var inputList = $("#iform").find("input,select,textarea"),
      dataObj = {};
      dataObj['GroupId'] = uId;
      $.each(inputList,function(index, val) {
        dataObj[$(val).attr('id')] = $(val).val();
      });
      $.ajax({
        type:"POST",
        url:_path+"role/UpdateGroup",
        dataType: "json",
        data:dataObj,
        success: function(data){
          if(data.Status==1){
            $("#refresh_jqgrid").click();
            reset();
            $('#dialog-message').dialog('close');
            DistrAll();
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
  $.delFun("role/DelGroup","GroupId",uId);//1：接口名称  2：参数名称  3：参数值
}

function RoleId(){
  $.ajax({
    url: _path+'role/GetRole',
    type: 'GET',
    dataType: 'json',
    data: {},
    success: function(data){
      var $RoleId = $("#RoleId"),
      html = '<option value="0">请选择</option>';
      $.each(data,function(index, el) {
        html += '<option value="'+el.RoleId+'">'+el.RoleName+'</option>';
      });
      $RoleId.empty().append(html);
    },
    error: function(error){
      $.errorFun("获取角色信息失败，请刷新页面尝试");
    }
  })
}

function OrganizationId(){
  $.ajax({
    url: _path+'role/getOrganization?OrganizationNo=',
    type: 'GET',
    dataType: 'json',
    data: {},
    success: function(data){
      var $OrganizationId = $("#OrganizationId"),
      html = '<option value="0">请选择</option>';
      $.each(data,function(index, el) {
        html += '<option value="'+el.OrganizationId+'">'+el.OrganizationName+'</option>';
      });
      $OrganizationId.empty().append(html);
    },
    error: function(error){
      $.errorFun("获取企业信息失败，请刷新页面尝试");
    }
  })
}