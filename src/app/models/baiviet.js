const { el } = require("date-fns/locale");
const connection = require("../../config/db/index");
const BaiVietModel = {
  getAllCategories: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM category WHERE is_deleted = 0`;
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  getAllBaiViets: (callback) => {
    const query = "SELECT * FROM baiviet where is_deleted =0";
    connection.query(query, callback);
  },
  trashGetAllBaiViets: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT baiviet.*,
       category.nameCategory AS nameCategory
      FROM baiviet
      JOIN category ON baiviet.categoryId = category._id
      WHERE baiviet.is_deleted = 1
      `;
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  getBaiVietById: (BaiVietId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM baiviet WHERE _id = ?";
      connection.query(query, [BaiVietId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  addBaiViet: (BaiViet, callback) => {
    BaiViet.date = new Date();
    const query =
      "INSERT INTO baiviet (title, image,categoryId,content,slug,isMenu,isLogo,date,createdAt) VALUES (?,?,?,?,?,?,?,?,?)";
    const values = [
      BaiViet.title,
      BaiViet.image,
      BaiViet.categoryId,
      BaiViet.content,
      BaiViet.slug,
      BaiViet.isMenu,
      BaiViet.isLogo,
      BaiViet.date,
      BaiViet.createdAt,
    ];
    connection.query(query, values, callback);
  },

  updateBaiViet: (BaiVietId, BaiViet, callback) => {
    BaiViet.date = new Date();
    const query =
      "UPDATE baiviet SET title = ?, image = ?,content = ?,categoryId = ?,slug = ?,isMenu = ?,isLogo = ?,date = ?,createdAt =?  WHERE _id = ?";
    const values = [
      BaiViet.title,
      BaiViet.image,
      BaiViet.content,
      BaiViet.categoryId,
      BaiViet.slug,
      BaiViet.isMenu,
      BaiViet.isLogo,
      BaiViet.date,
      BaiViet.createdAt,
      BaiVietId,
    ];
    connection.query(query, values, callback);
  },

  deleteBaiViet: (BaiVietId, callback) => {
    const query = "UPDATE baiviet SET is_deleted = 1 WHERE _id = ?";
    connection.query(query, [BaiVietId], callback);
  },
  deleteAllBaiVietsWithId: (idsToDelete, callback) => {
    const query = "UPDATE baiviet SET is_deleted = 1 WHERE _id IN (?)";
    connection.query(query, [idsToDelete], callback);
  },
  restoreBaiViet: (BaiVietId, callback) => {
    const query = "UPDATE baiviet SET is_deleted = 0 WHERE _id = ?";
    connection.query(query, [BaiVietId], callback);
  },
  forceDestroyBaiViet: (BaiVietId, callback) => {
    const query = "DELETE FROM baiviet WHERE _id = ?";
    connection.query(query, [BaiVietId], callback);
  },
  forceDestroyAllSelectedBaiViet: (BaiVietId, callback) => {
    const query = "DELETE FROM baiviet WHERE _id IN (?)";
    connection.query(query, [BaiVietId], callback);
  },
  restoreAllSelectedBaiViet: (BaiVietId, callback) => {
    const query = "UPDATE baiviet SET is_deleted = 0 WHERE _id IN (?)";
    connection.query(query, [BaiVietId], callback);
  },
  //tìm kiếm trang admin
  searchBaiVietByName: (title) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT baiviet.*,
      category.nameCategory AS nameCategory
      FROM baiviet
      JOIN category ON baiviet.categoryId = category._id
       WHERE baiviet.title LIKE ? AND baiviet.is_deleted = 0`;
      const searchName = "%" + title + "%";
      connection.query(sql, [searchName], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },
  //tìm kiếm trang client
  searchBaiVietByNameClient: (title) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM baiviet WHERE title LIKE ?";
      const searchName = "%" + title + "%";
      connection.query(sql, [searchName], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },

  // lấy những bản ghi có loại là dịch vụ và hiển thị lên menu
  getAllDichVuShowMenu: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM baiviet WHERE categoryId = 2 AND isMenu = 1";
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  },
  // lấy những bản ghi có loại là dịch vụ và hiển thị logo
  getAllDichVuShowLogo: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM baiviet WHERE categoryId = 2 AND isLogo = 1";
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  },

  // lấy những bản ghi có loại là dịch vụ
  getAllGioiThieu: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM baiviet WHERE categoryId = 1";
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  },
  // lấy những bản ghi có loại là tin tức
  getAllTinTuc: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM baiviet WHERE categoryId = 3";
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  },
  // lấy 5 bản ghi có loại là tin tức mới nhất
  getTinTucNew: () => {
    return new Promise((resolve, reject) => {
      const query =
        'SELECT * FROM baiviet WHERE categoryId = 3 ORDER BY STR_TO_DATE(createdAt, "%d-%m-%Y") LIMIT 5';
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  },
  // lấy chi tiết bài viết
  getDetailBaiViet: (slug) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM baiviet WHERE slug = ?";
      connection.query(query, [slug], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results[0]);
      });
    });
  },
  // lấy bài viết giới thiệu
  getDetailBaiVietGioiThieu: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM baiviet WHERE slug = ?";
      connection.query(query, ["gioi-thieu-to-chuc"], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results[0]);
      });
    });
  },

  // đếm số lượng bài viết
  countBaiViet: (is_deleted, callback) => {
    const condition = is_deleted ? "WHERE is_deleted = 0" : "";
    const query = `SELECT COUNT(*) AS baivietCount FROM baiviet ${condition}`;
    connection.query(query, (error, results, fields) => {
      if (error) {
        return callback(error, null);
      }

      const baivietCount = results[0].baivietCount;
      callback(null, baivietCount);
    });
  },
};

// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = BaiVietModel;
