const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const { Player, Match } = require('./models');
const playerRoutes = require('./routes/playerRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/players', playerRoutes);

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ force: false });
    console.log('Models synced.');

    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Database error:', err);
  }
}

initializeDatabase();
