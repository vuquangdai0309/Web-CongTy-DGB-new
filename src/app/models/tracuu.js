const connection = require('../../config/db/index')
const TraCuuModel = {
    getAllTraCuus: (callback) => {
        const query = 'SELECT * FROM tracuu ';
        connection.query(query, callback);
    },
    getTraCuuById: (TraCuuId, callback) => {
        const query = 'SELECT * FROM tracuu WHERE _id = ?';
        connection.query(query, [TraCuuId], callback);
    },

    addTraCuu: (TraCuu, callback) => {
        const query = 'INSERT INTO tracuu (filepdf, madangky,congty,diachi,sdt,nguoidaidien,ngaybatdau,ngayketthuc,trangthai) VALUES (?,?,?,?,?,?,?,?,?)';
        const values = [TraCuu.filepdf, TraCuu.madangky, TraCuu.congty, TraCuu.diachi, TraCuu.sdt, TraCuu.nguoidaidien, TraCuu.ngaybatdau, TraCuu.ngayketthuc, TraCuu.trangthai];
        connection.query(query, values, callback);
    },
    updateTraCuu: (TraCuuId, TraCuu, callback) => {
        const query = 'UPDATE tracuu SET filepdf=?, madangky=?,congty=?,diachi=?,sdt=?,nguoidaidien=?,ngaybatdau=?,ngayketthuc=?,trangthai=?,ngaygiahan=?  WHERE _id = ?';
        const values = [TraCuu.filepdf, TraCuu.madangky, TraCuu.congty, TraCuu.diachi, TraCuu.sdt, TraCuu.nguoidaidien, TraCuu.ngaybatdau, TraCuu.ngayketthuc, TraCuu.trangthai, TraCuu.ngaygiahan, TraCuuId];
        connection.query(query, values, callback);
    },
    forceDestroyTraCuu: (TraCuuId, callback) => {
        const query = 'DELETE FROM tracuu WHERE _id = ?';
        connection.query(query, [TraCuuId], callback);
    },
    //tìm kiếm giấy chứng nhận
    searchTraCuu: (madangky, ngaybatdau, ngayketthuc) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tracuu WHERE madangky = ? AND ngaybatdau = ? AND ngayketthuc = ? ';
            connection.query(query, [madangky, ngaybatdau, ngayketthuc], (err, results) => {
                if (err) {
                    reject(error);
                }
                resolve(results[0]);
            })
        })
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
    }

};

// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = TraCuuModel;