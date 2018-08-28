var MOBILE_REG = /^1[3|4|5|6|8|7|9][0-9]\d{8}$/,
    EMAIL_REG = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/,
    MONEY_REG = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
    NAME_REG = /^([\u4e00-\u9fa5]+|[a-zA-Z0-9]+)$/,
    CH_NAME_REG = /[\u4e00-\u9fa5][\u4e00-\u9fa5]+/,
    HKMACAO_REG = /^[CHMhm]{1}([0-9]{10}|[0-9]{8})$/,
    TAIWAN_REG = /^[0-9]{8,10}$/,
    BIRTH_REG = /^[A-Z]{1}\d{9}$/,
    PASSPORT_REG = /^[a-zA-Z0-9]{5,17}$/,
    UA = window
        .navigator
        .userAgent
        .toLowerCase();

function isRule(regText, value) {
    if (!value || value.length == 0)
        return true

    var reg = new RegExp(regText)
    if (!reg.test(value)) {
        return false
    }
    return true
}

//是否是 ios
export function isIos(){
    let userAgent = navigator.userAgent;
    let IsiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return IsiOS;
}
//是否是qq浏览器
export function isQQ() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/\sQQ/i) !== null){
        return true
    }
    return false
}
//是否是手机管家
export function isWeSecure(){
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    var ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if(ua.match(/wesecure/i) !== null){
        return true;
    }else{
        return false;
    }
}
//是否是微信
export function isWeChat(){
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    var ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
//验证手机号
export function isMobile(mobile){
    return isRule(MOBILE_REG, mobile)
}
//验证email
export function isEmail(email){
    return isRule(EMAIL_REG, email)
}
//验证金钱
export function isMoney(money){
    return isRule(MONEY_REG, money)
}
//是否中文名称
export function isChNam(name){
    isRule(CH_NAME_REG, name)
}
//是否是身份证件
export function isIdCard(card){
    if (!card)
        return true;
    var num = card.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 下面分别分析出生日期和校验位
    var len,
        re;
    var birthday,
        sex;
    len = num.length;
    if (len == 15) {

        //获取出生日期
        birthday = '19' + card.substring(6, 8) + "-" + card.substring(8, 10) + "-" + card.substring(10, 12);
        //获取性别
        sex = parseInt(card.substr(14, 1)) % 2 == 1
            ? 'M'
            : 'F';

        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return false;
        } else {
            //将15位身份证转成18位 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;

            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
        }
    } else if (len == 18) {

        //获取出生日期
        birthday = card.substring(6, 10) + "-" + card.substring(10, 12) + "-" + card.substring(12, 14);
        //获取性别
        sex = parseInt(card.substr(16, 1)) % 2 == 1
            ? 'M'
            : 'F';

        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return false;
        } else {
            //检验18位身份证的校验码是否正确。 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0,
                i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                return false;
            }
        }
    }
    return {birthday: birthday, sex: sex}
}
//邮政编号
export function isPostcode(postcode) {
    if ( postcode == "") {
        return false;
    } else {
        if (! /^[0-9][0-9]{5}$/.test(postcode)) {
            return false;
        }
    }
    return true;
}
//电话普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
export function isTel(tel) {
    if(tel.length ==0){
        return false;
    }
    var patrn=/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
    if (!patrn.exec(tel)) {
        return false
    }
    return true;
}
//正整数
export function isNumber(number) {
    if(number.length==0) return false
    if(!/^[1-9]\d*/) return false
    return true
}
//是IP
export function isIP(ip) {
    var patrn=/^[0-9.]{1,20}$/;
    if (!patrn.exec(ip)){
        return false
    }
    return true;
}
//简单检查身份证号
export function checkIdCard(value) {

    if(value.length ==0){
        return true;
    }

    var reg = /^\d{15}(\d{2}[A-Za-z0-9])?$/;

    if (!reg.test(value)) {
        return false;
    }

    return true;
}
//密码强度 大于8位 大小写  数字  特殊字符
export function pwdStrength(pwd) {
    var sum = [0, 0, 0];
    for (var i=0; i<pwd.length; i++) {
        var c = pwd.charCodeAt(i);
        if (c >=48 && c <=57) //数字
            sum[0] = 1;
        else if (c >=65 && c <=90) //大写字母
            sum[1] = 1;
        else if (c >=97 && c <=122) //小写字母
            sum[1] = 1;
        else //特殊字符
            sum[2] = 1;
    }
    var level = sum[0] + sum[1] + sum[2] ;
    if (pwd.length >= 8) level++;
    return level;
}










