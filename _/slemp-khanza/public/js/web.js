function getWeb(page, search) {
	search = search == undefined ? '':search;
	var sUrl = '/Ajax.php?action=getData&tojs=getWeb&tab=sites&limit=10&p=' + page + '&search=' + search;
	var loadT = layer.load();
	$.get(sUrl, function(data) {
		layer.close(loadT);
		var Body = '';
		for (var i = 0; i < data.data.length; i++) {
			if (data.data[i].status == 'running' || data.data[i].status == '1') {
				var status = "<a href='javascript:;' title='Deactivate this site' onclick=\"webStop(" + data.data[i].id + ",'" + data.data[i].name + "')\" class='btn-defsult'><span style='color:#3498DB;'>Running    </span><span style='color:#3498DB;' class='glyphicon glyphicon-pause'></span></a>";
			} else {
				var status = "<a href='javascript:;' title='Enable this site' onclick=\"webStart(" + data.data[i].id + ",'" + data.data[i].name + "')\" class='btn-defsult'><span style='color:red'>Stopped    </span><span style='color:rgb(255, 0, 0);' class='glyphicon glyphicon-play'></span></a>";
			}

			if (data.data[i].backup_count > 0) {
				var backup = "<a href='javascript:;' class='link' onclick=\"getBackup(" + data.data[i].id + ",'" + data.data[i].name + "')\">Packed</a>";
			} else {
				var backup = "<a href='javascript:;' class='link' onclick=\"getBackup(" + data.data[i].id + ",'" + data.data[i].name + "')\">No packaging</a>";
			}
			var web_end_time = (data.data[i].due_date == "0000-00-00") ? 'permanent' : data.data[i].due_date;
			data.data[i].domain = data.data[i].domain == null?"":data.data[i].domain;
			var domain = data.data[i].domain.split(',');
			Body += "<tr><td style='display:none'><input type='checkbox' name='id' value='" + data.data[i].id + "'></td>\
					<td><a class='link webtips' href='javascript:;' onclick=\"webEdit(" + data.data[i].id + ",'" + data.data[i].name + "','" + data.data[i].due_date + "','" + data.data[i].addtime + "')\">" + data.data[i].name + " (" + domain.length + ")</td>\
					<td>" + status + "</td>\
					<td>" + backup + "</td>\
					<td><a class='link' title='Open Directory' href=\"javascript:openPath('"+data.data[i].path+"');\">" + data.data[i].path + "</a></td>\
					<td><a class='linkbed' href='javascript:;' data-id='"+data.data[i].id+"'>" + data.data[i].ps + "</a></td>\
					<td style='text-align:right; color:#bbb'>\
					<a href='javascript:;' class='link' onclick=\"webEdit(" + data.data[i].id + ",'" + data.data[i].name + "','" + data.data[i].due_date + "','" + data.data[i].addtime + "')\">Modify </a>\
                        | <a href='javascript:;' class='link' onclick=\"webDelete('" + data.data[i].id + "','" + data.data[i].name + "')\" title='Delete site'>Delete</a>\
					</td></tr>"
		}
		$("#webBody").html(Body);
		$(".btn-more").hover(function(){
			$(this).addClass("open");
		},function(){
			$(this).removeClass("open");
		});
		$("#webPage").html(data.page);

		$(".linkbed").click(function(){
			var dataid = $(this).attr("data-id");
			var databak = $(this).text();
			if(databak=="空"){
				databak='';
			}
			$(this).hide().after("<input class='baktext' type='text' data-id='"+dataid+"' name='bak' value='" + databak + "' placeholder='Remarks' onblur='GetBakPost(\"sites\")' />");
			$(".baktext").focus();
		});
	});
}

