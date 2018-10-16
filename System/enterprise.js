var _Obj = {};
function table(){
  var grid = $("#jqgrid");
    grid.jqGrid({
    //data: jqgrid_data,
      url: _path+"role/getOrganization?OrganizationNo=",
      datatype: "json",
      mtype: 'get',
      multiselect: false,//多选框禁用
      autowidth: true,
      height: 'auto',
      search: true,
      rowNum: 10,
      rowList: [10, 20, 50],
      pager: '#pjqgrid',
      sortname: 'OrganizationNo',
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
      colNames: ['企业编号', '企业名称', '父级ID', '地区','企业服务开始日期','企业服务到期日期','是否启用', '操作'],
          colModel: [{
              name: 'OrganizationNo',
              index: 'OrganizationNo',
          }, {
              name: 'OrganizationName',
              index: 'OrganizationName',
          }, {
              name: 'ParentId',
              index: 'ParentId',
          }, {
              name: 'AreaId',
              index: 'AreaId',
          }, {
              name: 'StartTime',
              index: 'StartTime',
          }, {
              name: 'EndTime',
              index: 'EndTime',
          }, {
              name: 'Enabled',
              index: 'Enabled',
          }, {
              name: 'act',
              index: 'act',
              width:'50'
          }],
      gridComplete: function () {//加载完之后执行
          qxC();//权限控制
      },
      loadComplete: function (data) {//加载前执行
        _Obj = data;
        var $ParentId = $("#ParentId");
        var html = '<option value="0">顶级</option>';
        var ids = grid.jqGrid('getDataIDs');   
        for (var i = 0; i < ids.length; i++) {
          var enab = data[i].Enabled;
          enab == true ? enab = '启用' : enab = '禁止';
          var cl = ids[i];
          se = "<button class='btn btn-xs btn-default' title='修改' data-qx='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data[i].OrganizationId + "');\"><i class='fa fa-pencil'></i></button>";
          ca = "<button class='btn btn-xs btn-default' title='删除' data-qx='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data[i].OrganizationId + "');\"><i class='fa  fa-trash-o'></i></button>";
          grid.jqGrid('setRowData', ids[i], {
            act: se + ca,
            Enabled : enab
          });

          //父级Id
          html += '<option value="'+data[i].OrganizationId+'">'+data[i].OrganizationName+'</option>';
        }
        $ParentId.empty().append(html);
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
      OrganizationNo : {
        validators : {
          notEmpty : {
            message : '企业名称为必填项'
          },
          
        }
      },
      OrganizationName : {
        validators : {
          notEmpty : {
            message : '企业名称为必填项'
          },
          
        }
      },
      ParentId : {
        validators : {
          notEmpty : {
            message : '父级ID为必填'
          }
        }
      },
      AreaId : {
        validators : {
          notEmpty : {
            message : '地区编号为必填项'
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
  var inputList = $("#iform").find("input,select"),
  dataObj = {};
  $.each(inputList,function(index, val) {
    dataObj[$(val).attr('id')] = $(val).val();
  });
  dataObj['Info'] = '';
  $.ajax({
    url: _path+'role/CreateOrganization',
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
    var Top_tr = $("#" + trId).children("td:not(:last)");
    $("#ui-id-1").html("修改企业");
    $('#dialog-message').dialog('open');
    $("#update").show();
    $("#add").hide();

    $("#iform").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj[trId-1][$(item).attr("id")]);
    });
    $("#ExpireTime").val(_Obj[trId-1].EndTime);
    var EnB = _Obj[trId-1].Enabled;
    EnB == true ? EnB = 'true':EnB = 'false';
    $("#Enabled").val(EnB);

    $("#update").unbind("click").click(function() {
      var inputList = $("#iform").find("input,select"),
      dataObj = {};
      $.each(inputList,function(index, val) {
        dataObj[$(val).attr('id')] = $(val).val();
      });
      dataObj['Info'] = '';
      dataObj['OrganizationId'] = _Obj[trId-1].OrganizationId;
      $.ajax({
      type:"POST",
      url:_path+"role/UpdateOrganization",
      dataType: "json",
      data:dataObj,
      //data:{values},
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
  $.delFun("role/DelDOrganization","OrganizationId",uId);//1：接口名称  2：参数名称  3：参数值
}

function AreaNo(){//获取地区信息
  $.ajax({
    url: _path+'role/GetAreaOption',
    type: 'GET',
    dataType: 'json',
    data: {},
    success: function(data){
      var AreaNo = $("#AreaId");
      var html = '<option value="">请选择</option>';
      $.each(data,function(item, val) {
        if(data[item].Value != null){
            html+='<option value="'+data[item].Id+'">'+data[item].Fill+data[item].Name+data[item].Value+'</option>';
        }
      });
      AreaNo.empty().append(html);
    },
    error: function(error){
      $.errorFun("获取地区信息失败，请刷新页面重试！");
    }
  })
  
}

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
  reset();
  $("#ui-id-1").text("新增企业");
  return false;
});   
$("#dialog-message").dialog({
  autoOpen: false,
  modal: true,
  width: 580,
  height: 480,
  
});