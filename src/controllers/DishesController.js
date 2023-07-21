const AppError = require('../utils/AppError');
const knex = require('../database/knex');
const DiskStorage = require('../providers/DiskStorage');

class DishesController {
  async create(request, response) {
    const user_id = request.user.id;
    const { name, price, description, category, ingredients } = request.body;
    const dishFilename = request.file.filename;
    const diskStorage = new DiskStorage();

    if (!dishFilename) {
      throw new AppError('Imagem é um campo obrigatório!');
    }

    const filename = await diskStorage.save(dishFilename);

    const [dishes_id] = await knex('dishes').where({ user_id }).insert({
      user_id,
      name,
      price,
      description,
      image: filename,
      category,
    });

    if (ingredients) {
      if (ingredients.length >= 0) {
        if (Array.isArray(ingredients)) {
          const ingredientsInsert = ingredients.map((ingredient) => {
            return {
              dishes_id,
              title: ingredient,
            };
          });

          await knex('ingredients').insert(ingredientsInsert);
        } else {
          await knex('ingredients').insert({
            dishes_id,
            title: ingredients,
          });
        }
      }
    }

    return response.json('O prato foi criado com sucesso.');
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, price, description, category, ingredients } = request.body;
    const dishIngredients = JSON.parse(ingredients);

    const dish = await knex('dishes').where({ id }).first();
    if (!dish) {
      throw new AppError('Prato não encontrado.');
    }

    if (request.file) {
      const dishFilename = request.file.filename;
      const diskStorage = new DiskStorage();

      if (dishFilename) {
        await diskStorage.delete(dish.image);
        const filename = await diskStorage.save(dishFilename);
        dish.image = filename;
      }
    }

    dish.name = name ?? dish.name;
    dish.price = price ?? dish.price;
    dish.description = description ?? dish.description;
    dish.image, (dish.category = category ?? dish.category);

    await knex('dishes').where({ id }).update({
      name: dish.name,
      price: dish.price,
      description: dish.description,
      image: dish.image,
      category: dish.category,
      updated_at: knex.fn.now(),
    });

    const ingredientsInsert = dishIngredients.map((ingredient) => {
      return {
        dishes_id: id,
        title: ingredient,
      };
    });

    await knex('ingredients').where('dishes_id', id).delete();

    await knex('ingredients').insert(ingredientsInsert);

    return response.json('As alterações foram salvas com sucesso.');
  }

  async delete(request, response) {
    const { id } = request.params;

    const dish = await knex('dishes').where({ id }).first();
    if (!dish) {
      throw new AppError('Prato nao encontrado.');
    }

    await knex('dishes').where({ id }).delete();

    return response.json('Prato excluído com sucesso.');
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex('dishes').where({ id }).first();
    if (!dish) {
      throw new AppError('Prato não encontrado.');
    }

    return response.json(dish);
  }

  async showAll(request, response) {
    const { name } = request.query;
    let dishes;

    if (name) {
      dishes = await knex('ingredients')
        .select([
          'dishes.id',
          'dishes.name',
          'dishes.price',
          'dishes.description',
          'dishes.category',
          'dishes.image',
          'ingredients.title',
        ])
        .whereLike('dishes.name', `%${name}%`)
        .orWhereLike('ingredients.title', `%${name}%`)
        .innerJoin('dishes', 'dishes.id', 'ingredients.dishes_id')
        .groupBy('dishes.id');
    } else {
      dishes = await knex('dishes');
    }

    return response.json(dishes);
  }
}

module.exports = DishesController;
