import Express from "express";
const userController = Express.Router();
import Users from "../service/user-service.js";
import Eventos from "../service/evento-service.js" // que importe el service de user
const eventoService = new Eventos();
const userService = new Users();

//hola zarek y dante del futuro les dejo comentarios para que entiendan mi codigo a la hora de hacer el service -dante del pasado

userController.get("/login", (req, res) => {
  
  const token = (Math.random() + 1).toString(36).substring(7); //el token no se cuando se usa y etc
  let correct;
  correct = userService.Login(req.query.username, req.query.password); //devuelve  true o false si ando o no andó
  
  if (correct) {
    return res.status(201).send({
      token: token,
      info_adicional:"ahora, cuando geteas, aunque no hayas puesto usuario ni contraseña te llega el token. Eso es porque no hace falta pasar por validacion si pusiste todos los datos, porque en el momento en el que codeemos la bd solo chequeamos si coincide con alguno en la tabla"
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
    typeof req.body.first_name == "string" && req.body.first_name!=null
      ? req.body.first_name
      : (error = true);
  let last_name =
    typeof req.body.last_name == "string" && req.body.last_name!= null ? req.body.last_name : (error = true);
  let username = req.body.username != null && userService.UsernameExists(req.body.username)
    ? req.body.username
    : (error = true); //username exists es una funcion imaginaria que deveulve true o false si el usuario ya existe bastante self explanatory


  let password =
    req.body.password!=null && req.body.password.toString().length > 7
      ? req.body.password
      : (error = "la contraseña es no valida"); 
  if (error == false) {
    
    return res.status(201).send(userService.Register(first_name,last_name,username,password));
    
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
userController.get("/:id/enrollment", (req, res) => {
  const pageSize = 4
  const page = req.query.page
 if (Object.values(req.query).some((i) => i != null)){
    let filteredEventFromUsers = userService.ObtenerUserByEventId(req.query.first_name,req.query.last_name,req.query.username,req.query.attended,req.query.rating,pageSize,page, req.params.id) //funcion que retorna los pibes de la BD segun la bd
    return res.json(filteredEventFromUsers)}
    else
    return res.json("Datos no validos")


})

export default userController;
