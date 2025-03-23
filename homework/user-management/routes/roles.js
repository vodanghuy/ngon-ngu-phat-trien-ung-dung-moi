var express = require("express");
var router = express.Router();
var roleSchema = require("../schemas/role");

// GET USER LISTING

router.get("/", async function (req, res, next) {
  try {
    let roles = await roleSchema.find();
    res.status(200).send({
      sucess: true,
      data: roles,
    });
  } catch (error) {
    res.status(400).send({
        sucess: false,
        message: error.message
      });
  }
});

module.exports = router;