import * as XLSX from 'xlsx';
import { getSessionEmail } from '../../lib/session';
import { readClients, saveClients } from '../../lib/store';

export const config = { api: { bodyParser: { sizeLimit: '15mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = getSessionEmail(req) || req.body.email;
  const { filename, dataBase64 } = req.body;
  if (!email || !filename || !dataBase64) {
    return res.status(400).json({ error: 'Missing file.' });
  }

  const ext = (filename.split('.').pop() || '').toLowerCase();
  if (!['csv', 'xlsx', 'xls'].includes(ext)) {
    return res.status(400).json({ error: 'Please upload a .csv, .xlsx, or .xls file.' });
  }

  try {
    const buffer = Buffer.from(dataBase64, 'base64');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }); // array of objects keyed by header row

    if (rows.length === 0) {
      return res.status(400).json({ error: 'That file has no data rows.' });
    }

    // Normalize header keys (trim whitespace) same way the Google Sheets path does
    const cleanRows = rows.map((row) => {
      const obj = {};
      Object.keys(row).forEach((key) => { obj[key.trim()] = String(row[key] ?? ''); });
      return obj;
    });

    const emailKey = Object.keys(cleanRows[0]).find((k) => k.toLowerCase() === 'email');
    if (!emailKey) {
      return res.status(400).json({ error: "Your file must have a column header named 'email'." });
    }

    const clients = await readClients();
    const client = clients[email];
    if (!client) return res.status(404).json({ error: 'Client not found. Please connect first.' });

    client.contactSource = 'upload';
    client.contactFilename = filename;
    client.contactRows = cleanRows;
    client.sheetUrl = null; // uploading a file replaces a previously-connected sheet
    await saveClients(clients);

    res.json({ success: true, rowCount: cleanRows.length, columns: Object.keys(cleanRows[0]) });
  } catch (err) {
    console.error('Upload parse error:', err);
    res.status(400).json({ error: 'Could not read that file. Make sure it\'s a valid CSV or Excel file.' });
  }
}
