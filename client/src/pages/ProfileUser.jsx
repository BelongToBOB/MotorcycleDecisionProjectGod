import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../style/ProfileUser.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileUser() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeMap, setTypeMap] = useState({});
  const inputFile = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mototype", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        // สร้าง map {id: name}
        const map = {};
        res.data.forEach((t) => (map[t.moto_type_id] = t.moto_type_name));
        setTypeMap(map);
      });
  }, []);

  // Fetch User & History
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(
          "http://localhost:5000/api/recommend-history/mine",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch {
        setHistory([]);
      }
      setLoading(false);
    };
    fetchUser();
    fetchHistory();
  }, []);

  // Upload profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("picture", file);
    const token = localStorage.getItem("token");
    toast.info("Uploading...");
    axios
      .put("http://localhost:5000/api/user/update-picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setUser((prev) => ({ ...prev, picture: res.data.picture }));
        toast.success("Profile picture updated!");
      })
      .catch(() => toast.error("Upload failed!"));
  };

  return (
    <>
      <Navbar />
      <section className="profile-section">
        <div className="profile-box">
          <div className="profile-img">
            <img
              src={preview || user?.picture || "/default-profile.png"}
              alt="Profile"
              onClick={() => inputFile.current.click()}
              style={{ cursor: "pointer" }}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={inputFile}
              onChange={handleFileChange}
            />
            <button
              className="change-img-btn"
              onClick={() => inputFile.current.click()}
            >
              Change Photo
            </button>
          </div>
          <div className="profile-user-info">
            <h3>{user ? user.username || user.email : "Loading..."}</h3>
            <p className="profile-email">{user?.email}</p>
          </div>
          <div className="recommend-history">
            <h4>ประวัติการเลือก</h4>
            <div className="history-list">
              {loading ? (
                <div>Loading...</div>
              ) : history.length === 0 ? (
                <div className="no-history">No history found.</div>
              ) : (
                history.map((h, i) => (
                  <div key={h.id} className="history-item">
                    <div className="history-date">
                      {new Date(h.createdAt).toLocaleString()}
                    </div>
                    <div className="history-row">
                      <span>ประเภท:</span>
                      <b>{typeMap[h.selectedType] || h.selectedType || "-"}</b>
                    </div>
                    <div className="history-row">
                      <span>ยี่ห้อ:</span>
                      <b>{h.criteria?.brand || "เลือกทุกแบรนด์"}</b>
                    </div>
                    <div className="history-row">
                      <span>ลำดับความสำคัญ:</span>
                      <ul>
                        {Array.isArray(h.priority) ? (
                          h.priority.map((p, idx) => (
                            <a key={idx}>
                              <b>
                                <p></p> {idx + 1}.
                              </b>{" "}
                              {p}
                            </a>
                          ))
                        ) : (
                          <li>{String(h.priority)}</li>
                        )}
                      </ul>
                    </div>

                    <div className="history-row">
                      <span>เกณฑ์:</span>
                      <ul>
                        {h.criteria && typeof h.criteria === "object" ? (
                          Object.entries(h.criteria).map(([k, v]) => (
                            <li key={k}>
                              <b>{k}</b>: {String(v)}
                            </li>
                          ))
                        ) : (
                          <li>{String(h.criteria)}</li>
                        )}
                      </ul>
                    </div>
                    <div className="history-row">
                      <span>ผลลัพธ์:</span>
                      <ul>
                        {Array.isArray(h.result) ? (
                          h.result.map((r, idx) => (
                            <li key={idx}>
                              <b>{r.moto_name}</b> ({r.moto_brand}){" "}
                              {typeof r.score !== "undefined" &&
                                ` - Score: ${r.score?.toFixed(4)}`}
                            </li>
                          ))
                        ) : (
                          <li>{String(h.result)}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
