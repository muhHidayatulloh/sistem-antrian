import React, { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../services/socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminPage = () => {
  const [antrian, setAntrian] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQueue, setTotalQueue] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalProcessed, setTotalProcessed] = useState(0);

  const limit = 10; // jumlah per halaman

  const fetchData = async (page = 1) => {
    try {
      const res = await api.get(`/queue?page=${page}&limit=${limit}`);
      setAntrian(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalQueue(res.data.totalItems);
      setTotalPending(res.data.totalPending);
      setTotalProcessed(res.data.totalProcessed);
    } catch (err) {
      alert("Gagal mengambil data antrian: " + err);
    }
  };

  const handleProses = async (id) => {
    await api.put(`/queue/${id}`);
    fetchData(currentPage); // Refresh data
  };

  // untuk pilih halaman
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchData(currentPage);

    socket.on("update-antrian", (data) => {
      fetchData(currentPage);
    });

    return () => {
      socket.off("update-antrian");
    };
  }, [currentPage]); // render ketika currentPage berubah

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-2">
          <div className="card">
            <div className="card-body">
              <div className="card-title text-warning" style={{ fontSize: "2rem" }}><FontAwesomeIcon icon="users" /> <span className="p-2">{totalQueue}</span> </div>
              <div className="card-text"><strong>Total Antrian</strong></div>
            </div>
          </div>
        </div>
        <div className="col-sm-2">
          <div className="card">
            <div className="card-body">
              <div className="card-title text-danger" style={{ fontSize: "2rem" }}><FontAwesomeIcon icon="users" /> <span className="p-2">{totalPending}</span> </div>
              <div className="card-text"><strong>Total Pending</strong></div>
            </div>
          </div>
        </div>
        <div className="col-sm-2">
          <div className="card">
            <div className="card-body">
              <div className="card-title text-success" style={{ fontSize: "2rem" }}><FontAwesomeIcon icon="users" /> <span className="p-2">{totalProcessed}</span> </div>
              <div className="card-text"><strong>Total Processed</strong></div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <h1>Daftar Antrian</h1>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Nomor Antrian</th>
                <th scope="col">Status</th>
                <th scope="col">Waktu Masuk</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {antrian.map((item) => (
                <tr key={item._id}>
                  <td>{item.nomor_urut}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          item.status === "pending" ? "red" : "green",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>
                    {item.status === "pending" && (
                      <button
                        onClick={() => handleProses(item._id)}
                        className="btn btn-primary"
                      >
                        Telah Diproses
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 && "active"}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages && "disabled"
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
