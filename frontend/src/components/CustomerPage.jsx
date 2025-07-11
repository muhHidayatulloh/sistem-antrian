import { useEffect, useState } from "react";
import api from "../services/api";
import socket from '../services/socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const base_url_backend = process.env.REACT_APP_API_URL;
const CustomerPage = () => {
  const [lastNumber, setLastNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil nomor urut awal saat pertama kali masuk
  useEffect(() => {
    const fetchLastNumber = async () => {
      try {
        const res = await api.get("/queue/last");
        setLastNumber(res.data.nomor_urut);
      } catch (err) {
        console.error("Gagal mengambil nomor urut terakhir", err);
      }
    };

    fetchLastNumber();

    // Saat socket menerima update dari server
    socket.on("update-antrian", (data) => {
      if (Array.isArray(data) && data.length > 0) {
        const lastQueue = data[data.length - 1];
        setLastNumber(lastQueue.nomor_urut);
      }
    });

    // Bersihkan listener saat komponen dibongkar
    return () => {
      socket.off("update-antrian");
    };
  }, []);

  const handleMasukAntrian = async () => {
    setLoading(true);
    try {
      const res = await api.post("/queue");
      const pdfUrl = res.data.pdfPath;

       // Gabungkan URL dengan aman (hindari double slash)
      const fullPdfUrl = `${base_url_backend}/api/download/pdf${pdfUrl}`.replace(/([^:]\/)\/+/g, "$1");

      // Buat link <a> untuk trigger download
      const link = document.createElement("a");
      link.href = fullPdfUrl;
      link.setAttribute("download", `Antrian_${res.data.data.nomor_urut}.pdf`);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      alert("Gagal masuk antrian");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-sm-12 col-md-12 col-lg-6">
          <div className="shadow-sm p-3 mb-5 bg-body rounded"><FontAwesomeIcon icon="ticket" className="text-success" /> Ambil Antrian Toko Muhhis</div>

          <div className="shadow-sm p-3 mb-5 bg-body rounded d-flex justify-content-center">
            <div className="border border-success rounded p-3 text-center col-sm-10">
              <h1>Nomor Antrian Terakhir</h1>
              {lastNumber !== null && (
                <p className="text-success" style={{ fontSize: "5rem" }}><strong>{lastNumber}</strong></p>
              )}
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Memproses...
                </>
              ) : (
                <>
                <button className="btn btn-success btn-rounded p-3" onClick={handleMasukAntrian}><FontAwesomeIcon icon="user-plus" /> &nbsp; Masuk Antrian</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
