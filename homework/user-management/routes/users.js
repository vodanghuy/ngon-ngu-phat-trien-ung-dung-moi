var express = require("express");
var router = express.Router();
var userSchema = require("../schemas/user");
var roleSchema = require("../schemas/role");
/* GET users listing. */
router.get("/", async function (req, res, next) {
  let users = await userSchema.find({});
  res.send(users);
});

/* GET users by ID. */
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let user = await userSchema.findById(id).populate('role');
    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error.message,
    });
  }
});

/* CREATE user. */
router.post("/", async function (req, res, next) {
  try {
    let body = req.body;
    let role = req.body.role;
    let getRole = await roleSchema.findOne({
      name: role,
    });
    let newUser = new userSchema({
      username: body.username,
      password: body.password,
      role: getRole._id,
    });
    await newUser.save();
    res.status(200).send({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

/* UPDATE user */
router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let body = req.body;
    let user = await userSchema.findById(id);
    if (body.username) {
      user.username = body.username;
    }
    if (body.password) {
      user.password = body.password;
    }
    if (body.role) {
      let getRole = await roleSchema.findOne({
        name: body.role,
      });
      user.role = getRole;
    }
    await user.save();
    res.status(200).send({
      success: true,
      date: user
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      date: error.message
    })
  }
});

/* DELETE user */
router.delete('/:id', async function(req,res,next){
  try {
    let id = req.params.id;
    let user = await userSchema.findById(id);
    if(user)
    {
      user.isDeleted = true;
      await user.save();
      res.status(200).send({
        success:true,
        date: user
      })
    }
  } catch (error) {
    res.status(404).send({
      success:false,
      date: error.message
    })
  }
})

module.exports = router;
