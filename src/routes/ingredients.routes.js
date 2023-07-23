const { Router } = require('express');
const ingredientsRoutes = Router();

const IngredientsController = require('../controllers/IngredientsController');
const ingredientsController = new IngredientsController();

ingredientsRoutes.get('/:dishes_id', ingredientsController.showAll);

module.exports = ingredientsRoutes;
