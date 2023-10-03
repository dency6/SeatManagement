import * as XLSX from "xlsx";

function readFileFromExcel(file) {
  if (!file || !(file instanceof Blob)) {
    console.error("Invalid file object:", file);
    return;
  }
  const reader = new FileReader();
  reader.onload = (evt) => {
    const bstr = evt.target.result;
    const wb = XLSX.read(bstr, { type: "binary" });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
    // console.log("Data>>>" + data);
    console.log(convertToJson(data));
    const jsonData = convertToJson(data);
    // fetch("/api/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(jsonData),
    // })
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };
  reader.readAsBinaryString(file);
}

function convertToJson(csv) {
  var lines = csv.split("\n");

  var headers = lines[0].split(",");
  var result = [];

  for (var i = 0; i < headers.length; i++) {
    var column = {
      [headers[i]]: [],
    };
    result.push(column);
  }

  for (var i = 1; i < lines.length; i++) {
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      var column = result[j];
      column[headers[j]].push(currentline[j]);
    }
  }

  return result;
}

export function excelToJson(file) {
  readFileFromExcel(file);
}
