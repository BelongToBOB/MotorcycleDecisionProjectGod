const prisma = require('../config/prisma');
const { CRITERIAS, PAIRWISE_MATRIX, CRITERIA_DIRECTIONS } = require('../utils/ahpMatrix');
const { ahpWeights, topsisRank } = require('../utils/ahpTopsis');

const criteriaMeta = [
  { key: "moto_price", label: "Price" },
  { key: "moto_cc", label: "CC" },
  { key: "maintenance_cost", label: "Maintenance Cost" },
  { key: "consumption_rate", label: "Fuel Consumption" },
  // { key: "fuel_size", label: "Fuel Tank Size" },
  // { key: "moto_weight", label: "Weight" }
];

const priorityKeyMap = {
  price: "moto_price",
  cc: "moto_cc",
  // fuel_size: "fuel_size",
  consumption: "consumption_rate",
  maintenance: "maintenance_cost",
  // weight: "moto_weight"
};

exports.recommend = async (req, res) => {
  try {
    const { selectedType, priority, criteria } = req.body;

    // --- Build filter
    let where = {};
    if (selectedType) where.moto_type_id = Number(selectedType);
    if (criteria.brand && criteria.brand !== "เลือกทุกแบรนด์") {
      where.moto_brand = { contains: criteria.brand }; 
    }  

    if (criteria) {
      if (criteria.price === "ไม่เกิน 50,000 บาท") where.moto_price = { lt: 50001 };
      if (criteria.price === "50,000 - 100,000 บาท") where.moto_price = { gte: 50000, lte: 100000 };
      if (criteria.price === "100,000 - 200,000 บาท") where.moto_price = { gte: 100000, lte: 200000 };
      if (criteria.price === "200,000 - 500,000 บาท") where.moto_price = { gte: 200000, lte: 500000 };
      if (criteria.price === "มากกว่า 500,000 บาท") where.moto_price = { gt: 500000 };

      if (criteria.cc === "110-125 cc") where.moto_cc = { gte: 110, lte: 125 };
      if (criteria.cc === "126-160 cc") where.moto_cc = { gte: 126, lte: 160 };
      if (criteria.cc === "161-300 cc") where.moto_cc = { gte: 161, lte: 300 };
      if (criteria.cc === "301-500 cc") where.moto_cc = { gte: 301, lte: 500 };
      if (criteria.cc === "501-999 cc") where.moto_cc = { gte: 501, lte: 995 };
      if (criteria.cc === "1000 cc ขึ้นไป") where.moto_cc = { gte: 996 };

      if (criteria.fuel === "60-40 กม./ลิตร") where.consumption_rate = { gte: 40, lte: 60 };
      if (criteria.fuel === "40-30 กม./ลิตร") where.consumption_rate = { gte: 30, lte: 40 };
      if (criteria.fuel === "30-20 กม./ลิตร") where.consumption_rate = { gte: 20, lte: 30 };
      if (criteria.fuel === "ต่ำกว่า 20 กม./ลิตร (ขับขี่เน้นสมรรถนะที่สูง)") where.consumption_rate = { lt: 20 };

      if (criteria.maintenance === "ต่ำกว่า 2,000 บาท/ปี") where.maintenance_cost = { lt: 2000 };
      if (criteria.maintenance === "2,000 - 5,000 บาท/ปี") where.maintenance_cost = { gte: 2000, lte: 5000 };
      if (criteria.maintenance === "5,000 - 10,000 บาท/ปี") where.maintenance_cost = { gte: 5000, lte: 10000 };
      if (criteria.maintenance === "มากกว่า 10,000 บาท/ปี") where.maintenance_cost = { gt: 10000 };
    }

    // --- Query
    const bikes = await prisma.motorcycle.findMany({
      where,
      include: { moto_type: true }
    });
    if (!bikes.length) return res.json([]);

    // --- Calculate AHP weights (table order)
    const weightsTableOrder = ahpWeights(PAIRWISE_MATRIX);

    // --- Log: Pairwise Matrix and weights
    console.log("\n===== AHP Pairwise Matrix (table order) =====");
    console.table(PAIRWISE_MATRIX);
    console.log("AHP Weights (table order):");
    CRITERIAS.forEach((c, i) => {
      const label = criteriaMeta.find(x => x.key === c)?.label || c;
      console.log(`${label}: ${weightsTableOrder[i].toFixed(4)}`);
    });

    // 2. userOrderKeys: เรียง key ตาม user
    const userOrderKeys = priority.map(k => priorityKeyMap[k]);

    // 3. จัดเรียง weight มาก → น้อย แล้ว mapping ตาม user order
    const weightsSorted = [...weightsTableOrder].sort((a, b) => b - a);
    const userWeights = userOrderKeys.map((key, idx) => weightsSorted[idx]);

    // 4. directions สำหรับ TOPSIS เรียงตาม userOrderKeys
    const userDirections = userOrderKeys.map(k => {
      const idx = CRITERIAS.indexOf(k);
      return CRITERIA_DIRECTIONS[idx];
    });

    // 5. TOPSIS Decision Matrix (columns เรียงตาม user)
    const topsisMatrix = bikes.map(item => userOrderKeys.map(c => Number(item[c])));
    console.log("\n===== TOPSIS Decision Matrix (user order) =====");
    console.table(topsisMatrix);

    // 6. Log weights (user order)
    console.log("\n===== Weights by user order =====");
    userOrderKeys.forEach((key, i) => {
      const label = criteriaMeta.find(x => x.key === key)?.label || key;
      console.log(`${label}: ${userWeights[i].toFixed(4)}`);
    });
    console.log("\n===== Directions by user order =====");
    userOrderKeys.forEach((key, i) => {
      const label = criteriaMeta.find(x => x.key === key)?.label || key;
      console.log(`${label}: ${userDirections[i] ? 'Benefit (more is better)' : 'Cost (less is better)'}`);
    });

    // 7. TOPSIS Ranking (ส่ง directions เข้าไป)
    const ranked = topsisRank(bikes, userOrderKeys, userWeights, userDirections);

    // 8. Log: TOPSIS ranked scores
    console.log("\n===== TOPSIS Ranked Scores =====");
    ranked.forEach((b, idx) => {
      console.log(`#${idx + 1}: ${b.moto_name} (${b.score?.toFixed(4)})`);
    });

    // 9. Return result
    res.json(ranked.slice(0, 11));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

