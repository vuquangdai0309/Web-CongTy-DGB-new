const BaiViet = require("../models/baiviet");
const TraCuu = require("../models/tracuu");
const LogoModel = require("../models/logo");
class HomeController {
  async index(req, res, next) {
    try {
      const [showmenu, gioithieu, showlogo, gioithieutochuc, logos] =
        await Promise.all([
          BaiViet.getAllDichVuShowMenu(),
          BaiViet.getAllGioiThieu(),
          BaiViet.getAllDichVuShowLogo(),
          BaiViet.getDetailBaiVietGioiThieu(),
          LogoModel.getAllLogo(),
        ]);
      res.render("home", {
        showmenu,
        gioithieu,
        showlogo,
        gioithieutochuc,
        logos,
      });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  //chi tiết bài viết
  async baiviet(req, res, next) {
    try {
      const [baiviet, showmenu, gioithieu, showlogo, logos] = await Promise.all(
        [
          BaiViet.getDetailBaiViet(req.params.slug),
          BaiViet.getAllDichVuShowMenu(),
          BaiViet.getAllGioiThieu(),
          BaiViet.getAllDichVuShowLogo(),
          LogoModel.getAllLogo(),
        ]
      );
      res.render(
        "baiviet/detail",
        { baiviet, showmenu, gioithieu, showlogo, logos },
        console.log(baiviet)
      );
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }

  async tintuc(req, res, next) {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const pageSize = 6; // Kích thước trang
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    try {
      const [showmenu, gioithieu, showlogo, data, latestPosts, logos] =
        await Promise.all([
          BaiViet.getAllDichVuShowMenu(),
          BaiViet.getAllGioiThieu(),
          BaiViet.getAllDichVuShowLogo(),
          BaiViet.getAllTinTuc(),
          //lấy 10 bài viết mới nhất
          BaiViet.getTinTucNew(),
          LogoModel.getAllLogo(),
        ]);

      const totalPages = Math.ceil(data.length / pageSize);
      const pages = Array.from({ length: totalPages }, (_, index) => {
        return {
          number: index + 1,
          active: index + 1 === page,
        };
      });
      const paginatedData = data.slice(startIndex, endIndex);
      paginatedData.title = "test";
      // Chuẩn bị dữ liệu để truyền vào template
      const viewData = {
        showmenu: showmenu,
        showlogo: showlogo,
        gioithieu: gioithieu,
        latestPosts: latestPosts,
        tintuc: paginatedData,
        logos,
        pagination: {
          prev: page > 1 ? page - 1 : null,
          next: endIndex < data.length ? page + 1 : null,
          pages: pages,
        },
      };
      // Render template và truyền dữ liệu
      res.render("tintuc/tintuc", viewData);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  //Tra cứu giấy chứng nhận
  async search(req, res) {
    const code = req.query.code;
    try {
      const [showmenu, gioithieu, showlogo, tracuu, logos] = await Promise.all([
        BaiViet.getAllDichVuShowMenu(),
        BaiViet.getAllGioiThieu(),
        BaiViet.getAllDichVuShowLogo(),
        TraCuu.searchTraCuu(code),
        LogoModel.getAllLogo(),
      ]);
      res.render("tracuu/tracuu", {
        showmenu,
        showlogo,
        gioithieu,

        tracuu: tracuu[0],
        logos,
      });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  async lienhe(req, res, next) {
    try {
      const [showmenu, gioithieu, showlogo, logos] = await Promise.all([
        BaiViet.getAllDichVuShowMenu(),
        BaiViet.getAllGioiThieu(),
        BaiViet.getAllDichVuShowLogo(),
        LogoModel.getAllLogo(),
      ]);
      res.render("lienhe/lienhe", { showmenu, gioithieu, showlogo, logos });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  // tìm kiếm bài viết
  async timkiem(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 9;
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const searchTerm = req.query.search || "";
    try {
      const [showmenu, gioithieu, showlogo, data, logos] = await Promise.all([
        BaiViet.getAllDichVuShowMenu(),
        BaiViet.getAllGioiThieu(),
        BaiViet.getAllDichVuShowLogo(),
        BaiViet.searchBaiVietByNameClient(searchTerm),
        LogoModel.getAllLogo(),
      ]);
      const totalPages = Math.ceil(data.length / pageSize);
      const pages = Array.from({ length: totalPages }, (_, index) => {
        return {
          number: index + 1,
          active: index + 1 === page,
          isDots: index + 1 > 5,
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
        logos,
        pagination: {
          // valuecurrent: searchTerm,
          prev: page > 1 ? page - 1 : null,
          next: endIndex < data.length ? page + 1 : null,
          pages: pages,
        },
      };
      // Render template và truyền dữ liệu
      res.render("timkiem/timkiem", viewData);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  error404(req, res) {
    res.render("error404/error");
  }
}
module.exports = new HomeController();