function webAdd(type) {
	if (type == 1) {
		var array;
		var str="";
		var domainlist='';
		var domain = array = $("#mainDomain").val().split("\n");
		var Webport=[];
		var checkDomain = domain[0].split('.');

		if(domain[0].indexOf('*') != -1){
			layer.msg('Primary domain name cannot be panned!',{icon:5});
			return;
		}

		if(checkDomain.length < 1 || checkDomain[1].length < 1|| domain[0].length < 5){
			layer.msg('The domain name is not in the correct format. Please re-enter!',{icon:5});
			return;
		}
		for(var i=1; i<domain.length; i++){
			domainlist += '"'+domain[i]+'",';
		}
		Webport = domain[0].split(":")[1];
		if(Webport==undefined){
			Webport="80";
		}
		domainlist = domainlist.substring(0,domainlist.length-1);
		domain ='{"domain":"'+domain[0]+'","domainlist":['+domainlist+'],"count":'+domain.length+'}';
		var loadT = layer.load({
			shade: true,
			shadeClose: false
		});
		var data = $("#addweb").serialize()+"&port="+Webport+"&webname="+domain;
		$.post('/site.php?action=oneKeyAdd', data, function(ret) {
			var ftpData = '';
			if (ret.in_ftp) {
				ftpData = "<p class='p1'>FTP has also helped you build it.</p>\
					 		<p>FTP address: <strong>" + ret.ftpUrl + "</strong></p>\
					 		<p>Account number: <strong>" + ret.ftpUserName + "</strong></p>\
					 		<p class='p1'>Password:<strong>" + ret.ftpPassword + "</strong></p>\
					 		<p>Just upload the website to the above FTP to access!</p>"
			}
			var sqlData = '';
			if (ret.sql) {
				sqlData = "<p class='p1'>The database has also helped you build it.</p>\
					 		<p>Data storage name: <strong>" + ret.sql.dataName + "</strong></p>\
					 		<p>Account number: <strong>" + ret.sql.dataUser + "</strong></p>\
					 		<p class='p1'>Password: <strong>" + ret.sql.password + "</strong></p>"
			}
			if (ret.status == true) {
				getWeb(1);
				layer.closeAll()
				layer.open({
					type: 1,
					skin: 'demo-class',
					area: '600px',
					title: false,
					closeBtn: 2,
					shift: 0,
					shadeClose: true,
					content: "<div class='success-msg'>\
					 	<div class='pic'><img src='/public/img/success-pic.png'></div>\
					 	<div class='suc-con'>\
					 		<h3>Site setup completed!</h3>\
					 		" + ftpData + sqlData + "\
					 	</div>\
					 	<div class='bottom-btn' style='text-align: center;'>\
					 		<a class='close-btn' onclick='layer.closeAll()'>Shut down</a>\
					 	</div>\
					 </div>",
				});
				if ($(".success-msg").height() < 150) {
					$(".success-msg").find("img").css({
						"width": "150px",
						"margin-top": "50px"
					});
				}

			} else {
				layer.msg(ret.msg, {
					icon: 5
				});
			}
			layer.close(loadT);
		});
		return;
	}

	$.get('/site.php?action=GetPHPVersion',function(rdata){
		var defaultPath = $("#defaultPath").html();
		var php_version = "<div class='line'><label><span>PHP version</span></label><select name='version' id='c_k3' style='width:100px'>";
		for(var i=rdata.length-1;i>=0;i--){
            php_version += "<option value='"+rdata[i].version+"'>"+rdata[i].name+"</option>";
        }
		php_version += "</select></div>";
		var index = layer.open({
			type: 1,
			skin: 'demo-class',
			area: '560px',
			title: 'Add website',
			closeBtn: 2,
			shift: 0,
			shadeClose: false,
			content: "<form class='zun-form-new' id='addweb'>\
						<div class='line'>\
		                    <label><span>Domain name</span></label>\
		                    <div class='info-r'>\
								<textarea id='mainDomain' name='webname'/></textarea>\
							</div>\
						</div>\
	                    <div class='line'>\
	                    <label><span>Remarks</span></label>\
	                    <div class='info-r'>\
	                    	<input id='Wbeizhu' type='text' name='bak' placeholder='Website note' style='width:398px' />\
	                    </div>\
	                    </div>\
	                    <div class='line'>\
	                    <label><span>Directory</span></label>\
	                    <div class='info-r'>\
	                    	<input id='inputPath' type='text' name='path' value='"+defaultPath+"/' placeholder='Website root directory' style='width:398px' /><span class='glyphicon glyphicon-folder-open cursor' onclick='ChangePath(\"inputPath\")'></span>\
	                    </div>\
	                    </div>\
	                    <div class='line'>\
	                    <label><span>Database</span></label>\
		                    <select name='sql' id='c_k2' style='width:100px'>\
		                    	<option value='MySQL'>MySQL</option>\
		                    	<option value='false' selected>Not created</option>\
		                    </select>\
		                    <select name='codeing' id='c_codeing' style='width:100px'>\
		                    	<option value='utf8'>UTF-8</option>\
		                    	<option value='utf8mb4'>UTF8_MB4</option>\
								<option value='gbk'>GBK</option>\
								<option value='big5'>BIG5</option>\
		                    </select>\
	                    </div>\
	                    <div class='line' id='datass'>\
	                    <label><span>Database settings</span></label>\
	                    <div class='info-r'>\
		                    <div class='userpassword'><span>Username: <input id='data-user' type='text' name='datauser' value=''  style='width:150px' /></span>\
		                    <span class='last'>Password: <input id='data-password' type='text' name='datapassword' value=''  style='width:150px' /></span></div>\
		                    <p>While creating the site, create a corresponding database account for the site to facilitate different databases using different databases.</p>\
	                    </div>\
	                    </div>\
						"+php_version+"\
	                    <div class='submit-btn'>\
							<button type='button' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
							<button type='button' class='btn btn-info btn-sm btn-title' onclick=\"webAdd(1)\">Submit</button>\
						</div>\
	                  </form>",
		});
		$(function() {
			var placeholder = "<div class='placeholder' style='top:10px;left:10px'>Fill in one domain per line<br>The default is port 80.<br>If the additional port format is www.domain.com:88</div>";
			$('#mainDomain').after(placeholder);
			$(".placeholder").click(function(){
				$(this).hide();
				$('#mainDomain').focus();
			})
			$('#mainDomain').focus(function() {
			    $(".placeholder").hide();
			});

			$('#mainDomain').blur(function() {
				if($(this).val().length==0){
					$(".placeholder").show();
				}
			});

			$('#mainDomain').on('input', function() {
				var array;
				var res,ress;
				var str = $(this).val();
				var len = str.replace(/[^\x00-\xff]/g, "**").length;
				array = str.split("\n");
				ress =array[0].split(":")[0];
				res = ress.replace(new RegExp(/([-.])/g), '_');
				if(res.length > 16) res = res.substr(0,16);
				if($("#inputPath").val().substr(0,defaultPath.length) == defaultPath) $("#inputPath").val(defaultPath+'/'+ress);
				$("#Wbeizhu").val(ress);
				$("#ftp-user").val(res);
				$("#data-user").val(res);
			})
			$('#Wbeizhu').on('input', function() {
				var str = $(this).val();
				var len = str.replace(/[^\x00-\xff]/g, "**").length;
				if (len > 20) {
					str = str.substring(0, 20);
					$(this).val(str);
					layer.msg('Do not exceed 20 characters', {
						icon: 0
					});
				}
			})

			var timestamp = new Date().getTime().toString();
			var dtpw = timestamp.substring(7);
			$("#data-user").val("sql" + dtpw);

			function _getRandomString(len) {
				len = len || 32;
				var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
				var maxPos = $chars.length;
				var pwd = '';
				for (i = 0; i < len; i++) {
					pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
				}
				return pwd;
			}
			$("#ftp-password").val(_getRandomString(10));
			$("#data-password").val(_getRandomString(10));


			$("#ftpss,#datass").hide();

			$("#c_k1").change(function() {
					var val = $("#c_k1").val();
					if (val == 'false') {
						$("#ftp-user").attr("disabled", true);
						$("#ftp-password").attr("disabled", true);
						$("#ftpss").hide();
					} else {
						$("#ftp-user").attr("disabled", false);
						$("#ftp-password").attr("disabled", false);
						$("#ftpss").show();
					}
				})

			$("#c_k2").change(function() {
				var val = $("#c_k2").val();
				if (val == 'false') {
					$("#data-user").attr("disabled", true);
					$("#data-password").attr("disabled", true);
					$("#datass").hide();
				} else {
					$("#data-user").attr("disabled", false);
					$("#data-password").attr("disabled", false);
					$("#datass").show();
				}
			});
		});
	});
}

