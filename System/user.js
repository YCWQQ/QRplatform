var tab_data=[],_userNo,_userArray = [],_userId;
$(function(){  

  $("#search-div").click(function(event) {
      var searchVal = $("#search-html").val(),
      path = _path+"role/uservague/?PermitNo="+dataList.PermitNo+"&v="+searchVal;
      jQuery("#jqgrid").jqGrid("setGridParam",{url:path}).trigger("reloadGrid");//每次点击查询重新加载url
  });

    if(IsPC()){
      $("#dialog-message").dialog({
          autoOpen: false,
          modal: true,
          width: 760,
          height: 'auto',
       });

      $("#lv-form").dialog({
          autoOpen: false,
          modal: true,
          width: 1000,
          height: 700,
       });
    }else{
      $("#dialog-message").dialog({
        autoOpen: false,
        modal: true,
        width: 'auto',
        height: 'auto',
     });

    $("#lv-form").dialog({
        autoOpen: false,
        modal: true,
        width: 'auto',
        height: 'auto',
     });
    }
    $('#modal_link').click(function () {//点击显示弹出框
         $("#ui-id-3").text("添加用户");
        $('#dialog-message').dialog('open');
        add_user();
        return false;
    });

    

    //获取所有模块
    ajax({
      url: "role/GetModule",
      data: {
        ModuleId:'',
        types:1
      },
      success: function(data){
         var dq_list = [];
          $.each(data,function(index, el) {
            var strArray = [],strObj = {};
              var urlJson = eval(data[index].Info);
              urlJson != null ? info = urlJson[0].url : info = null;
              if(data[index].roleDate != null){
                var dataArr = data[index].roleDate.split(',');
                $.each(dataArr,function(index, el) {
                  strArray.push(el.split(':'));
                });
              }else{
                strArray.length = 0;
              }
              
              dq_list.push({"name":data[index].ModuleName,"id":data[index].ModuleId,"ParentId":data[index].ParentId,"qx":strArray,"info":info});
          });
          var sum='',
              laber='';
          for(var i=0;i<dq_list.length;i++){
            laber = "";
            if(dq_list[i]['qx'].length>0){
              $.each(dq_list[i]['qx'],function(index, el) {
                laber += '<label for="'+index+'_a'+dq_list[i].id+'s"><input type="checkbox" name="checkbox-inline" data-id="'+el[1]+'" value="'+el[1]+'" id="'+index+'_a'+dq_list[i].id+'s">'+el[0]+'</label>'
              });
            }else{
              laber = '';
            }
            if(dq_list[i].ParentId == 0){
              sum = '<tr id="P'+ dq_list[i].id +'" ><td colspan="2"><strong>'+ dq_list[i].name +'</strong></td></tr>';
              $("#lv-tbody").append(sum);
            }
            if(dq_list[i].ParentId != 0){
              $("tr").removeClass('trActive');
              sum = '<tr class="trActive">'+
              '<td>' +
              '<label for=a'+dq_list[i].id+'s>&nbsp;&nbsp;&nbsp;&nbsp;<input data-name="key" type="checkbox" name="checkbox-inline" id="a'+dq_list[i].id+'s">'+
              dq_list[i].name+'</label>'+
              '</td>'+
              '<td> '+laber+'</td>'+
              '</tr>';
              $("#P"+dq_list[i].ParentId).after(sum);
              $("#P"+dq_list[i].ParentId).removeAttr('id');
              $(".trActive").attr('id','P'+dq_list[i].ParentId);
            }

         }
         $("#lv-tbody input[type='checkbox']").click(function(){ //父级选中 子集模块对应
            var s=$(this).attr("id");
           var car=false; //定义父级勾选值
              if(s.indexOf("_")>-1){ //子集点击选中
                     var op=s.substring(s.indexOf('_')+1,s.length);
                   $("input[id*='_"+op+"']").each(function(){ 
                            if($(this).is(':checked')){  //判断子集是否还有勾选项
                               car=true;
                            }
                   });
                      $("#"+op).prop("checked",car); //父级勾选
                      $(this).parents('td').find('label:first input').prop("checked",car);
              }else{  //父级点击勾选
                     $("input[id*='"+s+"']").prop("checked",$(this).is(':checked'));
              }   
          });
      },
      error: function(error){
        
      }
    });
    ajax_table(); 
    // getOrganization();//获取企业信息
    GetGroup();//获取组信息
    GetDepartment();//获取部门信息
    // AreaNo();//获取地区信息
})

