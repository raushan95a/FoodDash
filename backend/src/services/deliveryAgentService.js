const { query } = require('../database/connection');

async function listDeliveryAgents() {
  return query(
    `SELECT agent_id, name, email, phone, vehicle_type, license_number,
      is_available, current_location, total_deliveries, avg_rating
     FROM deliveryagents
     ORDER BY is_available DESC, name ASC`
  );
}

module.exports = {
  listDeliveryAgents
};
