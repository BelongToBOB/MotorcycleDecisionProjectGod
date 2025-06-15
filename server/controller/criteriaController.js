const prisma = require('../config/prisma');

// แปลง label เป็น where filter สำหรับแต่ละหมวด
function labelToFilter(label, type) {
  if (!label) return null;
  if (type === "price") {
    switch (label) {
      case "ไม่เกิน 50,000 บาท": return { lt: 50000 };
      case "50,000 - 100,000 บาท": return { gte: 50000, lt: 100001 };
      case "100,000 - 200,000 บาท": return { gte: 100001, lt: 200001 };
      case "200,000 - 500,000 บาท": return { gte: 200001, lt: 500001 };
      case "มากกว่า 500,000 บาท": return { gt: 500000 };
    }
  }
  if (type === "cc") {const prisma = require('../config/prisma');

function labelToFilter(label, type) {
  if (!label) return null;
  if (type === "price") {
    switch (label) {
      case "ไม่เกิน 50,000 บาท": return { lt: 50000 };
      case "50,000 - 100,000 บาท": return { gte: 50000, lte: 100000 };
      case "100,000 - 200,000 บาท": return { gte: 100001, lte: 200000 };
      case "200,001 - 500,000 บาท": return { gte: 200001, lte: 500000 };
      case "มากกว่า 500,000 บาท": return { gt: 500000 };
    }
  }
  if (type === "cc") {
    switch (label) {
      case "110-125 cc": return { gte: 110, lte: 125 };
      case "126-160 cc": return { gte: 126, lte: 160 };
      case "161-300 cc": return { gte: 161, lte: 300 };
      case "301-500 cc": return { gte: 301, lte: 500 };
      case "500 cc ขึ้นไป": return { gte: 501 };
    }
  }
  if (type === "fuel") {
    switch (label) {
      case "60-40 กม./ลิตร": return { gte: 40, lte: 60 };
      case "40-30 กม./ลิตร": return { gte: 30, lte: 40 };
      case "30-20 กม./ลิตร": return { gte: 20, lte: 30 };
      case "ต่ำกว่า 20 กม./ลิตร (ขับขี่เน้นสมรรถนะที่สูง)": return { lt: 20 };
    }
  }
  if (type === "maintenance") {
    switch (label) {
      case "ต่ำกว่า 2,000 บาท/ปี": return { lt: 2000 };
      case "2,000 - 5,000 บาท/ปี": return { gte: 2001, lte: 5000 };
      case "5,000 - 10,000 บาท/ปี": return { gte: 5001, lte: 10000 };
      case "มากกว่า 10,000 บาท/ปี": return { gt: 10001 };
    }
  }
  return null;
}

exports.getDynamicCriteriaOptions = async (req, res) => {
  try {
    const { typeId, price, cc, fuel, maintenance, brand } = req.query;
    const where = { moto_type_id: Number(typeId) };

    const pf = labelToFilter(price, "price");
    if (pf) where.moto_price = pf;
    const cf = labelToFilter(cc, "cc");
    if (cf) where.moto_cc = cf;
    const ff = labelToFilter(fuel, "fuel");
    if (ff) where.consumption_rate = ff;
    const mf = labelToFilter(maintenance, "maintenance");
    if (mf) where.maintenance_cost = mf;
    if (brand && brand !== "เลือกทุกแบรนด์") {
      where.moto_brand = { contains: brand };
    }

    const bikes = await prisma.motorcycle.findMany({
      where,
      select: {
        moto_price: true,
        moto_cc: true,
        consumption_rate: true,
        maintenance_cost: true,
        moto_brand: true,
      }
    });

    const extractRange = (value, type) => {
      if (type === "price") {
        if (value < 50000) return "ไม่เกิน 50,000 บาท";
        if (value <= 100000) return "50,000 - 100,000 บาท";
        if (value <= 200000) return "100,000 - 200,000 บาท";
        if (value <= 500000) return "200,001 - 500,000 บาท";
        return "มากกว่า 500,000 บาท";
      }
      if (type === "cc") {
        if (value <= 125) return "110-125 cc";
        if (value <= 160) return "126-160 cc";
        if (value <= 300) return "161-300 cc";
        if (value <= 500) return "301-500 cc";
        if (value < 1000) return "501-999 cc";  // <--- แก้จาก 995 เป็น 1000
        return "1000 cc ขึ้นไป";
      }
      if (type === "fuel") {
        if (value < 20) return "ต่ำกว่า 20 กม./ลิตร (ขับขี่เน้นสมรรถนะที่สูง)";
        if (value <= 30) return "30-20 กม./ลิตร";
        if (value <= 40) return "40-30 กม./ลิตร";
        return "60-40 กม./ลิตร";
      }
      if (type === "maintenance") {
        if (value < 2000) return "ต่ำกว่า 2,000 บาท/ปี";
        if (value <= 5000) return "2,000 - 5,000 บาท/ปี";
        if (value <= 10000) return "5,000 - 10,000 บาท/ปี";
        return "มากกว่า 10,000 บาท/ปี";
      }
    };

    const uniq = (arr) => [...new Set(arr.filter(Boolean))];

    res.json({
      price: uniq(bikes.map(b => extractRange(b.moto_price, "price"))),
      cc: uniq(bikes.map(b => extractRange(b.moto_cc, "cc"))),
      fuel: uniq(bikes.map(b => extractRange(b.consumption_rate, "fuel"))),
      maintenance: uniq(bikes.map(b => extractRange(b.maintenance_cost, "maintenance"))),
      brand: uniq(bikes.map(b => b.moto_brand)),
    });
  } catch (err) {
    console.error("criteriaController.getDynamicCriteriaOptions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

    switch (label) {
      case "110-125 cc": return { gte: 110, lte: 125 };
      case "126-160 cc": return { gte: 126, lte: 160 };
      case "161-300 cc": return { gte: 161, lte: 300 };
      case "301-500 cc": return { gte: 301, lte: 500 };
      case "501-999 cc": return { gte: 501, lt: 1000 };    
      case "1000 cc ขึ้นไป": return { gte: 1000 };
    }
  }
  if (type === "fuel") {
    switch (label) {
      case "60-40 กม./ลิตร": return { gte: 40, lte: 60 };
      case "40-30 กม./ลิตร": return { gte: 30, lte: 40 };
      case "30-20 กม./ลิตร": return { gte: 20, lte: 30 };
      case "ต่ำกว่า 20 กม./ลิตร (ขับขี่เน้นสมรรถนะที่สูง)": return { lt: 20 };
    }
  }
  if (type === "maintenance") {
    switch (label) {
      case "ต่ำกว่า 2,000 บาท/ปี": return { lt: 2000 };
      case "2,000 - 5,000 บาท/ปี": return { gte: 2001, lte: 5000 };
      case "5,000 - 10,000 บาท/ปี": return { gte: 5001, lte: 10000 };
      case "มากกว่า 10,000 บาท/ปี": return { gt: 10001 };
    }
  }
  return null;
}

exports.getDynamicCriteriaOptions = async (req, res) => {
  try {
    const { typeId, price, cc, fuel, maintenance, brand } = req.query;
    const where = { moto_type_id: Number(typeId) };

    // ถ้ามี label ที่เลือกมาก่อนแล้ว ให้แปลงเป็น where.filter
    const pf = labelToFilter(price, "price");
    if (pf) where.moto_price = pf;
    const cf = labelToFilter(cc, "cc");
    if (cf) where.moto_cc = cf;
    const ff = labelToFilter(fuel, "fuel");
    if (ff) where.consumption_rate = ff;
    const mf = labelToFilter(maintenance, "maintenance");
    if (mf) where.maintenance_cost = mf;
    if (brand && brand !== "เลือกทุกแบรนด์") {
      where.moto_brand = { contains: brand };
    }

    // ดึงข้อมูลรถตามเงื่อนไขที่ update แล้ว
    const bikes = await prisma.motorcycle.findMany({
      where,
      select: {
        moto_price: true,
        moto_cc: true,
        consumption_rate: true,
        maintenance_cost: true,
        moto_brand: true,
      }
    });

    // สร้างชุด labels ใหม่จากรถที่ match ได้
    const extractRange = (value, type) => {
      // (เหมือนฟังก์ชันใน getCriteriaOptions)
      if (type === "price") {
        if (value < 50000) return "ไม่เกิน 50,000 บาท";
        if (value <= 100000) return "50,000 - 100,000 บาท";
        if (value <= 200000) return "100,000 - 200,000 บาท";
        if (value <= 500000) return "200,001 - 500,000 บาท";
        return "มากกว่า 500,000 บาท";
      }
      if (type === "cc") {
        if (value <= 125) return "110-125 cc";
        if (value <= 160) return "126-160 cc";
        if (value <= 300) return "161-300 cc";
        if (value <= 500) return "301-500 cc";
        if (value < 1000) return "501-999 cc";  
        return "1000 cc ขึ้นไป";
      }
      if (type === "fuel") {
        if (value < 20) return "ต่ำกว่า 20 กม./ลิตร (ขับขี่เน้นสมรรถนะที่สูง)";
        if (value <= 30) return "30-20 กม./ลิตร";
        if (value <= 40) return "40-30 กม./ลิตร";
        return "60-40 กม./ลิตร";
      }
      if (type === "maintenance") {
        if (value < 2000) return "ต่ำกว่า 2,000 บาท/ปี";
        if (value <= 5000) return "2,000 - 5,000 บาท/ปี";
        if (value <= 10000) return "5,000 - 10,000 บาท/ปี";
        return "มากกว่า 10,000 บาท/ปี";
      }
    };

    const uniq = (arr) => [...new Set(arr.filter(Boolean))];

    res.json({
      price:       uniq(bikes.map(b => extractRange(b.moto_price, "price"))),
      cc:          uniq(bikes.map(b => extractRange(b.moto_cc,    "cc"))),
      fuel:        uniq(bikes.map(b => extractRange(b.consumption_rate, "fuel"))),
      maintenance: uniq(bikes.map(b => extractRange(b.maintenance_cost,  "maintenance"))),
      brand:       uniq(bikes.map(b => b.moto_brand)),
    });
  } catch (err) {
    console.error("criteriaController.getDynamicCriteriaOptions:", err);
    res.status(500).json({ message: "Server error" });
  }
};
