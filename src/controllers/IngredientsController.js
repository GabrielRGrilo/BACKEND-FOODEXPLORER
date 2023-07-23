const knex = require('../database/knex');

class IngredientsController {
  async showAll(request, response) {
    const { dishes_id } = request.params;

    const ingredients = await knex('ingredients').where({ dishes_id });

    return response.json(ingredients);
  }
}

module.exports = IngredientsController;
