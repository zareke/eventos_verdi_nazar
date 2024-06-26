import Express from "express";
const eventoController = Express.Router();
import Eventos from "../service/evento-service.js";
import event_enrollment from "../models/event_enrollments.js";
import Middleware from "../../middleware.js";
import EventRepository from "../repositories/events-repository.js";
import Events from "../models/events.js";

var evento = {
  //filtros
  nombre: "",
  categoria: "",
  fechaDeInicio: "",
  tag: "",
};

const eventoService = new Eventos();
const middleware = new Middleware();

eventoController.get("/", middleware.pagination, async (req, res) => {
  
  var allEvents;
  let error = false;

  Object.values(evento).forEach((i) => (i = ""));

  evento.nombre = req.query.name;

  evento.categoria = req.query.category;
  evento.tag = req.query.tag;

  if (req.query.startDate != undefined) {
    evento.fechaDeInicio = !isNaN(Date.parse(req.query.startDate))
      ? req.query.startDate
      : (error = true);
  } else evento.fechaDeInicio = req.query.startDate;

  if (Object.values(evento).some((i) => i != null)) {
    if (error) {
      return res.json("Datos no validos");
    }
    allEvents = await eventoService.getAllEventosFiltrado(
      pageSize,
      page,
      evento
    );
    return res.json(allEvents);
  } 
  else {
    const pageSize = req.limit
    const page = req.offset
    let total
    [allEvents, total] = await eventoService.getAllEventos(pageSize, page);

    res.locals.pagination.total=total


    if(Number(res.locals.pagination.page)*Number(res.locals.pagination.limit)>=total){
      res.locals.pagination.nextPage=null 
    }


    const response = {
      collection:allEvents.rows,
      pagination:res.locals.pagination
  }

    return res.status(200).json(response);
  }
});

eventoController.get("/:id", async (req, res) => {
  if (Number.isInteger(Number(req.params.id))) {
    const id = req.params.id;
    const evento = await eventoService.getEventoById(id);
    return res.json(evento);
  } else return res.json("Datos no validos");
});
/*
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
}*/
function ValidarNumerosEstricto(numeros) {
  let fueError=false
  numeros.forEach((element) => {
    if (isNaN(element)) {
      console.log(" ES NANA");
      fueError=true
    }
  });

  return fueError;
}

