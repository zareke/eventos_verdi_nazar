export default class  Users {
    Login(username,password){
        const query = `select  password=${password} from users where username=${username}`
        const correct = query.execute();    

        return correct
    }

    UserNameExists(username){
        const query = `select exists (select 1 from user where username = ${username})`
        const exists = query.execute()
        return correct
    }

    Register(fn,ln,u,p){
        const query = `insert into user values (${fn},${ln},${u},${p})`
    }

    ObtenerEventosByUserFilters(first_name,last_name,username,attended,rating,pageSize,page, eventFromId){
        let datoshardcodeados = [
            {
                "first_name":first_name,
                "last_name":last_name,
                "username":username,
                "attended":attended,
                "rating":rating
            }
        ]
        //ACA VENDRIA TODA LA QUERY INCREIBLE CON EL EVENTFROMID
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