function webPathEdit(id){
	$.get("/Ajax.php?action=getKey&tab=sites&key=path&id="+id,function(rdata){
		$.get('/site.php?action=GetDirUserINI&path='+rdata,function(userini){
			var checkeds = userini.status?'checked':'';
			var webPathHtml = "<div class='webEdit-box padding-10'>\
						<div><input type='checkbox' name='userini' id='userini'"+checkeds+" /><label for='userini' style='font-weight:normal'>Anti-cross-site attack</label></div>\
						<div class='line' style='margin-top:5px'>\
							<input type='text' style='width:90%' placeholder='Website root directory' value='"+rdata+"' name='webdir' id='inputPath'>\
							<span onclick='ChangePath(&quot;inputPath&quot;)' class='glyphicon glyphicon-folder-open cursor'></span>\
						</div>\
						<button class='btn btn-info btn-sm' onclick='SetSitePath("+id+")'>Preservation</button>\
					</div>";
			$("#webEdit-con").html(webPathHtml);

			$("#userini").change(function(){
				$.get('/site.php?action=SetDirUserINI&path='+rdata,function(userini){
					layer.msg(userini.msg,{icon:userini.status?1:5});
				});
			});
		});
	});
}

function SetSitePath(id){
	var NewPath = $("#inputPath").val();
	var loadT = layer.msg('Processing...',{icon:16,time:100000});
	$.post('/site.php?action=SetPath','id='+id+'&path='+NewPath,function(rdata){
		layer.close(loadT);
		var ico = rdata.status?1:5;
		layer.msg(rdata.msg,{icon:ico});
	});
}

