var _ModuleId,__thisTag,breadcrumbObj;


$(function(){
    _ModuleId = $.getUrlParam('ModuleId');
	
    let classVue=window.sessionStorage.getItem('classVue');
    let htmlUrl="";
    if(classVue=="smart-style-0" || classVue=="ng"){
    	htmlUrl="./../login.html";
    }else if(classVue=="smart-style-5"){
    	htmlUrl="./../login1.html";
    }else if(classVue=="smart-style-1"){
    	htmlUrl="./../login3.html"
    }else if(classVue=="smart-style-2"){
    	htmlUrl="./../login2.html"
    }else if(classVue=="smart-style-3"){
    	htmlUrl="./../login4.html"
    }else if(classVue=="smart-style-4"){
    	htmlUrl="./../login6.html"
    }else if(classVue=="smart-style-6"){
    	htmlUrl="./../login5.html"
    }
	$("#header").empty().append(`<div id="logo-group">
				<span id="logo"> <a href="/" title="回到首页">${_title}</a></span>
			</div>
			<div class="pull-right">
			    <div id="TreeLib" class="btn-header transparent pull-right">
					<span> <a id="treLib" style="display:none;" data-action="stylecss" title="导航菜单编辑"><i class="fa fa-sliders"></i></a> </span>
				</div> 
			    <div id="Cstyle" class="btn-header transparent pull-right">
					<span> <a data-action="stylecss" title="导航样式选择"><i class="fa fa-gears"></i></a> </span>
				</div>
				<div id="hide-menu" class="btn-header pull-right">
					<span> <a href="javascript:void(0);" data-action="toggleMenu" title="隐藏Menu"><i class="fa fa-reorder"></i></a> </span>
				</div>
				<div id="loginEdit" class="btn-header transparent pull-right" >
					<span><a href="javascript:void(0);" title="修改用户密码" ><i class="fa fa-user"></i></a> </span>
				</div>
				<div id="logout" class="btn-header transparent pull-right">
					<span> <a href="${htmlUrl}" title="退出系统" data-action="userLogout" data-logout-msg="确定要退出管理系统？"><i class="fa fa-sign-out"></i></a> </span>
				</div>		
			</div>`.trim());
	$("#Cstyle").click(function() {
        $(".demo").toggle('fast').toggleClass("activate")
	})

	Tabcare();
	CreaTree();
	// if(dataList.OrganizationId=='3'){
		$('#treLib').show();
		LibCreaTree();
	// }
	loginEditFun();
})

function loginEditdialog(){
	var formTree = `<div id="dialog-loginEdit" style="display:none;" title="修改密码">
		<div class="widget-body">
			<form class="form-horizontal" id="new_Newuser">
				<fieldset>
					<div class="form-group">
						<label class="col-md-2 control-label">当前用户：</label>
						<div class="col-md-10">
							<span class="form-control" name="EditUsername" id="EditUsername" placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label class="col-md-2 control-label">新密码：</label>
						<div class="col-md-10">
							<input class="form-control" placeholder="" name="EditPassword" id="EditPassword" type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="col-md-2 control-label">确认密码：</label>
						<div class="col-md-10">
							<input class="form-control" placeholder="" name="EditOKPassword" id="EditOKPassword" type="text">
						</div>
					</div>
					<div class="form-actions">
						<div class="row">
							<div class="col-md-12">
								<button class="btn btn-primary" id="new_upsub" type="submit">
								<i class="fa fa-save"></i>
									保存
							    </button>
							</div>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	</div>`;
	$('body').append(formTree);

	$("#dialog-loginEdit").dialog({
        autoOpen: false,
        modal: true,
        width: 580,
        height: 280,
    });
}
function loginEditFun(){
	loginEditdialog();
	$('body').on('click', '#loginEdit', function(event) {
		tab_userYz();
		$("#dialog-loginEdit").dialog('open');
		$("#EditUsername").text(dataList.PermitNo);
	});

	$("#new_upsub").removeAttr("disabled").unbind("click").click(function(){
    	$('#new_Newuser').bootstrapValidator('validate');
    	if($("#EditOKPassword").val() == '' || $('#EditPassword').val() == ''){
    	 	$.errorFun("新密码和确认密码都不能为空");
    	 	$("#new_upsub").attr("disabled","disabled");
    	 	return false;
    	}
     	ajax({
	        cache: false,
	        type:"POST",
	        url:"UpdatePassword",
	        data:{
	            PermitNo:$("#EditUsername").text(),
	            Password:$("#EditPassword").val()    
	        },
	        success: function(data){
	        	if(data.Status == 1){
	        		location.href = "../../login.html";
	        	}
	        },
	        error: function(message){
	            console.log("error"+message);
	        }
	    });
	    return false;
    });
}

