

var util = require('./util');

exports.App = function (appId,appKey,desKey,isDev){
	this.appId=appId;
	this.appKey=appKey;
	this.desKey = desKey;
	this.isDev = isDev;
}

     /**
     * 身份验证
     * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param cardName  姓名
     * @param idcard    身份证
     * @param mhtOrderNo    商户订单号(可空,为空时自动生成)
     * @return
     */
exports.IdentityAuth = function (app,cardName,idcard,mhtOrderNo){
	var m = {};
	
	m['cardName'] = cardName;
	m['idcard'] = idcard;
	if(mhtOrderNo != ""){
		m['mhtOrderNo'] = mhtOrderNo;
	}else{
		
		m['mhtOrderNo'] = util.generateMixed(20);
	}
	return query(app,m,"ID01")
}


	/**
     * 身份验证-订单查询
     * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param mhtOrderNo    商户订单号
     * @return
     */
exports.IdentityAuthQuery = function (app,mhtOrderNo){
	var m = {};

	m['mhtOrderNo'] = mhtOrderNo;
	return query(app,m,"ID01_Query")
}




	/**
     * 卡信息认证
     * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param idCardName   姓名
     * @param idCard    身份证
     * @param bankCardNum   银行账户
     * @param mhtOrderNo    商户订单号(可空,为空时自动生成)
     * @return
     */
exports.CardAuth = function (app,idCardName,idCard,bankCardNum,mhtOrderNo){
	var m = {};
	
	m['idCardName'] = idCardName;
	m['idCard'] = idCard;
	m['bankCardNum'] = bankCardNum;
	if(mhtOrderNo != ""){
		m['mhtOrderNo'] = mhtOrderNo;
	}else{
		
		m['mhtOrderNo'] = util.generateMixed(20);
	}
	return query(app,m,"ID02")
}






	/**
     * 卡信息认证- 订单查询
     * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param mhtOrderNo
     * @return
     */
exports.CardAuthQuery = function (app,mhtOrderNo){
	var m = {};
	
	m['mhtOrderNo'] = mhtOrderNo;
	return query(app,m,"ID02_Query")
}








 	/**
     * 手机号认证
     * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param idCardName    认证姓名
     * @param idCard    身份证号码
     * @param mobile    手机号
     * @param mhtOrderNo    商户订单号
     * @return
     */
exports.MobileNoAuth = function (app,idCardName,idCard,mobile,mhtOrderNo){
	var m = {};
	
	m['idCardName'] = idCardName;
	m['idCard'] = idCard;
	m['mobile'] = mobile;
	if(mhtOrderNo != ""){
		m['mhtOrderNo'] = mhtOrderNo;
	}else{
		
		m['mhtOrderNo'] = util.generateMixed(20);
	}
	return query(app,m,"ID03")
}






	/**
     * 手机号认证 - 订单查询
     * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param mhtOrderNo
     * @return
     */
exports.MobileNoAuthQuery = function (app,mhtOrderNo){
	var m = {};
	
	m['mhtOrderNo'] = mhtOrderNo;
	return query(app,m,"ID03_Query")
}
















function query(app,requestMap,funcode) {

	content = util.postFormLinkReport(requestMap);

	var message1 = "appId="+app.appId+"";
	message1 = new Buffer(message1).toString('base64');

	

	var message2 = content;
	message2 = util.encrypt(message2,app.desKey);

	

	var message3 = new Buffer(util.md5(content+"&"+app.appKey)).toString('base64');	

	

	var message = message1+"|"+message2+"|"+message3+"";
	
	message = encodeURIComponent(message);

	
	var url = "";
	if(app.isDev){
		url = "https://dby.ipaynow.cn/identify";
	}else{
		url = "https://s.ipaynow.cn/auth";
	}
	return post("funcode="+funcode+"&message="+message,url,app);
}










function post(content,posturl,app){
	var https = require('https');
	var util = require('util');
	var url = require('url');
	var querystring = require('querystring');


	var post_option = url.parse(posturl);
	post_option.method = "POST";

	post_option.headers = {
    	'Content-Type' : 'text/html',
    	'Content-Length' : content.length
	};
	
	var result = "";
	var post_req = https.request(post_option,function(res){
    	res.setEncoding('utf8');
    	res.on('data',function(chunk){
        	result += chunk;
    	});
    	res.on('end', function() {
            if(result.split("|").length==2){	
			}else{
            	var return2 = result.split("|")[1];

				var util = require('./util');
            	var originalMsg = util.decrypt(return2.replace(/[\r\n]/g,""),app.desKey);
				console.log(originalMsg);
			}

        });
    
	});
	post_req.write(content);
	post_req.end();
	return result;
}