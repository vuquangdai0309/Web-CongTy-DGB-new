const { el } = require("date-fns/locale");
const connection = require("../../config/db/index");
const TraCuuModel = {
  getAllStatus: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT *FROM status WHERE is_deleted = 0`;
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  },

  getAllTraCuus: (search) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT tracuu.*,
      status.nameStatus AS nameStatus
      FROM tracuu
      JOIN status ON tracuu.statusId = status._id
      WHERE tracuu.is_deleted = 0 AND tracuu.company LIKE ?`;
      const values = "%" + search + "%";
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  getTraCuuById: (TraCuuId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tracuu WHERE _id = ? AND is_deleted = 0";
      connection.query(query, [TraCuuId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  },

  addTraCuu: (TraCuu, callback) => {
    const query =
      "INSERT INTO tracuu (filepdf, code,company,address,phone,customer,dateStart,dateEnd) VALUES (?,?,?,?,?,?,?,?)";
    const values = [
      TraCuu.filepdf,
      TraCuu.code,
      TraCuu.company,
      TraCuu.address,
      TraCuu.phone,
      TraCuu.customer,
      TraCuu.dateStart,
      TraCuu.dateEnd,
    ];
    connection.query(query, values, callback);
  },
  updateTraCuu: (TraCuuId, TraCuu, callback) => {
    const query =
      "UPDATE tracuu SET filepdf=?, code=?,company=?,address=?,phone=?,customer=?,dateStart=?,dateEnd=?,statusId=?,dateExtend=?  WHERE _id = ?";
    const values = [
      TraCuu.filepdf,
      TraCuu.code,
      TraCuu.company,
      TraCuu.address,
      TraCuu.phone,
      TraCuu.customer,
      TraCuu.dateStart,
      TraCuu.dateEnd,
      TraCuu.statusId,
      TraCuu.dateExtend,
      TraCuuId,
    ];
    connection.query(query, values, callback);
  },
  forceDestroyTraCuu: (TraCuuId, callback) => {
    const query = "DELETE FROM tracuu WHERE _id = ?";
    connection.query(query, [TraCuuId], callback);
  },
  //tìm kiếm giấy chứng nhận
  searchTraCuu: (code) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tracuu WHERE code = ? AND is_deleted = 0 ";
      connection.query(query, [code], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  },

  // đếm số lượng các chứng nhận
  countTraCuu: (callback) => {
    const query = `SELECT COUNT(*) AS giaychungnhanCount FROM tracuu`;
    connection.query(query, (error, results, fields) => {
      if (error) {
        return callback(error, null);
      }

      const giaychungnhanCount = results[0].giaychungnhanCount;
      callback(null, giaychungnhanCount);
    });
  },
};

// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = TraCuuModel;