function LibCreaTree(){
	if(SetMenuStorage.GetMenuListStorage){
		var data = SetMenuStorage.GetMenuListStorage;
		var dataTab=[];
		TabList=data;
		$(data).each(function (i) {
        	dataTab.push({AreaId:data[i].MenuId,ParentId:data[i].ParentId,AreaName:data[i].MenuName,AreaNo:data[i].MenuNo,Tag:data[i].Tag,Style:data[i].Style,Url:data[i].Path});                       
        })  
        Treestie("tabLinkTree",Treefn(dataTab,0));
        TreeCss();
	}else{
		$.errorFun('菜单栏信息为空，请刷新页面重试');
	}
		
}

//表单验证  先销毁再验证
function tab_userYz(){ 
    $('#new_Newuser input').each(function(){
    	$(this).val("");
    });
    $('#new_Newuser').data('bootstrapValidator', null);

    $('#new_Newuser').bootstrapValidator({
        feedbackIcons : {
            valid : 'glyphicon glyphicon-ok',
            invalid : 'glyphicon glyphicon-remove',
            validating : 'glyphicon glyphicon-refresh'
        },
        fields : {
            EditPassword : {
               validators : {
                    notEmpty : {
                        message : '*新密码为必填项'
                    },
                    stringLength: {
                         min: 6,
                         max: 32,
                         message: '当前密码长度必须在6到32之间'
                    },
                    regexp: {
                        regexp: /^[^\u4e00-\u9fa5]{0,}$/,
                        message: '当前密码不能为中文'
                    }
                }
            },
            EditOKPassword : {
                validators : {
                	identical: {
		              field: 'EditPassword',
		              message: '用户新密码与确认密码不一致！'
		            },
                    notEmpty : {
                        message : '*确认密码为必填项'
                    },
                    stringLength: {
                         min: 6,
                         max: 32,
                         message: '新密码长度必须在6到32之间'
                    },
                    regexp: {/* 不能填中文 */
                        regexp: /^[^\u4e00-\u9fa5]{0,}$/,
                        message: '新密码不能为中文'
                    }
                }
            },
        }
    })//表单验证end
}

