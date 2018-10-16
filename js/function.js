//------------------------------------公共方法----------------------------------------
$(function(){
    $.extend({
        //错误信息提醒
        errorFun:function(text,dom='#content'){
            $("#body_error").remove();
            jQuery(dom).append('<div id="body_error" class="alert alert-danger fade in">'
                        +'<button class="close" data-dismiss="alert">×</button>'
                        +'<i class="fa-fw fa fa-times"></i>'
                        +'<strong>提示信息：</strong> '+text+'.'
                        +'</div>');
            $("#body_error").delay(3000).fadeOut(500);
        },
        //删除操作          
        delFun:function(urlName,dName,dId,fn,txt='是否删除',flag=false){  //接口名称，参数name，参数val，fn：自定义可传可不传，是否是地区删除
            $('#dialog_del').remove();
            jQuery("body").append('<div id="dialog_del" title="删除"><p>'+txt+'</p></div>');
            var del = {};
            del[dName] = dId;
            var url = _path+urlName;
            // var url = 'http://172.26.153.186:8082/mms/'+urlName;
            if(IsPC()){
                var delwidth = 600;
            }else{
                var delwidth = 'auto';
            }
            $('#dialog_del').dialog({
                autoOpen : false,
                width : delwidth,
                resizable : false,
                modal : true,
                title : '删除操作',
                buttons : [{
                    html : "<i class='fa fa-trash-o'></i>&nbsp; 删除",
                    "class" : "btn btn-danger",
                    click : function(e) {
                        $.ajax({
                            cache: false,
                            type:"POST",
                            url:url,
                            data:del,
                            beforeSend: function(res){
                                res.setRequestHeader('Token',dataList.Key)
                            },
                            success: function(data){
                                if(data==0){
                                    if(flag){
                                        $("#dialog_del").dialog("close");
                                        $.errorFun("该选项或该选项子级在其他地方被引用，不可删除！！！");
                                    }else{
                                        $("#dialog_del").dialog("close");
                                        $.errorFun("删除失败！");
                                    }
                                }if(data.Status == -1){
                                    $("#dialog_del").dialog("close");
                                    $.errorFun(data.Value);
                                }else{
                                    $("#refresh_jqgrid").click();
                                    $("#dialog_del").dialog("close");
                                    $('#dialog_del').remove();
                                    if(fn){
                                        fn();
                                    }
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

        },
        //截取url
        getUrlParam:function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        //select 不可选中自己
        optionFalse:function(dom,uId){
            $("#"+ dom +">option").removeAttr("disabled").removeClass('DIYdisabled');
            $("#"+ dom +">option[data-id='"+uId+"']").attr("disabled",true).addClass('DIYdisabled');
        },
        optionClear:function(dom){ //清除select不可选中
            $("#"+ dom +">option").removeAttr("disabled").removeClass('DIYdisabled');
        }
    })
});
// 时间转换
function timeMat(t){
    if(t){
        var nS = t.substring(6,19);
        return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
    }else{
        return ' ';
    }
    
}   
//json转换
$.fn.stringify = function() {
  return JSON.stringify(this);
};
// jqgrid插件 UI样式
function jqGridUi(){
    $(".ui-jqgrid").removeClass("ui-widget ui-widget-content");
    $(".ui-jqgrid-view").children().removeClass("ui-widget-header ui-state-default");
    $(".ui-jqgrid-labels, .ui-search-toolbar").children().removeClass("ui-state-default ui-th-column ui-th-ltr");
    $(".ui-jqgrid-pager").removeClass("ui-state-default");
    $(".ui-jqgrid").removeClass("ui-widget-content");

    // add classes
    $(".ui-jqgrid-htable").addClass("table table-bordered table-hover");
    $(".ui-jqgrid-btable").addClass("table table-bordered table-striped");

    $(".ui-pg-div").removeClass().addClass("btn btn-sm btn-primary");
    $(".ui-icon.ui-icon-plus").removeClass().addClass("fa fa-plus");
    $(".ui-icon.ui-icon-pencil").removeClass().addClass("fa fa-pencil");
    $(".ui-icon.ui-icon-trash").removeClass().addClass("fa fa-trash-o");
    $(".ui-icon.ui-icon-search").removeClass().addClass("fa fa-search");
    $(".ui-icon.ui-icon-refresh").removeClass().addClass("fa fa-refresh");
    $(".ui-icon.ui-icon-disk").removeClass().addClass("fa fa-save").parent(".btn-primary").removeClass("btn-primary").addClass("btn-success");
    $(".ui-icon.ui-icon-cancel").removeClass().addClass("fa fa-times").parent(".btn-primary").removeClass("btn-primary").addClass("btn-danger");

    $(".ui-icon.ui-icon-seek-prev").wrap("<div class='btn btn-sm btn-default'></div>");
    $(".ui-icon.ui-icon-seek-prev").removeClass().addClass("fa fa-backward");

    $(".ui-icon.ui-icon-seek-first").wrap("<div class='btn btn-sm btn-default'></div>");
    $(".ui-icon.ui-icon-seek-first").removeClass().addClass("fa fa-fast-backward");

    $(".ui-icon.ui-icon-seek-next").wrap("<div class='btn btn-sm btn-default'></div>");
    $(".ui-icon.ui-icon-seek-next").removeClass().addClass("fa fa-forward");

    $(".ui-icon.ui-icon-seek-end").wrap("<div class='btn btn-sm btn-default'></div>");
    $(".ui-icon.ui-icon-seek-end").removeClass().addClass("fa fa-fast-forward");
};

$('#export-click').click(function(event) {
    /* Act on the event */
    ajax({
        url: $(this).attr('data-url'),
        data: {},
        success: function(data){
            window.open(data);
        },
        error: function(error){
            $.errorFun('获取excel文件地址失败');
        }
    })
});


//清空表单
function reset(id='#iform'){
	$(':input',id)  
	 .not(':button, :submit, :reset, :hidden')  
	 .val('')  
	 .removeAttr('checked')  
	 .removeAttr('selected'); 
     $('select').prop('selectedIndex', 0);
};

//时间控件
function iTime(el){
    $(el).datepicker({
        dateFormat : 'yy-mm-dd',
        prevText : '<i class="fa fa-chevron-left"></i>',
        nextText : '<i class="fa fa-chevron-right"></i>',
    });
}

//时间格式转义
function p(s) {
    return s < 10 ? '0' + s: s;
}

var sp=[];
function looper(data,pid){
    for(var i=0;i<data.length;i++){
            if(data[i].Id==pid){
                sp.push({"name":data[i].Value==""?"":data[i].Value,"id":data[i].Id});
                if(data[i].ParentId!=0){
                        looper(data,data[i].ParentId);
                  }
            }
        }
}

//刷新页面
function F5(){
    window.location.reload();
}

var getRandomColor = function(){     //随机生成颜色
  return  '#' +    
    (function(color){    
    return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
      && (color.length == 6) ?  color : arguments.callee(color);    
  })('');    
} 

//ajax提交之后返回值判断提示信息
function ReturnAjax(obj){//1.返回值 2.是否刷新页面 3.自定义方法
    if(obj.data.Status==1){
        $("#refresh_jqgrid").click();
        if(obj.reload){
            F5();
        }
        if(obj.DiyFunction){
            obj.DiyFunction;
        }
        $('#dialog-message').dialog('close');
        return false;
    }
    else if(obj.data.Status==2){
        $.errorFun("数据输入错误，请重新添加");
        return false;
    }
    else{
        $.errorFun("编号重复");
        return false;
    }
}
function ajax(obj){
    $.ajax({
        async: obj.async || false,
        cache: obj.cache || false,
        type: obj.type || "GET",
        url: _path+obj.url,
        dataType:obj.dataType || "json",
        data: obj.data || "",
        beforeSend: obj.beforeSend || function(res){
            res.setRequestHeader('Token',dataList.Key)
        },
        success: obj.success,
        error: obj.error
    })
}

function GlobaljqGrid(dom,obj){
    jQuery(dom).jqGrid({
        //data: jqgrid_data,
        sortable: true,
        url: _path + obj.url,
        datatype: "json",
        mtype: 'get',
        multiselect: false,//多选框禁用
        autowidth: true,
        height: 'auto',
        search: true,
        rowNum: obj.rowNum || 10,
        rowList: obj.rowList || [10, 20, 50],
        pager: obj.pageDom,
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
        },
        colNames: obj.colNames,
        colModel: obj.colModel,
        loadBeforeSend: function (request) {
            request.setRequestHeader("Token",dataList.Key);
        },
        gridComplete: function () {//加载完之后执行
            qxC();//权限控制
        },
        loadComplete: obj.loadComplete,
    });
    var grid = $(dom);

    var columnNames = grid.jqGrid('getGridParam','colModel');
    for (i = 0; i < columnNames.length; i++) {
         grid.setColProp(columnNames[i].index, { sortable: false });
    }
    grid.jqGrid('navGrid', obj.pageDom, {
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

function Tile(htmlId,nameObj,merge){ //merge为merger页面专属自定义
    var xOffset = 0,//向右偏移量
      yOffset = 35,//向下偏移量
      toshow = "treediv"+htmlId,//要显示的层的id
      target = htmlId, //输入框id
      timer,           //延迟时间事件
      html;         //生成ul列表
    var ajaxUrl = nameObj.url,
      ajaxField = nameObj.field,//AJAX传参条件
      ajaxDataNo = nameObj.dataNo,
      ajaxDataName = nameObj.dataName,
      ajaxGetValId = nameObj.GetValId || false;

    var delays = (function () {
        var timer = 0;
        return function (callback, time) {
          clearTimeout(timer);
          timer = setTimeout(callback, time);
        };
    })();

    $("body").append('<div id="'+toshow+'" style="display: none;" class="autoSelect" ></div>');
    $("#"+target).click(function(event) {
        $("#"+target).keydown();
    });
    $("#"+target).keydown(function (event){
    var _self=$(this);
    delays(function(){
        var wid = nameObj.width || _self.outerWidth();
        console.log(wid)
        $("#"+toshow).css(
          {"position":"absolute",
            "left":_self.offset().left + "px",
            "top": _self.offset().top+yOffset +"px",
            "width":wid
          }
        ).show();
        var data = {};
        data[ajaxField] = _self.val();
        ajax({
            url: ajaxUrl,
            data: data,
            success: function (data) {
                var ul = '';
                if(data.length){                  
                    $(data).each(function (i) {
                        var dname = data[i][ajaxDataName];
                        dname ? dname = dname : dname = '';
                        if(ajaxGetValId){
                          ul += '<li onclick=TextVs("'+ trim(dname) +'","'+ data[i][ajaxDataNo] +'","'+ ajaxGetValId +'","'+ target +'","'+ toshow +'") >'+ dname +'</li>';
                        }else if(merge){
                            if(data[i].Custom){
                                var Custom = JSON.parse(data[i].Custom);
                                if(Custom.settings.item){
                                    Custom.settings.item.map(function(index, elem) {
                                        if(index.key == 'PartCode' || index.key == 'Spec'){
                                            dname += '-' + index.value
                                        }
                                    })
                                }
                            }
                          ul += '<li onclick=AddPNos("'+ data[i][ajaxDataNo] +'","'+ trim(dname) +'","'+ toshow +'")><button class="btn btn-xs btn-success" >添加</button> '+ dname+'</li>';
                        }else{
                          ul += '<li onclick=TextV("'+ data[i][ajaxDataNo] +'","'+ target +'","'+ toshow +'") >'+ dname +'</li>';
                        }
                    })
                }else{
                    ul = '<li onclick="$("#"'+toshow+').hide();">暂无信息</li>'
                }
                html = '<ul>'+ul+'</ul>';
                $("#"+toshow).empty().append(html);
            },
            error: function (message) {
                
            }
        })   
       
    }, 1000);
    $(document).one("click", function(eve) {
       $("#"+toshow).hide();
    });
  });
}
function trim(str){
    return str.replace(/[ ]/g,"");  //去除字符算中的空格
 }
function TextVs(val,no,noId,textdom,dom){
    $('#'+noId).val(no);
    $("#"+textdom).val(val);
    $("#"+dom).hide();
}

function TextV(val,textdom,dom){
    $("#"+textdom).val(val);
    $("#"+dom).hide();
}

function GetStylesDom(type){
    if(!dataList.Config){
        return false;
    }
    var dataInfo = $.parseJSON(dataList.Config),
        data = dataInfo.settings.item;
    data.map(function(p){ 
        if(p.key == type){
            var pStylesStr='',PStyles = $('#StylesTbody');
            $('#StylesContainer').show();
            CustomArray = p.add;
            if(CustomArray.length >= 1){
                CustomArray.map(val =>{
                    if(val.key){
                        pStylesStr += val.key+',';
                    }
                    var must;
                    if(val.must == 1){
                        must = 'NotNull'
                    }else{
                        must = ''
                    }
                    if(val.type == 0){
                        if(val.rules){
                            var inputRules = `<input class="form-control" data-type="${val.type}" data-name="${val.name}" onkeyup="if(${val.rules}.test(this.value)){$('#rules${val.name}').hide()}else{$('#rules${val.name}').show()}" name="${val.name}" id="${val.name}">
                                    <span id="rules${val.name}" style="color:red;display:none">Ps:${val.text}格式错误</span>`
                        }else{
                            var inputRules = `<input class="form-control" data-type="${val.type}" data-name="${val.name}" name="${val.name}" id="${val.name}">`
                        }
                        PStyles.append(`
                        <tr>
                            <td>
                                <label style="margin-right:5px" class="col-md-3 control-label" id="${val.name}-title">${val.text} </label>
                                <div class="col-md-8 ${must}">
                                    ${inputRules}
                                </div>
                            </td>
                        </tr>`);
                    }else if(val.type == 1){
                        PStyles.append(`
                        <tr>
                            <td>
                                <label style="margin-right:5px" class="col-md-3 control-label" id="${val.name}-title">${val.text} </label>
                                <div class="col-md-8">
                                    <select class="form-control" data-type="${val.type}" data-name="${val.name}" name="${val.name}" id="${val.name}">
                                        
                                    </select>
                                </div>
                            </td>
                        </tr>`);
                    }else if(val.type == 2){
                        PStyles.append(`
                        <tr>
                            <td>
                                <label style="margin-right:5px" class="col-md-3 control-label" id="${val.name}-title">${val.text} </label>
                                <div class="col-md-8 ${must}">
                                        <div class="smart-form inline-group" id="${val.name}">
                                            
                                        </div>
                                </div>
                            </td>
                        </tr>`);
                    }else if(val.type == 3){
                        PStyles.append(`
                        <tr>
                            <td>
                                <label style="margin-right:5px" class="col-md-3 control-label" id="${val.name}-title">${val.text} </label>
                                <div class="col-md-8 ${must}">
                                    <div class="inline-group smart-form" id="${val.name}"></div>
                                </div>
                            </td>
                        </tr>`);
                    }else if(val.type == 4){
                        PStyles.append(`
                        <tr>
                            <td>
                                <label style="margin-right:5px" class="col-md-3 control-label" id="${val.name}-title">${val.text} </label>
                                <div class="col-md-8 ${must}" style="min-height:50px;max-height:150px;overflow:auto">
                                        <div class="smart-form inline-group" id="${val.name}">
                                            
                                        </div>
                                </div>
                            </td>
                        </tr>`);
                    }
                })
            }else{
                if(CustomArray.key){
                    pStylesStr += CustomArray.key+',';
                }
                var must;
                if(CustomArray.must == 1){
                    must = 'NotNull'
                }else{
                    must = ''
                }
                if(CustomArray.type == 0){
                    if(CustomArray.rules){
                        var inputRules = `<input class="form-control" data-type="${CustomArray.type}" data-name="${CustomArray.name}" onkeyup="if(${CustomArray.rules}.test(this.CustomArrayue)){$('#rules${CustomArray.name}').hide()}else{$('#rules${CustomArray.name}').show()}" name="${CustomArray.name}" id="${CustomArray.name}">
                                <span id="rules${CustomArray.name}" style="color:red;display:none">Ps:${CustomArray.text}格式错误</span>`
                    }else{
                        var inputRules = `<input class="form-control" data-type="${CustomArray.type}" data-name="${CustomArray.name}" name="${CustomArray.name}" id="${CustomArray.name}">`
                    }
                    PStyles.append(`
                    <tr>
                        <td>
                            <label style="margin-right:5px" class="col-md-3 control-label" id="${CustomArray.name}-title">${CustomArray.text} </label>
                            <div class="col-md-8 ${must} ">
                                ${inputRules}
                            </div>
                        </td>
                    </tr>`);
                }else if(CustomArray.type == 1){
                    PStyles.append(`
                    <tr>
                        <td>
                            <label style="margin-right:5px" class="col-md-3 control-label" id="${CustomArray.name}-title">${CustomArray.text} </label>
                            <div class="col-md-8 ${must}">
                                <select class="form-control" data-type="${CustomArray.type}" data-name="${CustomArray.name}" name="${CustomArray.name}" id="${CustomArray.name}">
                                    
                                </select>
                            </div>
                        </td>
                    </tr>`);
                }else if(CustomArray.type == 2){
                    PStyles.append(`
                    <tr>
                        <td>
                            <label style="margin-right:5px" class="col-md-3 control-label" id="${CustomArray.name}-title">${CustomArray.text} </label>
                            <div class="col-md-8 ${must}">
                                <div class="inline-group smart-form" id="${CustomArray.name}">
                                    
                                </div>
                            </div>
                        </td>
                    </tr>`);
                }else if(CustomArray.type == 3){
                    PStyles.append(`
                    <tr>
                        <td>
                            <label style="margin-right:5px" class="col-md-3 control-label" id="${CustomArray.name}-title">${CustomArray.text} </label>
                            <div class="col-md-8 ${must}">
                                <div class="inline-group smart-form" id="${CustomArray.name}"></div>
                            </div>
                        </td>
                    </tr>`);
                }else if(CustomArray.type == 4){
                    PStyles.append(`
                    <tr>
                        <td>
                            <label style="margin-right:5px" class="col-md-3 control-label" id="${CustomArray.name}-title">${CustomArray.text} </label>
                            <div class="col-md-8 ${must}" style="min-height:50px;max-height:150px;overflow:auto">
                                <div class="inline-group smart-form" id="${CustomArray.name}">
                                    
                                </div>
                            </div>
                        </td>
                    </tr>`);
                }
            }
            if(pStylesStr){
                getStyles(pStylesStr);
            }
        }
    });
}

function getStyles(name){
    var url = name.substring(name.length-1,0);
    ajax({
        url: 'GetProfileInfo/',
        type: 'GET',
        dataType: 'json',
        data: {no: url},
        success: function(data){
            StyleArray = data;
            var datas = [],i = 1;
            if(CustomArray.length >= 1){
                CustomArray.map((Citem, Cindex) => {
                    data.map((item,index) => {
                        if(item.No == Citem.key && Citem.type == 1){
                            $('#'+ Citem.name).append('<option data-type="'+Citem.type+'" data-name="'+Citem.name+'" value="'+item.Value+'">'+item.Name+'</option>')
                        }else if(item.No == Citem.key && Citem.type == 2){  
                            $('#'+ Citem.name).append(`<label style="padding-top:0px" class="checkbox">
                                        <input type="checkbox" id="${item.No+item.Id}" data-name="${Citem.name}" data-type="${Citem.type}" name="checkbox" value="${item.Value}" >
                                        <i></i>${item.Name}</label>`)
                        }else if(item.No == Citem.key && Citem.type == 3){
                            if(i == 1){
                                $('#'+Citem.name).append(`<label style="padding-top:0px" class="radio">
                                    <input type="radio" id="${item.No+item.Id}" data-name="${Citem.name}" data-type="${Citem.type}" name="radio" value="${item.Value}" checked="checked" >
                                    <i></i>${item.Name}</label>`);
                                i++;
                            }else{
                                $('#'+Citem.name).append(`<label style="padding-top:0px" class="radio">
                                    <input type="radio" id="${item.No+item.Id}" data-name="${Citem.name}" data-type="${Citem.type}" name="radio" value="${item.Value}" >
                                    <i></i>${item.Name}</label>`);
                            }
                        }else if(item.No == Citem.key && Citem.type == 4){  
                            $('#'+ Citem.name).append(`<label style="padding-top:0px" class="checkbox">
                                        <input type="checkbox" id="${item.No+item.Id}" data-name="${Citem.name}" data-type="${Citem.type}" name="checkbox" value="${item.Value}" >
                                        <i></i>${item.Name}</label>`)
                        }
                    })
                })
            }else{
                data.map((item,index) => {
                    if(item.No == CustomArray.key && CustomArray.type == 1){
                        $('#'+ CustomArray.name).append('<option data-type="'+item.type+'" data-name="'+item.name+'" value="'+item.Value+'">'+item.Name+'</option>')
                    }else if(item.No == CustomArray.key && CustomArray.type == 2){  
                        $('#'+ CustomArray.name).append(`<label style="padding-top:0px" class="checkbox">
                                    <input type="checkbox" id="${item.No+item.Id}" data-name="${item.name}" data-No="${index}" name="checkbox" value="${item.Value}" >
                                    <i></i>${item.Name}</label>`)
                    }else if(item.No == CustomArray.key && CustomArray.type == 3){
                        if(i == 1){
                            $('#'+CustomArray.name).append(`<label style="padding-top:0px" class="radio">
                                <input type="radio" id="${item.No+item.Id}" data-name="${item.name}" data-No="${index}" name="radio" value="${item.Value}" checked="checked" >
                                <i></i>${item.Name}</label>`);
                            i++;
                        }else{
                            $('#'+CustomArray.name).append(`<label style="padding-top:0px" class="radio">
                                <input type="radio" id="${item.No+item.Id}" data-name="${item.name}" data-No="${index}" name="radio" value="${item.Value}" >
                                <i></i>${item.Name}</label>`);
                        }
                    }else if(item.No == CustomArray.key && CustomArray.type == 4){  
                        $('#'+ CustomArray.name).append(`<label style="padding-top:0px" class="checkbox">
                                    <input type="checkbox" id="${item.No+item.Id}" data-name="${item.name}" data-No="${index}" name="checkbox" value="${item.Value}" >
                                    <i></i>${item.Name}</label>`)
                    }
                })
            }
        },
        error: function(error){
            console.log(error);
        }
    });
    
}


function setStyles(ID){
    var validateList = $(ID+' .NotNull'),
        validateFlag = true,
        validateText = '';
    $.each(validateList,function(index, el) {
        if(!$(el).find('input:text,select,input:checkbox:checked,input:radio:checked').val()){
            validateText += $(el).prev().text()+'，';
            validateFlag = false;
        }
        
    });
    if(!validateFlag){
        $.errorFun(validateText+'数据请填写完整');
        return validateFlag;
    }
    var valArray = $(ID).find('input:text,select,input:checkbox:checked,input:radio:checked');
    var ProStylesArray = [];
    if(valArray.length){
        var obj = [];
        valArray.map(function(index, elem) {
            var domObj = {}
            if($(elem).val()){
                domObj.name = $(elem).attr('data-name');
                domObj.type = $(elem).attr('data-type');
                domObj.id = $(elem).attr('id');
                domObj.value = $(elem).val();
                ProStylesArray.push(domObj)
            }
        })
        
    }
    return {
        Custom: ProStylesArray,
        flag: validateFlag
    }
}

function GetHeaders(act = 'true'){  //true 显示操作按钮   false不显示操作按钮  
    var colNames = [],colModel = [];
    ajax({
        url:'get-header/',
        data:{tag:__thisTag},
        success:function(data){
            data.sort(function(a,b){  
                return a.Sort - b.Sort;  
            }); 
            data.map(function(index, elem) {
                if(index.Status[0]){
                    colNames.push(index.Name);
                    var wid = index.Width > 0 ?  index.Width + 'px' : ''
                    colModel.push({
                        name: index.Value,
                        index: index.Value,
                        width: wid,
                    })
                }
            })
            if(act){
                colNames.push('操作');
                colModel.push({
                    name: 'act',
                    index: 'act',
                    align:'right',
                    width: '100px'
                })
            }
            dialogHeaders(data);
        }
    })
    return {
        colNames,
        colModel
    }
}

function dialogHeaders(data){
    var dialoTable = '<ul class="todo" id="sortable" style="height:369px;overflow:auto"></ul>';
    $('body').append('<div id="dialog-jQgrid" class="jarviswidget" style="display:none" ><div class="no-padding smart-form">'+dialoTable+'</div><span>Ps:单选框左侧可按住拖动进行排序、双击名称可进行修改</span></div>')
    $("#dialog-jQgrid").dialog({//弹出框设置
        autoOpen: false,
        modal: true,
        width: 440,
        maxHeight: 600,
        minHeight: 200,
        title : "编辑表头信息",
        modal: true,
        resizable: false,
        buttons : [{
            html : "<i class='fa fa-save'></i>&nbsp; 保存",
            "class" : "btn btn-primary",
            click : function() {
                var dialogThis = $(this);
                var sortList = $('#sortable').find('li'),
                    sortArray = [];
                sortList.map(function(index, elem) {
                    var sortObj = {
                        Id:$(this).attr('data-id'),
                        Name:$(this).find('input.name').val(),
                        Width:$(this).find('input.width').val(),
                        Status:$(this).find('input[type=checkbox]').is(':checked') ? 1 : 0,
                        Sort:index,
                        Tag:$(this).attr('data-type')
                    }
                    sortArray.push(sortObj);
                })
                ajax({
                    url: 'upt-header',
                    type: 'POST',
                    dataType: 'json',
                    data: {str: JSON.stringify(sortArray)},
                    success: function(data){
                        if(data.Status == 1){
                            F5();
                        }
                    },
                    error: function(error){

                    }
                })
                
            }
        }, 
        {
            html : "<i class='fa fa-times'></i>&nbsp; 关闭",
            "class" : "btn btn-danger",
            click : function() {
                $(this).dialog("close");
            },
        }]
    });

    $('#ToggleColumns').click(function(event) {
        var $table = $('#sortable'),
            tr = '';
        $('#dialog-jQgrid').dialog('open');
        data.map(function(index, elem) {
            var checkbox = `<label class="checkbox"><input type="checkbox" ${index.Status[0] == 1 ? 'checked=checked' : ''}" /><i></i></label>`;
            var name = `<lable class="input"><input title="表头名称，双击鼠标可修改" class="name contenteditable" style="border:none" type="text" value=${index.Name} disabled="true" /></label>`;
            var width = `<lable class="input"><input title="表头宽度，双击鼠标可修改" class="width contenteditable" max="200" style="border:none;float:left" type="number" value=${index.Width} disabled="true" /></label>`;
            tr += `<li data-id="${index.Id}" data-type="${index.Tag}">
                        <span class="handle" >${checkbox}</span>
                        <p >${name+width}</p>
                    </li>`;
        })
        $table.html(tr);

        $("#sortable").sortable({
            handle : '.handle',
            connectWith : ".todo",
            update : countTasks
        }).disableSelection();

        function countTasks() {
            $('.todo-group-title').each(function() {
                var $this = $(this);
                $this.find(".num-of-tasks").text($this.next().find("li").size());
            });
        }

        $('#sortable').on('dblclick', '.contenteditable', function(event) {
            $(this).removeAttr('disabled');
            $(this).removeAttr('style');
        });
    });
}


/*解析数据函数*/
function fn(data,pid){
    var result = [] , temp;
    for(var i in data){     
            if(data[i].ParentId==pid){
                result.push(data[i]);
                temp = fn(data,data[i].AreaId);           
                if(temp.length>0){
                    data[i].children=temp;              
                }           
            }      
    }
    return result;
}

/*
  引入css：treetable.css，
  引入js:jquery.treetable.js
  @parmas : {
      tableId: table表格ID
      thead:表头名称
      tbodydata: 表格字段
      data: 数据
  }
 */
class  table_Tree{
    constructor(params){  
        this.TabName = params.tableId||'';
        this.Name = params.thead||[]; 
        this.tbodyData = params.tbodydata||[]; 
        this.datalist = params.data||[]; 
        this.addType=params.addType || 0;
        this.stie(); 
    }

    //数据初始化
    info() {
        this.Name = [];
        this.tbodyData = [];
        this.datalist = [];
    }

    stie() {
        var strH = "" , 
            TreeThead = this.tbodyData ,
            Tab_thead=` <thead><tr>`;
        this.Name.push('操作');
        (this.Name ).map( item => Tab_thead += `<th>${ item }</th>`);
        Tab_thead += `</tr></thead>`;
        var theadNum = this.Name.length;
        var Type = this.addType;
        (function insertNode (data) {
            if (data.length > 0) {
                data.map(function (item) {
                    var Info = item.Info == null || item.Info == "" ? '' : JSON.parse(item.Info).StoreSceneNo;
                    var updateBtn = "<button class='btn btn-xs btn-default' data-qx='修改' title='修改' data-original-title='Save Row' onclick=updateRow('"+item.AreaId+"')><i class='fa fa-pencil'></i></button>",
                       deleteBtn = "<button class='btn btn-xs btn-default' data-qx='删除' title='删除' data-original-title='Cancel' onclick=delRow('"+item.AreaId+"','"+item.AreaNo+"')><i class='fa  fa-trash-o'></i></button>";
                    var StoreBtn = '';
                    if(Type == 1){
                        StoreBtn = "<button class='btn btn-xs btn-default' data-qx='修改' title='配置默认库位' data-original-title='Cancel' onclick=editStore('"+Info+"','"+item.AreaNo+"')><i class='fa fa-sliders'></i></button>";
                    }
                    if (item.children) {
                        strH += `<tr data-tt-id='${ item.AreaId }' data-no='${ item.AreaNo }' data-tt-parent-id='${item.ParentId}'>`;
                        TreeThead.map(i => strH += `<td>${ item[i] }</td>`)
                        strH +=  `<td>${ updateBtn }${ deleteBtn }${StoreBtn}</td></tr>`;  
                        insertNode( item.children );                           
                    } else {
                        strH += `<tr data-tt-id='${ item.AreaId }' data-no='${ item.AreaNo }' data-tt-parent-id='${item.ParentId}'>`;
                        TreeThead.map(i => strH += `<td>${ item[i] }</td>`)
                        strH +=  `<td>${ updateBtn }${ deleteBtn }${StoreBtn}</td></tr>`;  
                    }
                });
            } else {
                 strH = `<tr><td colspan='${ theadNum }' style='text-align:center;'>暂无信息</td></tr>`;
            }
        })(this.datalist);
        $('#'+this.TabName).html(Tab_thead+strH);
        this.TreeFun();
        this.info();
    }

    TreeFun(){
        var _tabId=this.TabName;
        $("#"+_tabId).treetable({expandable: true},true); 
        $("#"+_tabId+" tbody").on("mousedown", "tr", function() {
            $(".selected").not(this).removeClass("selected");
            $(this).toggleClass("selected");
        });
        $("#"+_tabId+" .file,#"+_tabId+" .folder").draggable({
            helper: "clone",
            opacity: .75,
            refreshPositions: true,
            revert: "invalid",
            revertDuration: 300,
            scroll: true
        });
        $("#"+_tabId+" .folder").each(function() {
            $(this).parents("#"+_tabId+" tr").droppable({
              accept: ".file, .folder",
              drop: function(e, ui) {
                var droppedEl = ui.draggable.parents("tr");
                $("#"+_tabId).treetable("move", droppedEl.data("ttId"), $(this).data("ttId"));
              },
              hoverClass: "accept",
              over: function(e, ui) {
                var droppedEl = ui.draggable.parents("tr");
                if(this != droppedEl[0] && !$(this).is(".expanded")) {
                  $("#"+_tabId).treetable("expandNode", $(this).data("ttId"));
                }
              }
            });
        });  
    }
}

function GetMenu(token){ //一次性获取菜单栏信息保存到浏览器
    var MenuStorage = {};
    $.ajax({
        dataType: "json",
        url:_path+'get-menu-tree', 
        type: "GET",
        async: false,
        beforeSend: function(res){
            res.setRequestHeader('Token',token)
        },
        success:function(data){
            if(data){
                MenuStorage.GetMenuTreeStorage = data;
            }
        },
        error:function(error){
            $.errorFun('菜单栏信息获取失败，请刷新页面重试');
        }
    });
    $.ajax({
        dataType: "json",
        url:_path+'getMenuTwo', 
        type: "GET",
        async: false,
        beforeSend: function(res){
            res.setRequestHeader('Token',token)
        },
        success:function(data){
            if(data){
                MenuStorage.getMenuTwoStorage = data;
            }
        },
        error:function(error){
            $.errorFun('菜单栏信息获取失败，请刷新页面重试');
        }
    });
    $.ajax({
        dataType: "json",
        url:_path+'getMenulist', 
        type: "GET",
        async: false,
        beforeSend: function(res){
            res.setRequestHeader('Token',token)
        },
        success:function(data){
            if(data){
                MenuStorage.GetMenuListStorage = data;
            }
        },
        error:function(error){
            $.errorFun('菜单栏信息获取失败，请刷新页面重试');
        }
    });
    if(IsPC()){
        window.sessionStorage.setItem('MenuStorage',JSON.stringify(MenuStorage));
    }else{
        localStorage.setItem('MenuStorage',JSON.stringify(MenuStorage));
    }
}