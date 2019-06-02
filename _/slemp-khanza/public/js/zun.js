function PageData(data,page,type){
	var next = page + 1;
	var prev = page - 1;
	var disabled_prev = '';
	var disabled_next = '';
	if (page <= 1) {
		disabled_prev = 'disabled';
		prev = 1;
	}
	if (page >= data.page) {
		disabled_next = 'disabled';
		next = data.page;
	}

	if (page < 4) {
		var i = 1;
	} else {
		var i = page - 1;
	}

	var count = i+3;
	if ((data.page - page) < 2) {
		count = data.page + 1;
	}

	var PageData = "<li class='" + disabled_prev + "'><a href='javascript:;' onclick='"+type+"(1)'>&lt;&lt;</a></li><li class='prev " + disabled_prev + "'><a href='javascript:;' onclick='"+type+"(" + prev + ")'>&lt;</a></li>";
	for (i; i < count; i++) {
		if (i == page) {
			PageData += "<li class='active'><a href='javascript:;' onclick='"+type+"(" + i + ")'>" + i + "</a></li>";
		} else {
			PageData += "<li><a href='javascript:;' onclick='"+type+"(" + i + ")'>" + i + "</a></li>";
		}
	}
	PageData += "<li class='next " + disabled_next + "'><a href='javascript:;' onclick='"+type+"(" + next + ")'>&gt;</a></li>\
	<li class='" + disabled_next + "'><a href='javascript:;' onclick='"+type+"(" + data.page + ")'>&gt;&gt;</a></li>\
	<li class='disabled'><a href='javascript:;'>Total " + data.page + " page  "+data.count+" records</a></li>";
	return PageData;
}

function mstsc(port) {
		layer.confirm('When changing the remote port, all the logged in accounts will be cancelled. Do you really want to change the remote port?', {
			title: 'Remote port',
			closeBtn:2
		}, function(index) {
			if (index > 0) {
				var data = "port=" + port;
				var loadT = layer.load({
					shade: true,
					shadeClose: false
				});
				$.post('/firewall.php?action=SetSshPort', data, function(ret) {
					if (ret == true) {
						layer.msg('Successful change', {
							icon: 1
						});
						location.reload();
					} else {
						layer.msg('Connection failure', {
							icon: 5
						});
						layer.close(loadT);
					}

				});
			}
		});
	}


$(document).ready(function() {
	$(".sub-menu a.sub-menu-a").click(function() {
		$(this).next(".sub").slideToggle("slow")
			.siblings(".sub:visible").slideUp("slow");
	});
});

function thenew(info, id, ssid, ip) {
	if (info == null) {
		layer.confirm('It may take a few minutes to initialize the data, continue?',{
			title: 'Initialization',
			closeBtn:2
		}, function(index) {
			if (index > 0) {
				var loadT = layer.load({
					shade: true,
					shadeClose: false
				});
				$.get('/Server/there?id=' + id + '&ssid=' + ssid + '&ip=' + ip, function(ret) {
					if (ret == true) {
						layer.msg('Initialization successful', {
							icon: 1
						});
						location.reload();
					} else {
						layer.msg('Initialization failed, no service installed', {
							icon: 5
						});
						layer.close(loadT);
					}
				});
			}
		});

	} else {
		window.location.href = "/Server?ssid=" + ssid;
	}
}

function RandomStrPwd(len) {
	len = len || 32;
	var $chars = 'AaBbCcDdEeFfGHhiJjKkLMmNnPpRSrTsWtXwYxZyz2345678';
	var maxPos = $chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}
function repeatPwd(len){
	$("#MyPassword").val(RandomStrPwd(len));
}

function refresh(){
    window.location.reload();
}

function GetBakPost(tab){
	$(".baktext").hide().prev().show();
	var id = $(".baktext").attr("data-id");
	var bakText = $(".baktext").val();
	if(bakText==''){
		bakText='空';
	}
	setWebPs(tab, id, bakText);
	$(".baktext").remove();
}

