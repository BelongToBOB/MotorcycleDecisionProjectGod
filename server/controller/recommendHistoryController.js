const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const { selectedType, priority, criteria, result } = req.body;
    if (!priority || !criteria || !result)
      return res.status(400).json({ message: "Missing data" });

    const history = await prisma.recommendhistory.create({
      data: {
        user_id,
        selectedType: selectedType ? Number(selectedType) : null,
        priority: JSON.stringify(priority),
        criteria: JSON.stringify(criteria),
        result: JSON.stringify(result), // เก็บเป็น string
      },
    });

    res.status(201).json(history);
  } catch (err) {
    console.error("SAVE HISTORY ERROR:", err);
    res.status(500).json({ message: "Server Error", err });
  }
};

// ✅ ฟังก์ชันช่วย normalize
const formatHistory = (h) => {
  let priority = {};
  let criteria = {};
  let result = [];
  try {
    priority = JSON.parse(h.priority);
  } catch {}
  try {
    criteria = JSON.parse(h.criteria);
  } catch {}
  try {
    result = JSON.parse(h.result);
  } catch {}

  const best = Array.isArray(result) && result.length > 0 ? result[0] : null;

  return {
    ...h,
    priority,
    criteria,
    result,
    bestModel: best?.moto_name || best?.model || null,
    bestScore: best?.score || null,
  };
};

exports.getStatistic = async (req, res) => {
  try {
    const histories = await prisma.recommendhistory.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const motorcycles = await prisma.motorcycle.findMany({
      select: { moto_name: true, moto_brand: true },
    });

    const motoMap = {};
    motorcycles.forEach((m) => {
      motoMap[m.moto_name] = m.moto_brand;
    });

    const brandCount = {};
    const typeCount = {};
    const priceCount = {};
    const modelCount = {};

    histories.forEach((h) => {
      let criteria = {};
      let result = [];
      try { criteria = JSON.parse(h.criteria); } catch {}
      try { result = JSON.parse(h.result); } catch {}

      if (criteria.brand) {
        brandCount[criteria.brand] = (brandCount[criteria.brand] || 0) + 1;
      }
      if (h.selectedType) {
        typeCount[h.selectedType] = (typeCount[h.selectedType] || 0) + 1;
      }
      if (criteria.price) {
        priceCount[criteria.price] = (priceCount[criteria.price] || 0) + 1;
      }

      if (Array.isArray(result) && result.length > 0) {
        const best = result[0];
        const modelName = best?.moto_name || best?.model;
        const brandName =
          motoMap[modelName] || best?.moto_brand || criteria.brand || "ไม่ทราบ";

        if (modelName) {
          const key = `${brandName}||${modelName}`;
          modelCount[key] = (modelCount[key] || 0) + 1;
        }
      }
    });

    const topModels = Object.entries(modelCount)
      .map(([key, count]) => {
        let [brand, model] = key.split("||");
        return { brand, model, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const latest = histories.slice(0, 10).map(formatHistory);

    res.json({
      brandCount,
      typeCount,
      priceCount,
      topModels,
      latest,
    });
  } catch (err) {
    console.error("STATISTIC ERROR:", err);
    res.status(500).json({ message: "Server Error", err });
  }
};



/**
 * ดึงประวัติของ user คนเดียว
 * GET /api/history/mine
 */
exports.listMine = async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const histories = await prisma.recommendhistory.findMany({
      where: { user_id },
      orderBy: { createdAt: "desc" },
    });

    res.json(histories.map(formatHistory));
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
};

/**
 * ดึงทั้งหมด (admin เท่านั้น)
 * GET /api/history
 */
exports.listAll = async (req, res) => {
  try {
    const histories = await prisma.recommendhistory.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(histories.map(formatHistory));
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
};
