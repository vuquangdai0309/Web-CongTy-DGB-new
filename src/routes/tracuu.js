const express = require("express");
const router = express.Router();
const TraCuuController = require("../app/controller/TraCuuController");
const upload = require("../app/middlewares/uploadMilddle");
const CheckController = require("../app/middlewares/checkout");
// tạo file pdf
router.get("/create-pdf", CheckController.checkout, TraCuuController.createPDF);
router.post(
  "/creat",
  CheckController.checkout,
  upload.single("filepdf"),
  TraCuuController.creat
);

//xóa
router.delete("/:id", CheckController.checkout, TraCuuController.delete);

//xóa
router.get("/:id/detail", CheckController.checkout, TraCuuController.detail);

//update
router.put(
  "/:id/edit",
  CheckController.checkout,
  upload.single("filepdf"),
  TraCuuController.update
);

router.get("/", CheckController.checkout, TraCuuController.index);
module.exports = router;
