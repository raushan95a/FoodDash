const app = require('./app');
const env = require('./config/environment');
const { pool } = require('./database/connection');

async function startServer() {
  try {
    await pool.query('SELECT 1');
    app.listen(env.port, () => {
      console.log(`FoodDash API running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Unable to start server. Check MySQL connection settings.');
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
