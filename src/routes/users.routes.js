const { Router } = require('express');
const usersRouter = Router();

const UsersController = require("../controllers/UsersController")
const usersController = new UsersController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

usersRouter.post('/', usersController.create);
usersRouter.put('/', ensureAuthenticated, usersController.update);
usersRouter.delete('/', ensureAuthenticated, usersController.delete);

module.exports = usersRouter;
