import Express from "express";
const provinciaController = Express.Router();
import Users from "../service/user-service.js";
import Eventos from "../service/evento-service.js" // que importe el service de user
import Provincias from "../service/provincia-service.js" // que importe el service de provincias
import Provinces from "../models/provinces.js"
const userService = new Users();
const eventoService = new Eventos()
const provinciaService = new Provincias();
import Middleware from '../../middleware.js'
const middleware=new Middleware





provinciaController.get("/", middleware.pagination,async (req, res) => { //anda por su puesto
  const pageSize = req.limit
  const offset = req.offset


  let [provinces,total] = await provinciaService.getAllProvinces(pageSize, offset)

  res.locals.pagination.total=total

  if(Number(res.locals.pagination.page)*Number(res.locals.pagination.limit)>=total){
    res.locals.pagination.nextPage=null 
  }

  const response = {
    collection:provinces.rows, //
    pagination:res.locals.pagination
}

  return res.status(200).json(response)


})


provinciaController.get("/:id", async (req, res) => { //san martin de los anda
  
  let id = Number(req.params.id)


  let provincia = await provinciaService.getProvinciaById(id)


  if ( provincia.rowCount<1){
    return res.status(404).json("La provincia no existe")
  }
  else{
    return res.status(200).json(provincia.rows)
  }

})

provinciaController.get("/:id/locations",middleware.pagination, async (req,res) =>{ //anda te de vacaciones

  const pageSize = req.limit
  const page = req.offset

  const idProvince = req.params.id
  let [locations,total] = await provinciaService.getAllLocationsProvince(pageSize, page,idProvince)
  if(locations.rowCount<1){
    return res.status(404).json("Provincia no encontrada")
  }

  res.locals.pagination.total=total

  if(res.locals.pagination.offset*res.locals.pagination.limit>=total){
    res.locals.pagination.nextPage=null 
  }

  const response = {
    categories:locations.rows,
    pagination:res.locals.pagination
}

  return res.status(200).json(response)

})


provinciaController.post("/", async (req, res) => {  //punpiona

  try{
    let provincia = new Provinces()
    if (req.body.name == undefined || req.body.name == null || req.body.name.length<3 || isNaN(req.body.latitude) || isNaN(req.body.longitude)){
      throw new Error("Datos no validos")
    }
    provincia.name=req.body.name
    provincia.full_name=req.body.full_name
    provincia.latitude=req.body.latitude
    provincia.longitude=req.body.longitude
    provincia.display_order=req.body.display_order
    await provinciaService.newProvincia(provincia)
    return res.status(201).json("Provincia creada")
  }
  catch (e){
    return res.status(400).json("Datos no validos")
  }

})

provinciaController.put("/", async (req, res) => { //che dire straits, esto funciona? dire straits: we are the sultans of si
    try{
      const provincia = new Provinces()

      if (req.body.name == undefined || req.body.name == null || req.body.name.length<3 || isNaN(req.body.latitude) || isNaN(req.body.longitude)){
        throw new Error("Datos no validos")
      }

      provincia.id=req.body.id
      provincia.name=req.body.name
      provincia.full_name=req.body.full_name
      provincia.latitude=req.body.latitude
      provincia.longitude=req.body.longitude
      provincia.display_order=req.body.display_order
      if ((await provinciaService.UpdateProvincia(provincia)).rowCount<1){
        return res.status(404).json("Provincia no encontrada")
      }
      else return res.status(200).json("Provincia actualizada")

    }
    catch (e){
      return res.status(400).json("datos no validos")
    }
})


provinciaController.delete("/:id", async (req, res) => {


  let id=req.params.id

  let result = await provinciaService.DeleteProvincia(id) //no anda, deberia borrar en cascada toooodo lo qeu tiene q ver con una provincia y por ende multiples localidades y por ende multiples eventos y por ende toda la informaicon de eventos
    if (result.rowCount<1 || Number.isNaN(id)){
        return res.status(404).json("Provincia no encontrada")
    }
    else{
        return res.status(200).json("Provincia eliminada")
    }

})


export default provinciaController