//权限控制
var _userQX;
function qxC(){
	$("#content").height('auto');
	$("#modal_link").height(18);
	$("button[data-qx='修改'],a[data-qx='修改']").show();
	$("button[data-qx='删除'],a[data-qx='删除']").show();
	//if(_ModuleId!=null && _ModuleId != '' && _ModuleId != undefined){
    	// $.ajax({
	    // 	url: _path+'role/GetRoleInfoByModuId',
	    // 	type: 'GET',
	    // 	dataType: 'json',
	    // 	data: {
	    // 		PermitNo: dataList.PermitNo,
	    // 		ModuleNo: _ModuleId
	    // 	},
	    // 	success: function(data){
	    // 		var database = JSON.parse(data);
	    // 		database = database[_ModuleId];
	    // 		_userQX = database;
	    // 		//控制能否查看表格，为false的话隐藏所有主题内容
	    // 		if(database.indexOf(1)>=0){
	    // 			$("#content").height('auto');
	    // 			//控制添加按钮
	    // 			if(database.indexOf(2)>=0){
	    // 				$("#modal_link").height(18);
	    // 			}else{
	    // 				$("#modal_link").remove();
	    // 			}
	    // 			//控制修改按钮
	    // 			if(database.indexOf(3)>=0){
	    // 				$("button[data-qx='修改'],a[data-qx='修改']").show();
	    // 			}else{
	    // 				$("button[data-qx='修改'],a[data-qx='修改']").remove();
	    // 			}
	    // 			//控制删除按钮
	    // 			if(database.indexOf(4)>=0){
	    // 				$("button[data-qx='删除'],a[data-qx='删除']").show();
	    // 			}else{
	    // 				$("button[data-qx='删除'],a[data-qx='删除']").remove();
	    // 			}
	    // 		}else{
	    // 			$("#content").hide();
	    // 			$.errorFun('您没有权限查看此页面');
	    // 		}
	    // 	},
	    // 	error: function(error){
	    // 		console.log('获取权限信息失败');
	    // 	}
	    // })
    //}
}


//导航栏控制
var  TabList="";
function Tabcare(){
   var 	html=`<div id="dialog-messageop" style='overflow: hidden;' title="菜单栏编辑">
			 <div class="widget-body">
				<form class="form-horizontal" id="iformTab" style='width: 50%;float: right;display:none;' method="get">
					<fieldset>
						<div class="form-group">
							<label class="col-md-3 control-label">编号：</label>
							<div class="col-md-9">
								<input class="form-control" id="linkTabMenuNo" name="linkTabMenuNo" placeholder="必填项" type="text">
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-3 control-label">名称：</label>
							<div class="col-md-9">
								<input class="form-control" id="linkTabMenuName" name="linkTabMenuName" placeholder="必填项" type="text">
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-3 control-label">所属ID：</label>
							<div class="col-md-9">
								<select class="form-control" id="linkTabParentId" name="linkTabParentId">
								</select>
							</div>
						</div>	
						<div class="form-group">
							<label class="col-md-3 control-label">相对路径：</label>
							<div class="col-md-9">
								<input class="form-control" id="linkTabPath" name="linkTabPath" placeholder="必填项" type="text">
							</div>
						</div>
						<div class="form-group">
										<label class="col-md-3 control-label">状态：</label>
										<div class="col-md-9">
											<select class="form-control" name="linkTabStatus" id="linkTabStatus">
												<option value="1">正常</option>
												<option value="0">失效</option>
											</select> 
										</div>
						</div>
						<div class="form-group">
							<label class="col-md-3 control-label">标记号：</label>
							<div class="col-md-9">
								<input class="form-control" id="linkTabTag" name="linkTabTag" placeholder="必填项" type="text">
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-3 control-label">样式：</label>
							<div class="col-md-9">
								<input class="form-control" id="linkTabStyle" name="linkTabStyle" type="text">
							</div>
						</div>
					</fieldset>
					<div style="float:right;">
						<div class="row">
							<div class="col-md-12">
								<button class="btn btn-primary" id="addlinkTab" type="submit">
									<i class="fa fa-save"></i>
									添加
								</button>
								<button class="btn btn-primary" id="updatelinkTab" type="submit" style='display: none;'>
									<i class="fa fa-save"></i>
									修改
								</button>
							</div>
						</div>
					</div>
				</form>
				<div class="tree smart-form"  style="width: 48%;float: left; height: 500px;overflow-y: auto">
					<ul>
						<li>
							<span><i class="fa fa-lg fa-folder-open"></i> 全部</span>
							<a href="javascript:void(0)" onclick="addLinkTree()" class="btn btn-primary btn-sm"> 添加菜单栏 </a>
							<ul id="tabLinkTree">
								
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>`;
	if(!$('#TreeTabs').html()){
		$('body').append(`<div id='TreeTabs'></div>`);
	}
	$('#TreeTabs').empty().append(html);

	 $('#TreeLib').click(function(){
    	   $('#dialog-messageop').dialog('open');
    	   $('#iformTab').hide();
    	   return false;
    });

	$("#dialog-messageop").dialog({//弹出框设置
		    autoOpen: false,
		    modal: true,
		    width: 850,
		    height: 550,
	});	 

	if(SetMenuStorage.GetMenuTreeStorage){
		var data = SetMenuStorage.GetMenuTreeStorage;
		var AreaNo = $("#linkTabParentId");
		var html = '';
		$.each(data,function(item, val) {				
			if(data[item].Value==null && data[item].Value==undefined){
				data[item].Value='';
			}
			if(data[item].Id=='0'&& data[item].Value==''){
				data[item].Name='顶级';
			}
			html+='<option value="'+data[item].Id+'">'+data[item].Fill+data[item].Name+data[item].Value+'</option>';
		});
		AreaNo.empty().append(html);
	}	
}

