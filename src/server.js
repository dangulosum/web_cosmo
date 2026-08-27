const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Apuntar los archivos estáticos a la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

// Configuración de MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cosmo_db',
  waitForConnections: true,
  connectionLimit: 10
});

// 2. Endpoints de la API
app.get('/api/miembros', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM miembros WHERE activo = TRUE ORDER BY orden ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/proyectos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM proyectos ORDER BY fecha_creacion DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Fallback para entregar index.html desde la carpeta public
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(3000, () => {
  console.log('Servidor activo en http://localhost:3000');
});