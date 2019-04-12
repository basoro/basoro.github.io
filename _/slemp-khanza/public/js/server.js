function junk() {
		var gurl = "/Clear/getSize?type=all";
		var body = "";
		$(".junk .box-con").html("<span class='loading'></span>");
		$.ajax({ url: gurl,type:"get",async:true ,success: function(rdata){
			body = "<p>System temporary file: <span id='systemsize'>" + rdata.System_temp + " MB</span><span class='btn btn-del btn-xs' onclick=\"delTemp('system')\">Clear</span></p>\
						<p>User temporary file: <span id='usersize'>" + rdata.User_temp + " MB</span><span class='btn btn-del btn-xs' onclick=\"delTemp('user')\">Clear</span></p>\
						<p>IE temporary file: <span id='iesize'>" + rdata.Ie_temp + " MB</span><span class='btn btn-del btn-xs' onclick=\"delTemp('ie')\">Clear</span></p>\
						<p>Cookie：<span id='cookiesize'>" + rdata.Cookie_temp + " MB</span><span class='btn btn-del btn-xs' onclick=\"delTemp('cookie')\">Clear</span></p>";
			$(".junk .box-con").html(body);
			$(".junk .box-con p").hide();
			var num = $(".junk p").size();
			for (var i = 0; i < num; i++) {
				setTimeout("$('.junk p').eq(" + i + ").fadeIn(1000);", i * 100);
			}

		}});
	}

function delTemp(type) {
		var data = "type=" + type;
		$.get('/Clear/delTemp', data, function(rdata) {
			if (rdata.status == "true") {
				layer.msg("Cleared successfully", {
					icon: 1
				});
			}
		});
		junk();
	}

function userSafe() {
	var gurl = "/clear/testIng?type=user";
	var body = "";
	$(".system-check .user-safe .box-con").html("<i class='loading'></i>");
	$.ajax({ url: gurl,type:"get",async:true ,success: function(rdata){
		var userlist = "";
		for (var i = 0; i < rdata.user.length; i++) {
			if (rdata.user[i].UserName == "Administrator" || rdata.user[i].UserName == "administrator") {
				if(rdata.user[i].Disable==false){
					userlist += "<p class='yellow'><a class='name' data-title='The default administrator name has not been modified and is vulnerable to hacker hacking! Click Rename to modify.'>" + rdata.user[i].UserName + "</a><span class='btn btn-info btn-xs' onclick=\"changeAdminName('"+rdata.user[i].UserName+"')\">改名</span><span class='btn btn-info btn-xs' onclick=\"disabledAdmin('"+rdata.user[i].UserName+"')\">Disable</span><span class='btn btn-del btn-xs' onclick=\"delAdmin('"+rdata.user[i].UserName+"')\">Delete</span></p>";
				}
				else{
					userlist += "<p class='yellow'><a class='name' data-title='The default administrator name has not been modified and is vulnerable to hacker hacking! Click Rename to modify.'>" + rdata.user[i].UserName + "</a><span class='btn btn-info btn-xs' onclick=\"enableAdmin('"+rdata.user[i].UserName+"')\">Enable</span></p>";
				}
			} else {
				if(rdata.user[i].Disable==false){
					userlist += "<p><a class='name'>" + rdata.user[i].UserName + "</a><span class='btn btn-info btn-xs' onclick=\"changeAdminName('"+rdata.user[i].UserName+"')\">Rename</span><span class='btn btn-info btn-xs' onclick=\"disabledAdmin('"+rdata.user[i].UserName+"')\">Disable</span><span class='btn btn-del btn-xs' onclick=\"delAdmin('"+rdata.user[i].UserName+"')\">Delete</span></p>";
				}
				else{
					userlist += "<p><a class='name' data-title='The account is disabled'>" + rdata.user[i].UserName + "</a><span class='btn btn-info btn-xs' onclick=\"enableAdmin('"+rdata.user[i].UserName+"')\">Enable</span></p>";
				}
			}
		}
		body = "<p>Number of administrators: " + rdata.count + "</p>" + userlist;
		$(".system-check .user-safe .box-con").html(body).hide().fadeIn(1000);
		$('.user-safe .box-con p a').mouseover(function(){
			var tipstitle = $(this).attr("data-title");
		    layer.tips(tipstitle, this, {
			    tips: [1, '#3c8dbc'],
			    time:0
			});
		});
		$('.user-safe .box-con p a').mouseout(function(){
			$(".layui-layer-tips").remove();
		});
	}});
}

function changeAdminNameGo(name){
	var newName = $(".usernewName").val();
	var gurl = "/clear/testIng?type=userName&name="+name+"&newName="+newName;
	$.get(gurl,function(rdata){
		if(rdata.status == true){
			userSafe();
			layer.msg('Username changed successfully', {icon: 1});
		}
		else{
			layer.msg(rdata.msg, {icon: 5});
		}
	});
	layer.closeAll();
}