function webBakEdit(id){
	$.get("/Ajax.php?action=getKey&tab=sites&key=ps&id="+id,function(rdata){
		var webBakHtml = "<div class='webEdit-box padding-10'>\
					<div class='line'>\
					<label><span>Website note</span></label>\
					<div class='info-r'>\
					<textarea name='beizhu' id='webbeizhu' col='5' style='width:96%'>"+rdata+"</textarea>\
					<br><br><button class='btn btn-info btn-sm' onclick='SetSitePs("+id+")'>Preservation</button>\
					</div>\
					</div>";
		$("#webEdit-con").html(webBakHtml)
	});
}

function SetSitePs(id){
	var myPs = $("#webbeizhu").val();
	$.get('/Ajax.php?action=setPs&tab=sites&id='+id+'&ps='+myPs,function(rdata){
		layer.msg(rdata?"Successfully modified":"No need to modify",{icon:rdata?1:5});
	});
}

function FilesRar(id,toServer){
	if(toServer == 1){
		var data = $("#FilesRar").serialize()+'&id='+id;
		var loadT = layer.msg('Right communication...',{icon:16,time:10000});
		$.get('/site.php?action=FilesZip',data,function(rdata){
			layer.closeAll();
			var ico = rdata.status?1:5;
			layer.msg(rdata.msg,{icon:ico});
		});
		return;
	}
	var fileRarHtml = "<div class='webEdit-box padding-10'><form id='FilesRar'>\
						<div class='line'>\
							<label><span style='padding-right:2px'>File name</span></label>\
							<div class='info-r'>\
								<input type='text' name='files' placeholder='Example: Test.zip or public/Test.zip' style='width:60%'/>\
								<button type='button' class='btn btn-info btn-sm' onclick=\"FilesRar(" + id + ",1)\">Decompression</button>\
								<p style='line-height: 26px; color: #666'>Only decompress .zip and tar.gz files</p>\
							</div>\
						</div>\
				      </form></div>";
	$("#webEdit-con").html(fileRarHtml)
}

function SetIndexEdit(id){
	$.get('/site.php?action=GetIndex&id='+id,function(rdata){
		rdata= rdata.replace(new RegExp(/(,)/g), "\n");
		var setIndexHtml = "<div class='webEdit-box padding-10'><form id='SetIndex'><div class='SetIndex'>\
				<div class='line'>\
						<textarea id='Dindex' name='files' style='margin-top: 2px; margin-bottom: 0px; height: 186px; width:50%; line-height:20px'>"+rdata+"</textarea>\
						<p style='line-height: 26px; color: #666'>The default document, one per line, has a priority from top to bottom.</p>\
						</br><button type='button' class='btn btn-info btn-sm' onclick='SetIndexList("+id+")'>Preservation</button>\
				</div>\
				</div></form></div>";
		$("#webEdit-con").html(setIndexHtml);
	});

}

function divcenter(){
	$(".layui-layer").css("position","absolute");
    var dw = $(window).width();
    var ow = $(".layui-layer").outerWidth();
    var dh = $(window).height();
    var oh = $(".layui-layer").outerHeight();
    var l = (dw - ow) / 2;
    var t = (dh - oh) / 2 > 0 ? (dh - oh) / 2 : 10;
    var lDiff = $(".layui-layer").offset().left - $(".layui-layer").position().left;
    var tDiff = $(".layui-layer").offset().top - $(".layui-layer").position().top;
    l = l + $(window).scrollLeft() - lDiff;
    t = t + $(window).scrollTop() - tDiff;
    $(".layui-layer").css("left",l + "px");
    $(".layui-layer").css("top",t + "px");
}

