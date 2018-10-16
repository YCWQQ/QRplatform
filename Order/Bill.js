var _Obj = {};
var billcode = '';

function formValidator() {
  $('#iform').data('bootstrapValidator', null);
  //表单验证
  $('#iform').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      Name: {
        validators: {
          notEmpty: {
            message: '编码单名为必填项'
          }
        }
      },
      ProductName: {
        validators: {
          notEmpty: {
            message: '产品为必填项'
          }
        }
      },
      Count: {
        validators: {
          notEmpty: {
            message: '请填写数量'
          },
          regexp: { /* 只需加此键值对，包含正则表达式，和提示 */
            regexp: /^[0-9_\.]+$/,
            message: '只能是数字'
          }
        }
      },
      Status: {
        validators: {
          notEmpty: {
            message: '状态为必选项'
          },
          regexp: { /* 只需加此键值对，包含正则表达式，和提示 */
            regexp: /^[0-9]+$/,
            message: '只能是数字'
          }
        }
      }

    }
  }) //表单验证end
}
//修改数据
function updateRow(trId, uId) {
  formValidator();
  $('#TeamNo').attr("disabled", true);
  var Top_tr = $("#" + trId).children("td:not(:last)");
  var updateJson = [];
  $(Top_tr).each(function(i, o) {
    updateJson.push($(this).html());
  })
  $("#ui-id-4").html("修改编码");
  $('#dialog-message').dialog('open');
  if (_Obj[trId - 1].NumSatus == 'False') {
    $("#update").show();
  } else {
    $("#update").hide();
  }
  $("#add").hide();
  $('#tab1').nextAll().remove();
  reset();
  $('#CodeType').val(_Obj[trId - 1].NumSatus == 'True' ? '1' : '0');
  $('#CodeType').change();
  $("#iform").find("input,select,textarea").each(function(i, item) {
    if($(item).attr("id") != 'CodeType'){
      $("#" + $(item).attr("id")).val(_Obj[trId - 1][$(item).attr("id")]);
    }
    
  });
  $('#Params').val(_Obj[trId - 1]['Status'] == 'True' ? '1' : '0');
  

  product();
  var op = _Obj[trId - 1].ProductNo.split('|');
  if (op) {
    let all_sel = $('#add-tbody');
    op.map((item, i) => {
      let $id = all_sel.children('select').eq(i);
      if (op.length == 2 && i == 1) {
        $id.val(item);
      } else {
        $id.children('option[data-no="' + item + '"]').attr('selected', 'selected');
        $id.change();
        if (_Obj[trId - 1].Issued > 0) {
          $id.prop("disabled", true);
          $id.css('background-color', '#eeeeee');
        } else {
          $id.prop("disabled", false);
          $id.css('background-color', '');
        }
      }
    })
  }

  if (_Obj[trId - 1].Issued > 0) {
    $("#Name,#Custom,#MakeType,#Layer,#Params,#Remark,#CodeType,#LableName,#Count").prop("disabled", true);
  } else {
    $("#Name,#Custom,#MakeType,#Layer,#Params,#Remark,#CodeType,#LableName,#Count").prop("disabled", false);
  }

  var dataObj = {};
  dataObj.No = uId;
  dataObj.CreateBy = dataList.PermitNo;
  dataObj.Info = '';
  $("#update").unbind("click").click(function() {
    $("#iform").find("input,select,textarea").each(function(i, item) {
      dataObj[$(this).attr('id')] = $(this).val();
    });
    $("#dialog_ad p").text(" 您当前选择是【" + $("#MakeType").find("option:selected").text() + "】，是否确认？")
    $('#dialog_ad').dialog({
      autoOpen: false,
      width: 600,
      resizable: false,
      modal: true,
      title: '确认操作',
      buttons: [{
        html: "<i class='fa fa-save'></i>&nbsp; 确认",
        "class": "btn btn-danger",
        click: function(e) {
          ajax({
            type: "POST",
            url: "updateNumber",
            data: dataObj,
            dataType: 'json',
            success: function(data) {
              ReturnAjax({
                data: data
              });
              $("#dialog_ad").dialog("close");
            },
            error: function(message) {
              $.errorFun("修改失败，请稍后重试");
            }
          });
        }
      }, {
        html: "<i class='fa fa-times'></i>&nbsp; 取消",
        "class": "btn btn-default",
        click: function() {
          $(this).dialog("close");
        }
      }]
    });
    $('#dialog_ad').dialog("open");
    return false;
  })
}
//删除数据
function delRow(trId, uId) {
  $.delFun("del-Number", "No", uId); //1：接口名称  2：参数名称  3：参数值
}