function changeAdminName(name){
	var index = layer.open({
		type: 1,
		area: '350px',
		title: 'Change admin user name',
		closeBtn: 2,
		shift: 5,
		shadeClose: false,
		content: "<div class='zun-form-new changename'>\
			<div class='line'>\
				<input class='usernewName' type='text' value='"+name+"'>\
			</div>\
			<div class='submit-btn'>\
				<button type='button' class='btn btn-danger btn-sm btn-title' onclick='layer.closeAll()'>Cancel</button>\
		        <button type='button' class='btn btn-info btn-sm btn-title' onclick=\"changeAdminNameGo('"+name+"')\" >Submit</button>\
	        </div>\
			</div>"
	});
}

function delAdmin(name){
	layer.confirm('Do you really want to delete: '+name, {
		icon:3,
	    btn: ['Delete','Cancel'],
	    closeBtn: 2,
	    title:false
	}, function(){
	    var gurl = "/clear/testIng?type=userDelete&name="+name;
		$.get(gurl,function(rdata){
			if(rdata.status == true){
				userSafe();
				layer.msg('User deleted successfully', {icon: 1});
			}
			else{
				layer.msg(rdata.msg, {icon: 5});
			}
		});
	}, function(){
	    layer.closeAll();
	});
}

function disabledAdmin(name){
	var gurl = "/clear/testIng?type=userStatus&status=0&name="+name;
	$.get(gurl,function(rdata){
		if(rdata.status == true){
			userSafe();
			layer.msg('User has been disabled', {icon: 1});
		}
		else{
			layer.msg(rdata.msg, {icon: 5});
		}
	});
}

\function enableAdmin(name){
	var gurl = "/clear/testIng?type=userStatus&status=1&name="+name;
	$.get(gurl,function(rdata){
		if(rdata.status == true){
			userSafe();
			layer.msg('User is enabled', {icon: 1});
		}
		else{
			layer.msg(rdata.msg, {icon: 5});
		}
	});
}

function dangerPort() {
	var gurl="/clear/testIng?type=danger";
	var body="";
	$(".system-check .danger").html("<i class='loading'></i>");
	$.ajax({ url: gurl,type:"get",async:true ,success: function(rdata){
	        var dangerPortList = "";
			for (var i = 0; i < rdata.length; i++) {
				if (rdata[i].status == true) {
					dangerPortList +=rdata[i].port+" ";
				}
			}
			body = "<p>Port is open: "+dangerPortList+"</p>";
			$(".system-check .danger").html(body).hide().fadeIn(1000);
	}});
}

function firewall(){
	var gurl = "/clear/testIng?type=firewall";
	var body = "";
	//$(".system-check .firewall").html("<i class='loading'></i>");
	$.ajax({ url: gurl,type:"get",async:true ,success: function(rdata){
		if(rdata.status==false){
			body="<p>The firewall is not turned on: <span class='btn btn-info btn-xs' onclick='FirewallStatus(1)'>Open</span></p>";
		}
		else{
			body="<p>The firewall is turned on: <span class='btn btn-del btn-xs' onclick='FirewallStatus(0)'>Shut down</span></p>";
		}
		$(".system-check .firewall").html(body).hide().fadeIn(1000);
	}});
}

function mstsc(){
	var gurl = "/clear/testIng?type=mstsc";
	var body = "";
	//$(".system-check .mstsc").html("<i class='loading'></i>");
	$.ajax({ url: gurl,type:"get",async:true ,success: function(rdata){
		if(rdata.status==false){
			body="<p>Remote port: "+rdata.port+"，unopened，<span class='btn btn-info btn-xs' onclick='mstscStatus(0)'>Open</span></p>";
		}
		else{
			body="<p>Remote port: "+rdata.port+"，activated，<span class='btn btn-del btn-xs' onclick='mstscStatus(1)'>Shut down</span></p>";
		}
		$(".system-check .mstsc").html(body).hide().fadeIn(1000);
	}});
}

function safe(){
	var gurl = "/clear/testIng?type=safe";
	var body = "";
	//$(".system-check .safeinfo").html("<i class='loading'></i>");
	$.ajax({ url: gurl,type:"get",async:true ,success: function(rdata){
		body="<p>Protection software: "+rdata.safes+"</p>";
		$(".system-check .safeinfo").html(body).hide().fadeIn(1000);
	}});
}

function ping() {
	var gurl = "/clear/testIng?type=ping";
	var body = "";
	$("#pings-box").html("<i class='loading'></i>");
	$.ajax({ url: gurl,type:"get",async:true ,success: function(rdata){
		var pingList = "";
		for (var i = 0; i < rdata.length; i++) {
			pingList += "<span>"+rdata[i].addr+"<em> <b>"+rdata[i].ping+"</b> ms</em></span>";
		}
		body = pingList;
		$("#pings-box").html(body).hide().fadeIn(1000);
		$("#pings-box span").each(function(){
			var that = $(this).find("em");
			var s = $(this).find("b").text();
			if(s<50){
				that.css("color","#3498DB");
			}
			else if(s<80){
				that.css("color","#3c8dbc");
			}
			else{
				that.css("color","#fdab02");
			}
		})
	}});
}

