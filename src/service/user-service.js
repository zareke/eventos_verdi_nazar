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

    async ObtenerUserByEventId(first_name,last_name,username,attended,rating,pageSize,page, eventFromId){
        let datoshardcodeados = [
            {
                "first_name":first_name,
                "last_name":last_name,
                "username":username,
                "attended":attended,
                "rating":rating
            }
        ]
        //ACA VENDRIA TODA LA QUERY INCREIBLE CON EL EVENTFROMID, lo que no tenemos bien en claro es si podemos si quiera obtener el evento y pasarlo al servicio del usuario...    
      
      
        return {
            collection: datoshardcodeados /*query*/, 
            pagination: {
              limit: pageSize,
              offset: page,
              nextPage: "http://localhost:3000/user?limit=15&offset=1",
              total: /*query2*/ 299998,
            },
          };
          
    }

    
}