const CRITERIAS = [
    "moto_price",
    "moto_cc",
    "maintenance_cost",
    "consumption_rate",
    // "fuel_size",
    // "moto_weight" 
  ];
  
  const PAIRWISE_MATRIX = [
    [1,    2,    3,    4],
    [0.5,  1,    2,    3],
    [0.333,0.5,  1,    2],
    [0.25, 0.333,0.5,  1]
  ];

  const CRITERIA_DIRECTIONS = [
    false,  // moto_price: น้อยดี (cost)
    true,   // moto_cc: มากดี (benefit)
    false,  // maintenance_cost: น้อยดี (cost)
    true,   // consumption_rate: มากดี (benefit) 
  ];

  module.exports = { CRITERIAS, PAIRWISE_MATRIX, CRITERIA_DIRECTIONS };
  
  