function CreaTree(){
	if(SetMenuStorage.getMenuTwoStorage){
		var data = SetMenuStorage.getMenuTwoStorage;
		var dataTab=[];
		TabList=data;
		$(data).each(function (i) {
        	dataTab.push({AreaId:data[i].MenuId,ParentId:data[i].ParentId,AreaName:data[i].MenuName,AreaNo:data[i].MenuNo,Tag:data[i].Tag,Style:data[i].Style,Url:data[i].Path});                       
        })  
        LeftTreestie('nav-left',Treefn(dataTab,0));
        TreeCss();
	}else{
		$.errorFun('信息为空，请刷新页面重试');
	}
}

function LeftTreestie(obj, arr) {  
    var str = "";
    (function insertNode (data) {
        if (data.length>0) {
            data.map(function (item) {
            	var valJson=item.Url;              
                valJson=valJson!='' ? '/'+valJson : '#';
                if (item.children) {       
				str += "<li>"
				    +"<a href='"+valJson+"' data-tag='"+item.Tag+"' title='"+item.AreaName+"'><i class='fa fa-lg fa-fw "+item.Style+"'></i><span class='menu-item-parent'>"+item.AreaName+"</span></a>"
					+"<ul>"
                    insertNode(item.children);
                    str += "</ul></li>";
                 
                } else {
                   str += "<li><a href='"+valJson+"'  data-tag='"+item.Tag+"' title='"+ item.AreaName +"'> <span class='menu-item-parent'>"+ item.AreaName +"</span></a></li>";                
                }
            });
        }
    })(arr);
    $("#"+obj).empty().html("<ul>"+str+"</ul>");
    var local = window.location.href;
	var localList = local.split("/");
	local = localList[localList.length-1];
	locals = local.split("?");
	locals = locals[0].split("#");
	if(locals[0] != null && locals[0] != undefined && locals[0] != ''){
		$('#nav-left a').each(function(){
			var href = $(this).attr('href');
			if(href.indexOf(locals[0])>-1){
				$("#nav-left li").removeClass();
		    	$(this).parent().addClass('active');
		    	__thisTag = $(this).attr('data-tag');  //查询表头所需字段

		    	breadcrumbObj = {
		    		index: $(this).text(),
		    		parent: $(this).parent().parent().prev('a').text()
		    	}

			}else{
				$(this).parent().removeClass("active");
			}               
		});
	}else{
		$("#nav-left li").removeClass();
		$(this).parent().removeClass("active");
	}
};
function addLinkTree(){
	$('#linkTabMenuNo').attr("disabled",false);
	$('#updatelinkTab').hide();
    $('#iformTab,#addlinkTab').show();
    resetTree();
   	var $html=$("#iformTab").find('input,select'),parems={};
    $('#addlinkTab').unbind('click').click(function(){
    	$html.each(function(){
	   		parems[(this.id).substr(7)]=this.value;
	   	});
    	ajax({
	        dataType: "json",
	        url:'cmenu', 
	        type: "POST",
	        data:parems,
			success:function(data){
				ReturnAjax({
	    			data:data,
	    			reload:true
	    		});
			},
			error:function(error){
				$.errorFun('添加菜单栏失败');
			}
	    }); 
	    return false;
    });
}

