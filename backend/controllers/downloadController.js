const fs = require('fs');
const path = require('path');

const pdfDownload =  (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', req.params.filename);

  if (fs.existsSync(filePath)) {
    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', 'attachment'); // Ini yang bikin auto-download
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send('File tidak ditemukan');
  }
}

module.exports = { pdfDownload };