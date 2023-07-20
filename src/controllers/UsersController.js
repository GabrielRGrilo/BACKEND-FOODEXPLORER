const { hash, compare } = require("bcrypt")

const AppError = require("../utils/AppError")

const knex = require("../database/knex")

class UsersController {
    /**
     * index - GET para listar vários registros
     * show - GET para exibir um registro específico
     * create - POST para criar um registro
     * update - PUT para atualizar um registro
     * delete - DELETE para remover um registro
     */

    async create(request, response) {
        const { name, email, password } = request.body
        
        
        const checkUserExists = await knex("users").where({email}).first()

        if(checkUserExists) {
            
            throw new AppError("Esse email já está cadastrado.")
        }


        const hashedPassword = await hash(password, 8)

        const user = await knex("users").insert({
            name,
            email,
            password: hashedPassword,
            
        })         
   

       

       return response.status(201).json()
   
    }

    async delete (request, response) {
        const {id}  = request.params;

        await knex("users").where({id}).delete();

        
        return response.json()
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        
        const user = await knex("users").where({id}).first()

        if(!user) {
            throw new AppError("Usuário não encontrado.")
        }

        const userWithUpdatedEmail = await knex("users").where({email}).first()

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este e-mail já está em uso.")
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password) {
            throw new AppError("A precisa informar a senha antiga para definir a nova senha.")
        }

        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword) {
                throw new AppError("A senha antiga não confere.")

            }
            user.password =  await hash(password, 8)
        }


       
            await knex('users')
             .where({ id })
             .update({
              name,
              email,
              password: user.password,
              updated_at: knex.fn.now(),
              
             })
             ;
            return response.json();
           

       
        

        
    }
}

module.exports = UsersController;