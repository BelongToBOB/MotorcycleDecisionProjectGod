import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../style/Statistic.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

export default function Statistic() {
  const [stat, setStat] = useState(null);
  const [types, setTypes] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState({
    start: "",
    end: "",
  });

  // Filter สำหรับเชิงลึก
  const [deepFilter, setDeepFilter] = useState({
    brand: "",
    type: "",
    cc: "",
    price: "",
  });

  // โหลดข้อมูล stat + ประเภท + history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [statRes, typeRes, historyRes] = await Promise.all([
          fetch("http://localhost:5000/api/history/statistic", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
          fetch("http://localhost:5000/api/mototype", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
          fetch("http://localhost:5000/api/history", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
        ]);
        setStat(statRes);
        setTypes(typeRes);
        setHistory(historyRes);
      } catch (err) {
        console.error("โหลดข้อมูลไม่สำเร็จ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!stat) return <div>ไม่สามารถโหลดข้อมูลสถิติได้</div>;

  const typeMap = {};
  types.forEach((t) => (typeMap[t.moto_type_id] = t.moto_type_name));

  // ✅ Filter เชิงลึก
  const filteredHistory = history.filter((h) => {
    const result = Array.isArray(h.result) ? h.result[0] : h.result;
    const createdAt = dayjs(h.createdAt);

    const inDateRange =
      (!dateFilter.start ||
        createdAt.isAfter(dayjs(dateFilter.start).startOf("day"))) &&
      (!dateFilter.end ||
        createdAt.isBefore(dayjs(dateFilter.end).endOf("day")));

    return (
      (!deepFilter.brand || h.criteria?.brand === deepFilter.brand) &&
      (!deepFilter.type ||
        String(h.selectedType) === String(deepFilter.type)) &&
      (!deepFilter.cc || h.criteria?.cc === deepFilter.cc) &&
      (!deepFilter.price || h.criteria?.price === deepFilter.price) &&
      (!deepFilter.fuel || h.criteria?.fuel === deepFilter.fuel) &&
      (!deepFilter.maintenance ||
        h.criteria?.maintenance === deepFilter.maintenance) &&
      (!deepFilter.model || result?.model === deepFilter.model) &&
      inDateRange
    );
  });

  // ✅ Export CSV เฉพาะ filteredHistory
  const exportDeepCSV = () => {
    const rows = filteredHistory.map((h) => {
      const result = Array.isArray(h.result) ? h.result[0] : h.result;
      return {
        username: h.user?.username || "",
        type: typeMap[h.selectedType] || h.selectedType,
        brand: h.criteria?.brand || "",
        cc: h.criteria?.cc || "",
        price: h.criteria?.price || "",
        maintenance: h.criteria?.maintenance || "",
        fuel: h.criteria?.fuel || "",
        model: h.bestModel || "",
        score:
          result?.score !== undefined && result?.score !== null
            ? Number(result.score).toFixed(3)
            : "N/A",
        createdAt: dayjs(h.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      };
    });
    const csv = Papa.unparse(rows);
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "deep_analysis.csv");
  };

  const exportDeepPDF = () => {
    const printContent = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>ประเภท</th>
          <th>ยี่ห้อ</th>
          <th>รุ่น</th>
          <th>CC</th>
          <th>ช่วงราคา</th>
          <th>Maintenance</th>
          <th>Fuel</th>
          <th>คะแนน</th>
          <th>วันที่</th>
        </tr>
      </thead>
      <tbody>
        ${filteredHistory
          .map(
            (h, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${h.user?.username || "-"}</td>
            <td>${typeMap[h.selectedType] || h.selectedType}</td>
            <td>${h.criteria?.brand || "-"}</td>
            <td>${h.bestModel || "-"}</td>
            <td>${h.criteria?.cc || "-"}</td>
            <td>${h.criteria?.price || "-"}</td>
            <td>${h.criteria?.maintenance || "-"}</td>
            <td>${h.criteria?.fuel || "-"}</td>
            <td>${
              h.bestScore !== undefined && h.bestScore !== null
                ? Number(h.bestScore).toFixed(3)
                : "N/A"
            }</td>
            <td>${dayjs(h.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

    const win = window.open("", "_blank");
    win.document.write(`
    <html>
      <head>
        <title>Export PDF</title>
        <style>
          body { font-family: "TH SarabunPSK", sans-serif; padding: 20px; }
          h2 { text-align: center; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: center; }
          th { background: #f2f2f2; }
          .meta { margin: 8px 0; }
        </style>
      </head>
      <body>
        <h2>ผลลัพธ์ตามเงื่อนไข</h2>
        <div class="meta">วันที่ Export: ${dayjs().format(
          "YYYY-MM-DD HH:mm:ss"
        )}</div>
        <div class="meta">
          ยี่ห้อ: ${deepFilter.brand || "ทั้งหมด"} |
          ประเภท: ${typeMap[deepFilter.type] || "ทั้งหมด"} |
          CC: ${deepFilter.cc || "ทั้งหมด"} |
          ราคา: ${deepFilter.price || "ทั้งหมด"}
        </div>
        <div class="meta">
          ${
            dateFilter.start || dateFilter.end
              ? `ช่วงวันที่: ${dateFilter.start || "ไม่กำหนด"} - ${
                  dateFilter.end || "ไม่กำหนด"
                }`
              : "ช่วงวันที่: ทั้งหมด"
          }
        </div>
        ${printContent}
      </body>
    </html>
  `);
    win.document.close();
    win.print();
  };

  // Helper: จัดอันดับ
  const sortEntries = (obj) =>
    Object.entries(obj)
      .map(([k, v]) => ({ name: k, value: v }))
      .sort((a, b) => b.value - a.value);

  const brandSorted = sortEntries(stat.brandCount);
  const priceSorted = sortEntries(stat.priceCount);

  // เตรียมข้อมูล Chart
  const typeData = Object.entries(stat.typeCount).map(([type, count]) => ({
    name: typeMap[type] || type,
    value: count,
  }));
  const brandData = Object.entries(stat.brandCount).map(([brand, count]) => ({
    name: brand,
    value: count,
  }));
  const priceData = Object.entries(stat.priceCount).map(([price, count]) => ({
    name: price,
    value: count,
  }));

  const COLORS = [
    "#2e86de",
    "#e74c3c",
    "#27ae60",
    "#f39c12",
    "#9b59b6",
    "#16a085",
    "#d35400",
  ];

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="statistic-section">
        <div className="header-flex no-print">
          <h2>📊 สถิติรายงาน</h2>
        </div>

        {/* Highlight Cards */}
        <div className="highlight-cards no-print">
          <div className="highlight-card">
            <h3>รุ่นที่ถูกเลือกมากที่สุด</h3>
            <p>
              <b>
                {stat.topModels[0]?.brand
                  ? `${stat.topModels[0].brand} ${
                      stat.topModels[0]?.model || stat.topModels[0]?.moto_name
                    }`
                  : stat.topModels[0]?.model || stat.topModels[0]?.moto_name}
              </b>
            </p>
            <span>{stat.topModels[0]?.count} ครั้ง</span>

            {stat.topModels.slice(1, 3).map((m, i) => (
              <div key={i} className="sub-rank">
                {m.brand
                  ? `${m.brand} ${m.model || m.moto_name}`
                  : m.model || m.moto_name}{" "}
                ({m.count} ครั้ง)
              </div>
            ))}
          </div>

          <div className="highlight-card">
            <h3>ยี่ห้อที่ถูกเลือกบ่อย</h3>
            <p>
              <b>{brandSorted[0]?.name}</b>
            </p>
            <span>{brandSorted[0]?.value} ครั้ง</span>
            {brandSorted.slice(1, 3).map((b, i) => (
              <div key={i} className="sub-rank">
                {b.name} ({b.value} ครั้ง)
              </div>
            ))}
          </div>
          <div className="highlight-card">
            <h3>ช่วงราคาที่นิยม</h3>
            <p>
              <b>{priceSorted[0]?.name}</b>
            </p>
            <span>{priceSorted[0]?.value} ครั้ง</span>
            {priceSorted.slice(1, 3).map((p, i) => (
              <div key={i} className="sub-rank">
                {p.name} ({p.value} ครั้ง)
              </div>
            ))}
          </div>
        </div>

        <div className="summary-cards no-print">
          <div className="summary-card">
            <h3>ผู้ใช้งานทั้งหมด</h3>
            <p>{new Set(history.map((h) => h.user?.username)).size} คน</p>
          </div>
          <div className="summary-card">
            <h3>การเลือกทั้งหมด</h3>
            <p>{history.length} ครั้ง</p>
          </div>
          <div className="summary-card">
            <h3>รุ่นที่ครอบคลุม</h3>
            <p>18 รุ่น</p>
          </div>
          <div className="summary-card">
            <h3>กิจกรรมล่าสุด</h3>
            <p>
              วันนี้:{" "}
              {
                history.filter((h) => dayjs(h.createdAt).isSame(dayjs(), "day"))
                  .length
              }{" "}
              ครั้ง
            </p>
            <span>
              สัปดาห์นี้:{" "}
              {
                history.filter((h) =>
                  dayjs(h.createdAt).isSame(dayjs(), "week")
                ).length
              }{" "}
              ครั้ง
            </span>
          </div>
        </div>

        {/* Comparative Insights */}
        <div className="insight-card no-print">
          <h3>📊 ข้อมูลเชิงเปรียบเทียบ</h3>
          <ul>
            <li>
              <b>ยี่ห้อ: </b>
              {brandSorted[0]?.name} ถูกเลือก {brandSorted[0]?.value} ครั้ง
              ซึ่งมากกว่า {brandSorted[brandSorted.length - 1]?.name}(
              {brandSorted[brandSorted.length - 1]?.value} ครั้ง) ถึง{" "}
              {brandSorted[0]?.value -
                brandSorted[brandSorted.length - 1]?.value}{" "}
              ครั้ง
            </li>
            <li>
              <b>ช่วงราคา: </b>
              {priceSorted[0]?.name} นิยมที่สุด ({priceSorted[0]?.value} ครั้ง)
              เทียบกับ {priceSorted[priceSorted.length - 1]?.name}(
              {priceSorted[priceSorted.length - 1]?.value} ครั้ง)
            </li>
            <li>
              <b>ประเภท: </b>
              {typeData[0]?.name} มีสัดส่วนสูงสุด ({typeData[0]?.value} ครั้ง)
              มากกว่า {typeData[typeData.length - 1]?.name} (
              {typeData[typeData.length - 1]?.value} ครั้ง)
            </li>
          </ul>
        </div>

        {/* Charts */}
        <div className="chart-section no-print">
          <div className="chart-box">
            <h3>ประเภทที่ถูกเลือกบ่อย</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>ยี่ห้อที่ถูกเลือกบ่อย</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={brandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2e86de" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>ช่วงราคาที่ถูกเลือกบ่อย</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#27ae60" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History Table */}
        <div className="stat-card">
          <h3>🕒 10 ประวัติล่าสุด</h3>
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>ประเภท</th>
                <th>ยี่ห้อ</th>
                <th>รุ่น</th>
                <th>CC</th>
                <th>ช่วงราคา</th>
                <th>Maintenance</th>
                <th>Consumption</th>
                <th>คะแนน</th>
                <th>วันที่</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 10).map((h, idx) => (
                <tr key={h.history_id}>
                  <td>{idx + 1}</td>
                  <td>{h.user?.username || "-"}</td>
                  <td>{typeMap[h.selectedType] || h.selectedType}</td>
                  <td>{h.criteria?.brand || "-"}</td>
                  <td>{h.bestModel || "-"}</td>
                  <td>{h.criteria?.cc || "-"}</td>
                  <td>{h.criteria?.price || "-"}</td>
                  <td>{h.criteria?.maintenance || "-"}</td>
                  <td>{h.criteria?.fuel || "-"}</td>
                  <td>
                    {h.bestScore !== undefined && h.bestScore !== null
                      ? Number(h.bestScore).toFixed(3)
                      : "N/A"}
                  </td>
                  <td>{dayjs(h.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Section ใหม่: วิเคราะห์เชิงลึก */}
        <div className="filter-section">
          <h3>🔎 วิเคราะห์เชิงลึก</h3>

          {/* Filter Form */}
          <div className="filter-box-inline">
            <div className="filter-item">
              <label>ยี่ห้อ</label>
              <select
                value={deepFilter.brand}
                onChange={(e) =>
                  setDeepFilter({ ...deepFilter, brand: e.target.value })
                }
              >
                <option value="">ทั้งหมด</option>
                <option value="Honda">Honda</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Kawasaki">Kawasaki</option>
                <option value="Suzuki">Suzuki</option>
                <option value="GPX">GPX</option>
                <option value="Royal Enfield">Royal Enfield</option>
                <option value="BMW">BMW</option>
                <option value="Ducati">Ducati</option>
                <option value="Harley Davidson">Harley Davidson</option>
                <option value="Triumph">Triumph</option>
                <option value="Vespa">Vespa</option>
                <option value="Lambretta">Lambretta</option>
                <option value="Benelli">Benelli</option>
                <option value="KTM">KTM</option>
                <option value="Aprilia">Aprilia</option>
                <option value="Indian">Indian</option>
                <option value="Scomadi">Scomadi</option>
                <option value="Zontes">Zontes</option>
              </select>
            </div>

            <div className="filter-item">
              <label>ประเภท</label>
              <select
                value={deepFilter.type}
                onChange={(e) =>
                  setDeepFilter({ ...deepFilter, type: e.target.value })
                }
              >
                <option value="">ทั้งหมด</option>
                {types.map((t) => (
                  <option key={t.moto_type_id} value={t.moto_type_id}>
                    {t.moto_type_name}
                  </option>
                ))}
              </select>
            </div>

            {/* ช่วงราคา */}
            <div className="filter-item">
              <label>ช่วงราคา</label>
              <select
                value={deepFilter.price}
                onChange={(e) =>
                  setDeepFilter({ ...deepFilter, price: e.target.value })
                }
              >
                <option value="">ทั้งหมด</option>
                <option value="ไม่เกิน 50,000 บาท">ไม่เกิน 50,000 บาท</option>
                <option value="50,000 - 100,000 บาท">
                  50,000 - 100,000 บาท
                </option>
                <option value="100,000 - 200,000 บาท">
                  100,000 - 200,000 บาท
                </option>
                <option value="200,000 - 500,000 บาท">
                  200,000 - 500,000 บาท
                </option>
                <option value="มากกว่า 500,000 บาท">มากกว่า 500,000 บาท</option>
              </select>
            </div>

            {/* CC */}
            <div className="filter-item">
              <label>CC</label>
              <select
                value={deepFilter.cc}
                onChange={(e) =>
                  setDeepFilter({ ...deepFilter, cc: e.target.value })
                }
              >
                <option value="">ทั้งหมด</option>
                <option value="110-125 cc">110-125 cc</option>
                <option value="126-160 cc">126-160 cc</option>
                <option value="161-300 cc">161-300 cc</option>
                <option value="301-500 cc">301-500 cc</option>
                <option value="501-999 cc">501-999 cc</option>
                <option value="1000 cc ขึ้นไป">1000 cc ขึ้นไป</option>
              </select>
            </div>

            {/* Fuel */}
            <div className="filter-item">
              <label>Fuel</label>
              <select
                value={deepFilter.fuel}
                onChange={(e) =>
                  setDeepFilter({ ...deepFilter, fuel: e.target.value })
                }
              >
                <option value="">ทั้งหมด</option>
                <option value="60-40 กม./ลิตร">60-40 กม./ลิตร</option>
                <option value="40-30 กม./ลิตร">40-30 กม./ลิตร</option>
                <option value="30-20 กม./ลิตร">30-20 กม./ลิตร</option>
                <option value="ต่ำกว่า 20 กม./ลิตร (ขับขี่เน้นสมรรถนะที่สูง)">
                  ต่ำกว่า 20 กม./ลิตร (ขับขี่เน้นสมรรถนะที่สูง)
                </option>
              </select>
            </div>

            {/* Maintenance */}
            <div className="filter-item">
              <label>Maintenance</label>
              <select
                value={deepFilter.maintenance}
                onChange={(e) =>
                  setDeepFilter({ ...deepFilter, maintenance: e.target.value })
                }
              >
                <option value="">ทั้งหมด</option>
                <option value="ต่ำกว่า 2,000 บาท/ปี">
                  ต่ำกว่า 2,000 บาท/ปี
                </option>
                <option value="2,000 - 5,000 บาท/ปี">
                  2,000 - 5,000 บาท/ปี
                </option>
                <option value="5,000 - 10,000 บาท/ปี">
                  5,000 - 10,000 บาท/ปี
                </option>
                <option value="มากกว่า 10,000 บาท/ปี">
                  มากกว่า 10,000 บาท/ปี
                </option>
              </select>
            </div>

            <div className="filter-item">
              <label>วันที่เริ่มต้น</label>
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, start: e.target.value })
                }
              />
            </div>

            <div className="filter-item">
              <label>วันที่สิ้นสุด</label>
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, end: e.target.value })
                }
              />
            </div>
          </div>

          {/* ปุ่ม Export */}
          <div style={{ marginTop: "12px" }}>
            <button className="export-btn" onClick={exportDeepCSV}>
              Export CSV
            </button>
            <button className="export-btn" onClick={exportDeepPDF}>
              Export PDF
            </button>
          </div>

          {/* ตารางผลลัพธ์ */}
          {/* ตารางผลลัพธ์ UI */}
          <div className="stat-card" style={{ marginTop: "20px" }}>
            <h3>📋 ผลลัพธ์ตามเงื่อนไข</h3>
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>ประเภท</th>
                  <th>ยี่ห้อ</th>
                  <th>รุ่น</th>
                  <th>CC</th>
                  <th>ช่วงราคา</th>
                  <th>Maintenance</th>
                  <th>Fuel</th>
                  <th>คะแนน</th>
                  <th>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((h, idx) => (
                  <tr key={h.history_id}>
                    <td>{idx + 1}</td>
                    <td>{h.user?.username || "-"}</td>
                    <td>{typeMap[h.selectedType] || h.selectedType}</td>
                    <td>{h.criteria?.brand || "-"}</td>
                    <td>{h.bestModel || "-"}</td>
                    <td>{h.criteria?.cc || "-"}</td>
                    <td>{h.criteria?.price || "-"}</td>
                    <td>{h.criteria?.maintenance || "-"}</td>
                    <td>{h.criteria?.fuel || "-"}</td>
                    <td>
                      {h.bestScore !== undefined && h.bestScore !== null
                        ? Number(h.bestScore).toFixed(3)
                        : "N/A"}
                    </td>
                    <td>{dayjs(h.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ ตารางซ่อนสำหรับ PDF */}
          <div id="print-area" style={{ display: "none" }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>ประเภท</th>
                  <th>ยี่ห้อ</th>
                  <th>รุ่น</th>
                  <th>CC</th>
                  <th>ช่วงราคา</th>
                  <th>Maintenance</th>
                  <th>Fuel</th>
                  <th>คะแนน</th>
                  <th>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((h, idx) => (
                  <tr key={h.history_id}>
                    <td>{idx + 1}</td>
                    <td>{h.user?.username || "-"}</td>
                    <td>{typeMap[h.selectedType] || h.selectedType}</td>
                    <td>{h.criteria?.brand || "-"}</td>
                    <td>{h.bestModel || "-"}</td>
                    <td>{h.criteria?.cc || "-"}</td>
                    <td>{h.criteria?.price || "-"}</td>
                    <td>{h.criteria?.maintenance || "-"}</td>
                    <td>{h.criteria?.fuel || "-"}</td>
                    <td>{h.bestScore || "-"}</td>
                    <td>{dayjs(h.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