function webStop(wid, wname) {
	layer.open({
		type: 1,
	    title: "Deactivate site ["+wname+"]",
	    area: '350px',
	    closeBtn: 2,
	    shadeClose: true,
	    content:"<div class='zun-form-new webDelete'>\
	    	<p style='font-size:14px'>Once disabled, you won’t be able to access it. Are you sure you want to disable this site?</p>\
	    	<div class='submit-btn' style='margin-top:15px'>\
				<button type='button' id='web_end_time' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
		        <button type='button' id='web_del_send' class='btn btn-info btn-sm btn-title'  onclick=\"webStopPub('"+wid+"','"+wname+"')\">Determine</button>\
	        </div>\
	    </div>"
	})
}

function webStopPub(wid,wname){
	layer.closeAll();
	var loadT = layer.load();
	$.get("/site.php?action=SiteStop&id=" + wid + "&name=" + wname, function(ret) {
		if (ret['status'] == true) {
			layer.msg('Site is disabled', {
				icon: 1
			});
			getWeb(1);
		} else {
			layer.msg(ret.msg, {
				icon: 5
			});
		}
		layer.close(loadT);
	});
}

function webStart(wid, wname) {
	layer.open({
		type: 1,
	    title: "Enable site ["+wname+"]",
	    area: '350px',
	    closeBtn: 2,
	    shadeClose: true,
	    content:"<div class='zun-form-new webDelete'>\
	    	<p style='font-size:14px'>Are you sure you want to enable the site?</p>\
	    	<div class='submit-btn' style='margin-top:15px'>\
				<button type='button' id='web_end_time' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
		        <button type='button' id='web_del_send' class='btn btn-info btn-sm btn-title'  onclick=\"webStartPub('"+wid+"','"+wname+"')\">Determine</button>\
	        </div>\
	    </div>"
	})
}

function webStartPub(wid,wname){
	layer.closeAll();
	var loadT = layer.load();
	$.get("/site.php?action=SiteStart&id=" + wid + "&name=" + wname, function(ret) {
		if (ret['status'] == true) {
			layer.msg('Site has started', {
				icon: 1
			});
			getWeb(1);
		} else {
			layer.msg(ret.msg, {
				icon: 5
			});
		}
		layer.close(loadT);
	});
}

function webDelete(wid, wname){
	layer.open({
		type: 1,
	    title: "Delete site ["+wname+"]",
	    area: '350px',
	    closeBtn: 2,
	    shadeClose: true,
	    content:"<div class='zun-form-new webDelete'>\
	    	<p>Whether to delete the same name FTP, database, root directory</p>\
	    	<div class='options'>\
	    	<label><input type='checkbox' id='delftp' name='ftp'><span>FTP</span></label>\
	    	<label><input type='checkbox' id='deldata' name='data'><span>Database</span></label>\
	    	<label><input type='checkbox' id='delpath' name='path'><span>Root directory</span></label>\
	    	</div>\
			<div class='vcode'>Calculation results: <span class='text'></span>=<input type='text' id='vcodeResult' value=''></div>\
	    	<div class='submit-btn' style='margin-top:15px'>\
				<button type='button' id='web_end_time' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
		        <button type='button' id='web_del_send' class='btn btn-info btn-sm btn-title'  onclick=\"weball('"+wid+"','"+wname+"')\">Submit</button>\
	        </div>\
	    </div>"
	})
	randomSum()
}

