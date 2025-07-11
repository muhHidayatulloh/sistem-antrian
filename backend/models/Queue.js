// backend/models/Queue.js
const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  nomor_urut: {
    type: Number,
    required: true,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processed'],
    default: 'pending'
  },
  lokasi: {
    type: String,
    default: 'default_location' // Bisa diganti sesuai lokasi mesin
  }
});

// Tambahkan index pada field yang sering diquery
queueSchema.index({ status: 1 });         // Untuk filter berdasarkan status
queueSchema.index({ timestamp: -1 });     // Untuk sorting terbaru
queueSchema.index({ lokasi: 1 });         // Untuk multi-lokasi

module.exports = mongoose.model('Queue', queueSchema);