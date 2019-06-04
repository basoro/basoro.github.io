/**
 * 取回网站数据列表
 * @param {Number} page   当前页
 * @param {String} search 搜索条件
 */
function getWeb(page, search) {
	search = search == undefined ? '':search;
	var sUrl = '/Ajax.php?action=getData&tojs=getWeb&tab=sites&limit=10&p=' + page + '&search=' + search;
	var loadT = layer.load();
	//取回数据
	$.get(sUrl, function(data) {
		layer.close(loadT);
		//构造数据列表
		var Body = '';
		for (var i = 0; i < data.data.length; i++) {
			//当前站点状态
			if (data.data[i].status == '正在运行' || data.data[i].status == '1') {
				var status = "<a href='javascript:;' title='停用这个站点' onclick=\"webStop(" + data.data[i].id + ",'" + data.data[i].name + "')\" class='btn-defsult'><span style='color:rgb(92, 184, 92)'>运行中    </span><span style='color:rgb(92, 184, 92)' class='glyphicon glyphicon-pause'></span></a>";
			} else {
				var status = "<a href='javascript:;' title='启用这个站点' onclick=\"webStart(" + data.data[i].id + ",'" + data.data[i].name + "')\" class='btn-defsult'><span style='color:red'>已停止    </span><span style='color:rgb(255, 0, 0);' class='glyphicon glyphicon-play'></span></a>";
			}

			//是否有备份
			if (data.data[i].backup_count > 0) {
				var backup = "<a href='javascript:;' class='link' onclick=\"getBackup(" + data.data[i].id + ",'" + data.data[i].name + "')\">有打包</a>";
			} else {
				var backup = "<a href='javascript:;' class='link' onclick=\"getBackup(" + data.data[i].id + ",'" + data.data[i].name + "')\">无打包</a>";
			}
			//是否设置有效期
			var web_end_time = (data.data[i].due_date == "0000-00-00") ? '永久' : data.data[i].due_date;
			//分割域名
			data.data[i].domain = data.data[i].domain == null?"":data.data[i].domain;
			var domain = data.data[i].domain.split(',');
			//表格主体
			Body += "<tr><td style='display:none'><input type='checkbox' name='id' value='" + data.data[i].id + "'></td>\
					<td><a class='link webtips' href='javascript:;' onclick=\"webEdit(" + data.data[i].id + ",'" + data.data[i].name + "','" + data.data[i].due_date + "','" + data.data[i].addtime + "')\">" + data.data[i].name + " (" + domain.length + ")</td>\
					<td>" + status + "</td>\
					<td>" + backup + "</td>\
					<td><a class='link' title='打开目录' href=\"javascript:openPath('"+data.data[i].path+"');\">" + data.data[i].path + "</a></td>\
					<td><a class='linkbed' href='javascript:;' data-id='"+data.data[i].id+"'>" + data.data[i].ps + "</a></td>\
					<td style='text-align:right; color:#bbb'>\
					<a href='javascript:;' class='link' onclick=\"webEdit(" + data.data[i].id + ",'" + data.data[i].name + "','" + data.data[i].due_date + "','" + data.data[i].addtime + "')\">修改 </a>\
                        | <a href='javascript:;' class='link' onclick=\"webDelete('" + data.data[i].id + "','" + data.data[i].name + "')\" title='删除站点'>删除</a>\
					</td></tr>"
		}
		//输出数据列表
		$("#webBody").html(Body);
		$(".btn-more").hover(function(){
			$(this).addClass("open");
		},function(){
			$(this).removeClass("open");
		});
		//输出分页
		$("#webPage").html(data.page);
		
		$(".linkbed").click(function(){
			var dataid = $(this).attr("data-id");
			var databak = $(this).text();
			if(databak=="空"){
				databak='';
			}
			$(this).hide().after("<input class='baktext' type='text' data-id='"+dataid+"' name='bak' value='" + databak + "' placeholder='备注信息' onblur='GetBakPost(\"sites\")' />");
			$(".baktext").focus();
		});
	});
}

