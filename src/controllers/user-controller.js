import Express from "express";
const userController = Express.Router();
import Users from "../service/user-service.js";
import Eventos from "../service/evento-service.js" // que importe el service de user
const eventoService = new Eventos();
const userService = new Users();

//hola zarek y dante del futuro les dejo comentarios para que entiendan mi codigo a la hora de hacer el service -dante del pasado

userController.post("/login", (req, res) => {
  const token = (Math.random() + 1).toString(36).substring(7); //el token no se cuando se usa y etc
  let correct;
  correct = userService.Login(req.query.username, req.query.password); //devuelve  true o false si ando o no andó
  correct = false; //BORRAR CUANDO HAGAMOS EL SERVICE BORRAR
  if (correct) {
    return res.status(201).send({
      token: token,
    });
  } else {
    return res.status(403).send({
      reason: "Usuario o contraseña no validos",
    });
  }
});

userController.post("/register", (req, res) => {
  let error = false;
  let first_name =
    typeof req.body.first_name == "string"
      ? req.body.first_name
      : (error = true);
  let last_name =
    typeof req.body.last_name == "string" ? req.body.last_name : (error = true);
  let username = userService.UsernameExists(req.body.username)
    ? req.body.username
    : (error = true); //username exists es una funcion imaginaria que deveulve true o false si el usuario ya existe bastante self explanatory
  let contraseña = req.body.password;
  let password =
    contraseña.length > 7 &&
    typeof contraseña == "string" &&
    /\d/.test(contraseña)
      ? contraseña
      : (error = "la contraseña es no valida"); //la cosa mas obscure que vi en mi vida javascript es ese /\d/ rarisimo

  if (error == false) {
    userService.Register(first_name,last_name,username,password)
    return res.status(201);
    
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
//5
userController.get("/:id", (req, res) => {
  const pageSize = 4
  const page = req.query.page
  let error = false
  let first_name =
    typeof req.query.first_name == "string"
      ? req.query.first_name
      : (error = true);
      console.log("name" + error)
  let last_name =
    typeof req.query.last_name == "string" ? req.query.last_name : (error = true);
    let username =
    typeof req.query.username == "string"
      ? req.query.username
      : (error = true);
      console.log("user" + error)
  let attended = Boolean(req.query.attended)
   attended =
    typeof attended == "boolean" 
      ? attended
      : (error = true);
      console.log("att" + error)
      let rating = Number(req.query.rating)
      rating =
       typeof rating == "number" 
         ? rating
         : (error = true); 
         console.log("rat" + error)
  if (error == false) {
    let filteredEventFromUsers = userService.ObtenerEventosByUserFilters(first_name,last_name,username,attended,rating,pageSize,page, req.params.id) //funcion que retorna los pibes de la BD segun la bd
    return res.json(filteredEventFromUsers)
    
  }  else {
    return res.status(400).send({
      
      reason: "Datos no validos",
    });
  }

})

export default userController;
