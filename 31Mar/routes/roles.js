var express = require('express');
var router = express.Router();
const roleSchema = require('../schemas/role');
let jwt = require('jsonwebtoken');
let { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require('../utils/constants');
/* GET users listing. */
router.get('/', async function (req, res, next) {
  let roles = await roleSchema.find({});
  res.send({
    success: true,
    data: roles
  });
});
router.post('/',check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  let body = req.body;
  let newRole = new roleSchema({
    name: body.name
  })
  await newRole.save();
  res.status(200).send({
    success: true,
    data: newRole
  });

});
//? code như này có chỗ nào không ổn ?

module.exports = router;