function setWebPs(tab, id, bakText) {
	var loadT = layer.load({
		shade: true,
		shadeClose: false
	});
	var data = "ps="+bakText;
	$.get('/Ajax.php?action=setPs&tab=' + tab + '&id=' + id + '&' + data, function(ret) {
		if (ret == true) {
			if (tab == 'sites') {
				getWeb(1);
			} else if (tab == 'ftps') {
				getFtp(1);
			} else {
				getData(1);
			}

			layer.closeAll();
			layer.msg('Successfully modified', {
				icon: 1
			});
		} else {
			layer.msg('Failed, no permission', {
				icon: 5
			});
			layer.closeAll();
		}
	});
}

$("#setBox").click(function() {
	if ($(this).prop("checked")) {
		$("input[name=id]").prop("checked", true);
	} else {
		$("input[name=id]").prop("checked", false);
	}
});

$(".menu-icon").click(function() {
	$(".sidebar-scroll").toggleClass("sidebar-close");
	$(".main-content").toggleClass("main-content-open");
	if ($(".sidebar-close")) {
		$(".sub-menu").find(".sub").css("display", "none");
	}
});
var Upload,percentage;

function UsersSetup(id){
	$.get('/Client/GetClient?id='+id,function(rdata){
		var index = layer.open({
			type: 1,
			skin: 'demo-class',
			area: '540px',
			title: 'User settings',
			closeBtn: 2,
			shift: 5,
			shadeClose: false,
			content: '<div class="user-shezhi">\
						  <ul class="nav nav-tabs" role="tablist">\
						    <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Basic</a></li>\
						    <li role="presentation"><a href="#binding" aria-controls="binding" role="tab" data-toggle="tab">Binding</a></li>\
						    <li role="presentation"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab">Notice</a></li>\
						  </ul>\
						  <div class="tab-content">\
						    <div role="tabpanel" class="tab-pane active" id="home">\
						    	<form id="tabHome" class="zun-form-new">\
						    		<div class="line">\
									    <label><span>New password</span></label>\
									    <div class="info-r">\
									      <input type="password" name="password1" id="password1" placeholder="Please enter a new password">\
									    </div>\
									</div>\
						    		<div class="line">\
									    <label><span>Repeat the password</span></label>\
									    <div class="info-r">\
									      <input type="password" name="password2" id="password2" placeholder="Repeat again">\
									    </div>\
									</div>\
						    		<div class="submit-btn">\
							    			<button type="button" onclick="layer.closeAll()" class="btn btn-danger btn-sm btn-title">Cancel</button>\
										    <button type="button" class="btn btn-info btn-sm btn-title">Submit</button>\
									</div>\
						    	</form>\
						    </div>\
						    <div role="tabpanel" class="tab-pane" id="binding">\
								<form id="tabBinding" class="zun-form-new">\
									<div class="line">\
									    <label><span>Mobile phone</span></label>\
									    <div class="info-r">\
									      <input type="number" name="phone" id="phone" placeholder="Mobile phone number">\
									    </div>\
									</div>\
						    		<div class="line">\
									    <label><span>Mailbox</span></label>\
									    <div class="info-r">\
									      <input type="email" name="email" id="email" placeholder="abc@def.com">\
									    </div>\
									</div>\
						    	</form>\
							</div>\
						    <div role="tabpanel" class="tab-pane" id="messages">\
						    	<form id="tabMessage" class="zun-form-new">\
						    		<div class="line">\
						    		<select name="body" style="width:40%">\
						    			<option value="Offsite login notice">Offsite login notice</option>\
						    			<option value="Site exception notification">Site exception notification</option>\
						    			<option value="Backup notification">Backup notification</option>\
						    			<option value="Server exception notification">Server exception notification</option>\
						    		</select>\
						    		<select name="type"  style="width:20%">\
						    			<option value="Mail">Mail</option>\
						    			<option value="SMS">SMS</option>\
						    		</select>\
						    		<a class="btn btn-default">Add to</a>\
						    		</div>\
						    	</form>\
						    </div>\
						  </div>\
						</div>'
		});
	});

}

function ToSize(bytes){
	var unit = [' B',' KB',' MB',' GB'];
	var c = 1024;
	for(var i=0;i<unit.length;i++){
		if(bytes < c){
			return (i==0?bytes:bytes.toFixed(2)) + unit[i];
		}
		bytes /= c;
	}
}

