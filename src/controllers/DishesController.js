const AppError = require('../utils/AppError');
const knex = require('../database/knex');
const DiskStorage = require('../providers/DiskStorage');

class DishesController {
  async create(req, res) {
    const user_id = req.user.id;
    const { name, price, description, category, ingredients } = req.body;
    const dishFilename = req.file.filename;
    const diskStorage = new DiskStorage();

    if (!dishFilename) {
      throw new AppError('A imagem é um campo obrigatório!');
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

    return res.json('Prato criado com sucesso.');
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, price, description, category, ingredients } = req.body;
    const dishIngredients = JSON.parse(ingredients);

    const dish = await knex('dishes').where({ id }).first();
    if (!dish) {
      throw new AppError('O prato não foi encontrado.');
    }

    if (req.file) {
      const dishFilename = req.file.filename;
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

    return res.json('As alterações foram salvar com sucesso.');
  }

  async delete(req, res) {
    const { id } = req.params;

    const dish = await knex('dishes').where({ id }).first();
    if (!dish) {
      throw new AppError('O prato não foi encontrado.');
    }

    await knex('dishes').where({ id }).delete();

    return res.json('O prato foi excluído com sucesso.');
  }

  async show(req, res) {
    const { id } = req.params;

    const dish = await knex('dishes').where({ id }).first();
    if (!dish) {
      throw new AppError('O prato não foi encontrado.');
    }

    return res.json(dish);
  }

  async showAll(req, res) {
    const { name } = req.query;
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

    return res.json(dishes);
  }
}

module.exports = DishesController;