function NodangerPort(){
	var index = layer.open({
		type: 1,
		area: '500px',
		title: 'Port disabled',
		closeBtn: 2,
		shift: 5,
		shadeClose: false,
		content: "<div class='zun-form-new systemSafeCheck' style='text-align:left'>\
			<div class='line'>Dangerous Port 135: There is a risk of being written malicious code by a remote computer.</div>\
			<div class='line'>Dangerous Port 137: The risk of being allowed to obtain system information and being exploited by hackers.</div>\
			<div class='line'>Dangerous port 138: It is easy to leak the LAN information of the host.</div>\
			<div class='line'>Dangerous Port 139: There is a risk of being exploited by a null session to crack the administrator password.</div>\
			<div class='line'>Dangerous Port 445: There is a risk of invading the host hard drive through the shared folder.</div>\
			<div class='line'>Dangerous Port 445: There is a risk of invading the host hard drive through the shared folder.</div>\
			<div class='line'>Dangerous Port 4489: There is a risk of remote intrusion.</div>\
			<div class='line'>Dangerous Port 1025: Dynamic port scanning risk.</div>\
			<div class='line'>Hazardous Port 2475: There is a security risk.</div>\
			<div class='line'>Dangerous port 3127: There is a security risk.</div>\
			<div class='line'>Hazardous Port 6129: There is a security risk.</div>\
		</div>"
		});
		$(".systemSafeCheck .line").hide();
		var num = $(".systemSafeCheck .line").size();
		for (var i = 0; i < num; i++) {
			setTimeout("$('.systemSafeCheck .line').eq(" + i + ").append(\"<span style='color:#00be43;float:right;'>Closed</span>\").fadeIn();", i * 100);
		}
	var gurl = "/clear/testIng?type=dangerSet";
	$.get(gurl,function(rdata){
		setTimeout("layer.msg('Dangerous port is disabled', {icon: 1})",1000);
	});
}

function FirewallStatus(status){
	var gurl = "/clear/testIng?type=FirewallStatus&status="+status;
	$.get(gurl,function(rdata){
		if(status==1){
			if(rdata.status==true){
				layer.msg('The firewall is successfully opened.', {icon: 1});
			}
			else{
				layer.msg('Firewall failed to open', {icon: 5});
			}
		}
		if(status==0){
			if(rdata.status==true){
				layer.msg('The firewall is closed successfully', {icon: 1});
			}
			else{
				layer.msg('Firewall shutdown failed', {icon: 5});
			}
		}
		firewall();
	});
}

function mstscStatus(status){
	var gurl = "/clear/testIng?type=mstscStatus&status="+status;
	$.get(gurl,function(rdata){
		if(status==0){
			if(rdata.status==true){
				layer.msg('Remote service started successfully', {icon: 1});
			}
			else{
				layer.msg('Remote service failed to open', {icon: 5});
			}
		}
		if(status==1){
			if(rdata.status==true){
				layer.msg('Remote service closed successfully', {icon: 1});
			}
			else{
				layer.msg('Remote service shutdown failed', {icon: 5});
			}
		}
		mstsc();
	});
}

function systemSafeCheck(){
	setTimeout("dangerPort()", 50);
	setTimeout("firewall()", 2000);
	setTimeout("mstsc()", 4000);
	setTimeout("safe()", 6000);
}
function systemCheckUpDown(){
	$(".system-check .con").hide().show();
}
function systemCheck(info){
	if(info < 1.8){
		layer.msg('Cloud Manager version is too low, please update the version!',{icon:5});
		return;
	}
	systemCheckUpDown();
	setTimeout("junk()", 10);
	setTimeout("userSafe()", 2000);
	setTimeout("dangerPort()", 4000);
	setTimeout("firewall()", 6000);
	setTimeout("mstsc()", 8000);
	setTimeout("safe()", 10000);
	setTimeout("ping()", 12000);
}
var boxcon = $(".system-check .con > ul > li .box-right .box-con");
boxcon.click(function(){
	boxcon.removeAttr("onclick").unbind("click");
	boxcon.css({"background":"none","opacity":"1"});
	boxcon.next().remove();
})
$(".system-check .s-title a").click(function(){
	boxcon.removeAttr("onclick").unbind("click");
	boxcon.css({"background":"none","opacity":"1"});
	boxcon.next().remove();
})
boxcon.css("opacity","0.4").after("<div class='icon-shuaxin'></div>");
$(".box-right .gongju").find(".btn-info").click(function(){
	$(this).parent().next().removeAttr("onclick").unbind("click");
	$(this).parent().next().css({"background":"none","opacity":"1"});
	$(this).parent().next().next().remove();
})