function randomSum(){
	var a = Math.round(Math.random()*9+1);
	var b = Math.round(Math.random()*9+1);
	var sum = '';
	sum = a + b;
	$(".vcode .text").text(a+' + '+b);
	setCookie("vcodesum",sum);
	$("#vcodeResult").focus().keyup(function(e){
		if(e.keyCode == 13) $("#web_del_send").click();
	});
}
function weball(wid, wname){
	var sum = $("#vcodeResult").val();
	var ftp='',data='',path='';

	if($("#delftp").is(":checked")){
		ftp='&ftp=1';
	}
	if($("#deldata").is(":checked")){
		data='&data=1';
	}
	if($("#delpath").is(":checked")){
		path='&path=1';
	}
	if(navigator.cookieEnabled == false){
		layer.msg("Browser cookie function is disabled, please enable");
		return;
	}
	if(sum == undefined || sum ==''){
		layer.msg("Enter the calculation result, otherwise it cannot be deleted");
		return;
	}
	else{
		if(sum == getCookie("vcodesum")){
			var loadT = layer.load()
			$.get("/site.php?action=DeleteSite&id=" + wid + "&webname=" + wname+ftp+data+path, function(ret) {
				if (ret == true) {
					getWeb(1);
					layer.closeAll();
					layer.msg('Deleted successfully', {
						icon: 1
					});
				} else {
					layer.closeAll();
					layer.msg('Delete failed, please check if the site exists!', {
						icon: 5
					});
				}
			});
		}
		else{
			layer.msg("Calculation error, please recalculate");
			return;
		}
	}
}

function DomainEdit(id, name,msg) {
	$.get('/Ajax.php?action=getKey&tab=sites&key=domain&id=' + id, function(retuls) {
		var domain = retuls.split(',');
		var echoHtml = "";
		for (var i = 0; i < domain.length; i++) {
			var str = domain[i].split(':');
			if (str[1] == undefined) {
				str[1] = '80';
			}
			echoHtml += "<tr><td><a class='linkbed'>" + str[0] + "</a></td><td><a class='linkbed'>" + str[1] + "</a></td><td class='text-center'><a class='table-btn-del' href='javascript:;' onclick=\"delDomain(" + id + ",'" + name + "','" + str[0] + "','" + str[1] + "',1)\"><span class='glyphicon glyphicon-trash'></span></a></td></tr>";
		}
		var bodyHtml = "<div class='webEdit-box padding-10' style='display:block'>\
							<div class='divtable'>\
								<textarea id='newdomain'></textarea>\
								<input type='hidden' id='newport' value='80' />\
								<button type='button' class='btn btn-info btn-sm pull-right' style='margin:30px 35px 0 0' onclick=\"DomainAdd(" + id + ",'" + name + "',1)\">Add to</button>\
								<table class='table table-hover' width='100%' style='margin-bottom:0'>\
								<thead><tr><th>Domain name</th><th width='70px'>Port</th><th width='50px' class='text-center'>Action</th></tr></thead>\
								<tbody id='checkDomain'>" + echoHtml + "</tbody>\
								</table>\
							</div>\
						</div>";
		$("#webEdit-con").html(bodyHtml);
		if(msg != undefined){
			layer.msg(msg,{icon:1});
		}
		var placeholder = "<div class='placeholder'>Fill in one domain per line!<br>The default is port 80.<br>If the additional port format is www.domain.com:88</div>";
		$('#newdomain').after(placeholder);
		$(".placeholder").click(function(){
			$(this).hide();
			$('#newdomain').focus();
		})
		$('#newdomain').focus(function() {
		    $(".placeholder").hide();
		});

		$('#newdomain').blur(function() {
			if($(this).val().length==0){
				$(".placeholder").show();
			}
		});
		//checkDomain();
	});
}

function DomainRoot(id, name,msg) {
	$.get('/Ajax.php?action=getKey&tab=sites&key=domain&id=' + id, function(retuls) {
		var domain = retuls.split(',');
		var echoHtml = "";
		for (var i = 0; i < domain.length; i++) {
			var str = domain[i].split(':');

			if (str[1] == undefined) {
				str[1] = '80';
			}
			echoHtml += "<tr><td><a class='linkbed'>" + str[0] + "</a></td><td><a class='linkbed'>" + str[1] + "</a></td><td class='text-center'><a class='table-btn-del' href='javascript:;' onclick=\"delDomain(" + id + ",'" + name + "','" + str[0] + "','" + str[1] + "')\"><span class='glyphicon glyphicon-trash'></span></a></td></tr>";
		}
		var index = layer.open({
			type: 1,
			skin: 'demo-class',
			area: '450px',
			title: 'Domain management',
			closeBtn: 2,
			shift: 0,
			shadeClose: true,
			content: "<div class='divtable padding-10'>\
						<textarea id='newdomain'></textarea>\
						<input type='hidden' id='newport' value='80' />\
						<button type='button' class='btn btn-info btn-sm pull-right' style='margin:30px 35px 0 0' onclick=\"DomainAdd(" + id + ",'" + name + "')\">Add to</button>\
						<table class='table table-hover' width='100%' style='margin-bottom:0'>\
						<thead><tr><th>Domain name</th><th width='70px'>Port</th><th width='50px' class='text-center'>Action</th></tr></thead>\
						<tbody id='checkDomain'>" + echoHtml + "</tbody>\
						</table></div>"
		});
		if(msg != undefined){
			layer.msg(msg,{icon:1});
		}
		var placeholder = "<div class='placeholder'>Fill in one domain per line!<br>The default is port 80.<br>If the additional port format is www.domain.com:88</div>";
		$('#newdomain').after(placeholder);
		$(".placeholder").click(function(){
			$(this).hide();
			$('#newdomain').focus();
		})
		$('#newdomain').focus(function() {
		    $(".placeholder").hide();
		});

		$('#newdomain').blur(function() {
			if($(this).val().length==0){
				$(".placeholder").show();
			}
		});
		//checkDomain();
	});
}

