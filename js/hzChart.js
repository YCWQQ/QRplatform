function orgChart(jsonData,dom){
	if(jsonData){
		var $chart = $("#"+dom),
			CenterBox = '',
			ParentLine = '',
			lengths = '',
			html = '',
			table = '';
		
		var td1 = '',
			td2 = '',
			td3 = '',
			td4 = '';

		var List = jsonData[0].List;

		List.forEach(function(val,index,array){
			var length = val.List.length;
			lengths = parseInt(lengths+length);//获取list总长度	
			
			ParentLine += index != 0 ? `<td class="rightLine topLine" colspan="${length}"></td><td class="${index != parseInt(array.length-1)?"leftLine topLine":"leftLine"}" colspan="${length}"></td>`:`<td class="rightLine" colspan="${length}"></td><td class="leftLine topLine" colspan="${length}"></td>`;
			td1 += '<td colspan='+(length*2)+'><div class="box">'+val.CenterBox+'</div></td>';//生成一级
			td2 += '<td colspan='+(length*2)+'><div class="downLine"></div></td>';//生成一级连接线
			//生成二级连接线
			for (var i = 1; i <= (length*2); i++) {
				td3+=i%2 != 0?`<td class="${i==1?"rightLine":"rightLine topLine"}"></td>`:`<td class="${i==(length*2)?"leftLine":"leftLine topLine"}"></td>`;			
			}
			//生成下方表格
			val.List.forEach(function(v,i,arr){
				var td4Html = '';		
				v.List.forEach(function(v2,i2,arr2){
					td4Html += `<tr><td><i class="${v2.zt?"ibox green":"ibox red"}"></i></td>	
	                                 <td>${v2.number}</td>
								<td>${v2.type}</td></tr>`.trim();
				});
				td4 += '<td colspan="2"><table class="box-table">'+ td4Html +'</table><div class="td-text">'+ v.CenterBox +'</div></td>'
			})
		})
		CenterBox = `<tr class="boxs">
					<td colspan="${lengths*2}"><div class="box">${jsonData[0].CenterBox}</div></td>
				  </tr>
				  <tr class="lines">
				    <td colspan="${lengths*2}"><div class="downLine"></div></td>
				  </tr>`;
		ParentLine = '<tr class="lines">'+ ParentLine +'</tr>';
		var	tr1 = '<tr class="boxs">'+ td1+'</tr>',
			tr2 = '<tr class="lines">'+ td2 +'</tr>',
			tr3 = '<tr class="lines">'+ td3 +'</tr>',
			tr4 = '<tr class="boxs">'+ td4 +'</tr>';
		table = CenterBox+ParentLine+tr1+tr2+tr3+tr4;
		html = '<div class=orgchart><table>'+ table +'</table></div>';
		$chart.append(html);
	}
}
