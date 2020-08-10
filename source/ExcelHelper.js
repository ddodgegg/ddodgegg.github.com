const excel = require('xlsx');

function Load(name) {
    let xlsx = excel.readFile(name);

    return xlsx;
}

function GetSheet(xlsx, name) {
    let sheet = xlsx.Sheets[name];

    return sheet;
}

function GetSheetRowCount(sheet) {
    let info = excel.utils.decode_range(sheet['!ref']).e.r;

    return info;
}

function GetSheetColumnCount(sheet) {
    let info = excel.utils.decode_range(sheet['!ref']).e.c;

    return info;
}

function GetSheetColumnWord(num){
    let result = excel.utils.encode_col(num);

    return result;
}

function GetSheetColumnNum(word) {
    let result = excel.utils.decode_col(word);

    return result;
}

function Save(xlsx, name){
    excel.writeFile(xlsx, name);
}

module.exports = {
    Load: Load, 
    Save: Save, 
    GetSheet: GetSheet, 
    GetSheetRowCount: GetSheetRowCount, 
    GetSheetColumnCount: GetSheetColumnCount, 
    GetSheetColumnWord: GetSheetColumnWord, 
    GetSheetColumnNum: GetSheetColumnNum
}