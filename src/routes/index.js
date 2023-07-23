const { Router} = require("express");
const routes = Router();

const usersRouter = require("../routes/users.routes")
const sessionsRouter = require("../routes/sessions.routes");
const dishesRouter = require('./dishes.routes');
const ingredientsRouter = require("./ingredients.routes")




routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/dishes", dishesRouter);
routes.use("/ingredients", ingredientsRouter);




module.exports = routes;