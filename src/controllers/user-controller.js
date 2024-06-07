import Express, { response } from "express";
const userController = Express.Router();
import Users from "../service/user-service.js";
import Eventos from "../service/evento-service.js" // que importe el service de user
const eventoService = new Eventos();
const userService = new Users();
import jwt from 'jsonwebtoken'
export const secretkey = "ariaverdienspotify"




//6
userController.get("/login", async (req, res) => {
  
  const loggedin = await userService.Login(req.body.username, req.body.password); //devuelve  true o false si ando o no andó
  
  

  const options = {
    expiresIn:'1h',
    issuer:'hangover'
  }

  const payload={
    id : loggedin[0].user_exists
  }


    const token = jwt.sign(payload,secretkey,options)

  

if (loggedin[0].user_exists != -1) {
    return res.status(201).send({
      //token: token,
      token:token
    });
  } else {
    return res.status(403).send({
      reason: "Usuario o contraseña no validos",
    });
  }
});

userController.post("/register", (req, res) => { //anda 👌
  let error = false;
  let first_name =
    typeof req.body.first_name == "string" && req.body.first_name!=null
      ? req.body.first_name
      : (error = true);
  let last_name =
    typeof req.body.last_name == "string" && req.body.last_name!= null ? req.body.last_name : (error = true);
  let username = req.body.username != null && userService.UsernameExists(req.body.username) //no existe username exists 
    ? req.body.username
    : (error = true); 


  let password =
    req.body.password!=null && req.body.password.toString().length > 7
      ? req.body.password
      : (error = "la contraseña es no valida"); 


  
  if (error == false) {
    
    userService.Register(first_name,last_name,username,password)
    return res.status(201).json("usuario a sido created");

  } else if (error == "la contraseña es no valida") {
    return res.status(400).send({
      reason: "contraseña no valida",
    });
  } else {
    return res.status(400).send({
      reason: "datos no validos",
    });
  }
});


export default userController;
