var express = require("express");
var router = express.Router();
var userSchema = require("../schemas/user");
var roleSchema = require("../schemas/role");
/* GET users listing. */

function BuildQuery(query) {
  let result = {};
  if (query.username) {
    result.username = new RegExp(query.username, 'i');
  }
  if (query.fullName) {
    result.fullName = new RegExp(query.fullName.trim(), 'i');
  }
  result.loginCount = {};
  if (query.loginCount) {
    if (query.loginCount.$gte) {
      result.loginCount.$gte = Number(query.loginCount.$gte);
    }
    else
    {
      result.loginCount.$gte = 0
    }
    if (query.loginCount.$lte) {
      result.loginCount.$lte = Number(query.loginCount.$lte);
    }
    else
    {
      result.loginCount.$lte = 1000
    }
  }
  else
  {
    result.loginCount.$gte = 0
    result.loginCount.$lte = 1000
  }
  return result;
}

router.get('/', async function (req, res, next) {
  try {
    let users = await userSchema.find(BuildQuery(req.query)).populate({
      path: 'role',
      select: 'name',
    });
    if(users.length != 0)
    {
      res.status(200).send({
        success: true,
        data: users,
      });
    }
    else
    {
      res.status(200).send({
        success: true,
        message:"Không tồn tài dữ liệu theo yêu cầu"
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
    
});

/* GET BY ID*/
router.get('/:id', async function (req, res, next) {
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
      await user.save();
      res.status(200).send({
        success: true,
        data: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ID khong ton tai",
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const body = req.body;
    let user = await userSchema.findOne({
      username: body.username,
    });
    if (user) {
      res.status(404).send({
        success: false,
        message: "Username đã tồn tại!",
      });
    }
    let emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegExp.test(body.email)) {
      res.status(404).send({
        success: false,
        message: "Email không hợp lệ",
      });
    }
    let getRole = await roleSchema.findOne({
      name: body.role,
    });
    let newUser = new userSchema({
      username: body.username,
      password: body.password,
      email: body.email,
      fullName: body.fullName ? body.fullName : "",
      avatarURL: body.avatarURL ? body.avatarURL : "",
      status: body.status ? body.status : false,
      role: getRole._id,
    });
    await newUser.save();
    res.status(200).send({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE USER
router.put("/:id", async function (req, res, next) {
  try {
    let body = req.body;
    let getRole = roleSchema.findOne({
      name : body.role
    })
    let user = await userSchema.findById(req.params.id);
    if (user) {
      if (body.username) {
        user.username = body.username;
      }
      if (body.password) {
        user.password = body.password;
      }
      if (body.email) {
        user.email = body.email;
      }
      if (body.fullName) {
        user.fullName = body.fullName;
      }
      if (body.avatarURL) {
        user.avatarURL = body.avatarURL;
      }
      if (body.status) {
        user.status = body.status;
      }
      if(getRole)
      {
        user.role = getRole._id;
      }
      if(body.loginCount)
        {
          user.loginCount = body.loginCount;
        }
      if (body.description) {
        user.description = body.description;
      }
      await user.save();
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

// POST CHECK USERNAME AND EMAIL
router.post('/checking', async function(req,res,next){
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
      res.status(200).send({
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
