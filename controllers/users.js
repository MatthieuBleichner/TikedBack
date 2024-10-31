const bcrypt = require('bcrypt');
const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

async function signup(req, res) {
  try {
    const user = req.body;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await sql`
        INSERT INTO users (id, name, email, password, privilege)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.privilege})
        ON CONFLICT (id) DO NOTHING;
    `;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function login(req, res) {
  try {
    console.log('req.query.id', req.query.id);
    const userResult = await sql`SELECT * from users WHERE id=${req.query.id}`;
    console.log('userResult', userResult);
    if (!userResult.rows.length) {
      res.status(401).json({ message: 'unknown user' });
      return;
    }
    console.log('ici 1');
    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword) {
      res.status(401).json({ message: 'Wrong password' });
      return;
    }

    console.log('ici 2');
    res.status(200).json({
      userId: user.id,
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      }),
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  signup,
  login,
};