function getHelp(id){
		layer.open({
			type: 2,
			area:['60%','95%'],
			skin: 'demo-class',
			title: 'Help information',
			closeBtn: 2,
			shift: 5,
			shadeClose: false,
			content: '/Help/helpFind?id='+id
			});

}

function ChangePath(id){
	setCookie("SetId",id);
	var mycomputer = layer.open({
		type: 1,
		area: '650px',
		title: 'Select directory',
		closeBtn: 2,
		shift: 5,
		shadeClose: false,
		content:"<div class='changepath'>\
			<div class='path-top'>\
				<button type='button' class='btn btn-default btn-sm' onclick='BackFile()'><span class='glyphicon glyphicon-share-alt'></span> Return</button>\
				<div class='place' id='PathPlace'>Current path: <span></span></div>\
			</div>\
			<div class='path-con'>\
				<div class='path-con-left'>\
					<dl>\
						<dt class='ico-computer title cursor' id='comlist' onclick='BackMyComputer()'>Computer</dt>\
					</dl>\
				</div>\
				<div class='path-con-right'>\
					<ul class='default' id='computerDefautl'></ul>\
					<div class='file-list'>\
						<table class='table table-hover'>\
							<thead>\
								<tr class='file-list-head'>\
									<th width='65%'>File name</th>\
									<th width='10%'>Permission</th>\
									<th width='15%'>Owner</th>\
									<th width='10%'></th>\
								</tr>\
							</thead>\
							<tbody id='tbody' class='list-list'>\
							</tbody>\
						</table>\
					</div>\
				</div>\
			</div>\
		</div>\
		<div class='getfile-btn' style='margin-top:0'>\
				<button type='button' class='btn btn-default btn-sm pull-left' onclick='CreateFolder()'>New folder</button>\
				<button type='button' class='btn btn-danger btn-sm btn-title' onclick=\"layer.close(getCookie('ChangePath'))\">Shut down</button>\
				&nbsp;<button type='button' class='btn btn-info btn-sm btn-title' onclick='GetfilePath()'>Select</button>\
			</div>"
	});
	setCookie('ChangePath',mycomputer);
	var path = $("#inputPath").val();
	GetDiskList("");
	GetDiskList(path);
	ActiveDisk();
}

function GetDiskList(Path){
	var Body='';
	var LBody= '';
	var data='path='+Path;
	$.post('/Ajax.php?action=GetDir',data,function(rdata){

		if(rdata.DISK != undefined){
			for(var i=0; i < rdata.DISK.length; i++){
				LBody +="<dd onclick=\"GetDiskList('"+rdata.DISK[i].Span+"')\"><span class='glyphicon glyphicon-hdd'></span>&nbsp;"+rdata.DISK[i].Span+"("+rdata.DISK[i].Size+"GB)</dd>";
			}
			$("#comlist").after(LBody);
		}else{

			for(var i=0; i < rdata.DIR.length; i++){
				var fmp = rdata.DIR[i].split(";");
				var cnametext =fmp[0];
				if(cnametext.length>20){
					cnametext = cnametext.substring(0,20)+'...'
				}
				Body +="<tr>\
							<td onclick=\"GetDiskList('"+rdata.PATH+"/"+fmp[0]+"')\" title='"+fmp[0]+"'><span class='glyphicon glyphicon-folder-open'></span>"+cnametext+"</td>\
							<td>" + fmp[3] + "</td>\
							<td>" + fmp[4] + "</td>\
							<td><span class='delfile-btn' onclick=\"NewDelFile('"+rdata.PATH+fmp[0]+"')\">X</span></td>\
						</tr>";
			}
			if(rdata.FILES != null && rdata.FILES !=''){
				for(var i=0; i < rdata.FILES.length; i++){
					var fmp = rdata.FILES[i].split(";");
					var cnametext =fmp[0];
					if(cnametext.length>20){
						cnametext = cnametext.substring(0,20)+'...'
					}
					Body +="<tr>\
								<td title='"+fmp[0]+"'><span class='glyphicon glyphicon-file'></span>"+cnametext+"</td>\
								<td>" + fmp[3] + "</td>\
								<td>" + fmp[4] + "</td>\
								<td></td>\
							</tr>";
				}
			}
			$(".default").hide();
			$(".file-list").show();
			$("#tbody").html(Body);
			if(rdata.PATH.substr(rdata.PATH.length-1,1) != '/') rdata.PATH+='/'
			$("#PathPlace").find("span").html(rdata.PATH);
			ActiveDisk();
			return;
		}

		if(Path == '' && rdata.DIR != undefined){
			for(var i=0; i < rdata.DIR.length; i++){
				var fmp = rdata.DIR[i].split(";");
				Body +="<tr><td onclick=\"GetDiskList('"+rdata.PATH+"/"+fmp[0]+"')\"><span class='glyphicon glyphicon-folder-open'></span>"+fmp[0]+"</td><td><span class='delfile-btn' onclick=\"NewDelFile('"+rdata.PATH+fmp[0]+"')\">X</span></td></tr>";
			}
			for(var i=0; i < rdata.FILES.length; i++){
				var fmp = rdata.FILES[i].split(";");
				Body +="<tr><td><span class='glyphicon glyphicon-file'></span>"+fmp[0]+"</td><td></td></tr>";
			}
			$(".default").hide();
			$(".file-list").show();
			$("#tbody").html(Body);
			if(rdata.PATH.substr(rdata.PATH.length-1,1) != '/') rdata.PATH+='/'
			$("#PathPlace").find("span").html(rdata.PATH);
			ActiveDisk();
		}
	});
}

