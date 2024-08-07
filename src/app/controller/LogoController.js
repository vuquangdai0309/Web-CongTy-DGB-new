const LogoModel = require("../models/logo");
class LogoController {
  async index(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    try {
      const data = await LogoModel.getAllLogo();
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
        logos: paginatedData,

        pagination: {
          // valuecurrent: searchTerm,
          prev: page > 1 ? page - 1 : null,
          next: endIndex < data.length ? page + 1 : null,
          pages: pages,
        },
      };
      res.render("admin/logo/logo", viewData);
    } catch (error) {
      console.log("Error", error);
    }
  }
  async create(req, res) {
    const forms = {
      company: req.body.company,
      nameLogo: req.file.path,
    };

    try {
      await LogoModel.createLogo(forms);
      res.redirect("back");
    } catch (error) {
      console.log("Error", error);
    }
  }

  async edit(req, res) {
    const id = req.params.id;

    const forms = {
      company: req.body.company,
      nameLogo: req.file ? req.file.path : req.body.getLogo,
    };

    try {
      await LogoModel.updateLogo(id, forms);
      res.redirect("back");
    } catch (error) {
      console.log("Error", error);
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    try {
      await LogoModel.deleteLogo(id);
      res.redirect("back");
    } catch (error) {
      console.log("Error", error);
    }
  }
}

module.exports = new LogoController();
