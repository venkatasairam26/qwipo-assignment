const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const dbPath = path.join(__dirname, 'database.db');
let db = null;

const initDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });

    // Create tables if they don’t exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT NOT NULL UNIQUE
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        address_details TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pin_code TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      );
    `);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initDBAndServer();

app.get('/api/customers', async (req, res) => {
  const {search} = req.query;
  console.log(search, "search");
  
  try {
    if (search === undefined) {
      const getCustomersQuery = 'SELECT * FROM customers';
      const customers = await db.all(getCustomersQuery);
      res.status(200).send(customers);
    } else {
      const customers = await db.all(
        'SELECT * FROM customers WHERE first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?',
        [`%${search}%`, `%${search}%`, `%${search}%`]
      );
      res.status(200).send(customers);
    }
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/api/customers', async (req, res) => {
  const { first_name, last_name, phone_number } = req.body;
  const getCustomerQuery = 'SELECT * FROM customers WHERE phone_number = ?';
  const customer = await db.get(getCustomerQuery, [phone_number]);
  if (customer) {
    return res.status(400).send({ error: 'Phone number already exists' });
  }
  try {
    const insertQuery = 'INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)';
    const result = await db.run(insertQuery, [first_name, last_name, phone_number]);
    res.status(201).send({ id: result.lastID });
      
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await db.get('SELECT * FROM customers WHERE id = ?', [id]);
    const addresses = await db.all(
      'SELECT * FROM addresses WHERE customer_id = ?',
      [id]
    );
    res.status(200).send({ ...customer, addresses });

  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number } = req.body;
  try {
    const updateQuery = 'UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?';
    await db.run(updateQuery, [first_name, last_name, phone_number, id]);
    res.status(200).send({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
})


app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleteQuery = 'DELETE FROM customers WHERE id = ?';
    await db.run(deleteQuery, [id]);
    res.status(200).send({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/api/customers/:id/addresses', async (req, res) => {

  const { address, city, state, pin_code } = req.body;
  const { id } = req.params;
  console.log(req.body, "req.body");
  try {
    const insertQuery = 'INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)';
    const result = await db.run(insertQuery, [id, address, city, state, pin_code]);
    res.status(201).send({ id: result.lastID });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/api/customers/:id/addresses', async (req, res) => {
  const { id } = req.params;
  try {
    const addresses = await db.all('SELECT * FROM addresses WHERE customer_id = ?', [id]);
    res.status(200).send(addresses);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.put('/api/addresses/:id', async (req, res) => {
  const { address_details, city, state, pin_code } = req.body;
  const { id } = req.params;
  try {
    const updateQuery = 'UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?';
    await db.run(updateQuery, [address_details, city, state, pin_code, id]);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id, "server id");
  try {
    const deleteQuery = 'DELETE FROM addresses WHERE id = ?';
    await db.run(deleteQuery, [id]);
    res.status(200).send({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


