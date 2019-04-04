function getFtp(page,search) {
	search = search == undefined ? '':search;
	var sUrl = '/Ajax.php?action=getData&tojs=getFtp&tab=ftps&limit=10&p='+page+'&search='+search;
	var loadT = layer.load();
	$.get(sUrl, function(data){
		layer.close(loadT);
		var Body = '';
		for (var i = 0; i < data.data.length; i++) {
			if(data.data[i].status == '1'){
				var ftp_status = "<a href='javascript:;' title='Stop this account' onclick=\"ftpStop("+data.data[i].id+",'"+data.data[i].name+"')\"><span style='color:#3498DB'>Activated </span> <span style='color:#3498DB' class='glyphicon glyphicon-pause'></span></a>";
			}else{
				var ftp_status = "<a href='javascript:;' title='Enable this account' onclick=\"ftpStart("+data.data[i].id+",'"+data.data[i].name+"')\"><span style='color:red'>Terminated </span> <span style='color:red;' class='glyphicon glyphicon-play'></span></a>";;
			}
			Body +="<tr><td style='display:none'><input type='checkbox' name='id' value='"+data.data[i].id+"'></td>\
					<td>"+data.data[i].name+"</td>\
					<td class='relative'><span class='password' data-pw='"+data.data[i].password+"'>**********</span><span class='glyphicon glyphicon-eye-open cursor pw-ico' style='margin-left:10px'></span><span class='ico-copy cursor btcopy' style='margin-left:10px' title='Copy password' data-pw='"+data.data[i].password+"'></span></td>\
					<td>"+ftp_status+"</td>\
					<td><a class='link' title='Open Directory' href=\"javascript:openPath('"+data.data[i].path+"');\">"+data.data[i].path+"</a></td>\
					<td><a class='linkbed' href='javascript:;' data-id='"+data.data[i].id+"'>" + data.data[i].ps + "</a></td>\
					<td style='text-align:right; color:#bbb'>\
                       <a href='javascript:;' class='link' onClick=\"ftpEditSet("+data.data[i].id+",'"+data.data[i].name+"','"+data.data[i].password+"')\">Change </a>\
                        | <a href='javascript:;' class='link' onclick=\"ftpDelete('"+data.data[i].id+"','"+data.data[i].name+"')\" title='Delete FTP'>Delete</a>\
                    </td></tr>"
		}
		$("#ftpBody").html(Body);
		$("#ftpPage").html(data.page);
		$(".linkbed").click(function(){
			var dataid = $(this).attr("data-id");
			var databak = $(this).text();
			$(this).hide().after("<input class='baktext' type='text' data-id='"+dataid+"' name='bak' value='" + databak + "' placeholder='Remarks' onblur='GetBakPost(\"ftps\")' />");
			$(".baktext").focus();
		});
		btcopy();
		showHidePwd();
	});
}

function ftpAdd(type) {
	if (type == 1) {
		var loadT = layer.load({
			shade: true,
			shadeClose: false
		});
		var data = $("#ftpAdd").serialize();
		$.post('/ftp.php?action=AddUser', data, function(rdata) {
			if (rdata.status) {
				getFtp(1);
				layer.closeAll();
				layer.msg(rdata.msg, {
					icon: 1
				});
			} else {
				getFtp(1);
				layer.closeAll();
				layer.msg(rdata.msg, {
					icon: 5
				});
			}
		});
		return true;
	}
	var defaultPath = $("#defaultPath").html();
	var index = layer.open({
		type: 1,
		skin: 'demo-class',
		area: '500px',
		title: 'Add an FTP account',
		closeBtn: 2,
		shift: 5,
		shadeClose: false,
		content: "<form class='zun-form-new' id='ftpAdd'>\
					<div class='line'>\
					<label><span>Username</span></label>\
					<div class='info-r'><input type='text' id='ftpUser' name='ftp_username' style='width:340px' /></div>\
					</div>\
					<div class='line'>\
					<label><span>Password</span></label>\
					<div class='info-r'><input type='text' name='ftp_password' id='MyPassword' style='width:340px' value='"+(RandomStrPwd(10))+"' /><span title='Random code' class='glyphicon glyphicon-repeat cursor' onclick='repeatPwd(10)'></span></div>\
					</div>\
					<div class='line'>\
					<label><span>Directory</span></label>\
					<div class='info-r'><input id='inputPath' type='text' name='path' value='"+defaultPath+"/' placeholder='The root directory of the account will automatically create a directory with the same name'  style='width:340px' /><span class='glyphicon glyphicon-folder-open cursor' onclick='ChangePath(\"inputPath\")'></span><p>Directory pointed to by FTP</p></div>\
					</div>\
                    <div class='line' style='display:none'>\
					<label><span>Remarks</span></label>\
					<div class='info-r'>\
					<input type='text' name='ps' value='' placeholder='Remarks (less than 255 characters)' />\
					</div></div>\
					<div class='submit-btn'>\
						<button type='button' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
				        <button type='button' class='btn btn-success btn-sm btn-title' onclick=\"ftpAdd(1)\" >Submit</button>\
			        </div>\
			      </form>"
	});


	$("#ftpUser").keyup(function()
	{
		var ftpName = $(this).val();
		if($("#inputPath").val().substr(0,defaultPath.length) == defaultPath) $("#inputPath").val(defaultPath+'/'+ftpName);
	});
}

