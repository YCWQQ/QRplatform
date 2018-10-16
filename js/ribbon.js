$(function(){
	var $ribbon = $('#ribbon ol'),
	breadcrumb = `<li><a href="/">首页</a></li><li>${breadcrumbObj.parent}</li><li>${breadcrumbObj.index}</li>`;

	$ribbon.html(breadcrumb);
})