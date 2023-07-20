const { Router} = require("express");

const usersRouter = require("../routes/users.routes")



const routes = Router();

routes.use("/users", usersRouter);




module.exports = routes;