function Getfacilitator() {
  ajax({
    url: "get-facilitator",
    data: {
      Index: 1,
      Size: 100
    },
    success: function(data) {
      var thisdataList = data;
      if (thisdataList) {
        $.each(thisdataList, function(i) {
          $("#Custom").append("<option value='" + thisdataList[i].FacilitatorNo + "'>" + thisdataList[i].FacilitatorName + "</option");
        })
      }
    },
    error: function(message) {
      $.errorFun("产品查询失败！");
    }
  })
}

//产品
function product() {
  ajax({
    url: "brandlist",
    success: function(data) {
      var html = "<option value='0'>请选择</option>";
      $(data).each(function(i) {
        html += "<option data-no='" + data[i].BrandNo + "' value='" + data[i].BrandId + "'>" + data[i].BrandName + "</option>";
      })
      $("#tab1").empty().append(html)
    },
    error: function(message) {
      $.errorFun("获取产品信息失败");
    }
  })
}

var selI = 2;

function inOrd_info(id) {
  let $id = $('#' + id);
  let ids = $id.val();
  let Productid = $id.find("option:selected").attr("data-no");
  $.ajax({
    type: "GET",
    url: _path + "get-product-info/",
    dataType: 'json',
    async: false,
    data: {
      No: Productid,
    },
    beforeSend: function(res) {
      res.setRequestHeader('Token', dataList.Key)
    },
    success: function(data) {
      var html = "";
      if (data.length) {
        $id.parent().children('select:eq(' + $id.index() + ')').nextAll().remove();
        html = `<select id="tab${selI}" onchange="inOrd_infoCode('tab${selI}')" style="height:32px;width: 90px;margin:0 10px;border: 1px solid #ccc;"><option value="0">请选择</option>`;
        data.map(p => {
          html += `<option data-no='${p.ProductCode}' value='${p.ProductNo}'>${p.ProductName}</option>`;
        })
        html += '</select>';
        $id.parent().append(html);
        selI++;
      } else {
        $id.parent().children('select:eq(' + $id.index() + ')').nextAll().remove();
      }
    },
    error: function(message) {
      $.errorFun("查询失败，请稍后尝试!");
    }
  });
}

function inOrd_infoCode(id) {
  let $id = $('#' + id);
  let ids = $id.val();
  let Productid = $id.find("option:selected").attr("data-no");
  $.ajax({
    type: "GET",
    url: _path + "get-shard/",
    dataType: 'json',
    async: false,
    data: {
      No: Productid,
    },
    beforeSend: function(res) {
      res.setRequestHeader('Token', dataList.Key)
    },
    success: function(data) {
      var html = "";
      if (data.length > 0) {
        $id.parent().children('select:eq(' + $id.index() + ')').nextAll().remove();
        html = `<select id="tab${selI}" style="height:32px;width: 90px;border: 1px solid #ccc;">`;
        data.map(p => {
          var codeData = JSON.parse(p.Custom),
            Spec = '',
            SpecCoed = '',
            ProductNo = '',
            PartCode = '',
            Alias = '';
          (codeData.settings.item).map((p, index) => {
            if (p['key'] == "Spec") {
              Spec = p.value;
            }
            if (p['key'] == "SpecCode") {
              SpecCoed = p.value;
            }
            if (p['key'] == "PartCode") {
              PartCode = p.value + "/";
            }
            if (p['key'] == "ProductNo") {
              ProductNo = p.value;
            }
            if (p['key'] == "Alias") {
              Alias = p.value;
            }
          });
          html += `<option data-no='${p.ProductNo}' value='${p.ProductNo}'>${Alias+"/"+Spec+"/"+SpecCoed+"/"+PartCode+ProductNo}</option>`;
        })
        html += '</select>';
        $id.parent().append(html);
        selI++;
      } else {
        $id.parent().children('select:eq(' + $id.index() + ')').nextAll().remove();
      }
    },
    error: function(message) {
      $.errorFun("查询失败，请稍后尝试!");
    }
  });
}