function CreateFolder(){
	var html = "<tr><td colspan='2'><span class='glyphicon glyphicon-folder-open'></span> <input id='newFolderName' class='newFolderName' type='text' value=''></td><td colspan='2'><button id='nameOk' type='button' class='btn btn-info btn-sm'>Cancel</button>&nbsp;&nbsp;<button id='nameNOk' type='button' class='btn btn-default btn-sm'>Cancel</button></td></tr>";
	if($("#tbody tr").length==0){
		$("#tbody").append(html);
	}
	else{
		$("#tbody tr:first-child").before(html);
	}
	$(".newFolderName").focus();
	$("#nameOk").click(function(){
		var name = $("#newFolderName").val();
		var txt = $("#PathPlace").find("span").text();
		newTxt = txt.replace(new RegExp(/(\/)/g),'\\') + name;
		var data='path=' + newTxt;
		$.post('/Ajax.php?action=AddDir',data,function(rdata){
			if(rdata.status==true){
				layer.msg(rdata.msg, {icon: 1});
			}
			else{
				layer.msg(rdata.msg, {icon: 2});
			}
			GetDiskList(txt);
		})
	})
	$("#nameNOk").click(function(){
		$(this).parents("tr").remove();
	})
}

function NewDelFile(path){
	var txt = $("#PathPlace").find("span").text();
	newTxt = path.replace(new RegExp(/(\/)/g),'\\');
	var data='path=' + newTxt;
	$.post('/Ajax.php?action=DelNullDir',data,function(rdata){
		if(rdata.status==true){
			layer.msg(rdata.msg, {icon: 1});
		}
		else{
			layer.msg(rdata.msg, {icon: 2});
		}
		GetDiskList(txt);
	})
}

function ActiveDisk(){
	var active = $("#PathPlace").find("span").text().substring(0,1);
	switch(active){
		case "C":
		$(".path-con-left dd:nth-of-type(1)").css("background","#eee").siblings().removeAttr("style");
		break;
		case "D":
		$(".path-con-left dd:nth-of-type(2)").css("background","#eee").siblings().removeAttr("style");
		break;
		case "E":
		$(".path-con-left dd:nth-of-type(3)").css("background","#eee").siblings().removeAttr("style");
		break;
		case "F":
		$(".path-con-left dd:nth-of-type(4)").css("background","#eee").siblings().removeAttr("style");
		break;
		case "G":
		$(".path-con-left dd:nth-of-type(5)").css("background","#eee").siblings().removeAttr("style");
		break;
		case "H":
		$(".path-con-left dd:nth-of-type(6)").css("background","#eee").siblings().removeAttr("style");
		break;
		default:
		$(".path-con-left dd").removeAttr("style");
	}
}

