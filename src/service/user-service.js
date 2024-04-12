export class  Users {
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
}