function updateRowTree(uid){
	resetTree();
    if(uid){
    	var dataTrees="";
    	TabList.map((item,i)=>{
    		  if(item.MenuId==uid){
    		  	    dataTrees=item;
    		  }
    	})
    	$('#linkTabMenuNo').attr("disabled",true);
    	$('#addlinkTab').hide();
    	$('#iformTab,#updatelinkTab').show();
    	var $html=$("#iformTab").find('input:text,select');
			 $html.each(function(){
			 	    var strID=dataTrees[(this.id).substr(7)];
			        if(strID){
			            $("#"+this.id).val(strID);
			        }
			 });
		$('#updatelinkTab').unbind('click').click(function(){
		  var params={};
			 $html.each(function(){
		   		params[(this.id).substr(7)]=this.value;
		   	});
			params['MenuId']=uid;
	    	ajax({
		        dataType: "json",
		        url:'umenu', 
		        type: "POST",
		        data:params,
				success:function(data){
					GetMenu(dataList.Key)
					ReturnAjax({
		    			data:data,
		    			reload:true
	    		    });
				},
				error:function(error){
					$.errorFun('修改菜单栏失败');
				}
		    }); 
		    return false;
		});
    }
}

function delRowTree(uId) {
	$.delFun('dmenu',"MenuId",uId);
}


function resetTree(){
	$(':input','#iformTab')  
	 .not(':button, :submit, :reset, :hidden')  
	 .val('')  
	 .removeAttr('checked')  
	 .removeAttr('selected'); 
     $('select').prop('selectedIndex', 0);
};

/*
  树形
  样式加载函数
 */
function TreeCss(){
    //Tree插件
    $('#tabLinkTree').children('li').find('> ul >li').hide();
    $('.tree > ul').attr('role', 'tree').find('ul').attr('role', 'group');
    $('.tree').find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').find(' > span').unbind('click').click(function(e) {
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
}

/*
 树形数据解析
 data:数据格式  [{AreaId:
                  ParentId:
                  AreaName:
                  AreaNo:
                  }]
 */
function Treefn(data,pid){
    var result = [] , temp;
    for(var i in data){     
            if(data[i].ParentId==pid){
                result.push(data[i]);
                temp = Treefn(data,data[i].AreaId);           
                if(temp.length>0){
                    data[i].children=temp;              
                }           
            }      
    }
    return result;
}

/*
 obj:渲染ID
 arr:数据结构
 */
function Treestie(obj, arr) {  
    var str = "";
    (function insertNode (data) {
        if (data.length>0) {
            data.map(function (item) {
                var updateBtn = "<a title='详细信息' onclick=updateRowTree('"+item.AreaId+"')  class='btn btn-default btn-circle'><i class='fa fa-pencil-square-o'></i></a>";
                var deleteBtn = "<a title='删除' onclick=delRowTree('"+item.AreaId+"','"+item.AreaNo+"')  class='btn btn-default btn-circle'><i class='fa fa-times txt-color-red'></i></a>";
                if (item.children) {
                    str += "<li data-no="+ item.AreaNo +"><span><i class='fa fa-lg fa-plus-circle'></i> "+
                        "<label>"+item.AreaName + "</label></span>"+updateBtn+deleteBtn+"<ul>";               
                    insertNode(item.children);
                    str += "</ul></li>";
                 
                } else {
                    str +="<li data-no="+ item.AreaNo +"><span>"+
                        "<label>"+item.AreaName + "</label></span>"+updateBtn+deleteBtn+"</li>";               
                  
                }

            });
        }
    })(arr);
    $("#"+obj).empty().html(str);
};
