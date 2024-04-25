

const TraCuus = require('../models/tracuu')
// const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');



class TraCuuController {
    // lấy bản ghi
    index(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 4; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        TraCuus.getAllTraCuus((err, data) => {
            if (err) {
                console.error('Lỗi truy vấn:', err);
                res.status(500).send('Internal Server Error');
            } else {
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

                    tracuu: paginatedData,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                // Render template và truyền dữ liệu
                res.render('admin/tracuu/tracuu', viewData);
            }
        })
    }
    createPDF(req, res) {
        TraCuus.getAllTraCuus(async (err, results) => {
            if (err) {
                console.error('Lỗi truy vấn:', err);
                res.status(500).send('Internal Server Error');
            }
            else {
                try {
                    // Đọc file PDF từ đường dẫn hoặc URL
                    fs.readFile('FormDGB.pdf')
                        .then(existingPdfBytes => PDFDocument.load(existingPdfBytes))
                        .then(pdfDoc => {
                            // Tạo một trang mới trong tài liệu PDF
                            const [newPage] = pdfDoc.getPages();
                            let yPosition = 450;
                            // Chèn dữ liệu từ MySQL vào trang
                            // Điểm bắt đầu chèn dữ liệu trên trang
                            const helveticaFont = pdfDoc.embedFont(PDFDocument.Font.Helvetica);

                            results.forEach(row => {
                                newPage.drawText(` ${row.diachi} oke chaa`, { x: 50, y: yPosition, font: helveticaFont, fontSize: 12, fontColor: rgb(0, 0, 0) });
                                yPosition -= 20; // Giả sử mỗi dòng cách nhau 20 điểm
                            });
                            // Lưu tài liệu PDF đã cập nhật
                            return pdfDoc.save();
                        })
                        .then(modifiedPdfBytes => {
                            // Sử dụng 'path' để xử lý đường dẫn tệp một cách đúng đắn
                            const name = 'dai'
                            const outputPath = path.join(__dirname, `${name}.pdf`);
                            // Ghi tập tin PDF đã cập nhật
                            return fs.writeFile(outputPath, modifiedPdfBytes);
                        })
                        .then(() => {
                            res.send('Dữ liệu từ MySQL đã được chèn thành công vào tài liệu PDF.');
                        })
                        .catch(error => {
                            console.error('Lỗi:', error);
                            res.status(500).send('Đã xảy ra lỗi.');
                        });
                } catch (error) {
                    console.error('Lỗi:', error);
                    res.status(500).send('Đã xảy ra lỗi.');
                }
            };
        })
    }

    // Thêm bản ghi
    creat(req, res, next) {
        TraCuus.addTraCuu((
            {
                filepdf: req.file.path,
                madangky: req.body.madangky,
                congty: req.body.congty,
                nguoidaidien: req.body.nguoidaidien,
                diachi: req.body.diachi,
                sdt: req.body.sdt,
                ngaybatdau: req.body.ngaybatdau,
                ngayketthuc: req.body.ngayketthuc,
                trangthai: 'Đang còn hiệu lực'
            }
        ), (err, result) => {
            if (err) {
                console.error('Lỗi thêm bản ghi:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.redirect('/admin/tra-cuu-giay-chung-nhan')
                console.log('Bản ghi đã được thêm thành công:', result);

            }

        })
    }
    //delete 
    delete(req, res, next) {
        TraCuus.forceDestroyTraCuu(req.params.id, (err, results) => {
            if (err) {
                console.error('Lỗi truy vấn:', err);
                res.status(500).send('Internal Server Error');
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).send(' not found');
                } else {
                    res.redirect('back')
                }
            }
        })

    }
    // [GET] Edit /:id
    edit(req, res, next) {
        TraCuus.getTraCuuById(req.params.id, (err, tracuu) => {
            if (err) {
                console.error('Lỗi truy vấn:', err);
                res.status(500).send('Internal Server Error');
            } else {
                if (tracuu.length === 0) {
                    res.status(404).send(' Not found');
                } else {
                    res.render('admin/tracuu/edit', { tracuu })
                }
            }
        })
    }
    //[PUT] UPDATE /:id
    update(req, res, next) {
        if (req.file) {
            TraCuus.updateTraCuu(req.params.id, ({
                madangky: req.body.madangky,
                filepdf: req.file.path,
                congty: req.body.congty,
                diachi: req.body.diachi,
                sdt: req.body.sdt,
                nguoidaidien: req.body.nguoidaidien,
                ngaybatdau: req.body.ngaybatdau,
                ngaygiahan: req.body.ngaygiahan,
                ngayketthuc: req.body.ngayketthuc,
                trangthai: req.body.trangthai,
            }), (err, results) => {
                if (err) {
                    console.error('Lỗi truy vấn:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    if (results.affectedRows === 0) {
                        res.status(404).send(' Not found');
                    } else {
                        res.redirect('/admin/tra-cuu-giay-chung-nhan')
                    }
                }
            })
        }
        else {
            TraCuus.updateTraCuu(req.params.id, ({
                madangky: req.body.madangky,
                filepdf: req.body.urlFile,
                congty: req.body.congty,
                diachi: req.body.diachi,
                sdt: req.body.sdt,
                nguoidaidien: req.body.nguoidaidien,
                ngaybatdau: req.body.ngaybatdau,
                ngaygiahan: req.body.ngaygiahan,
                ngayketthuc: req.body.ngayketthuc,
                trangthai: req.body.trangthai,
            }), (err, results) => {
                if (err) {
                    console.error('Lỗi truy vấn:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    if (results.affectedRows === 0) {
                        res.status(404).send(' Not found');
                    } else {
                        res.redirect('/admin/tra-cuu-giay-chung-nhan')
                    }
                }
            })
        }
    }
    // xem chi tiết giấy chứng nhận
    detail(req, res) {
        const TraCuuId = req.params.id
        TraCuus.getTraCuuById(TraCuuId, (err, tracuu) => {
            if (err) {
                console.error('Lỗi truy vấn:', err);
                res.status(500).send('Internal Server Error');
            } else {
                if (tracuu.length === 0) {
                    res.status(404).send(' not found');
                } else {
                    console.log(tracuu)
                    res.render('admin/tracuu/detail', { tracuu })
                }
            }
        })

    }
}
module.exports = new TraCuuController