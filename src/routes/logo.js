const express = require("express");
const router = express.Router();
const LogoController = require("../app/controller/LogoController");
const upload = require("../app/middlewares/uploadMilddle");
const CheckController = require("../app/middlewares/checkout");

router.post(
  "/:id/edit",
  CheckController.checkout,
  upload.single("nameLogo"),
  LogoController.edit
);

router.post(
  "/create",
  CheckController.checkout,
  upload.single("nameLogo"),
  LogoController.create
);
//xóa
router.delete("/:id", CheckController.checkout, LogoController.delete);
//form edit

router.get("/", CheckController.checkout, LogoController.index);
module.exports = router;