eventoController.post("/", middleware.userMiddleware, async (req, res) => {
  try{
    let evento = new Events()

    evento.name=req.body.name
    evento.description=req.body.description
    
    if (evento.name.length < 3 || evento.description.length < 3)
      throw new Error ("datos no validos")
    
    
    evento.max_assistance=req.body.max_assistance
    evento.id_event_location=req.body.id_event_location
    
    if (eventoService.getMaxCapacity(evento.id_event_location) < max_assistance)
      throw new Error ("datos no validos")
    
    
    evento.price = req.body.price
    evento.duration_in_minutes=req.body.duration_in_minutes
    
    if (evento.price<=0 || evento.duration_in_minutes<=0)
      throw new Error("Datos no validos")
  
    evento.enabled_for_enrollment=req.body.enabled_for_enrollment
    evento.id_creator_user=req.id
    evento.id_event_category=req.body.id_event_category
    evento.start_date = req.body.startDate
    
    await eventoService.PostEvent(evento)
    return res.status(201).json("Evento creado")
  }
  catch(error){
    return res.status(400).json("Datos no validos")
  }
});
//HACER VALIDACIONES DE PATCH
eventoController.patch("/:id", middleware.userMiddleware, async (req, res) => { //codigo feisimo deberia ser muchisimo mas corto, hay q empezar from scratch
  const event = await eventoService.getEventoById(req.params.id);
  if (Object.keys(event).length == 0) {
    return res.status(404).json("El evento no existe");
  }
  // Validar que haya al menos un dato para actualizar
  if (!Object.values(req.body).some((i) => i != null)) {
    return res.json("NO HAY NINGUN DATO PARA EDITAR");
  }

  const campos = [
    "name",
    "description",
    "id_event_category",
    "id_event_location",
    "start_date",
    "price",
    "enabled_for_enrollment",
    "max_assistance",
    "duration_in_minutes",
    "id_creator_user",
  ];

  let objetoActualizacion = {}; // el objeto en  el que se le agregan los campos para actualizarlo
  let error = false;
  let stringsAValidar = []; // para ValidarStrings()
  let numerosAValidar = [];// para ValidarNumeros()

  // recorrer los campos esperados y agregar solo los dados
  campos.forEach((campo) => {
    if (req.body[campo] !== undefined) { //si el campo lo contiene el body...
      if (campo === "start_date") {
        const fecha = new Date(req.body[campo]);
        if (!isNaN(fecha.getTime())) {
          objetoActualizacion[campo] = fecha.toLocaleDateString();
        } else {
          error = true;
        }
      } else if ( // si tiene algun campo de numeros...
        [
          "id_event_category",
          "id_event_location",
          "price",
          "enabled_for_enrollment",
          "max_assistance",
          "duration_in_minutes",
          "id_creator_user",
        ].includes(campo)
      ) {
        const valor = Number(req.body[campo]);
        if (!isNaN(valor)) {
          objetoActualizacion[campo] = valor;
          numerosAValidar.push(valor);
        } else {
          error = true;
        }
      } else { // si no, es texto
        objetoActualizacion[campo] = req.body[campo];
        stringsAValidar.push(req.body[campo]);
      }
    }
  });

  // validar los strings y los números solo si existen
  error =
    error || ValidarStrings(stringsAValidar) || ValidarNumeros(numerosAValidar);
  if (req.body["name"] && req.body["name"].length < 3) {
    error = true;
  }
  if (
    req.body["description"] &&
    req.body["description"].length < 3
  ) {
    error = true;
  }
  if (error) {
    return res.status(404).json("Datos no válidos");
  } else {
    try {
      const result = await eventoService.patchEvent(
        req.params.id,
        objetoActualizacion
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      return res.status(404).json("Error interno del servidor");
    }
  }
});

eventoController.delete("/:id", middleware.userMiddleware, async (req, res) => {
  if (eventoService.getEventoById(req.params.id) != undefined) {
    const borrado = await eventoService.EliminarEvento(req.params.id);

    if (borrado) {
      return res.status(200).json("borrado correctamente");
    } else {
      return res.status(400).json("Hay usuarios registrados en el evento");
    }
  } else {
    return res.status(401).json("Ese evento no existe");
  }
});

eventoController.post("/:id/enrollment",middleware.userMiddleware, async (req, res) => { //esto funciona y es muy dificil de checkear, asumir que funciona bastante bien

  const userId=req.id
  const eventId=req.params.id

  let eventEnrollment = new event_enrollment()

  eventEnrollment.id_event=eventId
  eventEnrollment.id_user=userId
  eventEnrollment.description = req.body.description == null || req.body.description == undefined ? null : req.body.description
  const now = new Date()
  eventEnrollment.registration_date_time =now
  eventEnrollment.attended=null
  eventEnrollment.observations=null
  eventEnrollment.rating=null
  
  if(!(eventoService.eventoExists(eventId))){
    return res.status(404).json("El evento no existe")
  }

  if (await eventoService.checkEventoValido(eventId,userId)){
    eventoService.newEnrollment(eventEnrollment)
    return res.status(200).json("Registrado en el evento correctamente")
  }
  else return res.status(400).json("datos no validos. Puede que ya este registrado o el evento ya haya pasado")
});

eventoController.delete("/:id/enrollment",middleware.userMiddleware,async (req,res) =>{ //pretty much works
    const userId=req.id
    const eventId=req.params.id

    if (!eventoService.eventoExists(eventId)){
      return res.status(404).json("El evento no existe")
    }

    if(await eventoService.isDeletePossible(userId,eventId)){
      eventoService.DeleteEnrollment(userId,eventId)
      return res.status(200).json("Suscripcion anulada")
    }
    else return res.status(400).json("El evento ya paso o usted no esta registrado en el evento")
})

eventoController.patch("/:id/enrollment/:rating", middleware.userMiddleware, async (req, res) => { //funciona
  

  const observations = req.body.observations;
  const rating = req.params.rating;
  const userId=req.id
  const eventId=req.params.id
  
  if ((await eventoService.eventoExists(eventId))){
    return res.status(404).json("El evento no existe")
  }
  if (await eventoService.canGiveRating(eventId,userId,rating)){
    let eventEnrollment = new event_enrollment()

    eventEnrollment.observations=observations
    eventEnrollment.attended=true
    eventEnrollment.rating=rating
    eventEnrollment.id_user=userId
    eventEnrollment.id_event=eventId
    await eventoService.PatchEventEnrollment(eventEnrollment)
    return res.status(200).json("Registro actualizado")
  }
  else{
    return res.status(400).json("datos no validos")
  }
  
});

function ValidarStringsEstricto(strings) {
  strings.forEach((element) => {
    if (element.length < 3) {
      return true;
    }
  });
  return false;
}
function ValidarStrings(strings) {
  return strings.some((str) => typeof str !== "string" || str.trim() === ""); // el trim aca es para chequear si es vacio, el trim saca los primeros espacios y si despues de eso sigue vacio significa que el string es completamente vacio
}

function ValidarNumeros(numbers) {
  return numbers.some(
    (num) => num !== undefined && (isNaN(num) || typeof num !== "number")
  );
}


export default eventoController;