function ftpDelete(id,ftp_username){
	layer.open({
		type: 1,
	    title: "Delete ["+ftp_username+"]",
	    area: '350px',
	    closeBtn: 2,
	    shadeClose: true,
	    content:"<div class='zun-form-new webDelete'>\
	    	<p>Do you really want to delete it? </p>\
			<div class='vcode'>Calculation results: <span class='text'></span>=<input type='text' id='vcodeResult' value=''></div>\
	    	<div class='submit-btn' style='margin-top:15px'>\
				<button type='button' id='web_end_time' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
		        <button type='button' id='web_del_send' class='btn btn-info btn-sm btn-title'  onclick=\"ftpall('"+id+"','"+ftp_username+"')\">Submit</button>\
	        </div>\
	    </div>"
	})
	randomSum();
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

function ftpall(id,ftp_username){
	var sum = $("#vcodeResult").val();
	if(!(document.cookie || navigator.cookieEnabled)){
		layer.msg("Browser cookie function is disabled, please enable");
		return;
	}
	if(sum == undefined || sum ==''){
		layer.msg("Enter the calculation result, otherwise it cannot be deleted");
		return;
	}
	else{
		if(sum == getCookie("vcodesum")){
			var loadT = layer.load();
			$.get('/ftp.php?action=DeleteUser&id='+id+'&username='+ftp_username,function(rdata){
				layer.closeAll();
				if(rdata['status'] == true){
					getFtp(1);
					layer.msg(rdata.msg,{icon:1});
				}else{
					layer.msg(rdata.msg,{icon:5});
				}
			});
		}
		else{
			layer.msg("Calculation error, please recalculate");
			return;
		}
	}
}

function SyncTo()
{
	var index = layer.open({
			type: 1,
			skin: 'demo-class',
			area: '300px',
			title: 'Synchronous FTP',
			closeBtn: 2,
			shift: 5,
			shadeClose: false,
			content: "<br><button class='btn btn-default' onclick='goSet(1)'>Synchronize selected users</button><br><br>\
						<button class='btn btn-default' onclick='FtpToLocal()'>Sync all users</button><br><br>\
						<button class='btn btn-default' onclick='FtpToCloud()'>Get the user on the server</button><br><br>"
		});
}

function FtpToLocal(){
	layer.confirm('Synchronize the FTP list to the server?', {
		title:false,
		closeBtn:2,
	    time: 0,
	    btn: ['Determine', 'Cancel']
    },function(){
		var loadT =layer.msg('Connecting to server, please wait...', {icon: 16,time:20000});
		$.get('/Api/SyncData?arg=FtpToLocal',function(rdata){
			layer.closeAll();
			layer.msg(rdata.msg,{icon:rdata.status?1:5});
		})
	 },function(){
    	layer.closeAll();
    });
}

function FtpToCloud(){
	layer.confirm('Are you sure you want to get it? ', {
		title:false,
		closeBtn:2,
        time: 0,
        btn: ['Determine', 'Cancel']
    },function(){
    	var loadT =layer.msg('Connecting to server, please wait...', {icon: 16,time:20000});
		$.get('/Api/SyncData?arg=FtpToCloud',function(rdata){
			layer.closeAll();
			layer.msg(rdata.msg,{icon:rdata.status?1:5});
		})
    },function(){
    	layer.closeAll();
    });
}

function goSet(num){
	var el = document.getElementsByTagName('input');
	var len = el.length;
	var data='';
	var a = '';
	var count = 0;
	for(var i=0;i<len;i++){
		if(el[i].checked == true && el[i].value != 'on'){
			data += a+count+'='+el[i].value;
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

function reAdd(data,type){
	if(data == ''){
		layer.msg('Please select at least one FTP account as the operation object',{icon:5});
		return;
	}
	if(type == 1){
		var ssid = $("#server").prop('value');
		data = data+'&ssid='+ssid;
		var str = 'Transferring an FTP account is irreversible. Do you really want to transfer the selected FTP account to the target server?';
	}else{
		var str = 'The FTP account you selected will be re-added. If the FTP account already exists on the server, this operation will fail! Do you really want to sync?';
	}
	layer.confirm(str,{closeBtn:2}, function(index) {
		if(index <= 0){
			layer.closeAll();
			return;
		}
		var loadT=layer.load({shade:true,shadeClose:false});
		$.post('/Ftp/reAdd',data,function(retuls){
			if(retuls > 0){
				layer.closeAll();
				layer.msg('Successfully processed '+retuls+' FTP account',{icon:1});
			}else{
				layer.closeAll();
				layer.msg('Operation failed, the FTP already exists!',{icon:5});
			}

		});
	});
}

function ftpStop(id, username) {
	layer.open({
		type: 1,
	    title: "Disable FTP ["+username+"]",
	    area: '350px',
	    closeBtn: 2,
	    shadeClose: true,
	    content:"<div class='zun-form-new webDelete'>\
	    	<p style='font-size:14px'>You really want to stop " + username + " FTP?</p>\
	    	<div class='submit-btn' style='margin-top:15px'>\
				<button type='button' id='web_end_time' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
		        <button type='button' id='web_del_send' class='btn btn-info btn-sm btn-title'  onclick=\"ftpStopPub('"+id+"','"+username+"')\">Determine</button>\
	        </div>\
	    </div>"
	})
}
function ftpStopPub(id,username){
	layer.closeAll();
	var loadT = layer.load();
	$.get('/ftp.php?action=SetStatus&id=' + id + '&username=' + username + '&status=0', function(ret) {
		if (ret['status'] == true) {
			layer.msg(ret.msg, {icon: 1});
			getFtp(1);
		} else {
			layer.msg(ret.msg, {icon: 5});
		}
		layer.close(loadT);
	});
}

function ftpStart(id, username) {
	var loadT = layer.load({shade: true,shadeClose: false});
	$.get('/ftp.php?action=SetStatus&id=' + id + '&username=' + username + '&status=1', function(rdata) {
		layer.close(loadT);
		if (rdata.status == true) {
			layer.msg(rdata.msg, {icon: 1});
			getFtp(1);
		} else {
			layer.msg(rdata.msg, {icon: 5});
		}
	});
}

function ftpEditSet(id, username, passwd) {
	if (id != undefined) {
		var index = layer.open({
			type: 1,
			skin: 'demo-class',
			area: '300px',
			title: 'Modify the FTP user password.',
			closeBtn: 2,
			shift: 5,
			shadeClose: false,
			content: "<form class='zun-form-new' id='ftpEditSet'>\
						<div class='line'>\
						<input type='hidden' name='id' value='" + id + "'/>\
						<input type='hidden' name='ftp_username' value='" + username + "'/>\
						<label><span>Username:</span></label><div class='info-r'><input  type='text' name='myusername' value='" + username + "' disabled /></div></div>\
						<div class='line'>\
						<label><span>New password:</span></label><div class='info-r'><input  type='text' name='new_password' value='" + passwd + "' /></div>\
						</div>\
				        <div class='submit-btn'>\
							<button type='button' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
					        <button type='button' class='btn btn-info btn-sm btn-title' onclick='ftpEditSet()' >Submit</button>\
				        </div>\
				      </form>"
		});
	} else {
		layer.confirm("Are you sure you want to change the password for this FTP account?", {
			title: 'FTP service',
			closeBtn:2
		}, function(index) {
			if (index > 0) {
				var loadT = layer.load({
					shade: true,
					shadeClose: false
				});
				var data = $("#ftpEditSet").serialize();
				$.post('/ftp.php?action=SetUserPassword', data, function(rdata) {
					if (rdata == true) {
						getFtp(1);
						layer.closeAll();
						layer.msg('操作成功', {
							icon: 1
						});
					} else {
						getFtp(1);
						layer.closeAll();
						layer.msg('操作失败', {
							icon: 5
						});
					}

				});
			}
		});
	}
}

function ftpPortEdit(port) {
	layer.open({
		type: 1,
		skin: 'demo-class',
		area: '300px',
		title: 'Modify the FTP port',
		closeBtn: 2,
		shift: 5,
		shadeClose: false,
		content: "<form class='zun-form-new' id='ftpEditSet'>\
					<div class='line'><input id='ftp_port' type='text' name='ftp_port' value='" + port + "' /></div>\
			        <div class='submit-btn'>\
						<button type='button' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
				        <button id='poseFtpPort' type='button' class='btn btn-info btn-sm btn-title'>Submit</button>\
			        </div>\
			      </form>"
	});
	 $("#poseFtpPort").click(function(){
	 	var NewPort = $("#ftp_port").val();
	 	ftpPortPost(NewPort);
	 })
}

function ftpPortPost(port){
	layer.closeAll();
	var loadT = layer.load(2);
	$.get('/ftp.php?action=setPort&port=' + port, function(rdata) {
			if (rdata.status == true) {
				layer.msg(rdata.msg, {
					icon: 1
				});
				refresh();
			} else {
				layer.msg(rdata.msg, {
					icon: 5
				});
			}
			layer.close(loadT);
		});
}
