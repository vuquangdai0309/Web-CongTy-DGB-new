

const BaiViet = require('../models/baiviet')
const TraCuu = require('../models/tracuu')

class HomeController {
    async index(req, res, next) {
        try {
            const [showmenu, gioithieu, showlogo,gioithieutochuc] = await Promise.all([BaiViet.getAllDichVuShowMenu(),
            BaiViet.getAllGioiThieu(),
            BaiViet.getAllDichVuShowLogo(),
            BaiViet.getDetailBaiVietGioiThieu()
            ])
            res.render('home', { showmenu, gioithieu, showlogo,gioithieutochuc });
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
    //chi tiết bài viết
    async baiviet(req, res, next) {
        try {
            const [baiviet, showmenu, gioithieu, showlogo] = await Promise.all([
                BaiViet.getDetailBaiViet(req.params.slug),
                BaiViet.getAllDichVuShowMenu(),
                BaiViet.getAllGioiThieu(),
                BaiViet.getAllDichVuShowLogo()])
            res.render('baiviet/detail', { baiviet, showmenu, gioithieu, showlogo }, console.log(baiviet));
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }

    }
    async tracuu(req, res, next) {
        try {
            const [showmenu, gioithieu, showlogo] = await Promise.all([BaiViet.getAllDichVuShowMenu(), BaiViet.getAllGioiThieu(), BaiViet.getAllDichVuShowLogo()])
            res.render('tracuu/tracuu', { showmenu, gioithieu, showlogo });
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
    async tintuc(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 6; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        try {
            const [showmenu, gioithieu, showlogo, data, latestPosts] = await Promise.all([
                BaiViet.getAllDichVuShowMenu(),
                BaiViet.getAllGioiThieu(),
                BaiViet.getAllDichVuShowLogo(),
                BaiViet.getAllTinTuc(),
                //lấy 10 bài viết mới nhất
                BaiViet.getTinTucNew()
            ])

            const totalPages = Math.ceil(data.length / pageSize);
            const pages = Array.from({ length: totalPages }, (_, index) => {
                return {
                    number: index + 1,
                    active: index + 1 === page,
                };
            });
            const paginatedData = data.slice(startIndex, endIndex);
            paginatedData.title = 'test'
            // Chuẩn bị dữ liệu để truyền vào template
            const viewData = {
                showmenu: showmenu,
                showlogo: showlogo,
                gioithieu: gioithieu,
                latestPosts: latestPosts,
                tintuc: paginatedData,
                pagination: {
                    prev: page > 1 ? page - 1 : null,
                    next: endIndex < data.length ? page + 1 : null,
                    pages: pages,
                },
            };
            // Render template và truyền dữ liệu
            res.render('tintuc/tintuc', viewData);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
    //Tra cứu giấy chứng nhận
    async search(req, res, next) {
        const madangky = req.body.madangky
        const ngaybatdau = req.body.ngaybatdau
        const ngayketthuc = req.body.ngayketthuc
        try {
            const [showmenu, gioithieu, showlogo, tracuu] = await Promise.all([
                BaiViet.getAllDichVuShowMenu(),
                BaiViet.getAllGioiThieu(),
                BaiViet.getAllDichVuShowLogo(),
                TraCuu.searchTraCuu(madangky, ngaybatdau, ngayketthuc),
            ])
            res.render('tracuu/tracuu', { showmenu, showlogo, gioithieu, tracuu })
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }

    }
    async lienhe(req, res, next) {
        try {
            const [showmenu, gioithieu, showlogo] = await Promise.all([BaiViet.getAllDichVuShowMenu(), BaiViet.getAllGioiThieu(), BaiViet.getAllDichVuShowLogo()])
            res.render('lienhe/lienhe', { showmenu, gioithieu, showlogo });
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }

    }
    // tìm kiếm bài viết
    async timkiem(req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 9;
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const searchTerm = req.query.search || '';
        try {
            const [showmenu, gioithieu, showlogo, data] = await Promise.all([BaiViet.getAllDichVuShowMenu(),
            BaiViet.getAllGioiThieu(),
            BaiViet.getAllDichVuShowLogo(),
            BaiViet.searchBaiVietByNameClient(searchTerm)
            ])
            const totalPages = Math.ceil(data.length / pageSize);
            const pages = Array.from({ length: totalPages }, (_, index) => {
                return {
                    number: index + 1,
                    active: index + 1 === page,
                    isDots: index + 1 > 5
                };
            });
            const paginatedData = data.slice(startIndex, endIndex);
            // Chuẩn bị dữ liệu để truyền vào template
            const viewData = {
                showmenu: showmenu,
                showlogo: showlogo,
                gioithieu: gioithieu,
                data: paginatedData,
                searchTerm,

                pagination: {
                    // valuecurrent: searchTerm,
                    prev: page > 1 ? page - 1 : null,
                    next: endIndex < data.length ? page + 1 : null,
                    pages: pages,
                },
            };
            // Render template và truyền dữ liệu
            res.render('timkiem/timkiem', viewData);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
    error404(req, res) {
        res.render('error404/error')
    }
}
module.exports = new HomeController