//获取企业信息
// function getOrganization(){
//     var $OrganizationId = $("#OrganizationId"),
//     html = '<option value="0">请选择</option>';
//     ajax({
//         url: "role/getOrganization?OrganizationNo=",
//         success: function(data){
//             $.each(data,function(index, el) {
//                 html += '<option value="'+el.OrganizationId+'">'+el.OrganizationName+'</option>';
//             });
//             $OrganizationId.empty().append(html);
//         },
//         error: function(error){
//             $.errorFun("获取企业信息失败请刷新页面重试");
//         }
//     });
// }

//获取部门信息
function GetDepartment(){
    var $GetDepartment = $("#DepartmentId"),
    html = '<option value="0">请选择</option>';
    ajax({
        url: "role/dept-option",
        success: function(data){
            $.each(data,function(index, el) {
                html += '<option value="'+el.DepartmentId+'">'+el.DepartmentName+'</option>';
            });
            $GetDepartment.empty().append(html);
        },
        error: function(error){
            $.errorFun("获取部门信息失败请刷新页面重试");
        }
    });
}

//获取所有角色组
function GetGroup(){  
    ajax({
       url:"role/GetGroup",
       error: function(message){
           $.errorFun("获取组信息失败，请刷新页面尝试");
       },
       success: function(data){
          if(data.length>0&&data.length!=undefined){               
            var html="";
            for(var i=0;i<data.length;i++){
               html+='<li><label><input type="checkbox" name="Group[]" id="'+ data[i].GroupId +'" />'+ data[i].GroupName+'</label></li>';
            }
          }
          $("#Group").empty().append(html);   
       }
    });
}

