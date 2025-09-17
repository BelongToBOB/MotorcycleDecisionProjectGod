const prisma = require('../config/prisma');
const { CRITERIAS, PAIRWISE_MATRIX, CRITERIA_DIRECTIONS } = require('../utils/ahpMatrix');
const { ahpWeights, topsisRank } = require('../utils/ahpTopsis');

// === Metadata
const criteriaMeta = [
  { key: "moto_price", label: "Price" },
  { key: "moto_cc", label: "CC" },
  { key: "maintenance_cost", label: "Maintenance Cost" },
  { key: "consumption_rate", label: "Fuel Consumption" },
];

const priorityKeyMap = {
  price: "moto_price",
  cc: "moto_cc",
  consumption: "consumption_rate",
  maintenance: "maintenance_cost",
};

const priceRanges = {
  "ไม่เกิน 50,000 บาท": { lt: 50001 },
  "50,000 - 100,000 บาท": { gte: 50000, lte: 100000 },
  "100,000 - 200,000 บาท": { gte: 100000, lte: 200000 },
  "200,000 - 500,000 บาท": { gte: 200000, lte: 500000 },
  "มากกว่า 500,000 บาท": { gt: 500000 },
};

const ccRanges = {
  "110-125 cc": { gte: 110, lte: 125 },
  "126-160 cc": { gte: 126, lte: 160 },
  "161-300 cc": { gte: 161, lte: 300 },
  "301-500 cc": { gte: 301, lte: 500 },
  "501-999 cc": { gte: 501, lte: 995 },
  "1000 cc ขึ้นไป": { gte: 996 },
};

const fuelRanges = {
  "60-40 กม./ลิตร": { gte: 40, lte: 60 },
  "40-30 กม./ลิตร": { gte: 30, lte: 40 },
  "30-20 กม./ลิตร": { gte: 20, lte: 30 },
  "ต่ำกว่า 20 กม./ลิตร (ขับขี่เน้นสมรรถนะที่สูง)": { lt: 20 },
};

const maintenanceRanges = {
  "ต่ำกว่า 2,000 บาท/ปี": { lt: 2000 },
  "2,000 - 5,000 บาท/ปี": { gte: 2000, lte: 5000 },
  "5,000 - 10,000 บาท/ปี": { gte: 5000, lte: 10000 },
  "มากกว่า 10,000 บาท/ปี": { gt: 10000 },
};

// === Helper: สร้าง object filter
function buildWhereFilter(selectedType, criteria) {
  const where = {};

  if (selectedType) where.moto_type_id = Number(selectedType);
  if (criteria?.brand && criteria.brand !== "เลือกทุกแบรนด์") {
    where.moto_brand = { contains: criteria.brand };
  }

  if (criteria.price) where.moto_price = priceRanges[criteria.price];
  if (criteria.cc) where.moto_cc = ccRanges[criteria.cc];
  if (criteria.fuel) where.consumption_rate = fuelRanges[criteria.fuel];
  if (criteria.maintenance) where.maintenance_cost = maintenanceRanges[criteria.maintenance];

  return where;
}

// === Helper: สร้าง map object จาก array
function toMap(keys, values) {
  return keys.reduce((obj, k, i) => {
    obj[k] = values[i];
    return obj;
  }, {});
}

// === Controller
exports.recommend = async (req, res) => {
  try {
    const { selectedType, priority, criteria } = req.body;
    const where = buildWhereFilter(selectedType, criteria);

    const bikes = await prisma.motorcycle.findMany({
      where,
      include: { mototype: true },
    });

    if (!bikes.length) return res.json([]);

    // 1. คำนวณ AHP weights
    const weightsTableOrder = ahpWeights(PAIRWISE_MATRIX);
    const weightsMap = toMap(CRITERIAS, weightsTableOrder);

    // 2. แปลง priority เป็น keys ของ DB
    const userOrderKeys = priority.map(k => priorityKeyMap[k]);

    // 3. สร้างน้ำหนัก และทิศทาง ตามลำดับที่ผู้ใช้เลือก
    const userWeights = userOrderKeys.map(k => weightsMap[k]);
    const directionMap = toMap(CRITERIAS, CRITERIA_DIRECTIONS);
    const userDirections = userOrderKeys.map(k => directionMap[k]);

    // 4. TOPSIS Ranking
    const ranked = topsisRank(bikes, userOrderKeys, userWeights, userDirections);

    // === Debug Logs
    console.log("\n===== AHP Pairwise Matrix (table order) =====");
    console.table(PAIRWISE_MATRIX);

    // console.log("\n===== AHP Weights (table order) =====");
    // CRITERIAS.forEach((k, i) => {
    //   const label = criteriaMeta.find(c => c.key === k)?.label || k;
    //   console.log(`${label}: ${weightsTableOrder[i].toFixed(4)}`);
    // });

    console.log("\n===== Weights by user order =====");
    userOrderKeys.forEach((key, i) => {
      const label = criteriaMeta.find(c => c.key === key)?.label || key;
      console.log(`${label}: ${userWeights[i].toFixed(4)}`);
    });

    console.log("\n===== TOPSIS Decision Matrix (user order) =====");
    console.table(bikes.map(item => userOrderKeys.map(k => Number(item[k]))));

    console.log("\n===== Directions by user order =====");
    userOrderKeys.forEach((key, i) => {
      const label = criteriaMeta.find(c => c.key === key)?.label || key;
      console.log(`${label}: ${userDirections[i] ? 'Benefit (มากดี)' : 'Cost (น้อยดี)'}`);
    });

    console.log("\n===== TOPSIS Ranked Scores =====");
    ranked.forEach((b, i) => {
      console.log(`#${i + 1}: ${b.moto_name} (${b.score?.toFixed(4)})`);
    });

    // 5. Return top 11 results
    res.json(ranked.slice(0, 11));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
