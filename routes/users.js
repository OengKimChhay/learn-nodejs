const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authentication = require("../middleware/authentication");

router
  .route("/")
  .get(authentication, UserController.all)
  .post(UserController.create);
router
  .route("/:id")
  .get(UserController.getOne)
  .patch(UserController.updateOne)
  .delete(UserController.deleteOne);
router.route("/login").post(UserController.login);

module.exports = router;
