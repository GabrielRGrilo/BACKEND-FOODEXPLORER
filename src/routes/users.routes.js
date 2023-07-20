const { Router } = require('express');
const userRoutes = Router();

const UsersController = require("../controllers/UsersController")
const usersController = new UsersController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

userRoutes.post('/', usersController.create);
userRoutes.put('/', ensureAuthenticated, usersController.update);
userRoutes.delete('/', ensureAuthenticated, usersController.delete);

module.exports = userRoutes;
