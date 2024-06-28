import Express, { response } from "express";
const userController = Express.Router();
import Users from "../service/user-service.js";
import Eventos from "../service/evento-service.js" // que importe el service de user
const eventoService = new Eventos();
const userService = new Users();
import jwt from 'jsonwebtoken'
import { secretkey } from "../../middleware.js";
import User from "../models/users.js"





//6
userController.post("/login", async (req, res) => { //funca
  
  if (!userService.isEmail(req.body.username)){
    return res.status(400).json({success:false, reason:"El nombre de usuario no es un Email valido."})
  }

  const loggedIn = await userService.Login(req.body.username, req.body.password); //devuelve  true o false si ando o no andó
  
  

  const options = {
    expiresIn:'1h',
    issuer:'hangover'
  }

  const payload={
    id : loggedIn[0].user_exists
  }


    const token = jwt.sign(payload,secretkey,options)

  

if (loggedIn[0].user_exists != -1) {
    return res.status(200).send({
      success:true,
      token:token
    });
  } else{
    return res.status(401).send({
      success:false,
      reason: "Usuario o contraseña no validos",
    });
  }
});

userController.post("/register", (req, res) => {  //funciona
  let error = false;
  let user = new User()

  try{
    if(req.body.first_name.length<3 || req.body.first_name === undefined || req.body.last_name.length<3 || req.body.last_name === undefined){
      throw new error("Datos no validos")
    }
    user.first_name=req.body.first_name
    user.last_name=req.body.last_name

    if(!userService.isValidUsername(req.body.username)){
      throw new error ("datos no validos")
    }
    user.username=req.body.username
    if ((req.body.password.length<3 || req.body.password===undefined)) {
      throw new error ("datos no validos")
    }
    user.password = req.body.password 
    
    userService.Register(user)
    return res.status(201).json("Registrado correctamente")
  }
  catch (e){
    return res.status (400).json("datos no validos")
  }

  
});


export default userController;
