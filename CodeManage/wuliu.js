var _wuliu = [],
	pCode,mCode,seach;

function CodeSearch(No) {
	console.log(No);
	$("#seach").val(No);
	$("#seachbt").click();
}


//查询之后页面渲染
function SearchDOM(data) {
	if(data.message == null){
		$("#search-section").fadeIn(500);
		$("#error").html("");
		if(data.ElapsedMilliseconds){
			$('#ElapsedMilliseconds').html("<p style='text-align:center'><strong style='color:green;'>本次查询耗时："+data.ElapsedMilliseconds+"毫秒</p>");
		}

		//生产状态渲染
		var td = $('#InOrderStatus').find('td');
		td.map(function(index, elem) {
			var value = data[$(elem).attr('id')];
			value  === true ? value ='是' : value === false ? value ='否' : value;

			if($(elem).attr('id') == 'Layer'){
				value == 1 ? value = '产品码' : value == 2 ? value = '箱码' : value = '跺码';
			}
			$(elem).html(value);
		})

		//生产单号渲染加点击事件添加
		if(data.Logs){
			var LogsItem = JSON.parse(data.Logs).info.item;
			$('#'+LogsItem.key).html(`${LogsItem.value}`);
		}

        var json = data.rows,
        html = '';
        if(json.length > 0){
        	json.map(function(index, el) {
            	html += `<tr>
			            	<td>${index.OrderName}</td>
			            	<td>${index.ProductNo}</td>
			            	<td>${index.ProductName}</td>
			            	<td>${index.Count+index.UnitName}</td>
			            	<td>${index.Issued+index.UnitName}</td>
			            	<td>${index.BatchNo}</td>
			            	<td>${index.TeamName}</td>
			            	<td>${index.SceneName}</td>
			            	<td>${index.MergeName}</td>
			            </tr>`;
            });
        }else{
        	html = '<tr><td colspan=9 style=color:red;>该产品编号无效</td></tr>'
        }
        $('#InOrder').html(html);

        //生产单产品信息渲染
        if(data.Info){
			var InfoItem = JSON.parse(data.Info).info.item,
			codeHtml = '';
			console.log(InfoItem);
			if(InfoItem.length){
				InfoItem.map(function(index, elem) {
					var add =  index.add;
					var addNos = '';
					if(add){
						if(add.length){
							add.map(function(index, elem) {
								var spl = ',';
								if(add.length == elem){
									spl = '';
								}
								addNos += `<span title="点击查询该编码" class="CCode" onclick="CodeSearch('${index.key}')">${index.key}${spl}</span>`;
							})
						}else{
							addNos = `<span title="点击查询该编码" class="CCode" onclick="CodeSearch('${add.key}')">${add.key}</span>`;
						}
					}
					
					codeHtml += `<tr>
				            	<td>${index.value}</td>
				            	<td>${index.count}</td>
				            	<td>${addNos}</td>
				            </tr>`;
				})
			}else{
				var add =  InfoItem.add;
				var addNos = '';
				if(add){
					if(add.length){
						add.map(function(index, elem) {
							var spl = ',';
							if((add.length-1) == elem){
								spl = '';
							}
							addNos += `<span title="点击查询该编码" class="CCode" onclick="CodeSearch('${index.key}')">${index.key}${spl}</span>`;
						})
					}else{
						addNos = `<span title="点击查询该编码" class="CCode" onclick="CodeSearch('${add.key}')">${add.key}</span>`;
					}
				}
				codeHtml += `<tr>
			            	<td>${InfoItem.value}</td>
			            	<td>${InfoItem.count}</td>
			            	<td>${addNos}</td>
			            </tr>`;
			}
			
			$('#InOrderProCode').html(codeHtml);
		}
	}else{
		$("#error").html("<div style='text-align:center'><strong style='color:red;'>"+data.message+"</strong></div>")
	}
}

$(function(){
	
	qxC();
	$("#order_error").hide();//隐藏产品未出库信息
	$("#order_error2").hide();//隐藏产品未出库信息
	$("#seachbt").click(function(event) {
	  var seachval = $("#seach").val();
		if(seachval.indexOf('?')>-1){
			seachval=seachval.substring(seachval.lastIndexOf('?')+1,seachval.length);
			$('#seach').val(seachval);
		}else if(seachval.indexOf('/')>-1){
			seachval=seachval.substring(seachval.lastIndexOf('/')+1,seachval.length);
			$('#seach').val(seachval);
		}	
		if(seachval){
			ajax({
				url: "proCode/",
				data: {
					Code:seachval,
					permit:dataList.PermitNo
				},
				success: function(data){
					SearchDOM(data);
					
			    },
				error:function(message){
					$("#search-section").fadeOut(500);
					$("#error").html("<div style='text-align:center'><strong style='color:red;'>输入了错误的编码号，请输入正确编码号！</strong></div>")
				}
			})
		}else{
			$.errorFun('请输入编码');
		}
		
	});
})