//获取地区信息
function AreaNo(){
  ajax({
    url: 'role/GetAreaOptions',
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
//获取权限详情
function  power_info(no,id){  //权限详情
  var $checkList = $("#jqgrid").find('td input[name="checkbox-inline"]:first');
  
  _userArray.length = 0;//清空数组
  _userId = id;
  $('#lv-form').dialog('open');
  $("#lv-form tbody input[type='checkbox']").prop("checked",false);
  $("#lv-form").animate({scrollTop:0}, 0);//容器回到顶部
  $("#lv-form").fadeIn(800);
  ajax({
    url: 'role/GetRoleByUserId',
    data: {PermitNo: no},
    success: function(data){
      if(data!=null && data!=''){
        var values=data; //模拟返回数据
        $.each(values,function(index, el) {
            $('input[data-id='+el.RoleId+']').prop("checked",true);
        });
        $("input[data-name='key']").each(function(index,item){
            if($(item).parents("tr").find('input[type="checkbox"]').is(":checked")){
                $(item).prop("checked",true); //父级勾选
            }
        })
        $(":input[data-id]:checked").each(function(index, el) {
            _userArray.push($(el).attr('data-id'));
        });

      }else{
        console.log('此用户没有赋予权限');
        $("#lv-form tbody input[type='checkbox']").prop("checked",false);
      }
    },
    error: function(error){
        $.errorFun('获取用户详情失败');
    }
  })
}

//修改自定义权限
function subQuxan(){
    // var qxArray = [];     //得到最新的权限
    // $(":input[data-id]:checked").each(function(index, el) {
    //     qxArray.push($(el).attr('data-id'));
    // });
    // if(qxArray.length >= _userArray.length){
    //     var str = qxGet(qxArray,_userArray,qxArray);
    // }else{
    //     var str = qxGet(_userArray,qxArray,qxArray);
    // }
    var str = qxGet();
    ajax({
        url: 'role/CreateAction',
        type: 'POST',
        data: {strDate: str},
        success: function(data){
            if(data.Status==1){
                location.reload();
            }else{
                $.errorFun('修改用户自定义权限失败');
            }
        },
        error: function(error){
            console.log(error);
        }
    })
}

//拆分数组获得权限字符串
function qxGet(){
  var str = _userId+'|',//定义字符串抬头
    getArray = [],    //得到所有的选中权限
    noArray = [];
    $(":input[data-id]:checked").each(function(index, el) {
        getArray.push($(el).attr('data-id'));
    });
    $("input[data-id]").not("input:checked").each(function(index, el) {
        noArray.push($(el).attr('data-id'));
    });
    if(getArray.length > 0){
        $.each(getArray,function(index, el) {
            if(getArray.length-1 > index){
                str += el+':1,';
            }else{
                str += el+':1'
            }
        });
    }
    if(noArray.length > 0){
        $.each(noArray,function(index, el) {
            str += ','+el+':0';
        });
    }
    return str;
}

// function qxGet(arr1,arr2,arr3){
//         str = _userId+'|',//定义字符串抬头
//         diyArray = [],    //得到所有的权限包括增加和取消
//         diyArray2 = [];   //得到取消的权限
//     $.each(arr1,function(index, el) { //先根据数组长度来遍历出不同的roleId
//         //定义一个变量用于取arr1,arr2中不同的值
//         var count = 0;
//         $.each(arr2,function(i, v) {
//             if(el == v){
//                 count++;
//             }else{
//                 diyArray.push(v);//这里截取到重复的除新增或减少的roleId的其余数据
//             }
//         });
//         if(count==0){
//             diyArray.push(el);//这里把变化的roleId取出来
//         }       
//     });
//     diyArray = uniQueue(diyArray);//把重复的roleId去掉
//     $.each(diyArray,function(index, el) {
//         var count = 0;
//         $.each(arr3,function(i, v) {
//             if(el == v){
//                 count++;
//             }
//         });
//         if(count == 0){
//             diyArray2.push(el); //获取到取消的roleId
//         }
//     });
//     //给新增和以前的roleId赋值
//     if(arr3.length > 0){
//         $.each(arr3,function(index, el) {
//             if(arr3.length-1 > index){
//                 str += el+':1,';
//             }else{
//                 str += el+':1';
//             }
//         });
//     }
//     //给取消的roleId赋值
//     if(diyArray2.length > 0){
//         $.each(diyArray2,function(index, el) {
//             str += ','+el+':0';
//         }); 
//     }
//     return str;//返回最后的字符串
// }

//过滤数组重复元素
function uniQueue(array){ 
    var arr=[]; 
    var m; 
    while(array.length>0){ 
        m=array[0]; 
        arr.push(m); 
        array=$.grep(array,function(n,i){ 
            return n==m; 
        },true); 
    } 
    return arr; 
} 

//表单验证
function tab_Verification(){
    //先销毁再验证
    $('#iform').data('bootstrapValidator', null);
    $('#iform').bootstrapValidator({
        feedbackIcons : {
            valid : 'glyphicon glyphicon-ok',
            invalid : 'glyphicon glyphicon-remove',
            validating : 'glyphicon glyphicon-refresh'
        },
        fields : {
            PermitNo : {
                validators : {
                    notEmpty : {
                        message : '*用户账号为必填项'
                    },
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    },
                     stringLength: {
                         min: 3,
                         max: 30,
                         message: '用户账号长度必须在3到30之间'
                     },
                }
            },
            PermitName : {
                validators : {
                    notEmpty : {
                        message : '*用户姓名为必填项'
                    }
                }
            },
            Password : {
                validators : {
                    notEmpty : {
                        message : '*用户密码为必填项'
                    },
                    stringLength: {
                         min: 3,
                         max: 30,
                         message: '用户密码长度必须在3到30之间'
                    },
                    regexp: {/* 不能填中文 */
                        regexp: /^[^\u4e00-\u9fa5]{0,}$/,
                        message: '用户密码不能为中文'
                    }
                }
            },
            Email : {
                validators : {
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^\w+@([0-9a-zA-Z]+[-0-9a-zA-Z]*)(\.[0-9a-zA-Z]+[-0-9a-zA-Z]*)+$/,
                        message: '请输入正确的邮箱类型'
                    },
                     emailAddress: {
                         message: '请输入正确的邮件地址如：123@qq.com'
                     }

                }
            },
            Phone : {
                validators : {
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
                        message: '请输入正确的电话号码格式'
                    }
                }
            },
            Mobile : {
                validators : {  
                    stringLength: {
                         min: 11,
                         max: 11,
                         message: '请输入11位手机号码'
                    },
                     regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^1[34578]\d{9}$/,
                        message: '请输入正确的手机号码格式'
                    }
                }
            },
            'Group[]': {
                  validators: {
                     choice: {
                        min: 1,
                        message: '*所属组至少勾选一项'
                     }
                 }
            },
        }
    })//表单验证end
}

