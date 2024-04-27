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
  const pageSize = 4;
  const page = req.query.page;
  let provinces = provinciaService.SearchProvinces(pageSize, page)
  return res.json(provinces)


})
provinciaController.get("/:id", (req, res) => {
  let id = Number(req.params.id)


  if (id != null & !provinciaService.ChequearProvinciaExiste(req.params.id)) //Chequea si existe provincia
    return res.json("Ese id no existe")


  let province = provinciaService.SearchProvinceById(id)
  return res.json(province)



})
provinciaController.post("/", (req, res) => { // QUEDA SOLUCIONAR EL CHEQUEO DE DATOS
  let error = false
  let name =
    req.body.name != null
      ? req.body.name
      : (error = true);
  let full_name =
    typeof req.body.full_name != null ? req.body.full_name : (error = true);
  let latitude = Number(req.body.latitude)
  latitude =
    !isNaN(latitude)
      ? req.body.latitude
      : (error = true);
  let longitude = Number(req.body.longitude)

  longitude =
    !isNaN(longitude)
      ? req.body.longitude
      : (error = true);
  let dO = Number(req.body.display_order)
  dO =
    !isNaN(dO)
      ? req.body.display_order
      : (error = true);
  if (error == false) {
    let province = provinciaService.CreateProvince(name, full_name, latitude, longitude, dO) //funcion que crea provincias
    return res.json(province)

  } else {
    return res.status(400).send({

      reason: "Datos no validos",
    });
  }


})
provinciaController.patch("/:id", (req, res) => {
  /* if(SearchProvinceById(req.params.id) == null){//      <------- POR AHORA NO PODEMOS HACER ESTO PORQUE NO TENEMOS LA QUERY
     return res.status(400).send({
 
       reason: "ID no existe",
     });
   }*/ //      <------- POR AHORA NO PODEMOS HACER ESTO PORQUE NO TENEMOS LA QUERY
  if (!Object.values(req.body).some((i) => i != null) || !Object.keys(req.body).some((i) => i == "name" || i == "full_name" || i == "latitude" || i == "longitude" || i == "display_order")) {
    return res.json("NO HAY NINGUN DATO PARA EDITAR")
  }
  let error = false
  let name = req.body.name
  let full_name = req.body.full_name
  let latitude = Number(req.body.latitude)
  if (req.body.latitude != undefined) {


    latitude =
      !isNaN(latitude)
        ? req.body.latitude
        : (error = true);
  } else latitude = req.body.latitude
  let longitude = Number(req.body.longitude)
  if (req.body.longitude != undefined) {
    longitude =
      !isNaN(longitude)
        ? req.body.longitude
        : (error = true);
  } else longitude = req.body.longitude
  let dO = Number(req.body.display_order)
  if (req.body.display_order != undefined) {

    dO =
      !isNaN(dO)
        ? req.body.display_order
        : (error = true);
  } else dO = req.body.display_order
  console.log("rat" + error)
  if (error == false) {
    let province = provinciaService.EditarPorId(name, full_name, latitude, longitude, dO, req.params.id) //funcion que edita
    return res.json(province)

  } else {
    return res.status(400).send({

      reason: "Datos no validos",
    });
  }


})
provinciaController.delete("/:id", (req, res) => {
  let id = provinciaService.ChequearProvinciaExiste(req.params.id)
  if (id) {
    let province = provinciaService.DeleteProvince(id) //funcion que elimina provincias
    return res.json(province)

  } else {
    return res.status(400).send({

      reason: "Datos no validos",
    });
  }


})


export default provinciaController