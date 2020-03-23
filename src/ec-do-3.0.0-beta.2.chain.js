/*3.0.0-beta2*/
let ecDo = (function () {
    // let handle= function (obj) {
    //     this.obj=this.clone(obj);
    // }
    class handle {
        constructor(obj) {
            this.obj = this.clone(obj);
            this.ruleData = {
                checkType: {
                    email(str){
                        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
                    },
                    mobile(str){
                        return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
                    },
                    tel(str){
                        return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
                    },
                    number(str){
                        return /^[0-9]$/.test(str);
                    },
                    english(str){
                        return /^[a-zA-Z]+$/.test(str);
                    },
                    text(str){
                        return /^\w+$/.test(str);
                    },
                    chinese(str){
                        return /^[\u4E00-\u9FA5]+$/.test(str);
                    },
                    lower(str){
                        return /^[a-z]+$/.test(str);
                    },
                    upper(str){
                        return /^[A-Z]+$/.test(str);
                    }
                }
            }
        }
        extend() {

        }
//***************字符串模块**************************/
        /**
         * @description 清除左右空格
         */
        trim() {
            return this.obj.replace(/(^\s*)|(\s*$)/g, "");
        }
        /**
         * @description 清除所有空格
         */
        trimAll() {
            return this.obj.replace(/\s+/g, "");
        }

        /**
         * @description 清除左空格
         */
        trimLeft() {
            return this.obj.replace(/(^\s*)/g, "");
        }

        /**
         * @description 清除右空格
         */
        trimRight() {
            return this.obj.replace(/(\s*$)/g, "");
        }

        /**
         * @description 大小写切换
         */
        toggleCase() {
            let itemText = ""
            this.obj.split("").forEach(item => {
                if (/^([a-z]+)/.test(item)) {
                    itemText += item.toUpperCase();
                } else if (/^([A-Z]+)/.test(item)) {
                    itemText += item.toLowerCase();
                } else {
                    itemText += item;
                }
            });
            return itemText;
        }

        /**
         * @description 首字母大写
         */
        firstWordUpper() {
            return this.obj.replace(/\b\w+\b/g, function (word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);

            });
        }

        /**
         * @description 首字母小写
         */
        firstWordLower() {
            return this.obj.replace(/\b\w+\b/g, function (word) {
                return word.substring(0, 1).toLowerCase() + word.substring(1);
            });
        }

        /**
         * @description 字符串替换
         */
        replaceAll( AFindText, ARepText) {
            let raRegExp = new RegExp(AFindText, "g");
            return this.obj.replace(raRegExp, ARepText);
        }

        /**
         * @description 加密字符串
         */
        encryptStr(regIndex, ARepText = '*') {
            let regtext = '',
                Reg = null,
                _regIndex = regIndex.split(','),
                replaceText = ARepText;
            //repeatStr是在上面定义过的（字符串循环复制），大家注意哦
            _regIndex = _regIndex.map(item => +item);
            regtext = '(\\w{' + _regIndex[0] + '})\\w{' + (1 + _regIndex[1] - _regIndex[0]) + '}';
            Reg = new RegExp(regtext);
            let replaceCount = this.repeatStr(replaceText, (1 + _regIndex[1] - _regIndex[0]));
            return this.obj.replace(Reg, '$1' + replaceCount);
        }

        /**
         * @description 不加密字符串
         */
        encryptUnStr(regIndex, ARepText = '*') {
            let regtext = '',
                Reg = null,
                _regIndex = regIndex.split(','),
                replaceText = ARepText;
            _regIndex = _regIndex.map(item => +item);
            regtext = '(\\w{' + _regIndex[0] + '})(\\w{' + (1 + _regIndex[1] - _regIndex[0]) + '})(\\w{' + (this.obj.length - _regIndex[1] - 1) + '})';
            Reg = new RegExp(regtext);
            let replaceCount1 = this.repeatStr(replaceText, _regIndex[0]);
            let replaceCount2 = this.repeatStr(replaceText, this.obj.length - _regIndex[1] - 1);
            return this.obj.replace(Reg, replaceCount1 + '$2' + replaceCount2);
        }

        /**
         * @description 字符串开始位置加密
         */
        encryptStartStr(length, replaceText = '*') {
            let regtext = '(\\w{' + length + '})';
            let Reg = new RegExp(regtext);
            let replaceCount = this.repeatStr(replaceText, length);
            return this.obj.replace(Reg, replaceCount);
        }

        /**
         * @description 字符串结束位置加密
         */
        encryptEndStr(length, replaceText = '*') {
            return this.encryptStartStr(this.obj.split('').reverse().join(''), length, replaceText).split('').reverse().join('');
        }

        /**
         * @description 检测字符串
         */
        checkType(type) {
            return !!this.ruleData.checkType[type](this.obj);
        }

        /**
         * @description 检测密码强度
         */
        checkPwdLevel() {
            let nowLv = 0;
            // if (str.length < 6) {
            //     return nowLv
            // }
            let rules = [/[0-9]/, /[a-z]/, /[A-Z]/, /[\.|-|_]/];
            for (let i = 0; i < rules.length; i++) {
                if (rules[i].test(this.obj)) {
                    nowLv++;
                }
            }
            return nowLv;
        }

        /**
         * @description 随机码
         */
        randomWord(count = 36) {
            return Math.random().toString(count).substring(2);
        }

        /**
         * @description 统计特定字符串的次数
         */
        countStr(strSplit) {
            return this.obj.split(strSplit).length - 1
        }

        /**
         * @description 过滤特定类型字符串
         */
        filterStr(type, replaceStr = '') {
            let arr = Array.prototype.slice.call(arguments);
            let fnName = 'filter' + this.firstWordUpper(type);
            arr.splice(1, 1);
            return this[fnName] ? this[fnName].apply(null, arr) : false;
        }

        /**
         * @description 过滤字符串的特殊符号
         */
        filterSpecialStr(replaceStr = '', spstr) {
            let regText = '$()[]{}?\|^*+./\"\'+', pattern;
            //是否有哪些特殊符号需要保留
            if (spstr) {
                let _spstr = spstr.split(""), _regText = "[^0-9A-Za-z\\s";
                for (let j = 0, len1 = _spstr.length; j < len1; j++) {
                    if (regText.indexOf(_spstr[j]) === -1) {
                        _regText += _spstr[j];
                    }
                    else {
                        _regText += '\\' + _spstr[j];
                    }
                }
                _regText += ']'
                pattern = new RegExp(_regText, 'g');
            }
            else {
                pattern = new RegExp("[^0-9A-Za-z\\s]", 'g')
            }
            return this.obj = this.obj.replace(pattern, replaceStr);
        }

        /**
         * @description 过滤字符串的html标签
         */
        filterHtml(replaceStr = '') {
            return this.obj.replace(/<\/?[^>]*>/g, replaceStr);
        }

        /**
         * @description 过滤字符串的表情
         */
        filterEmjoy(replaceStr = '') {
            return this.obj.replace(/[^\u4e00-\u9fa5|\u0000-\u00ff|\u3002|\uFF1F|\uFF01|\uff0c|\u3001|\uff1b|\uff1a|\u3008-\u300f|\u2018|\u2019|\u201c|\u201d|\uff08|\uff09|\u2014|\u2026|\u2013|\uff0e]/ig, replaceStr);
        }

        /**
         * @description 过滤字符串的大写字母
         */
        filterWordUpper(replaceStr = '') {
            return this.obj.replace(/[A-Z]/g, replaceStr);
        }

        /**
         * @description 过滤字符串的小写字母
         */
        filterWordLower(replaceStr = '') {
            return this.obj.replace(/[a-z]/g, replaceStr);
        }

        /**
         * @description 过滤字符串的数字
         */
        filterNumber(replaceStr = '') {
            return this.obj.replace(/[1-9]/g, replaceStr);
        }

        /**
         * @description 过滤字符串的中文
         */
        filterChinese(replaceStr = '') {
            return this.obj.replace(/[\u4E00-\u9FA5]/g, replaceStr);
        }

        /**
         * @description 格式化处理字符串
         */
        formatText(size = 3, delimiter = ',') {
            let regText = '\\B(?=(\\w{' + size + '})+(?!\\w))';
            let reg = new RegExp(regText, 'g');
            return this.obj.replace(reg, delimiter);
        }

        /**
         * @description 找出最长单词
         * @param str
         * @param splitType
         * @return {{el: string, max: number}}
         */
        longestWord(splitType = /\s+/g) {
            let _max = 0, _item = '';
            let strArr = this.obj.split(splitType);
            strArr.forEach(item => {
                if (_max < item.length) {
                    _max = item.length;
                    _item = item;
                }
            });
            return {el: _item, max: _max};
        }

        /**
         * @description 句中单词首字母大写
         * @param str
         * @param splitType
         * @return {*}
         */
        titleCaseUp(splitType = /\s+/g) {
            //这个我也一直在纠结，英文标题，即使是首字母大写，也未必每一个单词的首字母都是大写的，但是又不知道哪些应该大写，哪些不应该大写
            let strArr = this.obj.split(splitType),
                result = "";
            strArr.forEach(item => {
                result += this.firstWordUpper(item, 1) + ' ';
            });
            return this.trimRight(result)
        }

//***************字符串模块End**************************/
//***************数组模块**************************/
        /**
         * @description 数组去重
         * @return {[*]}
         */
        unique() {
            this.obj=[...new Set(this.obj)];
            return this;
        }

        /**
         * @description 数组顺序打乱
         */
        upset() {
            let j, _item;
            for (let i = 0; i < this.obj.length; i++) {
                j = Math.floor(Math.random() * i);
                _item = this.obj[i];
                this.obj[i] = this.obj[j];
                this.obj[j] = _item;
            }
            return this;
        }

        /**
         * @description 数组最大值（数值数组）
         * @param arr
         */
        max() {
            this.obj=Math.max(...this.obj);
            return this;
        }

        /**
         * @description 数组最小值（数值数组）
         * @param arr
         */
        min() {
            this.obj= Math.min(...this.obj);
        }

        /**
         * @description 数组求和（数值数组）
         * @param arr
         */
        sum() {
            this.obj=this.obj.reduce((pre, cur) => pre + cur)
        }

        /**
         * @description 数组平均值,小数点可能会有很多位，这里不做处理，处理了使用就不灵活了（数值数组）
         */
        average() {
            this.obj=this.sum(this.obj) / this.obj.length;
        }

        /**
         * @description 深拷贝
         * @param obj
         */
        clone() {
            if (!this.obj && typeof this.obj !== 'object') {
                return;
            }
            let newObj = this.obj.constructor === Array ? [] : {};
            for (let key in this.obj) {
                if (this.obj[key]) {
                    if (this.obj[key] && typeof this.obj[key] === 'object') {
                        newObj[key] = this.obj[key].constructor === Array ? [] : {};
                        //递归
                        newObj[key] = this.clone(this.obj[key]);
                    } else {
                        newObj[key] = this.obj[key];
                    }
                }
            }
            this.obj=newObj;
            return this;
        }

        /**
         * @description 从数组中随机获取元素
         * @param arr
         * @param num
         * @return {*}
         */
        getRandom(num = 1) {
            let _arr = this.clone(this.obj), nowIndex, result = [];
            for (let i = 0; i < num; i++) {
                nowIndex = Math.floor(Math.random() * _arr.length);
                result.push(_arr[nowIndex]);
                _arr.splice(nowIndex, 1);
            }
            this.obj= num > 1 ? result : result[0];
            return this;

        }

        /**
         * @description 降序返回数组（字符串）每个元素的出现次数
         * @param item
         */
        count(item) {
            //是否只返回一个元素的次数
            if (item) {
                let num = 0;
                for (let i = 0, len = this.obj.length; i < len; i++) {
                    if (item === this.obj[i]) {
                        num++;
                    }
                }
                return num;
            }
            let obj = {}, k, arr1 = []
            //记录每一元素出现的次数
            for (let i = 0, len = this.obj.length; i < len; i++) {
                k = this.obj[i];
                if (obj[k]) {
                    obj[k]++;
                } else {
                    obj[k] = 1;
                }
            }
            //保存结果{el-'元素'，count-出现次数}
            for (let o in obj) {
                arr1.push({el: o, count: obj[o]});
            }
            //排序（降序）
            arr1.sort(function (n1, n2) {
                return n2.count - n1.count
            });
            this.obj=arr1;
            return this;
        }

        /**
         * @description 删除值为'val'的数组元素
         * @param val
         */
        removeArrayForValue(val) {
            this.obj= this.obj.filter(item => item !== val)
        }

        /**
         * @description 删除值含有'val'的数组元素
         * @param val
         * @return {Array}
         */
        removeArrayForLike(val) {
            this.obj= this.obj.filter(item => item.indexOf(val) === -1);
        }

        /**
         * @description 排除对象数组某些项
         * @param keys
         * @return {Array}
         */
        filterOptionArray(keys) {
            let newArr = [];
            let _keys = keys.split(','), newArrOne = {};
            for (let i = 0, len = arr1.length; i < len; i++) {
                newArrOne = {};
                for (let key in arr1[i]) {
                    //如果key不存在排除keys里面,添加数据
                    if (_keys.indexOf(key) === -1) {
                        newArrOne[key] = arr1[i][key];
                    }
                }
                newArr.push(newArrOne);
            }
            this.obj=newArr
            return newArr;
        }

        /**
         * @description 对象数组排序
         * @param arr
         * @param sortText
         * @return {*}
         */
        sortBy(sortText) {
            if (!sortText) {
                return this.obj
            }
            let _sortText = sortText.split(',').reverse(), _arr = this.clone(this.obj);
            for (let i = 0, len = _sortText.length; i < len; i++) {
                _arr.sort((n1, n2) => {
                    return n1[_sortText[i]] - n2[_sortText[i]]
                })
            }
            this.obj= _arr;
            return this;
        }

        /**
         * @description 数组扁平化
         */
        steamroller() {
            let flattened = [].concat(...this.obj);
            this.obj= flattened.some(item => Array.isArray(item)) ? this.steamroller(flattened) : flattened;
            return this;
        }

//***************数组模块END**************************/


//***************对象及其他模块**************************/
        /**
         * @description 适配rem
         * @param _client 效果图的宽度
         */
        getFontSize(_client) {
            let doc = document,
                win = window;
            let docEl = doc.documentElement,
                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                countSize = function () {
                    let clientWidth = docEl.clientWidth;
                    if (!clientWidth) return;
                    //如果屏幕大于750（750是根据我效果图设置的，具体数值参考效果图），就设置clientWidth=750，防止font-size会超过100px
                    if (clientWidth > _client) {
                        clientWidth = _client
                    }
                    //设置根元素font-size大小
                    docEl.style.fontSize = 100 * (clientWidth / _client) + 'px';
                };
            //屏幕大小改变，或者横竖屏切换时，触发函数
            win.addEventListener(resizeEvt, countSize, false);
            //文档加载完成时，触发函数
            doc.addEventListener('DOMContentLoaded', countSize, false);
            return this;
        }

        /**
         * @description 到某一个时间的倒计时
         * @param endTime
         */
        getEndTime(endTime) {
            let t = +new Date(endTime) - +new Date(); //时间差的毫秒数
            let d = 0,
                h = 0,
                m = 0,
                s = 0;
            if (t >= 0) {
                d = Math.floor(t / 1000 / 3600 / 24);
                h = Math.floor(t / 1000 / 60 / 60 % 24);
                m = Math.floor(t / 1000 / 60 % 60);
                s = Math.floor(t / 1000 % 60);
            }
            this.obj={d, h, m, s};
            return this;
        }

        /**
         * @description 时间格式化
         * @param date
         * @param fmt
         * @return {*}
         */
        formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
            let _date = new Date(date), _fmt = fmt;
            let o = {
                "M+": _date.getMonth() + 1,                 //月份
                "d+": _date.getDate(),                    //日
                "h+": _date.getHours(),                   //小时
                "m+": _date.getMinutes(),                 //分
                "s+": _date.getSeconds()                 //秒
            };
            if (/(y+)/.test(_fmt)) {
                _fmt = _fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (let k in o) {
                if (new RegExp("(" + k + ")").test(_fmt)) {
                    _fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            this.obj= _fmt;
            return this;
        }

        /**
         * @description 随机产生颜色
         */
        randomColor(sum) {
            if (sum) {
                this.obj= '#' + Math.random().toString(16).substring(2).substr(0, 6);
            }
            else {
                this.obj= 'rgb(' + this.randomNumber(255) + ',' + this.randomNumber(255) + ',' + this.randomNumber(255) + ')';
            }
            return this
        }

        /**
         * @description 随机返回一个范围的数字
         * @param n1
         * @param n2
         */
        randomNumber(n1, n2) {
            //randomNumber(5,10)
            //返回5-10的随机整数，包括5，10
            if (arguments.length === 2) {
                this.obj= Math.round(n1 + Math.random() * (n2 - n1));
            }
            //randomNumber(10)
            //返回0-10的随机整数，包括0，10
            else if (arguments.length === 1) {
                this.obj= Math.round(Math.random() * n1)
            }
            //randomNumber()
            //返回0-100000000的随机整数，包括0，100000000
            else {
                this.obj= Math.round(Math.random() * 100000000)
            }
        }

        /**
         * @description 设置url参数
         * @param obj
         */
        setUrlParam(obj) {
            let _rs = [];
            for (let p in obj) {
                if (obj[p] !== null && obj[p] !== '' && obj[p] !== undefined) {
                    _rs.push(p + '=' + obj[p])
                }
            }
            this.obj=this.obj + '?' + _rs.join('&');
            return this;
        }

        /**
         * @description 获取url参数
         */
        getUrlParam(url) {
            url = url ? url : window.location.href;
            let _param = url.substring(url.indexOf('?') + 1),
                _paramItem = _param.split('&'),
                _rs = {};
            for (let i = 0, _len = _paramItem.length; i < _len; i++) {
                let pos = _paramItem[i].indexOf('=');
                if (pos === -1) {
                    continue;
                }
                let name = _paramItem[i].substring(0, pos),
                    value = window.decodeURIComponent(_paramItem[i].substring(pos + 1));
                _rs[name] = value;
            }
            this.url=_rs;
            return this;
        }

        /**
         * @description 现金额大写转换函数
         * @param n
         * @return {string}
         */
        upDigit(n) {
            let fraction = ['角', '分', '厘'];
            let digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
            let unit = [
                ['元', '万', '亿'],
                ['', '拾', '佰', '仟']
            ];
            let head = n < 0 ? '欠人民币' : '人民币';
            n = Math.abs(n);
            let s = '';
            for (let i = 0; i < fraction.length; i++) {
                s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);
            for (let i = 0; i < unit[0].length && n > 0; i++) {
                let p = '';
                for (let j = 0; j < unit[1].length && n > 0; j++) {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
                //s = p + unit[0][i] + s;
            }
            this.obj= head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
            return this;
        }

        /**
         * @description 清除对象中值为空的属性
         * @param obj
         * @return {{}}
         */
        filterParams(obj) {
            let _newPar = {};
            for (let key in obj) {
                if ((obj[key] === 0 || obj[key] === false || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
                    _newPar[key] = obj[key];
                }
            }
            this.obj=_newPar
            return this;
        }

        /**
         * @description 数据类型判断
         * @param o
         * @param type
         * @return {*}
         */
        isType(type) {
            if (!type) {
                return Object.prototype.toString.call(o)
            }
            let _type = type.toLowerCase();
            let typeObj = {
                'string': '[object String]',
                'number': '[object Number]',
                'boolean': '[object Boolean]',
                'null': '[object Null]',
                'function': '[object Function]',
                'array': '[object Array]',
                'object': '[object Object]',
                'symbol': '[object Symbol]'
            }
            let typeFn = {
                nan(){
                    this.obj= Number.isNaN(this.obj);
                },
                elements(){
                    this.obj= Object.prototype.toString.call(this.obj).indexOf('HTML') !== -1;
                }
            }
            if (typeObj[_type]) {
                this.obj= Object.prototype.toString.call(this.obj) === typeObj[_type];
            }
            else {
                this.obj= typeFn[_type]();
            }
            return this;
        }

        /**
         * @description 手机类型判断
         * @param type
         * @return {*}
         */
        getBrowserInfo(type) {
            let typeObj = {
                android: 'android',
                iphone: 'android',
                ipad: 'ipad',
                weixin: 'micromessenger'
            }
            this.obj= type ? navigator.userAgent.toLowerCase().indexOf(typeObj[type]) !== -1 : navigator.userAgent.toLowerCase();
            return this;
        }

        /**
         * @description 函数节流
         * @param fn 执行的函数
         * @param delay 延迟的时间
         * @param mustDelay 最大间隔时间
         */
        throttle(fn, delay, mustDelay) {
            let timer = null;
            let t_start;
            return function () {
                let context = this, args = arguments, t_cur = +new Date();
                //先清理上一次的调用触发（上一次调用触发事件不执行）
                clearTimeout(timer);
                //如果不存触发时间，那么当前的时间就是触发时间
                if (!t_start) {
                    t_start = t_cur;
                }
                //如果当前时间-触发时间大于最大的间隔时间（mustDelay），触发一次函数运行函数
                if (t_cur - t_start >= mustDelay) {
                    fn.apply(context, args);
                    t_start = t_cur;
                }
                //否则延迟执行
                else {
                    timer = setTimeout(() => {
                        fn.apply(context, args);
                    }, delay);
                }
            };
        }

        /**
         * @description 函数防抖(在事件被触发n毫秒后再执行回调，如果在这n毫秒内又被触发，则重新计时)
         * @param fn 执行函数
         * @param delay 间隔时间
         */
        debounce(fn, delay) {
            return function (args) {
                let _this = this
                let _args = args
                clearTimeout(fn.id);
                fn.id = setTimeout(function () {
                    fn.call(_this, _args)
                }, delay)
            }
        }

//***************对象及其他模块END**************************/
//***************cookie模块*******************************/
        /**
         * @description 设置cookie
         */
        setCookie(name, value, iDay) {
            let oDate = new Date();
            oDate.setDate(oDate.getDate() + iDay);
            document.cookie = name + '=' + value + ';expires=' + oDate;
        }

        /**
         * @description 获取cookie
         */
        getCookie(name) {
            let arr = document.cookie.split('; '), arr2;
            for (let i = 0; i < arr.length; i++) {
                arr2 = arr[i].split('=');
                if (arr2[0] == name) {
                    return arr2[1];
                }
            }
            return '';
        }

        /**
         * @description 删除cookie
         */
        removeCookie(name) {
            this.setCookie(name, 1, -1);
        }

        /**
         * @description 操作cookie
         */
        cookie(name, value, iDay) {
            if (arguments.length === 1) {
                return this.getCookie(name);
            }
            else {
                this.setCookie(name, value, iDay);
            }
        }

//***************cookie模块END*******************************/
//***************DOM模块*******************************/
//测试用例参考example/dom.html
        /**
         * @description 检测对象是否有哪个类名
         * @param obj
         * @param classStr
         * @return {boolean}
         */
        hasClass(obj, classStr) {
            return obj.className.split(/\s+/).indexOf(classStr) === -1 ? false : true;
        }

        /**
         * @description 添加类名
         * @param obj
         * @param classStr
         * @return {ecDo}
         */
        addClass(obj, classStr) {
            if ((this.isType(obj, 'array') || this.isType(obj, 'elements')) && obj.length >= 1) {
                for (let i = 0, len = obj.length; i < len; i++) {
                    if (!this.hasClass(obj[i], classStr)) {
                        obj[i].className += " " + classStr;
                    }
                }
            }
            else {
                if (!this.hasClass(obj, classStr)) {
                    obj.className += " " + classStr;
                }
            }
            return this;
        }

        /**
         * @description 删除类名
         * @param obj
         * @param classStr
         * @return {ecDo}
         */
        removeClass(obj, classStr) {
            let reg;
            if ((this.isType(obj, 'array') || this.isType(obj, 'elements')) && obj.length > 1) {
                for (let i = 0, len = obj.length; i < len; i++) {
                    if (this.hasClass(obj[i], classStr)) {
                        reg = new RegExp('(\\s|^)' + classStr + '(\\s|$)');
                        obj[i].className = obj[i].className.replace(reg, '');
                    }
                }
            }
            else {
                if (this.hasClass(obj, classStr)) {
                    reg = new RegExp('(\\s|^)' + classStr + '(\\s|$)');
                    obj.className = obj.className.replace(reg, '');
                }
            }
            return this;
        }

        /**
         * @description 替换类名
         * @param obj
         * @param newName
         * @param oldName
         * @return {ecDo}
         */
        replaceClass(obj, newName, oldName) {
            this.removeClass(obj, oldName);
            this.addClass(obj, newName);
            return this;
        }

        /**
         * @description 获取兄弟节点
         * @param obj
         * @param opt
         * @return {Array}
         */
        siblings(obj, opt) {
            let a = []; //定义一个数组，用来存obj的兄弟元素
            let p = obj.previousSibling;
            while (p) { //先取obj的哥哥们 判断有没有上一个哥哥元素，如果有则往下执行 p表示previousSibling
                if (p.nodeType === 1) {
                    a.push(p);
                }
                p = p.previousSibling //最后把上一个节点赋给p
            }
            a.reverse(); //把顺序反转一下 这样元素的顺序就是按先后的了
            let n = obj.nextSibling; //再取obj的弟弟
            while (n) { //判断有没有下一个弟弟结点 n是nextSibling的意思
                if (n.nodeType === 1) {
                    a.push(n);
                }
                n = n.nextSibling;
            }
            if (opt) {
                let _opt = opt.substr(1);
                let b = [];//定义一个数组，用于储存过滤a的数组
                if (opt[0] === '.') {
                    b = a.filter(item => item.className === _opt);
                }
                else if (opt[0] === '#') {
                    b = a.filter(item => item.id === _opt);
                }
                else {
                    b = a.filter(item => item.tagName.toLowerCase() === opt);
                }
                return b;
            }
            return a;
        }

        /**
         * @description 设置样式
         * @param dom
         * @param json
         * @return {ecDo}
         */
        css(dom, json) {
            if (dom.length) {
                for (let i = 0; i < dom.length; i++) {
                    for (let attr in json) {
                        dom[i].style[attr] = json[attr];
                    }
                }
            }
            else {
                for (let attr in json) {
                    dom.style[attr] = json[attr];
                }
            }
            return this;
        }

        /**
         * @description 设置或获取innerHTML
         * @param obj
         * @return {*}
         */
        html(obj) {
            if (arguments.length === 1) {
                return obj.innerHTML;
            } else if (arguments.length === 2) {
                obj.innerHTML = arguments[1];
            }
            return this;
        }

        /**
         * @description 设置或获取文本内容
         * @param obj
         * @return {*}
         */
        text(obj) {
            if (arguments.length === 1) {
                return obj.innerHTML;
            } else if (arguments.length === 2) {
                obj.innerHTML = this.filterStr.handle('html', arguments[1]);
            }
            return this;
        }

        /**
         * @description 显示元素
         * @param obj
         * @return {ecDo}
         */
        show(obj) {
            let blockArr = ['div', 'li', 'ul', 'ol', 'dl', 'table', 'article', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'hr', 'header', 'footer', 'details', 'summary', 'section', 'aside']
            if (blockArr.indexOf(obj.tagName.toLocaleLowerCase()) === -1) {
                obj.style.display = 'inline';
            }
            else {
                obj.style.display = 'block';
            }
            return this;
        }

        /**
         * @description 隐藏元素
         * @param obj
         * @return {ecDo}
         */
        hide(obj) {
            obj.style.display = "none";
            return this;
        }

        /** @description  封装ajax函数
         *  @param {string}obj.type http连接的方式，包括POST和GET两种方式
         *  @param {string}obj.url 发送请求的url
         *  @param {boolean}obj.async 是否为异步请求，true为异步的，false为同步的
         *  @param {object}obj.data 发送的参数，格式为对象类型
         *  @param {function}obj.success ajax发送并接收成功调用的回调函数
         *  @param {function}obj.error ajax发送失败或者接收失败调用的回调函数
         */
//  ajax({
//  	type:'get',
//  	url:'xxx',
//  	data:{
//  		id:'111'
//  	},
//  	success:function(res){
//  		console.log(res)
//  	}
//  })
        ajax(obj) {
            let _options = Object.assign({
                type: 'GET',
                url: '',
                async: true,
                data: null,
                success() {
                },
                error() {
                }
            }, obj);
            _options.type = _options.type.toUpperCase();
            let xmlHttp = null;
            if (XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            let params = [];
            for (let key in _options.data) {
                params.push(key + '=' + _options.data[key]);
            }
            let postData = params.join('&');
            if (_options.type.toUpperCase() === 'GET') {
                xmlHttp.open(_options.type, `${_options.url}?${postData}`, _options.async);
                xmlHttp.send(null);
            } else if (_options.type.toUpperCase() === 'POST') {
                xmlHttp.open(_options.type, _options.url, _options.async);
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xmlHttp.send(postData);
            }
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    _options.success(xmlHttp.responseText);
                } else {
                    _options.error(xmlHttp.responseText);
                }
            };
        }

        /**
         * @description 图片没加载出来时用一张图片代替
         * @param obj.dom
         * @param obj.url
         * @param obj.errorUrl
         * @param obj.fn
         */
        aftLoadImg(obj) {
            let oImg = new Image(), _this = this;
            oImg.src = obj.url;
            oImg.onload = function () {
                obj.dom.src = oImg.src;
                if (obj.fn && _this.isType(obj.fn, 'function')) {
                    obj.fn(obj.dom);
                }
            };
            if (obj.errorUrl) {
                oImg.onerror = function () {
                    obj.src = obj.errorUrl;
                    if (obj.fn && _this.isType(obj.fn, 'function')) {
                        obj.fn(obj.dom);
                    }
                }
            }
        }

        /**
         * @description 图片滚动懒加载
         * @param className 要遍历图片的类名
         * @param num 距离多少的时候开始加载 默认 0
         * @param errorUrl 出错时候的图片
         */
        lazyLoadImg(className = 'ec-load-img', num = 0, errorUrl = null) {
            let oImgLoad = document.getElementsByClassName(className), _this = this, _src = '';
            for (let i = 0, len = oImgLoad.length; i < len; i++) {
                //如果图片已经滚动到指定的高度
                if (document.documentElement.clientHeight + document.documentElement.scrollTop > oImgLoad[i].offsetTop - num && !oImgLoad[i].isLoad) {
                    //记录图片是否已经加载
                    oImgLoad[i].isLoad = true;
                    //设置过渡，当图片下来的时候有一个图片透明度变化
                    oImgLoad[i].style.cssText = "transition: ''; opacity: 0;";
                    oImgLoad[i].style.transition = "";
                    oImgLoad[i].style.opacity = "0";
                    _src = oImgLoad[i].dataset ? oImgLoad[i].dataset.src : oImgLoad[i].getAttribute("data-src");
                    this.aftLoadImg({
                        dom: oImgLoad[i],
                        url: _src,
                        errorUrl: errorUrl,
                        fn: function (o) {
                            //添加定时器，确保图片已经加载完了，一秒后再把图片指定的css样式清掉
                            setTimeout(() => {
                                if (o.isLoad) {
                                    o.style.transition = "";
                                }
                            }, 1000)
                        }
                    });
                    //加上动画，透明度样式
                    (function (i) {
                        setTimeout(() => {
                            oImgLoad[i].style.cssText = "transition:all 1s; opacity: 1;";
                        }, 16)
                    })(i);
                }
            }
        }

        /**
         * @description 加载图片
         * @param className
         * @param cb
         */
        loadImg(className, cb) {
            let _dom = [...document.querySelectorAll('.' + className)], now = 0, len = _dom.length;

            function handleLoad(dom) {
                dom.src = dom.dataset ? dom.dataset.src : dom.getAttribute("data-src");
                dom.onerror = dom.onload = function () {
                    now++
                    console.log(now, len)
                    //如果还有图片待加载
                    if (_dom.length > 0) {
                        //递归调用加载
                        handleLoad(_dom.shift());
                    }
                    else {
                        cb && cb();
                    }
                }
            }

            handleLoad(_dom.shift());
        }

        /**
         * @description 关键词加标签（多个关键词用空格隔开）
         * @param str
         * @param key
         * @param tag
         * @return {XML|string|void|*}
         */
        findKey(key, tag = 'span') {
            let arr = null, regStr = null, content = null, Reg = null;
            //alert(regStr); //    如：(前端|过来)
            regStr = "(" + key.split(/\s+/).join('|') + ")";
            //alert(regStr); //    如：(前端|过来)
            content = this.obj;
            //alert(Reg);//        /如：(前端|过来)/g
            Reg = new RegExp(regStr, "g");
            //过滤html标签 替换标签，往关键字前后加上标签
            content = content.replace(/<\/?[^>]*>/g, '')
            this.obj= content.replace(Reg, "<" + tag + ">$1</" + tag + ">");
            return this;
        }
//***************DOM模块END*******************************/
    }
    return function (obj) {
        return new handle(obj);
    }
})();