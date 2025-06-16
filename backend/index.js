const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// DB 연결 함수
async function connectDB() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
}

// 책 등록 API
app.post('/book', async (req, res) => {
  const {
    title, author, publisher, published_date,
    isbn, description, description2,
    category, price, pages, language
  } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: '책명과 저자는 필수입니다.' });
  }

  try {
    const conn = await connectDB();

    // 사용 중인 ID 목록 조회
    const [rows] = await conn.query('SELECT id FROM books ORDER BY id ASC');
    const usedIds = rows.map(row => row.id);
    let newId = 1;
    while (usedIds.includes(newId)) newId++;

    // 기본값 처리
    const finalDate = published_date || new Date().toISOString().split('T')[0];

    const [result] = await conn.execute(
      `INSERT INTO books
      (id, title, author, publisher, published_date, isbn,
       description, description2, category, price, pages, language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId, title, author, publisher || '', finalDate, isbn || '',
        description || '', description2 || '', category || '',
        price || 0, pages || 0, language || ''
      ]
    );

    conn.end();

    res.status(201).json({ id: newId, message: 'Book added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 단일 또는 전체 책 조회 API
app.get('/book', async (req, res) => {
  const { id } = req.query;

  try {
    const conn = await connectDB();

    if (id) {
      const [rows] = await conn.execute(`SELECT * FROM books WHERE id = ?`, [id]);
      conn.end();
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
      return res.json(rows[0]);
    } else {
      const [rows] = await conn.execute(`SELECT * FROM books ORDER BY id ASC`);
      conn.end();
      res.json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 책 삭제 API
app.delete('/book', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id is required' });

  try {
    const conn = await connectDB();
    const [result] = await conn.execute(`DELETE FROM books WHERE id = ?`, [id]);
    conn.end();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 책 수정 API
app.put('/book', async (req, res) => {
  const {
    id, title, author, publisher, published_date,
    isbn, description, description2,
    category, price, pages, language
  } = req.body;

  if (!id) return res.status(400).json({ error: 'id is required' });

  try {
    const conn = await connectDB();
    await conn.execute(
      `UPDATE books SET
      title = ?, author = ?, publisher = ?, published_date = ?, isbn = ?,
      description = ?, description2 = ?, category = ?, price = ?, pages = ?, language = ?
      WHERE id = ?`,
      [
        title, author, publisher || '', published_date || new Date().toISOString().split('T')[0], isbn || '',
        description || '', description2 || '', category || '',
        price || 0, pages || 0, language || '', id
      ]
    );
    conn.end();
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 테스트 라우트
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running at http://0.0.0.0:${port}`);
});

