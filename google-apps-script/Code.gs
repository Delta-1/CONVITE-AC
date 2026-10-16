// Cole este código em Extensões > Apps Script, dentro da planilha de convidados.
// Execute configurar() uma vez antes de implantar como aplicativo da Web.
const EVENT_ID = 'mavie-lunna-2027-02-28';
function configurar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Abra este projeto a partir da planilha.');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  let sheet = ss.getSheetByName('Confirmacoes');
  if (!sheet) sheet = ss.insertSheet('Confirmacoes');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Data de confirmação', 'Convidado responsável', 'Telefone', 'Acompanhantes', 'Total de pessoas', 'Evento']);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:G1').setBackground('#b74770').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setColumnWidth(1, 280); sheet.setColumnWidth(2, 170); sheet.setColumnWidth(3, 220);
    sheet.setColumnWidth(4, 180); sheet.setColumnWidth(5, 360); sheet.setColumnWidth(6, 140);
    sheet.getRange('D:D').setNumberFormat('@');
  }
}
function output(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function safeCell(value) { return /^[=+\-@\t\r]/.test(value) ? "'" + value : value; }
function doPost(e) {
  let locked = false;
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || e.postData.contents.length > 8000) return output({status:'error'});
    const p = JSON.parse(e.postData.contents);
    if (p.eventId !== EVENT_ID || typeof p.id !== 'string' || !/^[a-f0-9-]{36}$/i.test(p.id)) return output({status:'error'});
    if (typeof p.name !== 'string' || p.name.trim().length < 2 || p.name.length > 100) return output({status:'error'});
    if (typeof p.phone !== 'string' || !/^\+?[\d\s().-]+$/.test(p.phone) || p.phone.replace(/\D/g,'').length < 10 || p.phone.replace(/\D/g,'').length > 15) return output({status:'error'});
    if (!Array.isArray(p.companions) || p.companions.length > 15 || p.companions.some(n => typeof n !== 'string' || n.trim().length < 2 || n.length > 100)) return output({status:'error'});
    lock.waitLock(20000); locked = true;
    const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
    const sheet = ss.getSheetByName('Confirmacoes');
    // O mesmo pedido pode ser reenviado após falha de conexão sem duplicar a linha.
    if (sheet.getLastRow() > 1 && sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(p.id).matchEntireCell(true).findNext()) return output({status:'success',id:p.id});
    sheet.appendRow([p.id, new Date(), safeCell(p.name.trim()), safeCell(p.phone.trim()), safeCell(p.companions.map(n=>n.trim()).join(' • ')), 1+p.companions.length, EVENT_ID]);
    SpreadsheetApp.flush();
    return output({status:'success',id:p.id});
  } catch (_) { return output({status:'error'}); }
  finally { if (locked) lock.releaseLock(); }
}
