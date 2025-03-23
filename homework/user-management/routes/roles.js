var express = require("express");
var router = express.Router();
var roleSchema = require("../schemas/role");

// GET LISTING

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
      message: error.message,
    });
  }
});

// GET ROLE BY ID
router.get("/:id", async function (req, res, next) {
  try {
    let role = await roleSchema.findById(req.params.id);
    if (role) {
      res.status(200).send({
        success: true,
        data: role,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Invalid ID",
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

// CREATE ROLE
router.post("/", async function (req, res, next) {
  try {
    let body = req.body;
    let role = new roleSchema({
      name: body.name,
      description: body.description ? body.description : "",
    });
    await role.save();
    res.status(200).send({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE ROLE
router.put("/:id", async function (req, res, next) {
  try {
    let body = req.body;
    let role = await roleSchema.findById(req.params.id);
    if (role) {
      if (body.name) {
        let existedRole = await roleSchema.findOne({ name: body.name });
        if (existedRole) {
          res.status(404).send({
            success: false,
            message: "existed name",
          });
        } else {
          role.name = body.name;
        }
      }
      if (body.description) {
        role.description = body.description;
      }
      await role.save();
      res.status(200).send({
        success: true,
        data: role,
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

// SOFT DELETE
router.delete("/:id", async function (req, res, next) {
  try {
    let role = await roleSchema.findById(req.params.id);
    if (role) {
      role.isDeleted = true;
      await role.save();
      res.status(200).send({
        success: true,
        data: role
      });
    }
    else
    {
      res.status(400).send({
        success: false,
        message: "ID is not exist"
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});
module.exports = router;
