const { vi } = require("date-fns/locale");
const TraCuus = require("../models/tracuu");
const fs = require("fs").promises;
const path = require("path");
class TraCuuController {
  // lấy bản ghi
  async index(req, res, next) {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const pageSize = 12; // Kích thước trang
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const search = req.query.name || "";
    try {
      const statuses = await TraCuus.getAllStatus();
      const data = await TraCuus.getAllTraCuus(search);
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
        tracuu: paginatedData,
        search,
        statuses,
        pagination: {
          prev: page > 1 ? page - 1 : null,
          next: endIndex < data.length ? page + 1 : null,
          pages: pages,
        },
      };

      // Render template và truyền dữ liệu
      res.render("admin/tracuu/tracuu", viewData);
    } catch (error) {
      console.log("Error", error);
    }
  }
  createPDF(req, res) {
    TraCuus.getAllTraCuus(async (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        res.status(500).send("Internal Server Error");
      } else {
        try {
          // Đọc file PDF từ đường dẫn hoặc URL
          fs.readFile("FormDGB.pdf")
            .then((existingPdfBytes) => PDFDocument.load(existingPdfBytes))
            .then((pdfDoc) => {
              // Tạo một trang mới trong tài liệu PDF
              const [newPage] = pdfDoc.getPages();
              let yPosition = 450;
              // Chèn dữ liệu từ MySQL vào trang
              // Điểm bắt đầu chèn dữ liệu trên trang
              const helveticaFont = pdfDoc.embedFont(
                PDFDocument.Font.Helvetica
              );

              results.forEach((row) => {
                newPage.drawText(` ${row.address} oke chaa`, {
                  x: 50,
                  y: yPosition,
                  font: helveticaFont,
                  fontSize: 12,
                  fontColor: rgb(0, 0, 0),
                });
                yPosition -= 20; // Giả sử mỗi dòng cách nhau 20 điểm
              });
              // Lưu tài liệu PDF đã cập nhật
              return pdfDoc.save();
            })
            .then((modifiedPdfBytes) => {
              // Sử dụng 'path' để xử lý đường dẫn tệp một cách đúng đắn
              const name = "dai";
              const outputPath = path.join(__dirname, `${name}.pdf`);
              // Ghi tập tin PDF đã cập nhật
              return fs.writeFile(outputPath, modifiedPdfBytes);
            })
            .then(() => {
              res.send(
                "Dữ liệu từ MySQL đã được chèn thành công vào tài liệu PDF."
              );
            })
            .catch((error) => {
              console.error("Lỗi:", error);
              res.status(500).send("Đã xảy ra lỗi.");
            });
        } catch (error) {
          console.error("Lỗi:", error);
          res.status(500).send("Đã xảy ra lỗi.");
        }
      }
    });
  }
  // Thêm bản ghi
  creat(req, res, next) {
    TraCuus.addTraCuu(
      {
        filepdf: req.file.path,
        code: req.body.code,
        company: req.body.company,
        customer: req.body.customer,
        address: req.body.address,
        phone: req.body.phone,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
      },
      (err, result) => {
        if (err) {
          console.error("Lỗi thêm bản ghi:", err);
          res.status(500).send("Internal Server Error");
        } else {
          res.redirect("/admin/tra-cuu-giay-chung-nhan");
          console.log("Bản ghi đã được thêm thành công:", result);
        }
      }
    );
  }
  //delete
  delete(req, res, next) {
    TraCuus.forceDestroyTraCuu(req.params.id, (err, results) => {
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
  //[PUT] UPDATE /:id
  update(req, res, next) {
    TraCuus.updateTraCuu(
      req.params.id,
      {
        code: req.body.code,
        filepdf: req.file ? req.file.path : req.body.urlFile,
        company: req.body.company,
        address: req.body.address,
        phone: req.body.phone,
        customer: req.body.customer,
        dateStart: req.body.dateStart,
        dateExtend: req.body.dateExtend,
        dateEnd: req.body.dateEnd,
        statusId: req.body.statusId,
      },
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn:", err);
        } else {
          res.redirect("/admin/tra-cuu-giay-chung-nhan");
        }
      }
    );
  }
  // xem chi tiết giấy chứng nhận
  async detail(req, res) {
    const TraCuuId = req.params.id;
    try {
      const tracuu = await TraCuus.getTraCuuById(TraCuuId);
      res.render("admin/tracuu/detail", { tracuu });
    } catch (error) {
      console.log("Error", error);
    }
  }
}
module.exports = new TraCuuController();