//新增
function add_user(){   
    reset();
    tab_Verification();
    $("#userupsub").hide();
    $('#PermitNo').attr("disabled",false);
    $("#useraddsub").show().removeAttr("disabled").unbind("click").click(function(){ 
      var iflag = true;
      $('#iform').find('input[type!="checkbox"],select').each(function(index, el) {
        if($(this).val()){
          iflag = true;
        }else{
          iflag = false;
          return false;
        }
      });
      if(iflag){
        $('#iform').bootstrapValidator('validate');
        var inputList = $("#iform").find("input:text,select,textarea"),
        dataObj = {};
        $.each(inputList,function(index, val) {
            dataObj[$(val).attr('id')] = $(val).val();
        });
        var checkList = '';
        var checkDom = $("input:checkbox:checked");
        checkDom.each(function(index,val) {
            if(checkDom.length-1>index){
                checkList += $(val).attr('id')+',';
            }else{
                checkList += $(val).attr('id');
            }
            
        });
        dataObj['GroupIds'] = checkList;
        ajax({
            type:"POST",
            url: "role/CreateUser",
            data:dataObj,
            success: function(data){                
                ReturnAjax({data:data});
            },
            error: function(message){
                $.errorFun("添加失败，请重新尝试");
            }
        }); 
        return false;
      }else{
        $.errorFun('信息请填写完善');
        $('#iform').bootstrapValidator('validate');
        return false;
      }
    });
}

//删除数据
function delRow(trId,uId) {
    $.delFun("role/DelUser","PermitId",uId);//1：接口名称  2：参数名称  3：参数值
}

function updateRow(trId,uId) {  //修改
    reset();
    tab_Verification(); 
    $('#dialog-message').dialog('open');
    $("#ui-id-3").text("修改用户");
    $('#PermitNo').attr("disabled",true);
    var dataObj = tab_data[trId-1];
    $(":input[type=checkbox]").removeAttr('checked');
     $("#iform").find('input:text,select').each(function(i,item){
        var $DomId = $(item).attr("id");
        if(dataObj[$DomId]!=undefined){
            $("#"+$DomId).val(dataObj[$DomId]);
        }
    });
    var EnB = dataObj.Enabled;
    EnB == true ? EnB = 'true':EnB = 'false';
    $("#Enabled").val(EnB);
    var checkArray = dataObj.GroupIds.split(',');
    var $checkDoms = $("#iform input:checkbox");
    $.each(checkArray,function(item, val) {
        $.each($checkDoms,function(index, el) {
            if($(el).attr('id') == val){
                $(el).prop('checked',true);
            }
        });
    });
    $("#useraddsub").hide();   
    $("#userupsub").show().removeAttr("disabled").unbind("click").click(function(){
        $('#iform').bootstrapValidator('validate');
        var inputList = $("#iform").find("input:text,select,textarea"),
        ajaxObj = {};
        ajaxObj['PermitId'] = uId;
        $.each(inputList,function(index, val) {
            ajaxObj[$(val).attr('id')] = $(val).val();
        });
        var checkList = '';
        var checkDom = $("input:checkbox:checked");
        checkDom.each(function(index,val) {
            if(checkDom.length-1>index){
                checkList += $(val).attr('id')+',';
            }else{
                checkList += $(val).attr('id');
            }
            
        });
        ajaxObj['GroupIds'] = checkList;
        ajax({
            type:"POST",
            url:"role/UpdateUser",
            data:ajaxObj,
            success: function(data){
                ReturnAjax({data:data});
            },
            error: function(message){
                console.log("error"+message);
            }
        });
        return false;
    }); 
}

