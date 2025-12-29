const express = require("express");
const asyncHandler = require("../utils/asyncHandler");


const router = express.Router();

router.get(
  "/health",
  asyncHandler(async (req, res) => {
    res.json({
      status: "ok",
      service: "sigfarma-server",
      time: new Date().toISOString(),
    });
  })
);

module.exports = router;
