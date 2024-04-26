import Express from "express";
const provinciaController = Express.Router();
import Users from "../service/user-service.js";
import Eventos from "../service/evento-service.js" // que importe el service de user
import Provincias from "../service/provincia-service.js" // que importe el service de provincias
const userService = new Users();
const eventoService = new Eventos()
const provinciaService = new Provincias();
//nota: aparentemente hay que validar TODO
provinciaController.get("/", (req, res) => {

  let id = Number(req.params.id)
   

  if (id != null & !provinciaService.ChequearProvinciaExiste(req.params.id)) //Chequea si existe provincia
  return res.json("Ese id no existe")

  if (id) {
    let province = provinciaService.SearchProvinceById(id) 
    return res.json(province)
    
  }  else {
    let provinces = provinciaService.SearchProvinces() 
    return res.json(provinces)
  }

})
provinciaController.post("/", (req, res) => { // QUEDA SOLUCIONAR EL CHEQUEO DE DATOS
  let error = false
  let name =
    typeof req.body.name  == "string"
      ? req.body.name 
      : (error = true);
      console.log("name" + error)
  let full_name =
    typeof req.body.full_name == "string" ? req.body.full_name : (error = true);
let latitude = Number(req.body.latitude)
     latitude =
    latitude == 'null'
      ? req.body.latitude
      : (error = true);
      console.log("user" + error)
  let longitude = Number(req.body.longitude)
   longitude =
    longitude == 'null' 
      ? longitude
      : (error = true);
      console.log("att" + error)
      let dO = Number(req.body.display_order)
      dO =
        dO == 'null' 
         ? dO
         : (error = true); 
         console.log("rat" + error)
  if (error == false) {
    let province = provinciaService.CreateProvince(name,full_name,latitude,longitude,dO) //funcion que crea provincias
    return res.json(province)
    
  }  else {
    return res.status(400).send({

      reason: "Datos no validos",
    });
  }


})
provinciaController.patch("/:id", (req, res) => {
  let error = false
  let name =
    typeof req.body.name  == "string"
      ? req.body.name 
      : (error = true);
      console.log("name" + error)
  let full_name =
    typeof req.body.full_name == "string" ? req.body.full_name : (error = true);
let latitude = Number(req.body.latitude)
     latitude =
    latitude == 'null'
      ? req.body.latitude
      : (error = true);
      console.log("user" + error)
  let longitude = Number(req.body.longitude)
   longitude =
    longitude == 'null' 
      ? longitude
      : (error = true);
      console.log("att" + error)
      let dO = Number(req.body.display_order)
      dO =
        dO == 'null' 
         ? dO
         : (error = true); 
         console.log("rat" + error)
  if (error == false) {
    let province = provinciaService.EditarPorId(name,full_name,latitude,longitude,dO,req.params.id) //funcion que edita
    return res.json(province)
    
  }  else {
    return res.status(400).send({

      reason: "Datos no validos",
    });
  }


})
provinciaController.delete("/:id", (req, res) => {
 id = provinciaService.ChequearProvinciaExiste(req.params.id)
  if (id) {
    let province = provinciaService.DeleteProvince(id) //funcion que crea provincias
    return res.json(province)
    
  }  else {
    return res.status(400).send({

      reason: "Datos no validos",
    });
  }


})


export default provinciaController