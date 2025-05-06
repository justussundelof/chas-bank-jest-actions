import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

const app = express();
const port = 3001;

// Enable CORS for all origins (dev only)
app.use(cors());

// middleware
app.use(bodyParser.json());

// connect to DB
const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'bank_app',
  port: 3306,
});

app.get("/test", async (req, res) => {
  res.send("Test");
});

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// POST /users – skapa användare
app.post('/users', async (req, res) => {
  const { username, password } = req.body; // Hämta användarnamn och lösenord från request body

  // Kontrollera att både username och password är skickade
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Användarnamn och lösenord måste anges' });
  }

  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  try {
    const [result] = await pool.execute(sql, [username, password]);

    // Skapa bankkonto med saldo 0 för användaren
    const accountSql = 'INSERT INTO accounts (user_id, amount) VALUES (?, ?)';
    await pool.execute(accountSql, [result.insertId, 0]);

    res.json({ message: 'Användare skapad', user_id: result.insertId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Kunde inte skapa användare' });
  }
});

app.post('/sessions', async (req, res) => {
  const { username, password } = req.body;
  console.log('Inloggningsförsök:', username, password);

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Fel inloggning' });
    }

    const user = rows[0];
    const token = generateOTP();

    await pool.execute('INSERT INTO sessions (user_id, token) VALUES (?, ?)', [
      user.id,
      token,
    ]);

    res.json({ token });
  } catch (err) {
    console.error('Fel vid inloggning:', err);
    res.status(500).json({ error: 'Något gick fel vid inloggning' });
  }
});

// POST /me/accounts – hämta saldo
app.post('/me/accounts', async (req, res) => {
  const { token } = req.body;

  try {
    const [sessions] = await pool.execute(
      'SELECT * FROM sessions WHERE token = ?',
      [token]
    );
    if (sessions.length === 0)
      return res.status(401).json({ error: 'Ogiltig token' });

    const session = sessions[0];
    const [account] = await pool.execute(
      'SELECT * FROM accounts WHERE user_id = ?',
      [session.user_id]
    );
    if (account.length === 0)
      return res.status(404).json({ error: 'Konto ej funnet' });

    res.json({ amount: account[0].amount });
  } catch (err) {
    console.error('Error fetching account:', err);
    res.status(500).json({ error: 'Kunde inte hämta konto' });
  }
});

app.get('/me/accounts', async (req, res) => {
  const { token } = req.query; 
  try {
    // Query to get balance from the database
    const query = `
      SELECT a.amount
      FROM sessions s
      JOIN accounts a ON s.user_id = a.user_id
      WHERE s.token = ?;
    `;

    const [rows] = await pool.execute(query, [token]);

    if (rows.length > 0) {
      // Return the balance if found
      return res.status(200).json({ amount: rows[0].amount });
    } else {
      return res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});

// POST /me/accounts/transactions – sätt in pengar
app.post('/me/accounts/transactions', async (req, res) => {
  const { token, amount } = req.body;
  const numericAmount = parseFloat(amount);
  
  try {
    const [sessions] = await pool.execute(
      'SELECT * FROM sessions WHERE token = ?',
      [token]
    );
    if (sessions.length === 0)
      return res.status(401).json({ error: 'Ogiltig token' });

    const session = sessions[0];
    const [account] = await pool.execute(
      'SELECT * FROM accounts WHERE user_id = ?',
      [session.user_id]
    );
    if (account.length === 0)
      return res.status(404).json({ error: 'Konto ej funnet' });

     let currentAmount = parseFloat(account[0].amount) || 0;
     currentAmount += numericAmount;
     
    const updateSql = 'UPDATE accounts SET amount = ? WHERE user_id = ?';
    await pool.execute(updateSql, [currentAmount, session.user_id]);

    res.json({ message: 'Insättning lyckades', amount: currentAmount });
  } catch (err) {
    console.error('Error updating account:', err);
    res.status(500).json({ error: 'Kunde inte sätta in pengar' });
  }
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
