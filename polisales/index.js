const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { create } = require('xmlbuilder2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_FILE = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(DB_FILE);

// Inicializar tabla si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    type TEXT,
    owner TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// CRUD endpoints

// Listar todos
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener uno
app.get('/api/items/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

// Crear
app.post('/api/items', (req, res) => {
  const { title, description, price, category, type, owner } = req.body;
  db.run(
    `INSERT INTO items (title, description, price, category, type, owner) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, price, category, type, owner],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const id = this.lastID;
      db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(row);
      });
    }
  );
});

// Actualizar
app.put('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, price, category, type, owner } = req.body;
  db.run(
    `UPDATE items SET title=?, description=?, price=?, category=?, type=?, owner=? WHERE id=?`,
    [title, description, price, category, type, owner, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
      db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    }
  );
});

// Eliminar
app.delete('/api/items/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  });
});

//Informes: json y xml

// JSON report (agrupa por categoria)
app.get('/api/report/json', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = rows.reduce((s, r) => s + Number(r.price || 0), 0);
    const byCategory = {};
    rows.forEach(r => {
      const cat = r.category || 'Sin categoría';
      if (!byCategory[cat]) byCategory[cat] = { items: [], sum: 0 };
      byCategory[cat].items.push(r);
      byCategory[cat].sum += Number(r.price || 0);
    });
    res.json({ total, byCategory });
  });
});

// XML report (transforma del JSON internal y devuelve XML)
app.get('/api/report/xml', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const total = rows.reduce((s, r) => s + Number(r.price || 0), 0);

    // Agrupar por categoría
    const categories = {};
    rows.forEach(r => {
      const cat = r.category || 'Sin categoría';
      if (!categories[cat]) categories[cat] = { sum: 0, items: [] };
      categories[cat].sum += Number(r.price || 0);
      categories[cat].items.push(r);
    });

    // Construir XML con xmlbuilder2
    const root = { report: { total: total.toString(), categories: [] } };
    for (const [catName, obj] of Object.entries(categories)) {
      root.report.categories.push({
        category: {
          '@name': catName,
          sum: obj.sum.toString(),
          items: obj.items.map(it => ({
            item: {
              id: it.id.toString(),
              title: it.title,
              description: it.description || '',
              price: it.price.toString(),
              type: it.type || '',
              owner: it.owner || ''
            }
          }))
        }
      });
    }

    const doc = create(root);
    const xml = doc.end({ prettyPrint: true });
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  });
});

// Servir un ejemplo simple para probar despliegue
app.get('/api/ping', (req, res) => res.json({ pong: true }));

// Iniciar server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`POLIsales API running on port ${PORT}`);
});