const prisma = require("../config/prisma");

// ฟังก์ชันช่วย format ประวัติ
function formatHistory(h) {
  let criteria = {};
  let result = [];
  try { criteria = JSON.parse(h.criteria); } catch {}
  try { result = JSON.parse(h.result); } catch {}

  return {
    history_id: h.history_id,
    user: h.user ? { username: h.user.username } : null,
    selectedType: h.selectedType,
    criteria,
    result,
    createdAt: h.createdAt,
  };
}

exports.overview = async (req, res) => {
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