function cancelSend(){
	$(".changeDomain,.changePort").hide().prev().show();
	$(".changeDomain,.changePort").remove();
}

function checkDomain() {
	$("#checkDomain tr").each(function() {
		var $this = $(this);
		var domain = $(this).find("td:first-child").text();
		$(this).find("td:first-child").append("<i class='lading'></i>");
		checkDomainWebsize($this,domain);
	})
}

function checkDomainWebsize(obj,domain){
	//var gurl = "http://api.zun.gd/ipaddess"
	var gurl = ""
	var ip = getCookie('iplist');
	var data = "domain=" + domain+"&ip="+ip;
	$.ajax({ url: gurl,data:data,type:"get",dataType:"jsonp",async:true ,success: function(rdata){
		obj.find("td:first-child").find(".lading").remove();
		if (rdata.code == -1) {
			obj.find("td:first-child").append("<i class='yf' data-title='The domain name is not resolved'>Unresolved</i>");
		} else {
			obj.find("td:first-child").append("<i class='f' data-title='The domain name resolution IP is: " + rdata.data.ip + "<br>Current server IP: " + rdata.data.main_ip + " (for reference only, users who use CDN please ignore)'>Parsed</i>");
		}

		obj.find("i").mouseover(function() {
			var tipsTitle = $(this).attr("data-title");
			layer.tips(tipsTitle, this, {
				tips: [1, '#3c8dbc'],
				time: 0
			})
		})
		obj.find("i").mouseout(function() {
			$(".layui-layer-tips").remove();
		})
	}})
}

function DomainAdd(id, webname,type) {
	var Domain = $("#newdomain").val().split("\n");
	var domainlist="";
	for(var i=0; i<Domain.length; i++){
		domainlist += Domain[i]+",";
	}
	domainlist = domainlist.substring(0,domainlist.length-1);
	var loadT = layer.load();
	var data = "domain=" + domainlist + "&webname=" + webname + "&id=" + id;
	$.post('/site.php?action=oneKeyAddDomain', data, function(retuls) {
		if (retuls >0) {
			$.get('/config.php?action=ServiceAdmin&name='+getCookie('serverType')+'&type=reload',function(){});
			var msg = 'Successfully added '+retuls+' new domain names!';
			if(type == 1){
				layer.close(loadT);
				DomainEdit(id,webname,msg)
			}else{
				layer.closeAll();
				DomainRoot(id,webname,msg);
			}

		} else {
			layer.close(loadT);
			layer.msg('Add failed, domain name already exists!', {
				icon: 5
			});
		}
	});
}

function delDomain(wid, wname, domain, port,type) {
	var num = $("#checkDomain").find("tr").length;
	if(num==1){
		layer.msg('The last domain name cannot be deleted!');
	}
	layer.confirm('Do you really want to remove this domain from the site?',{closeBtn:2}, function(index) {
			var url = "/site.php?action=DeleteDomain&id=" + wid + "&webname=" + wname + "&domain=" + domain + "&port=" + port;
			var loadT = layer.load();
			$.get(url, function(ret) {
				if (ret.status == 'true' || ret.status == true) {

					$.get('/config.php?action=ServiceAdmin&name='+getCookie('serverType')+'&type=reload',function(){});
					if(type == 1){
						layer.close(loadT);
						DomainEdit(wid,wname)
					}else{
						layer.closeAll();
						DomainRoot(wid, wname);
					}

					layer.msg(ret.msg, {
						icon: 1
					});

				} else {
					layer.msg(ret.msg, {
						icon: 5
					});
				}
				layer.close(loadT);
			});
	});
}

