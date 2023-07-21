const { Router} = require("express");
const routes = Router();

const usersRouter = require("../routes/users.routes")
const sessionsRouter = require("../routes/sessions.routes");
const dishesRoutes = require('./dishes.routes');




routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/dishes", dishesRoutes);




module.exports = routes;