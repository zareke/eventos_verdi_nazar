import UsersRepository from '../repositories/users-repository.js'

export default class  Users {
    async Login(username,password){
        
        const userrepo = new UsersRepository()
        const loggedin = await userrepo.login(username,password)

        
        
        return loggedin
    }

    UsernameExists(username){
       // const query = `select exists (select 1 from user where username = ${username})`
      //  const exists = query.execute()
      let correct = true //harcoding
        return correct
    }

    Register(fn,ln,u,p){
        //const query = `insert into user values (${fn},${ln},${u},${p})`
        return {
            "fn":fn,
            "ln":ln,
            "u":u,
            "p":p
        }
    }

    ObtenerUserByEventId(first_name,last_name,username,attended,rating,pageSize,page, eventFromId){
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