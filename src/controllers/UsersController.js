const AppError = require('../utils/AppError');
const knex = require('../database/knex');
const { hash, compare } = require('bcrypt');

class UsersController {
  async create(req, res) {
    const { name, email, password, admin } = req.body;

    const emailExists = await knex('user').where({ email }).first();
    if (emailExists) {
      throw new AppError('Este e-mail já está em uso.');
    }

    const hashedPassword = await hash(password, 8);

    if (admin == true) {
      await knex('user').insert({
        name,
        email,
        password: hashedPassword,
        admin: true,
      });
    } else {
      await knex('user').insert({
        name,
        email,
        password: hashedPassword,
        admin: false,
      });
    }

    return res.json('Usuário criado com sucesso.');
  }

  async update(req, res) {
    const user_id = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await knex('user').where({ id: user_id }).first();
    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const emailInUse = await knex('user').where({ email }).first();
    if (emailInUse && user.email !== emailInUse.email) {
      throw new AppError('Este e-mail já está em uso');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (!currentPassword && newPassword) {
      throw new AppError('Por favor, insira a senha atual.');
    }

    if (currentPassword && newPassword) {
      const validadePassword = await compare(currentPassword, user.password);
      if (!validadePassword) {
        throw new AppError('A senha atual não confere.');
      }

      user.password = await hash(newPassword, 8);
    }

    await knex('user').where({ id: user_id }).update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now(),
    });

    return res.json('As informações foram alteradas com sucesso.');
  }

  async delete(req, res) {
    const user_id = req.user.id;
    const { password } = req.body;

    const user = await knex('user').where({ id: user_id }).first();
    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const validadePassword = await compare(password, user.password);
    if (!validadePassword) {
      throw new AppError('Senha incorreta.');
    }

    await knex('user').where({ id: user_id }).delete();

    return res.json('Usuário excluído com sucesso.');
  }
}

module.exports = UsersController;