function BackFile(){
	var str = $("#PathPlace").find("span").text().replace('//','/');
	if(str.substr(str.length-1,1) == '/'){
			str = str.substr(0,str.length-1);
	}
	var Path = str.split("/");
	var back = '/';
	if (Path.length > 2) {
		var count = Path.length - 1;
		for (var i = 0; i < count; i++) {
			back += Path[i] + '/';
		}
		if(back.substr(back.length-1,1) == '/'){
			back = back.substr(0,back.length-1);
		}
		GetDiskList(back.replace("//","/"));
	} else {
		back += Path[0];
		GetDiskList(back.replace("//","/"));
	}

}

function GetfilePath(){
	var txt = $("#PathPlace").find("span").text();
	txt = txt.replace(new RegExp(/(\\)/g),'/');
	$("#"+getCookie("SetId")).val(txt);
	layer.close(getCookie('ChangePath'));
}

function VirtualDirectories(id,path){
	layer.open({
		type: 1,
		area: '620px',
		title: 'View directory',
		closeBtn: 2,
		shift: 5,
		shadeClose: false,
		content:"<div class='changepath'>\
			<div class='path-top'>\
				<button id='backPath' type='button' class='btn btn-default btn-sm' ><span class='glyphicon glyphicon-share-alt'></span> Return</button>\
				<div class='place' id='xuniPathPlace'>Current path: <span></span></div>\
			</div>\
			<div class='path-con'>\
				<div class='path-con-right' style='width:100%'>\
					<table class='table table-hover'>\
						<thead>\
							<tr class='file-list-head'>\
								<th width='60%'>Name</th>\
								<th width='15%'>Size</th>\
								<th width='25%'>Update time</th>\
							</tr>\
						</thead>\
						<tbody id='xunitbody' class='list-list'>\
						</tbody>\
					</table>\
				</div>\
			</div>\
		</div>"
	});
	GetVirtualDirectories(id,path);
	$("#backPath").click(function(){
		var path = $("#xuniPathPlace").find("span").text();
		GetVirtualDirectories(-1,path);
	})
}

function GetVirtualDirectories(id,path){
	if(path == undefined){
		path = "";
	}
	var Body = "";
	var data = "id="+id+"&path="+path;
	$.get("/Api/GetDirFormat",data,function(rdata){
		for(var i=0; i < rdata.DIR.length; i++){
			Body +="<tr><td onclick=\"GetVirtualDirectories("+rdata.DIR[i].id+",\'"+rdata.PATH+"\')\"><span class='glyphicon glyphicon-folder-open'></span>"+rdata.DIR[i].name+"</td><td>--</td><td>"+rdata.DIR[i].addtime+"</td></tr>";
		}
		for(var i=0; i < rdata.FILES.length; i++){
			Body +="<tr><td><span class='glyphicon glyphicon-file'></span>"+rdata.FILES[i].filename+"</td><td>"+(ToSize(rdata.FILES[i].filesize))+"</td><td>"+rdata.FILES[i].uptime+"</td></tr>";
		}
		$("#xunitbody").html(Body);
		$("#xuniPathPlace").find("span").text(rdata.PATH);
	});
}

