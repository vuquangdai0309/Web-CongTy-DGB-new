const connection = require("../../config/db/index");
const LogoModel = {
  getAllLogo: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM logo WHERE is_deleted = 0`;
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  createLogo: (logo) => {
    return new Promise((resolve, reject) => {
      const query = ` INSERT INTO logo (company,nameLogo) VALUES (?,?)`;
      const values = [logo.company, logo.nameLogo];
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  updateLogo: (id, logo) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE logo SET company = ?, nameLogo = ?  WHERE _id = ?`;
      const values = [logo.company, logo.nameLogo, id];
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  deleteLogo: (id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM logo WHERE _id = ?`;
      connection.query(query, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
};
module.exports = LogoModel;