function IsDomain(domain) {
		//domain = 'http://'+domain;
		var re = new RegExp();
		re.compile("^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
		if (re.test(domain)) {
			return (true);
		} else {
			return (false);
		}
	}

function backupDel(bid, path, wname, file) {
		layer.confirm('Deleting the packaged file will not be recovered. Do you really want to delete this packaged file?',{closeBtn:2}, function(index) {
			if (index > 0) {
				var url = "/Web/delete_backup?id=" + bid + "&path=" + path + "&name=" + wname + "&file=" + file;
				var loadT = layer.load();
				$.get(url, function(ret) {
					if (ret == true) {
						layer.msg('File deleted successfully', {
							icon: 1
						});
						getWeb(1);
					} else {
						layer.msg('Failed to delete', {
							icon: 5
						});
					}
					layer.close(loadT);
				});
			}
		});
	}

function WebBackup(id, name) {
		var loadT =layer.msg('Packing, please wait...', {icon: 16,time:0});
		var data = "id="+id;
		$.post('/site.php?action=ToBackup', data, function(rdata) {
			if (rdata.status == true) {
				layer.closeAll();
				getBackup(id, name);
				layer.msg(rdata.msg, {
					icon: 1
				});
			} else {
				layer.close(loadT);
				layer.msg(rdata.msg, {
					icon: 5
				});
			}
		});
}

function WebBackupDelete(id,pid) {
	layer.confirm('Really want to delete the backup package?',{title:'Delete backup file',closeBtn:2},function(index){
		var loadT =layer.msg('Deleting, please wait...', {icon: 16,time:0});
		$.get('/site.php?action=DelBackup&id='+id, function(rdata) {
			layer.closeAll();
			layer.msg(rdata.msg,{icon:rdata.status?1:5});
			getBackup(pid);
		});
	})
}

function getBackup(id, mainDomain) {
	$.get('/Ajax.php?action=getFind&tab=sites&id=' + id, function(rdata) {
		var ftpdown = '';
		var index = layer.open({
			type: 1,
			skin: 'demo-class',
			area: '700px',
			title: 'Package backup',
			closeBtn: 2,
			shift: 0,
			shadeClose: true,
			content: "<form class='zun-form' id='WebBackup' style='max-width:98%'>\
						<button class='btn btn-default btn-sm' style='margin-right:10px' type='button' onclick=\"WebBackup('" + rdata.id + "','" + rdata.name + "')\">Package backup</button>\
						</form>\
						<div class='divtable' style='margin:17px'><table width='100%' id='WebBackupList' class='table table-hover'>\
						<thead><tr><th>File name</th><th>File size</th><th>Packing time</th><th width='140px' class='text-right'>Action</th></tr></thead>\
						<tbody id='WebBackupBody' class='list-list'></tbody>\
						</table></div>"
		});
		$.ajax({
			url: '/Ajax.php?action=getData&tab=backup&search=' + id + '&limit=10&p=1',
			async: true,
			success: function(frdata) {
				var body = '';
				for (var i = 0; i < frdata.data.length; i++) {
					if(frdata.data[i].type == '1') continue;
					var ftpdown = "<a class='link' href='/files.php?action=GetFileBytes&file="+frdata.data[i].filename+"&name="+frdata.data[i].name+"' target='_blank'>Download</a> | ";
					body += "<tr><td><span class='glyphicon glyphicon-file'></span>"+frdata.data[i].name+"</td>\
							<td>" + (ToSize(frdata.data[i].size)) + "</td>\
							<td>" + frdata.data[i].addtime + "</td>\
							<td class='text-right' style='color:#ccc'>"+ ftpdown + "<a class='link' href='javascript:;' onclick=\"WebBackupDelete('" + frdata.data[i].id + "',"+id+")\">Delete</a></td>\
						</tr>"
				}
				$("#WebBackupBody").html(body);
			}
		});
	});

}

function goSet(num) {
	var el = document.getElementsByTagName('input');
	var len = el.length;
	var data = '';
	var a = '';
	var count = 0;
	for (var i = 0; i < len; i++) {
		if (el[i].checked == true && el[i].value != 'on') {
			data += a + count + '=' + el[i].value;
			a = '&';
			count++;
		}
	}
	if(num==1){
		reAdd(data);
	}
	else if(num==2){
		shift(data);
	}
}
