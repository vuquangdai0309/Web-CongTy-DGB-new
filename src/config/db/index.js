const mysql = require('mysql2');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'manager_dgb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.getConnection((err, pool) => {
  if (err) {
    console.error('Không thể kết nối MySQL:', err);
  } else {
    pool.release()
    console.log('Đã kết nối thành công đến MySQL');
  }
});

module.exports = connection;