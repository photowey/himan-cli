/**
 * Format the Date Object.
 * @param {*} fmt
 * @returns
 */
Date.prototype.format = function (fmt) {
    var target = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'H+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'S+': this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var key in target) {
        if (new RegExp('(' + key + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (target[key]) : (('00' + target[key]).substr(String(target[key]).length)));
        }
    }
    return fmt;
};

function format(date, format = 'yyyy-MM-dd HH:mm:ss') {
    return date.format(format)
}

module.exports = {
    format
}