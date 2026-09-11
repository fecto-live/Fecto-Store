/*
FECTO FREE ORDER BACKEND
1. Create a Google Sheet called "FECTO Orders".
2. Extensions → Apps Script.
3. Replace the default code with this code.
4. Deploy → New deployment → Web app.
5. Execute as: Me. Who has access: Anyone.
6. Copy the /exec URL into ORDER_ENDPOINT in app.js.
*/

const SHEET_NAME = "Orders";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Order ID","Date","Name","Phone","Email","Address","City","PIN","Payment","Items","Total"]);
  }
  const items = data.items.map(x => `${x.name} x${x.qty} (${x.size}, ${x.color})`).join(" | ");
  const c = data.customer;
  sheet.appendRow([
    data.orderId, data.createdAt, c.name, c.phone, c.email, c.address,
    c.city, c.pincode, c.payment, items, data.total
  ]);
  return ContentService.createTextOutput(JSON.stringify({ok:true,orderId:data.orderId}))
    .setMimeType(ContentService.MimeType.JSON);
}