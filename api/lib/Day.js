"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSameDay = exports.normalizeDateString = void 0;
function normalizeDateString(dateStr) {
    const date = new Date(dateStr);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}
exports.normalizeDateString = normalizeDateString;
function isSameDay(date1, date2) {
    const d1 = normalizeDateString(date1);
    const d2 = normalizeDateString(date2);
    // console.log(`Comparing ${d1} and ${d2} ${d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()}`)
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}
exports.isSameDay = isSameDay;
