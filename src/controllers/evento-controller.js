import Express from "express";
const eventoController = Express.Router();
import Eventos from "../service/evento-service.js";
var evento = {
  //filtros
  nombre: "",
  categoria: "",
  fechaDeInicio: "",
  tag: "",
};

const eventoService = new Eventos();

eventoController.get("/", async (req, res) => {
  const pageSize = 4;
  const page = req.query.page;
  var allEvents;
  let error = false;
 
  Object.values(evento).forEach((i) => (i = ""));

  //LAS VALIDACIONES MITICAS (perdon por el codigo espagueti)
  evento.nombre = req.query.name

  evento.categoria = req.query.category
  evento.tag = req.query.tag

  if (req.query.startDate != undefined) {
    evento.fechaDeInicio = !isNaN(Date.parse(req.query.startDate)) ?
      req.query.startDate : (error = true); 
  } else evento.fechaDeInicio = req.query.startDate

  
  if (
    Object.values(evento).some((i) => i != null)
  ) {

    if (error) {
      return res.json("Datos no validos");
    }
    allEvents = await eventoService.getAllEventosFiltrado(pageSize, page, evento);
    return res.json(allEvents)

  } else {
    allEvents = await eventoService.getAllEventos(pageSize, page);
    
    return res.json(allEvents);
  }






});

eventoController.get("/:id", async (req, res) => {
  
  if (Number.isInteger(Number(req.params.id))) {
    const id = req.params.id;
    const evento = await eventoService.getEventoById(id);
    return res.json(evento);
  } else return res.json("Datos no validos");
});
function ValidarStrings(datos){
  for(var i= 0; i <datos.length; i++){
    let dato = datos[i]
    if (dato == undefined)
    {(error = true)} 
  }
  return false
}
function ValidarNumeros(datos){
  for(var i= 0; i <datos.length; i++){
    let dato = datos[i]
    if (isNaN(dato))
    {console.log(i);return true} 
  }
  return false
}
eventoController.post("/", (req, res) => {
  let error = false;
  let name = req.body.name 
  
//la validacion
  let description =
    req.body.description ;
    error=ValidarStrings([name,description])
    
  let id_event_category = Number(req.body.id_event_category);
  let id_event_location = Number(req.body.id_event_location);
  let start_date = Date.parse(req.body.start_date);
  let duration_in_minutes = Number(req.body.duration_in_minutes);

  let price = Number(req.body.price);
  let enabled_for_enrollment = Number(req.body.enabled_for_enrollment);
  let max_assistance = Number(req.body.max_assistance);
  let id_creator_user = Number(req.body.id_creator_user);
  error=ValidarNumeros([id_event_category,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id_creator_user])

  if (error) {
    return res.json("Datos no validos");
  } else {
    let object = {
      "name": name,
      "description": description,
      "id_event_category": id_event_category,
      "id_event_location": id_event_location,
      "start_date": start_date,
      "duration_in_minutes": duration_in_minutes,
      "price": price,
      "enabled_for_enrollment": enabled_for_enrollment,
      "max_assistance": max_assistance,
      "id_creator_user": id_creator_user,
    };
    return res.json(eventoService.PostEvent(object)); // funcion que crea evento
  }
});
eventoController.patch("/:id", (req, res) => {
  //EL SUPER HIPER MEGA VALIDAZO 2 o 3 en realidad (perdon)
  if (!Object.values(req.body).some((i) => i != null) ) {
    return res.json("NO HAY NINGUN DATO PARA EDITAR")
  }
  let error = false;
  let name = req.body.name

  let description = req.body.description
  error=ValidarStrings([name,description])

  let id_event_category = Number(req.body.id_event_category);
  let id_event_location = Number(req.body.id_event_location);
  let start_date = Date.parse(req.body.start_date);
  let price = Number(req.body.price);
  let enabled_for_enrollment = Number(req.body.enabled_for_enrollment);
  let max_assistance = Number(req.body.max_assistance);
  
  let duration_in_minutes = Number(req.body.duration_in_minutes);
  let id_creator_user = Number(req.body.id_creator_user);
  error=ValidarNumeros([id_event_category,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id_creator_user])
  if (error) {
    return res.json("Datos no validos");
  } else {
    let object = {
      name: name,
      description: description,
      id_event_category: id_event_category,
      id_event_location: id_event_location,
      start_date: start_date,
      duration_in_minutes: duration_in_minutes,
      price: price,
      enabled_for_enrollment: enabled_for_enrollment,
      max_assistance: max_assistance,
      id_creator_user: id_creator_user,
    };
    return res.json(eventoService.patchEvent(req.params.id, object)); // funcion que crea evento
  }
});
eventoController.delete("/:id", (req, res) => {
  if (eventoService.getEventoById(req.params.id) != null)
  return res.json(eventoService.EliminarEvento(req.params.id)) 
  else
    return res.json("Ese evento no existe")
})

eventoController.post("/:id/enrollment", (req, res) => {
  if (
    !(
      /*comentario para zarek dormidoa para que no rompa el codigo gracias aunque ya lo rompi ahre*/ (
        Number.isInteger(Number(req.query.userId)) &&
        Number.isInteger(Number(req.params.id))
      )
    )
  ) {
    return res.json("No hay ningun parametro de id de usuario o/y el id de evento no existe");
  }

  const user = req.query.userId;
  const evento = req.params.id;
  const descripcion = "n";
  const attended = 0;
  const observations = "o";
  const rating = 0;
  const enrollment = eventoService.postNewEnrollment(
    user,
    evento,
    descripcion,
    attended,
    observations,
    rating
  );
  return res.json(enrollment);
});

eventoController.patch("/:id/enrollment", (req, res) => {
  if (
    !(
       (
        Number.isInteger(Number(req.query.rating)) &&
        Number.isInteger(Number(req.params.id))
      )
    )
  ) {
    return res.json("No hay ningun rating o/y el id de evento no existe");
  }

  const observations = req.query.observations;
  const rating = req.query.rating;
  const enrollment = eventoService.patchEnrollment(
    "evento",
    "descripcion",
    "1",
    observations,
    rating
  );
  return res.json(enrollment);
});

export default eventoController;