function ajax_table() {  //查询数据

	var grid = $("#jqgrid");
    grid.jqGrid({
	    url: _path+"role/GetUserInfoPage?PermitNo="+dataList.PermitNo,
	    datatype: "json",
	    mtype: 'get',
	    jsonReader : {   
	        root: "rows",
            page: "page",
            total: "total",
            records: "records",
            cell: "cell",
            id: "id",
            size:"size"
	    },
        prmNames:{
            page:"Index",
            rows:"Size",
            // rogs:"OrgId",  //用户角色id eg：车间主任
            sort:null,
            order:null,
            search:null,
            nd:null,
            npage:null
        },
		colNames: ['用户姓名','用户账号','用户密码','组信息','企业名称','部门名称','邮箱','电话','手机','是否可用','所在地','状态','自定义权限','操作'],
        colModel: [{
            name: 'PermitName',
            index: 'PermitName',
             align: 'center'
        }, {
            name: 'PermitNo',
            index: 'PermitNo',
            width:'120',
            align: 'center'
        }, {
            name: 'Password',
            index: 'Password',
             align: 'center'
        }, {
            name: 'GroupNames',
            index: 'GroupNames',
             align: 'center'
        }, {
            name: 'OrganizationName',
            index: 'OrganizationName',
             align: 'center'
        }, {
            name: 'DepartmentName',
            index: 'DepartmentName',
             align: 'center'
        }, {
            name: 'Email',
            index: 'Email',
             align: 'center'
        }, {
            name: 'Phone',
            index: 'Phone',
        }, {
            name: 'Mobile',
            index: 'Mobile',
            width: '80'
        }, {
            name: 'Enabled',
            index: 'Enabled',
        }, {
            name: 'AreaName',
            index: 'AreaName',
            width:'80'
        }, {
            name: 'Status',
            index: 'Status',
            width:'80'
        }, {
            name: 'diy',
            index: 'diy',
            width:'150'
        }, {
            name: 'act',
            index: 'act',
            width:'100'
        }],
		
		loadComplete: function (data) {
      tab_data=data.rows;
		  var ids = jQuery("#jqgrid").jqGrid('getDataIDs');
     
          for (var i = 0; i < ids.length; i++) {
            
            //属性转换
            var enab = data.rows[i].Enabled;
            enab == true ? enab = '启用' : enab = '禁止';
            //状态转换
            var sta = data.rows[i].Status;
            sta == 1 ? sta = '正常' : sta = '失效';
            //自定义权限
            var diy = "<button class='btn btn-xs btn-primary' data-qx='修改' title='自定义权限' data-original-title='自定义权限' onclick=\"power_info('" + data.rows[i].PermitNo + "','" + data.rows[i].PermitId + "');\"><i class='fa fa-pencil'></i> 自定义权限</button>";
              var cl = ids[i];                          
              se = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=\"updateRow('" + cl + "','" + data.rows[i].PermitId + "');\"><i class='fa fa-pencil'></i></button>";
              ca = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=\"delRow('" + cl + "','" + data.rows[i].PermitId + "');\"><i class='fa  fa-trash-o'></i></button>";
              jQuery("#jqgrid").jqGrid('setRowData', ids[i], {
                  act:se + ca,
                  diy:diy,
                  Enabled:enab,
                  Status:sta
              });
          }
		},
    gridComplete: function (data) {
      qxC();//权限控制
    },
		multiselect: false,//多选框禁用
		autowidth: true,
		height: 'auto',
		search: true,
		rowNum: 10,
		rowList: [10, 20, 30],
		pager: '#pjqgrid',
		sortname: 'id',
		viewrecords: true,
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
	/* Add tooltips */
	$('.navtable .ui-pg-button').tooltip({
		container: 'body'
	});
	// remove classes
	jqGridUi();
}
