const { Router} = require("express");

const signUpRouter = require("./signUp.routes");
const signInRouter = require("./signIn.routes");
const homeUserRouter = require("./homeUser.routes")
const homeAdminRouter = require("./homeAdmin.routes")

const sessionsRouter = require("./sessions.routes")


const routes = Router();

routes.use("/users", usersRouter);

routes.use("/notes", notesRouter);
routes.use("/tags", tagsRouter);
routes.use("/sessions", sessionsRouter);



module.exports = routes;