//添加站点
function webAdd(type) {
	if (type == 1) {
		var array;
		var str="";
		var domainlist='';
		var domain = array = $("#mainDomain").val().split("\n");
		var Webport=[];
		var checkDomain = domain[0].split('.');
		
		if(domain[0].indexOf('*') != -1){
			layer.msg('主域名不能为泛解析!',{icon:5});
			return;
		}
		
		if(checkDomain.length < 1 || checkDomain[1].length < 1|| domain[0].length < 5){
			layer.msg('域名格式不正确，请重新输入!',{icon:5});
			return;
		}
		for(var i=1; i<domain.length; i++){
			domainlist += '"'+domain[i]+'",';
		}
		Webport = domain[0].split(":")[1];//主域名端口
		if(Webport==undefined){
			Webport="80";
		}
		domainlist = domainlist.substring(0,domainlist.length-1);//子域名json
		domain ='{"domain":"'+domain[0]+'","domainlist":['+domainlist+'],"count":'+domain.length+'}';//拼接joson
		var loadT = layer.load({
			shade: true,
			shadeClose: false
		});
		var data = $("#addweb").serialize()+"&port="+Webport+"&webname="+domain;
		$.post('/site.php?action=oneKeyAdd', data, function(ret) {
			var ftpData = '';
			if (ret.in_ftp) {
				ftpData = "<p class='p1'>FTP也帮你建好了</p>\
					 		<p>FTP地址:<strong>" + ret.ftpUrl + "</strong></p>\
					 		<p>账号:<strong>" + ret.ftpUserName + "</strong></p>\
					 		<p class='p1'>密码:<strong>" + ret.ftpPassword + "</strong></p>\
					 		<p>只要将网站上传至以上FTP即可访问!</p>"
			}
			var sqlData = '';
			if (ret.sql) {
				sqlData = "<p class='p1'>数据库也帮你建好了</p>\
					 		<p>数据库名:<strong>" + ret.sql.dataName + "</strong></p>\
					 		<p>账号:<strong>" + ret.sql.dataUser + "</strong></p>\
					 		<p class='p1'>密码:<strong>" + ret.sql.password + "</strong></p>"
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
					 		<h3>站点建立完成!</h3>\
					 		" + ftpData + sqlData + "\
					 	</div>\
					 	<div class='bottom-btn' style='text-align: center;'>\
					 		<a class='close-btn' onclick='layer.closeAll()'>关闭</a>\
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
		var php_version = "<div class='line'><label><span>PHP版本</span></label><select name='version' id='c_k3' style='width:100px'>";
		for(var i=rdata.length-1;i>=0;i--){
            php_version += "<option value='"+rdata[i].version+"'>"+rdata[i].name+"</option>";
        }
		php_version += "</select></div>";
		var index = layer.open({
			type: 1,
			skin: 'demo-class',
			area: '560px',
			title: '添加网站',
			closeBtn: 2,
			shift: 0,
			shadeClose: false,
			content: "<form class='zun-form-new' id='addweb'>\
						<div class='line'>\
		                    <label><span>域名</span></label>\
		                    <div class='info-r'>\
								<textarea id='mainDomain' name='webname'/></textarea>\
							</div>\
						</div>\
	                    <div class='line'>\
	                    <label><span>备注</span></label>\
	                    <div class='info-r'>\
	                    	<input id='Wbeizhu' type='text' name='bak' placeholder='网站备注' style='width:398px' />\
	                    </div>\
	                    </div>\
	                    <div class='line'>\
	                    <label><span>根目录</span></label>\
	                    <div class='info-r'>\
	                    	<input id='inputPath' type='text' name='path' value='"+defaultPath+"/' placeholder='网站根目录' style='width:398px' /><span class='glyphicon glyphicon-folder-open cursor' onclick='ChangePath(\"inputPath\")'></span>\
	                    </div>\
	                    </div>\
	                    <div class='line'>\
	                    	<label><span>FTP</span></label>\
	                    	<div class='info-r'>\
	                    	<select name='ftp' id='c_k1' style='width:100px'>\
		                    	<option value='true'>创建</option>\
		                    	<option value='false' selected>不创建</option>\
		                    </select>\
		                    </div>\
	                    </div>\
	                    <div class='line' id='ftpss'>\
	                    <label><span>FTP设置</span></label>\
	                    <div class='info-r'>\
		                    <div class='userpassword'><span>用户名：<input id='ftp-user' type='text' name='ftpuser' value='' style='width:150px' /></span>\
		                    <span class='last'>密码：<input id='ftp-password' type='text' name='ftppassword' value=''  style='width:150px' /></span></div>\
		                    <p>创建站点的同时，为站点创建一个对应FTP帐户，并且FTP目录指向站点所在目录。</p>\
	                    </div>\
	                    </div>\
	                    <div class='line'>\
	                    <label><span>数据库</span></label>\
		                    <select name='sql' id='c_k2' style='width:100px'>\
		                    	<option value='MySQL'>MySQL</option>\
		                    	<option value='false' selected>不创建</option>\
		                    </select>\
		                    <select name='codeing' id='c_codeing' style='width:100px'>\
		                    	<option value='utf8'>UTF-8</option>\
		                    	<option value='utf8mb4'>UTF8_MB4</option>\
								<option value='gbk'>GBK</option>\
								<option value='big5'>BIG5</option>\
		                    </select>\
	                    </div>\
	                    <div class='line' id='datass'>\
	                    <label><span>数据库设置</span></label>\
	                    <div class='info-r'>\
		                    <div class='userpassword'><span>用户名：<input id='data-user' type='text' name='datauser' value=''  style='width:150px' /></span>\
		                    <span class='last'>密码：<input id='data-password' type='text' name='datapassword' value=''  style='width:150px' /></span></div>\
		                    <p>创建站点的同时，为站点创建一个对应的数据库帐户，方便不同站点使用不同数据库。</p>\
	                    </div>\
	                    </div>\
						"+php_version+"\
	                    <div class='submit-btn'>\
							<button type='button' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>取消</button>\
							<button type='button' class='btn btn-success btn-sm btn-title' onclick=\"webAdd(1)\">提交</button>\
						</div>\
	                  </form>",
		});
		$(function() {
			var placeholder = "<div class='placeholder' style='top:10px;left:10px'>每行填写一个域名<br>默认为80端口<br>如另加端口格式为 www.domain.com:88</div>";
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
			
			
			//FTP账号数据绑定域名
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
					layer.msg('不要超出20个字符', {
						icon: 0
					});
				}
			})
			//获取当前时间时间戳，截取后6位
			var timestamp = new Date().getTime().toString();
			var dtpw = timestamp.substring(7);
			$("#data-user").val("sql" + dtpw);
	
			//生成n位随机密码
			function _getRandomString(len) {
				len = len || 32;
				var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1  
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
			//不创建
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
				//不创建
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

//修改网站目录
function webPathEdit(id){
	$.get("/Ajax.php?action=getKey&tab=sites&key=path&id="+id,function(rdata){
		$.get('/site.php?action=GetDirUserINI&path='+rdata,function(userini){
			var checkeds = userini.status?'checked':'';
			var webPathHtml = "<div class='webEdit-box padding-10'>\
						<div><input type='checkbox' name='userini' id='userini'"+checkeds+" /><label for='userini' style='font-weight:normal'>防跨站攻击</label></div>\
						<div class='line' style='margin-top:5px'>\
							<input type='text' style='width:90%' placeholder='网站根目录' value='"+rdata+"' name='webdir' id='inputPath'>\
							<span onclick='ChangePath(&quot;inputPath&quot;)' class='glyphicon glyphicon-folder-open cursor'></span>\
						</div>\
						<button class='btn btn-success btn-sm' onclick='SetSitePath("+id+")'>保存</button>\
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

//提交网站目录
function SetSitePath(id){
	var NewPath = $("#inputPath").val();
	var loadT = layer.msg('正在处理...',{icon:16,time:100000});
	$.post('/site.php?action=SetPath','id='+id+'&path='+NewPath,function(rdata){
		layer.close(loadT);
		var ico = rdata.status?1:5;
		layer.msg(rdata.msg,{icon:ico});
	});
}

//修改网站备注
function webBakEdit(id){
	$.get("/Ajax.php?action=getKey&tab=sites&key=ps&id="+id,function(rdata){
		var webBakHtml = "<div class='webEdit-box padding-10'>\
					<div class='line'>\
					<label><span>网站备注</span></label>\
					<div class='info-r'>\
					<textarea name='beizhu' id='webbeizhu' col='5' style='width:96%'>"+rdata+"</textarea>\
					<br><br><button class='btn btn-success btn-sm' onclick='SetSitePs("+id+")'>保存</button>\
					</div>\
					</div>";
		$("#webEdit-con").html(webBakHtml)
	});
}

//提交网站备注
function SetSitePs(id){
	var myPs = $("#webbeizhu").val();
	$.get('/Ajax.php?action=setPs&tab=sites&id='+id+'&ps='+myPs,function(rdata){
		layer.msg(rdata?"修改成功":"无需修改",{icon:rdata?1:5});
	});
}

/**
 * 文件解压
 * @param {int} id 网站标识
 */
function FilesRar(id,toServer){
	if(toServer == 1){
		var data = $("#FilesRar").serialize()+'&id='+id;
		var loadT = layer.msg('正在通信...',{icon:16,time:10000});
		$.get('/site.php?action=FilesZip',data,function(rdata){
			layer.closeAll();
			var ico = rdata.status?1:5;
			layer.msg(rdata.msg,{icon:ico});
		});
		return;
	}
	var fileRarHtml = "<div class='webEdit-box padding-10'><form id='FilesRar'>\
						<div class='line'>\
							<label><span style='padding-right:2px'>文件名</span></label>\
							<div class='info-r'>\
								<input type='text' name='files' placeholder='例：Test.zip 或  public/Test.zip' style='width:60%'/>\
								<button type='button' class='btn btn-success btn-sm' onclick=\"FilesRar(" + id + ",1)\">解压</button>\
								<p style='line-height: 26px; color: #666'>只支持.zip和tar.gz文件解压</p>\
							</div>\
						</div>\
				      </form></div>";
	$("#webEdit-con").html(fileRarHtml)
}

//设置默认文档
function SetIndexEdit(id){
	$.get('/site.php?action=GetIndex&id='+id,function(rdata){
		rdata= rdata.replace(new RegExp(/(,)/g), "\n");
		var setIndexHtml = "<div class='webEdit-box padding-10'><form id='SetIndex'><div class='SetIndex'>\
				<div class='line'>\
						<textarea id='Dindex' name='files' style='margin-top: 2px; margin-bottom: 0px; height: 186px; width:50%; line-height:20px'>"+rdata+"</textarea>\
						<p style='line-height: 26px; color: #666'>默认文档，每行一个，优先级由上至下。</p>\
						</br><button type='button' class='btn btn-success btn-sm' onclick='SetIndexList("+id+")'>保存</button>\
				</div>\
				</div></form></div>";
		$("#webEdit-con").html(setIndexHtml);
	});
	
}

//设置上下左右居中
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

/**
 * 停止一个站点
 * @param {Int} wid  网站ID
 * @param {String} wname 网站名称
 */
function webStop(wid, wname) {
	layer.open({
		type: 1,
	    title: "停用站点["+wname+"]",
	    area: '350px',
	    closeBtn: 2,
	    shadeClose: true,
	    content:"<div class='zun-form-new webDelete'>\
	    	<p style='font-size:14px'>停用后将无法访问，确定停用这个站点吗？</p>\
	    	<div class='submit-btn' style='margin-top:15px'>\
				<button type='button' id='web_end_time' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>取消</button>\
		        <button type='button' id='web_del_send' class='btn btn-success btn-sm btn-title'  onclick=\"webStopPub('"+wid+"','"+wname+"')\">确定</button>\
	        </div>\
	    </div>"
	})
}
function webStopPub(wid,wname){
	layer.closeAll();
	var loadT = layer.load();
	$.get("/site.php?action=SiteStop&id=" + wid + "&name=" + wname, function(ret) {
		if (ret['status'] == true) {
			layer.msg('站点已停用', {
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

/**
 * 启动一个网站
 * @param {Number} wid 网站ID
 * @param {String} wname 网站名称
 */
function webStart(wid, wname) {
	layer.open({
		type: 1,
	    title: "启用站点["+wname+"]",
	    area: '350px',
	    closeBtn: 2,
	    shadeClose: true,
	    content:"<div class='zun-form-new webDelete'>\
	    	<p style='font-size:14px'>是否确定启用站点？</p>\
	    	<div class='submit-btn' style='margin-top:15px'>\
				<button type='button' id='web_end_time' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>取消</button>\
		        <button type='button' id='web_del_send' class='btn btn-success btn-sm btn-title'  onclick=\"webStartPub('"+wid+"','"+wname+"')\">确定</button>\
	        </div>\
	    </div>"
	})
}

function webStartPub(wid,wname){
	layer.closeAll();
	var loadT = layer.load();
	$.get("/site.php?action=SiteStart&id=" + wid + "&name=" + wname, function(ret) {
		if (ret['status'] == true) {
			layer.msg('站点已启动', {
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

/**
 * 删除一个网站
 * @param {Number} wid 网站ID
 * @param {String} wname 网站名称
 */
function webDelete(wid, wname){
	layer.open({
		type: 1,
	    title: "删除站点["+wname+"]",
	    area: '350px',
	    closeBtn: 2,
	    shadeClose: true,
	    content:"<div class='zun-form-new webDelete'>\
	    	<p>是否要删除的同名FTP、数据库、根目录</p>\
	    	<div class='options'>\
	    	<label><input type='checkbox' id='delftp' name='ftp'><span>FTP</span></label>\
	    	<label><input type='checkbox' id='deldata' name='data'><span>数据库</span></label>\
	    	<label><input type='checkbox' id='delpath' name='path'><span>根目录</span></label>\
	    	</div>\
			<div class='vcode'>计算结果：<span class='text'></span>=<input type='text' id='vcodeResult' value=''></div>\
	    	<div class='submit-btn' style='margin-top:15px'>\
				<button type='button' id='web_end_time' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>取消</button>\
		        <button type='button' id='web_del_send' class='btn btn-success btn-sm btn-title'  onclick=\"weball('"+wid+"','"+wname+"')\">提交</button>\
	        </div>\
	    </div>"
	})
	randomSum()
}
//随机生成验证计算
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
		layer.msg("浏览器cookie功能被禁用，请启用");
		return;
	}
	if(sum == undefined || sum ==''){
		layer.msg("输入计算结果，否则无法删除");
		return;
	}
	else{
		if(sum == getCookie("vcodesum")){
			var loadT = layer.load()
			$.get("/site.php?action=DeleteSite&id=" + wid + "&webname=" + wname+ftp+data+path, function(ret) {
				if (ret == true) {
					getWeb(1);
					layer.closeAll();
					layer.msg('已成功删除', {
						icon: 1
					});
				} else {
					layer.closeAll();
					layer.msg('删除失败,请检查站点是否存在!', {
						icon: 5
					});
				}
			});
		}
		else{
			layer.msg("计算错误，请重新计算");
			return;
		}
	}
}

/**
 * 域名管理
 * @param {Int} id 网站ID
 */
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
								<button type='button' class='btn btn-success btn-sm pull-right' style='margin:30px 35px 0 0' onclick=\"DomainAdd(" + id + ",'" + name + "',1)\">添加</button>\
								<table class='table table-hover' width='100%' style='margin-bottom:0'>\
								<thead><tr><th>域名</th><th width='70px'>端口</th><th width='50px' class='text-center'>操作</th></tr></thead>\
								<tbody id='checkDomain'>" + echoHtml + "</tbody>\
								</table>\
							</div>\
						</div>";
		$("#webEdit-con").html(bodyHtml);
		if(msg != undefined){
			layer.msg(msg,{icon:1});
		}
		var placeholder = "<div class='placeholder'>每行填写一个域名!<br>默认为80端口<br>如另加端口格式为 www.domain.com:88</div>";
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
			title: '域名管理',
			closeBtn: 2,
			shift: 0,
			shadeClose: true,
			content: "<div class='divtable padding-10'>\
						<textarea id='newdomain'></textarea>\
						<input type='hidden' id='newport' value='80' />\
						<button type='button' class='btn btn-success btn-sm pull-right' style='margin:30px 35px 0 0' onclick=\"DomainAdd(" + id + ",'" + name + "')\">添加</button>\
						<table class='table table-hover' width='100%' style='margin-bottom:0'>\
						<thead><tr><th>域名</th><th width='70px'>端口</th><th width='50px' class='text-center'>操作</th></tr></thead>\
						<tbody id='checkDomain'>" + echoHtml + "</tbody>\
						</table></div>"
		});
		if(msg != undefined){
			layer.msg(msg,{icon:1});
		}
		var placeholder = "<div class='placeholder'>每行填写一个域名!<br>默认为80端口<br>如另加端口格式为 www.domain.com:88</div>";
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
//编辑域名/端口
function cancelSend(){
	$(".changeDomain,.changePort").hide().prev().show();
	$(".changeDomain,.changePort").remove();
}
//遍历域名
function checkDomain() {
	$("#checkDomain tr").each(function() {
		var $this = $(this);
		var domain = $(this).find("td:first-child").text();
		$(this).find("td:first-child").append("<i class='lading'></i>");
		checkDomainWebsize($this,domain);
	})
}
//检查域名是否解析备案
function checkDomainWebsize(obj,domain){
	var gurl = "http://api.zun.gd/ipaddess"
	var ip = getCookie('iplist');
	var data = "domain=" + domain+"&ip="+ip;
	$.ajax({ url: gurl,data:data,type:"get",dataType:"jsonp",async:true ,success: function(rdata){
		obj.find("td:first-child").find(".lading").remove();
		if (rdata.code == -1) {
			obj.find("td:first-child").append("<i class='yf' data-title='该域名未解析'>未解析</i>");
		} else {
			obj.find("td:first-child").append("<i class='f' data-title='域名解析IP为：" + rdata.data.ip + "<br>当前服务器IP：" + rdata.data.main_ip + "(仅供参考,使用CDN的用户请无视)'>已解析</i>");
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

/**
 * 添加域名
 * @param {Int} id  网站ID
 * @param {String} webname 主域名
 */
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
			var msg = '成功添加'+retuls+'个新域名!';
			if(type == 1){
				layer.close(loadT);
				DomainEdit(id,webname,msg)
			}else{
				layer.closeAll();
				DomainRoot(id,webname,msg);
			}
			
		} else {
			layer.close(loadT);
			layer.msg('添加失败,域名已存在!', {
				icon: 5
			});
		}
	});
}

/**
 * 删除域名
 * @param {Number} wid 网站ID
 * @param {String} wname 主域名
 * @param {String} domain 欲删除的域名
 * @param {Number} port 对应的端口
 */
function delDomain(wid, wname, domain, port,type) {
	var num = $("#checkDomain").find("tr").length;
	if(num==1){
		layer.msg('最后一个域名不能删除！');
	}
	layer.confirm('您真的要从站点中删除这个域名吗？',{closeBtn:2}, function(index) {
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

/**
 * 判断IP/域名格式
 * @param {String} domain  源文本
 * @return bool
 */
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
/**
 * 删除备份
 * @param {Number} bid  文件ID
 * @param {String} path 目录
 * @param {String} wname 网站名称
 * @param {String} file 文件名
 */
function backupDel(bid, path, wname, file) {
		layer.confirm('删除打包文件将无法恢复，您真的要删除这份打包文件吗？',{closeBtn:2}, function(index) {
			if (index > 0) {
				var url = "/Web/delete_backup?id=" + bid + "&path=" + path + "&name=" + wname + "&file=" + file;
				var loadT = layer.load();
				$.get(url, function(ret) {
					if (ret == true) {
						layer.msg('文件删除成功', {
							icon: 1
						});
						getWeb(1);
					} else {
						layer.msg('删除失败', {
							icon: 5
						});
					}
					layer.close(loadT);
				});
			}
		});
	}



/**
 *设置数据库备份
 * @param {Number} sign	操作标识
 * @param {Number} id	编号
 * @param {String} name	主域名
 */
function WebBackup(id, name) {
		var loadT =layer.msg('正在打包，请稍候...', {icon: 16,time:0});
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

/**
 *删除网站备份
 * @param {Number} webid	网站编号
 * @param {Number} id	文件编号
 * @param {String} name	主域名
 */
function WebBackupDelete(id,pid) {
	layer.confirm('真的要删除备份包吗?',{title:'删除备份文件',closeBtn:2},function(index){
		var loadT =layer.msg('正在删除，请稍候...', {icon: 16,time:0});
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
			title: '打包备份',
			closeBtn: 2,
			shift: 0,
			shadeClose: true,
			content: "<form class='zun-form' id='WebBackup' style='max-width:98%'>\
						<button class='btn btn-default btn-sm' style='margin-right:10px' type='button' onclick=\"WebBackup('" + rdata.id + "','" + rdata.name + "')\">打包备份</button>\
						</form>\
						<div class='divtable' style='margin:17px'><table width='100%' id='WebBackupList' class='table table-hover'>\
						<thead><tr><th>文件名称</th><th>文件大小</th><th>打包时间</th><th width='140px' class='text-right'>操作</th></tr></thead>\
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
					var ftpdown = "<a class='link' href='/files.php?action=GetFileBytes&file="+frdata.data[i].filename+"&name="+frdata.data[i].name+"' target='_blank'>下载</a> | ";
					body += "<tr><td><span class='glyphicon glyphicon-file'></span>"+frdata.data[i].name+"</td>\
							<td>" + (ToSize(frdata.data[i].size)) + "</td>\
							<td>" + frdata.data[i].addtime + "</td>\
							<td class='text-right' style='color:#ccc'>"+ ftpdown + "<a class='link' href='javascript:;' onclick=\"WebBackupDelete('" + frdata.data[i].id + "',"+id+")\">删除</a></td>\
						</tr>"
				}
				$("#WebBackupBody").html(body);
			}
		});
	});

}

function goSet(num) {
	//取选中对象
	var el = document.getElementsByTagName('input');
	var len = el.length;
	var data = '';
	var a = '';
	var count = 0;
	//构造POST数据
	for (var i = 0; i < len; i++) {
		if (el[i].checked == true && el[i].value != 'on') {
			data += a + count + '=' + el[i].value;
			a = '&';
			count++;
		}
	}
	//判断操作类别
	if(num==1){
		reAdd(data);
	}
	else if(num==2){
		shift(data);
	}
}
