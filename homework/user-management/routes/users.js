var express = require("express");
var router = express.Router();
var userSchema = require("../schemas/user");
/* GET users listing. */

function BuildQuery(query) {
  let result = {};
  if (query.username) {
    result.username = new RegExp(query.username, "i");
  }
  if (query.fullname) {
    result.fullname = new RegExp(query.fullname, "i");
  }
  result.logincount = {};
  if (query.logincount) {
    if (query.logincount.$gte) {
      result.logincount.$gte = Number(query.logincount.$gte);
    }
    if (query.logincount.$lte) {
      result.logincount.$lte = Number(query.logincount.$lte);
    }
  }
  return result;
}

router.get("/", async function (req, res, next) {
  let users = await userSchema.find(BuildQuery(req.query)).populate({
    path: "role",
    select: "name",
  });
  res.status(200).send({
    success: true,
    data: users,
  });
});

/* GET BY ID*/
router.get("/:id", async function (req, res, next) {
  try {
    let user = await userSchema.findById(req.params.id).populate("role");
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

/* SOFT DELETE */
router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let user = await userSchema.findOne({
      _id: id,
    });
    if (user) {
      user.isDeleted = true;
      await user.save()
      res.status(200).send({
        success:true,
        data:user
      })
    }
    else
    {
      res.status(404).send({
        success:false,
        message: "ID khong ton tai"
      })
    }
  } catch (error) {
    res.status(404).send({
      success:false,
      message: error.message
    })
  }
});

router.post('/', async function(req,res,next){
  try {
    let body = req.body;
    if(body.username && body.email)
    {
      let user = await userSchema.findOne({
        username : body.username
      })
      if(user)
      {
        res.status(404).send({
          success:false,
          message:"Username đã tồn tại!"
        })
      }
      let emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegExp.test(body.email))
      {
        res.status(404).send({
          success:false,
          message:"Email không hợp lệ"
        })
      }
      res.status(404).send({
        success:true,
        message:"Username và Email hợp lệ"
      })
    }
    else
    {
      res.status(404).send({
        success:false,
        message:"Username hoặc Email không được bỏ trống!"
      })
    }
  } catch (error) {
    res.status(404).send({
      success:false,
      message: error.message
    })
  } 
})

module.exports = router;
