const BaiViets = require("../models/baiviet");
const slugify = require("slugify");
const { formatDate } = require("../middlewares/format");
class BaiVietController {
  async index(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const searchTerm = req.query.search || "";
    try {
      const categories = await BaiViets.getAllCategories();
      const data = await BaiViets.searchBaiVietByName(searchTerm);

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
        baiviet: paginatedData,
        searchTerm,
        categories,
        pagination: {
          // valuecurrent: searchTerm,
          prev: page > 1 ? page - 1 : null,
          next: endIndex < data.length ? page + 1 : null,
          pages: pages,
        },
      };
      // Render template và truyền dữ liệu
      res.render("admin/baiviet/store", viewData);
    } catch (error) {
      console.log("Error", error);
    }
  }
  creat(req, res, next) {
    BaiViets.addBaiViet(
      {
        title: req.body.title,
        categoryId: req.body.category,
        image: req.file.path,
        content: req.body.editor,
        isMenu: JSON.parse(req.body.showmenu),
        isLogo: JSON.parse(req.body.showlogo),
        createdAt: formatDate(req.body.createdAt),
        slug: slugify(req.body.title, { lower: true }),
      },
      (err, results) => {
        if (err) {
          console.error("Lỗi thêm sản phẩm:", err);
          res.status(500).send("Internal Server Error");
        } else {
          res.render("admin/baiviet/store");
        }
      }
    );
  }
  //[GET] detail content
  detail(req, res, next) {
    const BaiVietId = req.params.id;
    BaiViets.getBaiVietById(BaiVietId, (err, baiviet) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        res.status(500).send("Internal Server Error");
      } else {
        if (baiviet.length === 0) {
          res.status(404).send(" not found");
        } else {
          console.log(baiviet);
          res.render("admin/baiviet/detail", { baiviet });
        }
      }
    });
  }
  // [DELETE] /baiviet/:id
  delete(req, res, next) {
    const baivietId = req.params.id;
    BaiViets.deleteBaiViet(baivietId, (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        res.status(500).send("Internal Server Error");
      } else {
        if (results.affectedRows === 0) {
          res.status(404).send(" not found");
        } else {
          res.redirect("back");
        }
      }
    });
  }
  // [GET] Edit /:id
  async edit(req, res) {
    const BaiVietId = req.params.id;
    try {
      const categories = await BaiViets.getAllCategories();
      const baiviet = await BaiViets.getBaiVietById(BaiVietId);
      res.render("admin/baiviet/edit", { baiviet, categories });
    } catch (error) {
      console.log("Error", error);
    }
  }
  //[PUT] UPDATE /:id
  update(req, res, next) {
    const BaiVietId = req.params.id;
    console.log(req.body);
    BaiViets.updateBaiViet(
      BaiVietId,
      {
        title: req.body.title,
        image: req.file ? req.file.path : req.body.UrlImage,
        categoryId: req.body.category,
        content: req.body.editor,
        isLogo: JSON.parse(req.body.showlogo),
        isMenu: JSON.parse(req.body.showmenu),
        createdAt: formatDate(req.body.createdAt),
        slug: slugify(req.body.title, { lower: true }),
      },
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn:", err);
          res.status(500).send("Internal Server Error");
        } else {
          if (results.affectedRows === 0) {
            res.status(404).send(" not found");
          } else {
            res.json({ message: "thành công" });
          }
        }
      }
    );
  }

  //[Get] Trash
  async trash(req, res, next) {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const pageSize = 12; // Kích thước trang
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const data = await BaiViets.trashGetAllBaiViets();
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
      baiviet: paginatedData,
      pagination: {
        prev: page > 1 ? page - 1 : null,
        next: endIndex < data.length ? page + 1 : null,
        pages: pages,
      },
    };
    // Render template và truyền dữ liệu
    res.render("admin/baiviet/trash", viewData);
  }
  //[PATCH]
  restore(req, res, next) {
    const idToRestore = req.params.id;
    BaiViets.restoreBaiViet(idToRestore, (err, results) => {
      if (err) {
        console.error("Lỗi khi restore bản ghi:", err);
      } else {
        res.redirect("back");
        console.log(`Đã khôi phục bản ghi ${results}`);
      }
    });
  }
  //[DELETE] /baiviet/:id/force
  forceDestroy(req, res, next) {
    const idToForceDelete = req.params.id;
    BaiViets.forceDestroyBaiViet(idToForceDelete, (err, results) => {
      if (err) {
        console.error("Lỗi khi xóa vĩnh viễn bản ghi:", err);
      } else {
        res.redirect("back");
        console.log(`Đã xóa vĩnh viễn bản ghi ${results}`);
      }
    });
  }

  // handle form action
  handleFormAction(req, res, next) {
    const idsToDelete = req.body.baivietIds;

    switch (req.body.action) {
      case "delete":
        BaiViets.deleteAllBaiVietsWithId(idsToDelete, (err, results) => {
          if (err) {
            console.error("Lỗi khi xóa bản ghi:", err);
          } else {
            res.redirect("back");
            console.log(`Đã xóa ${results.affectedRows} bản ghi`);
          }
        });
        break;
      default:
        res.json({ message: "action is invalid" });
    }
  }

  handleFormActionTrash(req, res, next) {
    const ids = req.body.baivietIds;
    switch (req.body.action) {
      case "delete":
        BaiViets.forceDestroyAllSelectedBaiViet(ids, (err, results) => {
          if (err) {
            console.error("Lỗi khi xóa bản ghi:", err);
          } else {
            res.redirect("back");
            console.log(`Đã xóa ${results.affectedRows} bản ghi`);
          }
        });
        break;

      case "restore":
        BaiViets.restoreAllSelectedBaiViet(ids, (err, results) => {
          if (err) {
            console.error("Lỗi khi xóa bản ghi:", err);
          } else {
            res.redirect("back");
            console.log(`Đã xóa ${results.affectedRows} bản ghi`);
          }
        });
        break;
      default:
        res.json({ message: "action is invalid" });
    }
  }
}
module.exports = new BaiVietController();
