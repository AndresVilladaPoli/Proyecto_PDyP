const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

const items = [
  { title: 'Libro Cálculo I', description: 'Usado, buen estado', price: 20000, category: 'Libros', type: 'venta', owner: 'Ana' },
  { title: 'Auriculares Bluetooth', description: 'Como nuevos', price: 80000, category: 'Electrónica', type: 'venta', owner: 'Luis' },
  { title: 'Habitación amoblada', description: 'Cerca del campus', price: 400000, category: 'Alojamiento', type: 'arriendo', owner: 'Pedro' }
];

db.serialize(() => {
  const stmt = db.prepare('INSERT INTO items (title,description,price,category,type,owner) VALUES (?,?,?,?,?,?)');
  items.forEach(i => stmt.run(i.title, i.description, i.price, i.category, i.type, i.owner));
  stmt.finalize(() => {
    console.log('Seed inserted');
    db.close();
  });
});