//文件上传
var PnoFile = '';
var MkT = '';

function uploadTxt(No, Pno, Mkt) {
  billcode = No;
  MkT = Mkt;
  PnoFile = Pno.split('|').pop();
  $("#dialog-upload").dialog("open");
  $('#file').val('');
}

function TextVs(val, no, noId, textdom, dom) {
  $('#' + noId).val(no);
  $("#" + textdom).val(val);
  $("#" + dom).hide();
  ajax({
    url: 'GetProductByLable/',
    type: 'GET',
    dataType: 'json',
    data: {
      LableId: no
    },
    success: function(data) {
      if (data.length) {
        var PNos = data.map(function(index, elem) {
          return index.ProductNo;
        })
        $('#ProductNo').val(PNos.splice(','));
      }
    }
  });

}

var MakeTypeList = {
  '1': "代表农药登记证持有人生产",
  '2': '代表委托加工',
  '3': '代表委托分装'
};

$(function() {
  //表格渲染
  product();

  $('#CodeType').change(function() {
    console.log(this.value)
    this.value == '0' ? $('#CountDiv').show() : $('#CountDiv').hide();
    this.value == '1' ? $('#Count').val('0') : $('#Count').val('');
  })
  iTime('#StartTime,#FinshTime');
  if ($("#StartTime").val() != '' && $("#FinshTime").val() != '') {
    var StartTime = $("#StartTime").val();
    var FinshTime = $("#FinshTime").val();
  } else {
    var myDate = new Date(); //获取当前年
    var fYear = myDate.getFullYear();
    var fMonth = p(myDate.getMonth() + 1); //获取当前月
    var fDate = p(myDate.getDate()); //获取当前日
    var FinshTime = fYear + '-' + fMonth + "-" + fDate + ' 23:59:59';
    var StartTime = fYear + '-' + fMonth + "-" + fDate + ' 00:00:00';
    $("#StartTime").val(StartTime);
    $("#FinshTime").val(FinshTime);
  }


  $("#LableId").on("input propertychange", function() {
    console.log($(this).val());
  })

  Tile('LableName', { //产线智能搜索
    url: 'Get_Lable_List_ByValue/',
    field: 'Value',
    dataNo: 'LableId',
    dataName: 'LableName',
    GetValId: 'LableId',
    width: 260
  });

  var jQGridData = GetHeaders();
  GlobaljqGrid('#jqgrid', {
    url: "GetNumberList/?strWhere=&ProductNo=&Facilitator=&sTime=" + $("#StartTime").val() + "&fTime=" + $("#FinshTime").val(),
    pageDom: '#pjqgrid',
    colNames: jQGridData.colNames,
    colModel: jQGridData.colModel,
    gridComplete: function() {
      qxC(); //权限控制
    },
    loadComplete: function(data) {
      _Obj = data.rows;
      var ids = jQuery("#jqgrid").jqGrid('getDataIDs');
      for (var item = 0; item < ids.length; item++) {
        var status = data.rows[item].Status;
        status == 'True' ? status = '正常' : status = '失效';
        var MakeType = data.rows[item].MakeType;
        MakeType = MakeTypeList[MakeType];
        var CreateTime = timeMat(data.rows[item].CreateTime);
        var Cte = data.rows[item].NumSatus == 'True' ? '是' : '否';
        jQuery("#jqgrid").jqGrid('setRowData', ids[item], {
          CodeType: Cte,
          MakeType: MakeType,
          Status: status,
          CreateTime: CreateTime
        });
      }
      for (var i = 0; i < ids.length; i++) {
        var cl = ids[i],
          uploadBtn = '',
          ca = '';

        if (data.rows[i].CodeType == '0') {
          $("[title='" + data.rows[i].Name + "']").css({
            'border-left': 'solid 15px #3276b1'
          });
        }

        if (data.rows[i].NumSatus == 'False' && data.rows[i].CodeType == '0') {

          uploadBtn = "<button class='btn btn-xs btn-success' data-qx='上传' title='上传文件' data-original-title='Save Row' onclick=\"uploadTxt('" + data.rows[i].No + "','" + data.rows[i].ProductNo + "','" + data.rows[i].MakeType + "');\"><i class='fa fa-cloud-upload'></i></button>";
          ca = "<button class='btn btn-xs btn-danger' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].No + "');\"><i class='fa  fa-trash-o'></i></button>";
        } else {
          uploadBtn = "<button style='background-color: #c5cec5;' class='btn btn-xs btn-success'  title='禁止上传文件' data-original-title='Save Row'><i class='fa fa-cloud-upload'></i></button>";
          ca = "<button style='background-color: #c5cec5;' class='btn btn-xs btn-danger' data-qx='删除' title='删除' data-original-title='Cancel'><i class='fa  fa-trash-o'></i></button>";
        }
        se = "<button class='btn btn-xs btn-primary' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].No + "');\"><i class='fa fa-pencil'></i></button>";

        jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
          act: uploadBtn + se + ca
        });
      }
    }
  })

  Getfacilitator();
  $("#search-div").click(function(event) {
    var searchVal = $("#BillName").val() || '',
      PNo = $('#ProductNoG').val() || '',
      Fo = $('#Facilitator').val() || '',
      path = _path + "GetNumberList/?strWhere=" + searchVal + '&ProductNo=' + PNo + '&Facilitator=' + Fo + "&sTime=" + $("#StartTime").val() + "&fTime=" + $("#FinshTime").val();
    jQuery("#jqgrid").jqGrid("setGridParam", {
      url: path
    }).trigger("reloadGrid"); //每次点击查询重新加载url
  });
  //添加
  $("#add").click(function() {
    var iflag = true;
    $('#iform').find('input,select').each(function(index, el) {
      if ($(this).val()) {
        iflag = true;
      } else {
        console.log(el);
        iflag = false;
        return false;
      }
    });
    if (iflag) {
      $('#iform').bootstrapValidator('validate');
      var options = decodeURIComponent($("#iform").serialize(), true);
      var params = $("#iform").serializeArray();
      var values = {};
      for (var item in params) {
        values[params[item].name] = params[item].value;
      }
      values.CreateBy = dataList.PermitNo;
      values.Info = '';
      console.log(values);
      $("#dialog_ad p").text(" 您当前选择是【" + $("#MakeType").find("option:selected").text() + "】，是否确认？")
      $('#dialog_ad').dialog({
        autoOpen: false,
        width: 600,
        resizable: false,
        modal: true,
        title: '确认操作',
        buttons: [{
          html: "<i class='fa fa-save'></i>&nbsp; 确认",
          "class": "btn btn-danger",
          click: function(e) {
            ajax({
              type: "POST",
              url: "addNumber",
              dataType: 'json',
              data: values,
              success: function(data) {
                ReturnAjax({
                  data: data
                });
                $("#dialog_ad").dialog("close");
              },
              error: function(message) {
                $.errorFun("添加失败，请稍后重试");
              }
            });
          }
        }, {
          html: "<i class='fa fa-times'></i>&nbsp; 取消",
          "class": "btn btn-default",
          click: function() {
            $(this).dialog("close");
          }
        }]
      });
      $('#dialog_ad').dialog("open");
      return false;
    } else {
      $.errorFun('信息请填写完整');
      $('#iform').bootstrapValidator('validate');
      return false;
    }
  });
  $('#modal_link').click(function() { //点击显示弹出框
    $("#ui-id-4").html("添加编码");
    $('#dialog-message').dialog('open');
    $("#add").show();
    $("#update").hide();
    $('#tab1').nextAll().remove();
    $('#CodeType').change();
    reset(); //清空表单
    formValidator();
    $("#Name,#Custom,#MakeType,#Layer,#Params,#Remark,#CodeType").attr("disabled", false);
    $('#add-tbody').children('select').attr("disabled", false);
    $('#add-tbody').children('select').css('background-color', '');
    $('#Name').val(CurentTime());
    $('#TeamNo').attr("disabled", false);
    return false;
  });

  if (IsPC()) {
    $("#dialog-message").dialog({ //弹出框设置
      autoOpen: false,
      modal: true,
      width: 700,
      height: 600,
    });
    $("#dialog-upload").dialog({ //弹框
      autoOpen: false,
      modal: true,
      width: 600,
      height: 300,
    });
  } else {
    $("#dialog-message").dialog({ //弹框
      autoOpen: false,
      modal: true,
      width: 'auto',
      height: 'auto',
    });
    $("#dialog-upload").dialog({ //弹框
      autoOpen: false,
      modal: true,
      width: 'auto',
      height: 'auto',
    });
  }
})


