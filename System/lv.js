var _Obj = {};
var _GroupId = '';
var datalist=[];
 var dq_list = [];
 $(function(){
    qxC();
    GetGroup();
    getOrganization();
    
    if(IsPC()){
      $("#dialog-message").dialog({  //弹框
        autoOpen: false,
        modal: true,
        width: 570,
        height: 370,
      });
      
    }else{
      $("#dialog-message").dialog({  //弹框
        autoOpen: false,
        modal: true,
        width: 'auto',
        height: 'auto',
      });
      $('#lv-form').css('width','100%');
      $('#diqu-tree').css('position','relative');
    }
    //Tree容器高度
    $("#diqu-fixed,#diqu-tree").height($(window).height()-161);
    $("#lv-form").height($(window).height()-161);
    //Tree插件
    $('.tree > ul').attr('role', 'tree').find('ul').attr('role', 'group');
    $('.tree').find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').find(' > span').attr('title', 'Collapse this branch').on('click', function(e) {
      var children = $(this).parent('li.parent_li').find(' > ul > li');
      if (children.is(':visible')) {
        children.hide('fast');
        $(this).attr('title', 'Expand this branch').find(' > i').removeClass().addClass('fa fa-lg fa-plus-circle');
      } else {
        children.show('fast');
        $(this).attr('title', 'Collapse this branch').find(' > i').removeClass().addClass('fa fa-lg fa-minus-circle');
      }
      e.stopPropagation();
    });
    //获取所有模块信息
    ajax({
      url: "role/GetModule",
      data: {
        ModuleId:'',
        types:1
      },
      success: function(data){
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
          })
      },
      error: function(error){
        $.errorFun('获取模块信息失败');
      }
    });
});

//获取企业信息
function getOrganization(){
    var $OrganizationId = $("#OrganizationId"),
    html = '<option value="0">请选择</option>';
    ajax({
        url:"role/getOrganization?OrganizationNo=",
        success: function(data){
            $.each(data,function(index, el) {
                html += '<option value="'+el.OrganizationId+'">'+el.OrganizationName+'</option>';
            });
            $OrganizationId.empty().append(html);
        },
        error: function(error){
            $.errorFun("获取企业信息失败请刷新页面重试");
        }
    });
}

function tab_yz(){
   $('#Newuser').data('bootstrapValidator', null);
    $('#Newuser').bootstrapValidator({
        feedbackIcons : {
            valid : 'glyphicon glyphicon-ok',
            invalid : 'glyphicon glyphicon-remove',
            validating : 'glyphicon glyphicon-refresh'
        },
        fields : {
            RoleNo : {
                validators : {
                    notEmpty : {
                        message : '*用户代码为必填项'
                    },
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字和字母'
                    }
                }
            },
            RoleName : {
                validators : {
                    notEmpty : {
                        message : '*角色名称为必填项'
                    }
                }
            },
            ModuleId : {
                validators : {
                    notEmpty : {
                        message : '*模块为必填项'
                    },
                    regexp: {/* 不能填中文 */
                        regexp: /^[0-9]+$/,
                        message: '只能为数字'
                    }
                }
            }           
        }
    })//表单验证end
}


function  power_info(id){  //权限详情
  $('.tree li').removeClass('active');
  $("#"+id).addClass('active');
  _GroupId = id;
  var storeObj={};
  $("#lv-form tbody input[type='checkbox']").prop("checked",false);
  $("#content").animate({scrollTop:0}, 0);//容器回到顶部
  $("#lv-form").fadeIn(800);
  ajax({
    url: 'role/GetRoleByGroupId/',
    data: {GroupId: id},
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
      }else{
        $("#lv-form tbody input[type='checkbox']").prop("checked",false);
      }
    },
    error: function(error){

    }
  })
}

function select_nr(id){
        $('#dialog-message').dialog('open');
         return false;
 }
  function All_check(){       
          console.log($("#All_checked").is(':checked'))
       $("#lv-form input[type='checkbox']").prop('checked', $("#All_checked").is(':checked'));
}
              
function subQuxan(){  //保存权限
        var sum="";
      $("input[data-name='key']:checked").each(function(index,item){
          sum += _GroupId +　":";
          var val = "";
          $(item).parents("tr").find("input:not(:first)").each(function(idx,i){ //循环一行TR的TD第一个除外
                if($(i).is(':checked')){
                  val += $(i).val();
                }else{
                   
                }
              if($(i).parents("tr").find("input:not(:first)").length-1 != idx){
                val += "|";
              }
          })
          if($("input[data-name='key']:checked").length-1 != index){
            val += ",";
          }
          sum += val;
      })   
       ajax({
            type:"POST",
            url:"role/rightOperation",        
            data:{
               strDate:sum
            },
            success: function(data){                
                if(data.Status>0){
                  alert('编辑权限成功');
                  F5();
                }
            },
            error: function(message){
                $.errorFun("编辑权限失败");
            }
        }); 
}

