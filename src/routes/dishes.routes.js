const { Router } = require('express');
const dishesRouter = Router();

const multer = require('multer');
const uploadConfig = require('../configs/upload');
const upload = multer(uploadConfig.MULTER);

const DishesController = require('../controllers/DishesController');
const dishesController = new DishesController();


const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

dishesRouter.use(ensureAuthenticated);

dishesRouter.post('/', upload.single('image'), dishesController.create);
dishesRouter.put('/:id', upload.single('image'), dishesController.update);
dishesRouter.delete('/:id', dishesController.delete);
dishesRouter.get('/:id', dishesController.show);
dishesRouter.get('/', dishesController.showAll);

module.exports = dishesRouter;