function setCookie(name,value)
{
var Days = 30;
var exp = new Date();
exp.setTime(exp.getTime() + Days*24*60*60*1000);
document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

function aotuHeight(){
	var McontHeight = $("body").height() - 40;
	$(".main-content").css("min-height",McontHeight);
}
$(function(){
	aotuHeight()
})
$(window).resize(function(){
	aotuHeight()
})

function showHidePwd(){
	var open = "glyphicon-eye-open",
		close = "glyphicon-eye-close";
	$(".pw-ico").click(function(){
		var $class = $(this).attr("class"),
			$prev = $(this).prev();
		if($class.indexOf(open)>0){
			var pw= $prev.attr("data-pw");
			$(this).removeClass(open).addClass(close);
			$prev.text(pw);

		}
		else{
			$(this).removeClass(close).addClass(open);
			$prev.text("**********");
		}
		var l = $(this).next().position().left;
		var t = $(this).next().position().top;
		var w = $(this).next().width();
		$(this).next().next().css({"left":l+w+"px","top":t+"px"});
	});
}

function openPath(path){
	setCookie('Path',path);
	window.location.href = 'files.php';
}

function OnlineEditFile(type, fileName) {
	if (type == 1) {
		var path = $("#PathPlace input").val();
		var data = encodeURIComponent($("#textBody").val().replace(/\+/g,'+'));
		var encoding = $("select[name=encoding]").val();
		layer.msg('Saving...', {
			icon: 16,
			time: 0
		});
		$.post('/files.php?action=SaveFileBody', 'data=' + data + '&file=' + fileName+'&encoding='+encoding, function(rdata) {
			layer.closeAll();
			layer.msg('File saved!', {
				icon: rdata.status ? 1 : 5
			});
		});
		return;
	}
	if (type == 2) {
		var path = $("#PathPlace input").val();
		var data = encodeURIComponent($("#textBody").val().replace(/\+/g,'+'));
		layer.msg('Saving...', {
			icon: 16,
			time: 0
		});
		var encoding = $("select[name=encoding]").val();
		$.post('/files.php?action=SaveFileBody', 'data=' + data + '&file=' + fileName+'&encoding='+encoding, function(rdata) {
			layer.msg('File saved!', {
				icon: rdata.status ? 1 : 5
			});
		});
		return;
	}

	layer.msg('Reading file...', {
		icon: 16,
		time: 0
	});
	var exts = fileName.split('.');
	var ext = exts[exts.length-1];
	var msg = 'Online editing only supports text and script files, default UTF8 encoding, do you try to open it?';
	if(ext == 'conf' || ext == 'cnf' || ext == 'ini'){
		msg = 'What you are opening is a configuration file. If you don\'t understand the configuration rules, the configuration program may not work properly. Continue?';
	}
	var doctype;
	switch (ext){
		case 'html':
			var mixedMode = {
				name: "htmlmixed",
				scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
							   mode: null},
							  {matches: /(text|application)\/(x-)?vb(a|script)/i,
							   mode: "vbscript"}]
			  };
			doctype = mixedMode;
			break;
		case 'htm':
			var mixedMode = {
				name: "htmlmixed",
				scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
							   mode: null},
							  {matches: /(text|application)\/(x-)?vb(a|script)/i,
							   mode: "vbscript"}]
			  };
			doctype = mixedMode;
			break;
		case 'js':
			doctype = "text/javascript";
			break;
		case 'json':
			doctype = "application/ld+json";
			break;
		case 'css':
			doctype = "text/css";
			break;
		case 'php':
			doctype = "application/x-httpd-php";
			break;
		case 'tpl':
			doctype = "application/x-httpd-php";
			break;
		case 'xml':
			doctype = "application/xml";
			break;
		case 'sql':
			doctype = "text/x-sql";
			break;
		case 'conf':
			doctype = "text/x-nginx-conf";
			break;
		default:
			var mixedMode = {
				name: "htmlmixed",
				scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
							   mode: null},
							  {matches: /(text|application)\/(x-)?vb(a|script)/i,
							   mode: "vbscript"}]
			  };
			doctype = mixedMode;
	}
	$.post('/files.php?action=GetFileBody', 'file=' + fileName, function(rdata) {
		layer.closeAll();
		var encodings = ["GBK","UTF-8"];
		var encoding = ''
		var opt = ''
		var val = ''
		for(var i=0;i<encodings.length;i++){
			opt = rdata.encoding == encodings[i] ? 'selected':'';
			encoding += '<option value="'+encodings[i]+'" '+opt+'>'+encodings[i]+'</option>';
		}

		layer.open({
			type: 1,
			shift: 5,
			closeBtn: 2,
			area: ['90%', '90%'],
			title: 'Online editing [' + fileName + ']',
			content: '<form class="zun-form-new" style="padding-top:10px">\
			<div class="line noborder">\
			<p style="color:red;margin-bottom:10px">Hint: Ctrl+F to search for keywords, Ctrl+G to find the next one, Ctrl+S to save, Ctrl+Shift+R to find replacements!\
			<select name="encoding" style="width: 74px;position: absolute;top: 11px;right: 14px;height: 22px;z-index: 9999;border-radius: 0;">'+encoding+'</select></p>\
			<textarea class="mCustomScrollbar" id="textBody" style="width:100%;margin:0 auto;line-height: 1.8;position: relative;top: 10px;" value="" />\
			</div>\
			<div class="submit-btn" style="position:absolute; bottom:0; width:100%">\
			<button type="button" class="btn btn-danger btn-sm btn-title" onclick="layer.closeAll()">Close</button>\
			<button id="OnlineEditFileBtn" type="button" class="btn btn-info btn-sm btn-title">Save</button>\
			</div>\
			</form>'
		});
		$("#textBody").text(rdata.data);
		//$(".layui-layer").css("top", "5%");
		var h = $(window).height()*0.9;
		$("#textBody").height(h-160);
		var editor = CodeMirror.fromTextArea(document.getElementById("textBody"), {
			extraKeys: {"Ctrl-F": "findPersistent","Ctrl-H":"replaceAll"},
			mode:doctype,
			lineNumbers: true,
			matchBrackets:true,
			matchtags:true,
			autoMatchParens: true
		});
		editor.focus();
		editor.setSize('auto',h-150);
		$("#OnlineEditFileBtn").click(function(){
			$("#textBody").text(editor.getValue());
			OnlineEditFile(1,fileName);
		})
		$(window).keydown(function(e) {
			if(e.keyCode == 83 && e.ctrlKey){
				$("#textBody").text(editor.getValue());
				OnlineEditFile(2,fileName);
				e.preventDefault();
			}
			if((e.keyCode == 70 && e.ctrlKey) || (e.keyCode == 71 && e.ctrlKey) || (e.keyCode == 82 && e.ctrlKey)){
				e.preventDefault();
			}
		});
	});
}

