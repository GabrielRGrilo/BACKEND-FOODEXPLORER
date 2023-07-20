const { Router} = require("express");

const usersRouter = require("../routes/users.routes")
const sessionsRouter = require("../routes/sessions.routes");



const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter)




module.exports = routes;