//文件上传
const BYTES_PER_CHUNK = 1024 * 1024; // 每个文件切片大小定为1MB .
var slices;
var totalSlices;

//发送请求
function sendRequest() {
  $('#progress').show();
  var blob = document.getElementById('file').files[0]; //file流      
  var start = 0;
  var end;
  var index = 0;
  if (blob) {
    // 计算文件切片总数
    slices = Math.ceil(blob.size / BYTES_PER_CHUNK); //切割多少次
    totalSlices = slices; //总切割次数

    while (start < blob.size) {
      end = start + BYTES_PER_CHUNK; //切片位置
      if (end > blob.size) { //判断是否完结
        end = blob.size;
      }

      uploadFile(blob, index, start, end);

      start = end; //记录切割位置
      index++;
    }
  } else {
    $.errorFun("请选择需要上传的文件！");
  }
}

//上传文件
function uploadFile(blob, index, start, end) { //文件流，第几个，从哪里开始，从哪里结束
  var fd;
  var chunk;

  //进度条
  var progress = 100 / totalSlices;
  progress = (index + 1) * progress + '%';
  $("#progress_text").text(progress);
  $('#progress_div').css('width', progress);


  chunk = blob.slice(start, end); //切割文件

  //构造form数据
  fd = new FormData();
  fd.append("file", chunk);
  fd.append("name", blob.name);
  fd.append("index", index);

  $.ajax({
    //url:"http://172.26.153.222:9091/mms/uploadFileNumber/?orderNo="+billcode+"&sum="+totalSlices,
    url: _path + "uploadFileNumber/?orderNo=" + billcode + "&sum=" + totalSlices + "&pno=" + PnoFile + "&type=" + MkT,
    type: "POST",
    data: fd,
    async: false,
    cache: false,
    processData: false,
    contentType: false,
    beforeSend: function(res) {
      res.setRequestHeader('Token', dataList.Key);
    },
    success: function(data) {
      if (data.Status > 0) {
        slices--;
        if (slices == 0) {
          $("#progress_text").text('100%');
          $('#progress_div').css('width', '100%');
          setTimeout(function() {
            $('#progress').hide();
            $("#dialog-upload").dialog('close');
            F5();
          }, 700);
        }
      } else {
        $.errorFun(data.Value);
      }

    },
    error: function() {
      $.errorFun("上传错误！");
    }
  });

}

function CurentTime(){ 
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒
    
    var clock = year;
    
    if(month < 10)
        clock += "0";
    clock += month;
    if(day < 10)
        clock += "0";
        
    clock += day;
    
    if(hh < 10)
        clock += "0";
        
    clock += hh;
    if (mm < 10) clock += '0'; 
    clock += mm ; 
     
    if (ss < 10) clock += '0'; 
    clock += ss; 
    return(clock); 
}