function ServiceAdmin(name,type){
	var data = "name="+name+"&type="+type;
	var msg = '';
	switch(type){
		case 'stop':
			msg = 'stop';
			break;
		case 'start':
			msg = 'start';
			break;
		case 'restart':
			msg = 'restart';
			break;
		case 'reload':
			msg = 'reload';
			break;
	}
	layer.confirm('You really want '+msg+name+' service? ',{closeBtn:2},function(){
		layer.msg('Right '+msg+name+' service...',{icon:16,time:0});
		$.post('/config.php?action=ServiceAdmin',data,function(rdata){
			layer.closeAll();
			var reMsg =rdata.status?name+'Service has been '+msg:name+' service '+msg+' failure!';
			layer.msg(reMsg,{icon:rdata.status?1:5});
			if(type == 'stop' || type == 'start'){
				setTimeout(function(){
					window.location.reload();
				},3000);
			}

			if(name == 'nginx'){
				if(!rdata.status) layer.msg(rdata.msg,{icon:5,area:'80%',time:10});
			}
		}).error(function(){
			layer.closeAll();
			layer.msg('Successful operation!',{icon:1});
			setTimeout(function(){
				window.location.reload();
			},3000);
		});
	});
}

function stopPHP(version){
	layer.msg('Deactivating [PHP-'+version+']...',{icon:16,time:0})
	$.get('/config.php?action=StopPHPVersion&version='+version,function(rdata){
		layer.closeAll()
		layer.msg(rdata.msg,{icon:rdata.status?1:5})
		setTimeout(function(){
			window.location.reload();
		},3000);
	})
}

function startPHP(version){
	layer.msg('Enabled [PHP-'+version+']...',{icon:16,time:0})
	$.get('/config.php?action=StartPHPVersion&version='+version,function(rdata){
		layer.closeAll()
		layer.msg(rdata.msg,{icon:rdata.status?1:5})
		setTimeout(function(){
			window.location.reload();
		},3000);
	})
}

