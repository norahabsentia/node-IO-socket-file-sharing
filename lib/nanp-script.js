const Excel = require('exceljs'),
  path = require('path');


let filepath = path.join('/home/vibrant_node/home/myjournies/arjun/', 'examples/file2server/lib/');
let filename = "nanp.xlsx";
let nanp_filename = filepath + filename;

let number_regions_9xx = {};
let number_regions_8xx = {};
let number_regions_7xx = {};
let number_regions_6xx = {};

function readWorkSheet(worksheet) {
  let number_regions = {};
  worksheet.eachRow(function (row, rowNumber) {
    if (rowNumber !== 1) {
      let num = "" + row.getCell(1).value;
      let reg = row.getCell(3).value;
      number_regions[num] = reg;
    }
  });
  return number_regions;
}

exports.readFile = function () {
  let workbook_nanp = new Excel.Workbook();
  const promise1 = workbook_nanp.xlsx.readFile(nanp_filename)
    .then(function () {
      let worksheet_9xx = workbook_nanp.getWorksheet("9xxx");
      let worksheet_8xx = workbook_nanp.getWorksheet("8xxx");
      let worksheet_7xx = workbook_nanp.getWorksheet("7xxx");
      let worksheet_6xx = workbook_nanp.getWorksheet("6xxx");
      number_regions_9xx = readWorkSheet(worksheet_9xx);
      number_regions_8xx = readWorkSheet(worksheet_8xx);
      number_regions_7xx = readWorkSheet(worksheet_7xx);
      number_regions_6xx = readWorkSheet(worksheet_6xx);
    });
  return promise1;
}

exports.compareNumber = function (numbers_to_compare) {
  let regions = [];
  for (var i = 0; i < numbers_to_compare.length; i++) {
    let number = "" + numbers_to_compare[i];
    let region = "empty";
    if (number.startsWith('9')) {
      region = compareWithRegex(number, number_regions_9xx);
    } else if (number.startsWith('8')) {
      region = compareWithRegex(number, number_regions_8xx);
    } else if (number.startsWith('7')) {
      region = compareWithRegex(number, number_regions_7xx);
    } else if (number.startsWith('6')) {
      region = compareWithRegex(number, number_regions_6xx);
    }
    regions.push(region);
  }
  return regions;
}

function compareWithRegex(number, numbers) {
  return numbers[number.slice(0, 4)];
}