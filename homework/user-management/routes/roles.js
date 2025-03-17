var express = require("express");
var router = express.Router();
var roleSchema = require("../schemas/role");

/* GET roles listing. */
router.get("/", async function (req, res, next) {
  let roles = await roleSchema.find({});
  res.send(roles);
});

/* GET role by _id */
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleSchema.findById(id);
    res.status(200).send({
      success: true,
      date: role,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      date: error.message,
    });
  }
});
/* CREATE role */
router.post("/", function (req, res, next) {
  try {
    let body = req.body;
    let newRole = new roleSchema({
      name: body.name,
    });
    newRole.save();
    res.status(200).send({
      success: true,
      date: newRole,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error.message,
    });
  }
});

/* UPDATE role */
router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleSchema.findById(id);
    if (role) {
      body = req.body;
      if (body.name) {
        role.name = body.name;
      }
    }
    await role.save();
    res.status(200).send({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error.message,
    });
  }
});

// DELETE role
router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let role = await roleSchema.findById(id);
    if (role) {
      role.isDeleted = true;
      await role.save();
      res.status(200).send({
        success: true,
        data: role,
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error.message,
    });
  }
});
module.exports = router;
