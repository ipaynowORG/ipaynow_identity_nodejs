
exports.url_encode = function (url){
    url = encodeURIComponent(url);
    url = url.replace(/\%3A/g, ":");
    url = url.replace(/\%2F/g, "/");
    url = url.replace(/\%3F/g, "?");
    url = url.replace(/\%3D/g, "=");
    url = url.replace(/\%26/g, "&");
    
    return url;
}

exports.generateMixed = function (n) {
	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
     var res = "";
     for(var i = 0; i < n ; i ++) {
         // var id = Math.ceil(Math.random()*35);
         res += chars[Math.ceil(Math.random()*35)];
     }
     return res;
}



exports.md5 = function (text) {
	var crypto = require('crypto');
  	return crypto.createHash('md5').update(text).digest('hex');
};

exports.postFormLinkReport = function (m){
	var result = "";
	var k_array = new Array();
	for(k in m) {
		k_array.push(k);
	}
	k_array.sort();
	var post
	for(var i=0;i<k_array.length;i++){
 		
 		result += k_array[i] + "=" + m[k_array[i]] + "&";
	}
	return result.substring(0,result.length-1);
}




















const CryptoJS = require('crypto-js');

const iv = CryptoJS.enc.Utf8.parse('0123456701234567');
const options = {
  iv,
  padding: CryptoJS.pad.NoPadding,
  mode: CryptoJS.mode.ECB
};

exports.decrypt = (secret, key) => {
  const utf8Key = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.TripleDES.decrypt(secret, utf8Key, options);
  return CryptoJS.enc.Utf8.stringify(decrypted);
};

exports.encrypt = (plaintext, key) => {
  const utf8Key = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.TripleDES.encrypt(complementZero(plaintext), utf8Key, options);
  return encrypted.toString();
};



function complementZero(str){
    
    var l = stringToByte(str).length;
    if (l % 8 != 0) {
        len = 8 - l % 8;
        var bytes = new Array(len);
        for(var i = 0 ;i < bytes.length;i++){
            bytes[i] = 0x0;
        }
        return str + byteToString(bytes);
    }else{
        return str;
    }
}


function byteToString(arr) {  
        if(typeof arr === 'string') {  
            return arr;  
        }  
        var str = '',  
            _arr = arr;  
        for(var i = 0; i < _arr.length; i++) {  
            var one = _arr[i].toString(2),  
                v = one.match(/^1+?(?=0)/);  
            if(v && one.length == 8) {  
                var bytesLength = v[0].length;  
                var store = _arr[i].toString(2).slice(7 - bytesLength);  
                for(var st = 1; st < bytesLength; st++) {  
                    store += _arr[st + i].toString(2).slice(2);  
                }  
                str += String.fromCharCode(parseInt(store, 2));  
                i += bytesLength - 1;  
            } else {  
                str += String.fromCharCode(_arr[i]);  
            }  
        }  
        return str;  
    }  



function stringToByte(str) {  
        var bytes = new Array();  
        var len, c;  
        len = str.length;  
        for(var i = 0; i < len; i++) {  
            c = str.charCodeAt(i);  
            if(c >= 0x010000 && c <= 0x10FFFF) {  
                bytes.push(((c >> 18) & 0x07) | 0xF0);  
                bytes.push(((c >> 12) & 0x3F) | 0x80);  
                bytes.push(((c >> 6) & 0x3F) | 0x80);  
                bytes.push((c & 0x3F) | 0x80);  
            } else if(c >= 0x000800 && c <= 0x00FFFF) {  
                bytes.push(((c >> 12) & 0x0F) | 0xE0);  
                bytes.push(((c >> 6) & 0x3F) | 0x80);  
                bytes.push((c & 0x3F) | 0x80);  
            } else if(c >= 0x000080 && c <= 0x0007FF) {  
                bytes.push(((c >> 6) & 0x1F) | 0xC0);  
                bytes.push((c & 0x3F) | 0x80);  
            } else {  
                bytes.push(c & 0xFF);  
            }  
        }  
        return bytes;
    }  
























