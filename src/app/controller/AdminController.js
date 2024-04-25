const Baiviet = require('../models/baiviet')
const TraCuu = require('../models/tracuu')

class AdminController {
    async index(req, res, next) {
        const is_deleted = 1
        Baiviet.countBaiViet(is_deleted, (error, BaiVietCount) => {
            if (error) {
                return res.status(500).send('Internal Server Error');
            }
            TraCuu.countTraCuu((error, TraCuuCount) => {
                if (error) {
                    return res.status(500).send('Internal Server Error');
                }

                res.render('admin/thongke', { BaiVietCount, TraCuuCount });
            })
        })
    }
}
module.exports = new AdminController