function GetGroup(){  //角色列表
    ajax({
        url:"role/GetGroup",
        error: function(message){
            console.log(message);
        },
        success: function(data){
            _Obj = data;
            if(data.length>0&&data.length!=undefined){
              datalist=data;
              var html="";
              for(var i=0;i<data.length;i++){
                 html+='<li id='+data[i].GroupId+'>'+
                          '<span title="点击查看权限信息" onclick="power_info('+data[i].GroupId+');">'+ 
                          data[i].GroupName+ 
                          '</span>'+
                          '<a title="详细信息" onclick="role_list(\''+i+'\',\''+data[i].GroupId+'\')" class="btn btn-default btn-circle"><i class="fa fa-pencil-square-o"></i></a>'+
                        '</li>';
              }
                $("#userTab").empty().append(html);
            }
            
        }
    }); 
}

function role_list(trId,uId){  //角色详情
      tab_yz();
   $('#dialog-message').dialog('open');
   $("#ui-id-3").text("编辑角色");
   $("#dialog-message input").each(function(i,item){
       $("#"+$(item).attr("id")).val(datalist[trId][$(item).attr("id")]);
    });
   $("#adsub").hide();
   //删除角色组
   $("#delsub").show().removeAttr("disabled").unbind("click").click(function(){   //删除
      jQuery("body").append('<div id="dialog_del" title="删除"><p>是否删除</p></div>');
          $('#dialog_del').dialog({
              autoOpen : false,
              width : 600,
              resizable : false,
              modal : true,
              title : '删除操作',
              buttons : [{
                  html : "<i class='fa fa-trash-o'></i>&nbsp; 删除",
                  "class" : "btn btn-danger",
                  click : function() {
                      ajax({
                          async: true,
                          type:"POST",
                          url:'role/DelGroup',
                          data:{GroupId:uId},
                          success: function(data){
                              if(data>=1){
                                location.reload();
                              }else{
                                $.errorFun("删除失败");
                              }
                          },
                          error: function(message){
                              $.errorFun("删除失败");
                          }
                      })
                  }
              }, {
                  html : "<i class='fa fa-times'></i>&nbsp; 取消",
                  "class" : "btn btn-default",
                  click : function() {
                      $(this).dialog("close");
                  }
              }]
          });
          $('#dialog_del').dialog("open");
   });

   //给修改input赋值
   $("#Newuser").find("input,select,textarea").each(function(i,item){
        $("#"+$(item).attr("id")).val(_Obj[trId][$(item).attr("id")]);
    });

   //修改角色组
   $("#upsub").show().removeAttr("disabled").unbind("click").click(function(){
     $('#Newuser').bootstrapValidator('validate');
        
        var inputList = $("#Newuser").find("input,select,textarea"),
        dataObj = {"GroupId":uId};
        $.each(inputList,function(index, val) {
          dataObj[$(val).attr('id')] = $(val).val();
        });
        ajax({
            url:"role/UpdateGroup",
            type:"POST",
            data:dataObj,
            success: function(data){
                GetGroup();
                $('#dialog-message').dialog('close');
            },
            error: function(message){
                $.errorFun('修改角色组失败');
            }
        });
    });
  return false;   
}

function add_user(){   //新增角色
    tab_yz();
  $("#dialog-message input").each(function(){
        $(this).val("");
  });
  $('#dialog-message').dialog('open');
    $("#ui-id-3").text("添加用户");
    $("#upsub,#delsub").hide();
    $("#adsub").show().removeAttr("disabled").click(function(){
      var iflag = true;
      $('#Newuser').find('input,select').each(function(index, el) {
        if($(this).val()){
          iflag = true;
        }else{
          iflag = false;
          return false;
        }
      });
      if(iflag){
        $('#Newuser').bootstrapValidator('validate');
        var inputList = $("#Newuser").find("input,select,textarea"),
        dataObj = {};
        $.each(inputList,function(index, val) {
          dataObj[$(val).attr('id')] = $(val).val();
        });
        ajax({
            url:"role/CreateGroup",
            type:"POST",          
            data:dataObj,
            success: function(data){
              ReturnAjax({data:data})
               window.location.reload();         
            },
            error: function(message){
                console.log("error"+message);
            }
        }); 
      }else{
        $.errorFun('信息请填写完善',"#es");
        $('#iform').bootstrapValidator('validate');
        return false;
      }
    });
    return false;

}
