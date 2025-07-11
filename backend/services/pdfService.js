const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');

const generatePDF = async (nomorUrut, timestamp) => {
  const html = `
    <div style="text-align: center;">
      <h1>Nomor Antrian</h1>
      <small>Toko Muhhis</small>
      <br>
      ---------------------------
      <br>
      <span style="color: red;font-size: 50px;"><b>${nomorUrut}</b></span>
      <p>${new Date(timestamp).toLocaleString()}</p>
    </div>
  `;

  const document = {
    html: html,
    data: {},
    path: `./public/antrian_${nomorUrut}.pdf`
  };

  const options = {
    format: 'A6', // ✅ A6 lebih kecil dari A4, cocok untuk struk/nota
    orientation: 'portrait',
    border: '5mm',
  };

  await pdf.create(document, options);
  return `/antrian_${nomorUrut}.pdf`;
};

module.exports = { generatePDF };