import validator from 'validator'
import UsersRepository from '../repositories/users-repository.js'

export default class  Users {
    async Login(username,password){
        
        const userrepo = new UsersRepository()
        const loggedin = await userrepo.login(username,password)

        
        
        return loggedin
    }

    async isValidUsername(username) {
        const userRpeo= new UsersRepository()
        if (!(validator.isEmail(username)) || userRpeo.usernameExists(username)) {
          return false;
        }
    }
    async isEmail(username){
        return validator.isEmail(username)
    }
    async Register(user){
        const userRepo = new UsersRepository()
        userRepo.register(user)
    }



    
}