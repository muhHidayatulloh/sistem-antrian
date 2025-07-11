const fs = require("fs");
const path = require("path");

module.exports = (context) => {
  const Queue = require("../models/Queue");
  const Counter = require("../models/Counter");
  const { generatePDF } = require("../services/pdfService");
  const { io } = context;

  // Get auto-increment number
  const getNextSequence = async (name) => {
    const counter = await Counter.findOneAndUpdate(
      { _id: name },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    return counter.sequence_value;
  };

  // POST /api/queue - Masuk antrian
  const joinQueue = async (req, res) => {
    try {
      const location = req.query.lokasi || "default";
      const queueNumber = await getNextSequence("nomor_urut");

      const newQueue = new Queue({
        nomor_urut: queueNumber,
        timestamp: new Date(),
        status: "pending",
        lokasi: location,
      });

      await newQueue.save();

      // Generate PDF
      const pdfPath = await generatePDF(queueNumber, new Date());

      // kirim update ke semua client via socket.io
      const updatedQueue = await Queue.find().sort({ nomor_urut: 1 });
      io.emit("update-antrian", updatedQueue);

      // Send response
      res.json({
        message: "Berhasil masuk antrian",
        data: newQueue,
        pdfPath,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal masuk antrian" });
    }
  };

  // GET /api/queue - lihat semua antrian
  const getAllQueues = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limitParam = req.query.limit ? parseInt(req.query.limit) : null;
      const skip = limitParam ? (page - 1) * limitParam : 0;

      // Ambil status dari query params, jika ada
      const { status } = req.query;
      const filter = {};

      if (status) {
        // Cek apakah status ada di daftar valid
        const validStatuses = ["pending", "processed"];
        if (validStatuses.includes(status.toLowerCase())) {
          filter.status = status.toLowerCase(); // kecilkan huruf
        }
      }

      let query = Queue.find(filter).sort({ nomor_urut: 1 });

      if (limitParam !== null) {
        query = query.skip(skip).limit(limitParam);
      }

      const data = await query;
      const total = await Queue.countDocuments();
      const totalFiltered = await Queue.countDocuments(filter);
      const pendingCount = await Queue.countDocuments({ status: "pending" });
      const processedCount = await Queue.countDocuments({ status: "processed" });

      res.json({
        currentPage: limitParam ? page : 1,
        totalPages: limitParam ? Math.ceil(totalFiltered / limitParam) : 1,
        totalItemsFiltered: totalFiltered,
        totalItems: total,
        totalPending: pendingCount,
        totalProcessed: processedCount,
        data,
      });
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil data antrian", error: err });
    }
  };

  // PUT /api/queue/:id - Tandai antrian telah di proses ( ubah status antrian jadi "Telah Diproses")
  const markAsProcessed = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Queue.findByIdAndUpdate(
        id,
        { status: "processed" },
        { new: true }
      );

      // kirim update ke semua client via socket.io
      const updatedQueue = await Queue.find().sort({ nomor_urut: 1 });
      io.emit("update-antrian", updatedQueue);

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Gagal memperbarui status antrian" });
    }
  };

  // GET /api/queue/last - Mengambil nomor antrian terakhir
  const getLastQueueNumber = async (req, res) => {
    try {
      const lastQueue = await Queue.findOne().sort({ nomor_urut: -1 });

      if (!lastQueue) {
        return res.json({ nomor_urut: 0, message: "Belum ada antrian" });
      }

      res.json({ nomor_urut: lastQueue.nomor_urut });
    } catch (err) {
      console.error("Gagal ambil nomor urut terakhir:", err);
      res.status(500).json({ error: "Gagal mengambil data" });
    }
  };

  return {
    joinQueue,
    getAllQueues,
    markAsProcessed,
    getLastQueueNumber,
  };
};