function GetConfigFile(type){
	var fileName = '';
	switch(type){
		case 'mysql':
			fileName = '/etc/my.cnf';
			break;
		case 'nginx':
			fileName = '/www/server/nginx/conf/nginx.conf';
			break;
		case 'pure-ftpd':
			fileName = '/www/server/pure-ftpd/etc/pure-ftpd.conf';
			break;
		default:
			fileName = '/www/server/php/'+type+'/etc/php.ini';
			break;
	}

	OnlineEditFile(0,fileName);
}

function GetPHPStatus(version){
	if(version == '52'){
		layer.msg('Sorry, PHP 5.2 is not supported.',{icon:5});
		return;
	}

	$.get('site.php?action=GetPHPStatus&version='+version,function(rdata){
		layer.open({
			type:1,
			area:'400',
			title:'PHP load status',
			closeBtn:2,
			shift:5,
			shadeClose:true,
			content:"<div style='margin:15px;'><table class='table table-hover table-bordered'>\
						<tr><th>App Pool (pool)</th><td>"+rdata.pool+"</td></tr>\
						<tr><th>Process management (process manager)</th><td>"+((rdata['process manager'] == 'dynamic')?'dynamic':'Static')+"</td></tr>\
						<tr><th>Start date (start time)</th><td>"+rdata['start time']+"</td></tr>\
						<tr><th>Number of requests (accepted conn)</th><td>"+rdata['accepted conn']+"</td></tr>\
						<tr><th>Request queue (listen queue)</th><td>"+rdata['listen queue']+"</td></tr>\
						<tr><th>Maximum waiting queue (max listen queue)</th><td>"+rdata['max listen queue']+"</td></tr>\
						<tr><th>Socket queue length (listen queue len)</th><td>"+rdata['listen queue len']+"</td></tr>\
						<tr><th>Number of idle processes (idle processes)</th><td>"+rdata['idle processes']+"</td></tr>\
						<tr><th>Number of active processes (active processes)</th><td>"+rdata['active processes']+"</td></tr>\
						<tr><th>Total number of processes (total processes)</th><td>"+rdata['total processes']+"</td></tr>\
						<tr><th>Maximum number of active processes (max active processes)</th><td>"+rdata['max active processes']+"</td></tr>\
						<tr><th>The maximum number of process arrivals (max children reached)</th><td>"+rdata['max children reached']+"</td></tr>\
						<tr><th>Slow request quantity (slow requests)</th><td>"+rdata['slow requests']+"</td></tr>\
					 </table></div>"
		});
	});
}

function GetNginxStatus(){
	$.get('Ajax.php?action=GetNginxStatus',function(rdata){
		layer.open({
			type:1,
			area:'400',
			title:'Nginx load status',
			closeBtn:2,
			shift:5,
			shadeClose:true,
			content:"<div style='margin:15px;'><table class='table table-hover table-bordered'>\
						<tr><th>Active connection (Active connections)</th><td>"+rdata.active+"</td></tr>\
						<tr><th>Total connections (accepts)</th><td>"+rdata.accepts+"</td></tr>\
						<tr><th>Total handshake (handled)</th><td>"+rdata.handled+"</td></tr>\
						<tr><th>Total requests (requests)</th><td>"+rdata.requests+"</td></tr>\
						<tr><th>Number of requests (Reading)</th><td>"+rdata.Reading+"</td></tr>\
						<tr><th>Response number (Writing)</th><td>"+rdata.Writing+"</td></tr>\
						<tr><th>Resident process (Waiting)</th><td>"+rdata.Waiting+"</td></tr>\
					 </table></div>"
		});
	});
}

function btcopy(){
	$(".btcopy").zclip({
		path: "/public/js/ZeroClipboard.swf",
		copy: function(){
		return $(this).attr("data-pw");
		},
		afterCopy:function(){/* After successful copying */
			if($(this).attr("data-pw") ==""){
				layer.msg("Password is empty",{icon:7,time:1500});
			}
			else
			layer.msg("Successful copy",{icon:1,time:1500});
		}
	})
}

function isChineseChar(str){   
   var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
   return reg.test(str);
}
