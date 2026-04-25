const restaurantService = require('../services/restaurantService');
const reviewService = require('../services/reviewService');

async function listRestaurants(req, res) {
  const data = await restaurantService.listRestaurants(req.query);
  res.json({ success: true, ...data });
}

async function getRestaurant(req, res) {
  const data = await restaurantService.getRestaurant(Number(req.params.id));
  res.json({ success: true, data });
}

async function createRestaurant(req, res) {
  const data = await restaurantService.createRestaurant(req.body);
  res.status(201).json({ success: true, data });
}

async function getMenu(req, res) {
  const data = await restaurantService.getMenu(Number(req.params.id));
  res.json({ success: true, data });
}

async function getReviews(req, res) {
  const data = await reviewService.listRestaurantReviews(Number(req.params.id));
  res.json({ success: true, data });
}

module.exports = {
  listRestaurants,
  getRestaurant,
  createRestaurant,
  getMenu,
  getReviews
};
