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

eventoController.get("/", middleware.pagination, async (req, res) => { //no probe los filtros + deberia retornar objetos en lugar de ids //arreglar
  
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

eventoController.get("/:id", async (req, res) => { //panda🐼
  
  const eventId=req.params.id
  const event = await eventoService.getEventoById(eventId)
  if (event.rowcountt<1){
    return res.status(404).json("Evento no encontrado")
  }
  else {
    return res.status(200).json(event)
  }

});



eventoController.post("/", middleware.userMiddleware, async (req, res) => { //anda :)
  try{
    let evento = new Events()

    evento.name=req.body.name
    evento.description=req.body.description
    
    if (evento.name.length < 3 || evento.description.length < 3)
      throw new Error ("Nombre o descripcion no validos")
    
    
    evento.max_assistance=req.body.max_assistance
    evento.id_event_location=req.body.id_event_location
    
    
    if (eventoService.getMaxCapacity(evento.id_event_location) < evento.max_assistance)
      throw new Error ("Capacidad maxima de personas exedida")
    evento.price = req.body.price
    evento.duration_in_minutes=req.body.duration_in_minutes
    
    if (evento.price<=0 || evento.duration_in_minutes<=0)
      throw new Error("Precio o duracion no validos")
  
    evento.enabled_for_enrollment=req.body.enabled_for_enrollment
    evento.id_creator_user=req.id
    evento.id_event_category=req.body.id_event_category
    evento.start_date = req.body.start_date ? new Date(req.body.start_date) : undefined;    
    await eventoService.PostEvent(evento)
    
    return res.status(201).json("Evento creado")
  }
  catch(error){
    return res.status(400).json("Datos no validos")
  }
});

eventoController.put("/:id", middleware.userMiddleware, async (req, res) => { //anda
  try{
    let evento = new Events()
    evento.id=req.params.id
    if (!eventoService.eventoExists(evento.id))
      return res.status(404).json("El evento no existe")
    
    evento.name=req.body.name
    evento.description=req.body.description
    
    if (evento.name.length < 3 || evento.description.length < 3)
      throw new Error ("Nombre o descripcion no validos")
    
    
    evento.max_assistance=req.body.max_assistance
    evento.id_event_location=req.body.id_event_location
    
    
    if (await eventoService.getMaxCapacity(evento.id_event_location) < evento.max_assistance)
      throw new Error ("Capacidad maxima de personas exedida")
    evento.price = req.body.price
    evento.duration_in_minutes=req.body.duration_in_minutes
    
    if (evento.price<=0 || evento.duration_in_minutes<=0)
      throw new Error("Precio o duracion no validos")
  
    evento.enabled_for_enrollment=req.body.enabled_for_enrollment
    evento.id_creator_user=req.id
    evento.id_event_category=req.body.id_event_category
    evento.start_date = req.body.start_date ? new Date(req.body.start_date) : undefined;  

    await eventoService.PatchEvent(evento)
    return res.status(200).json("Evento actualizado")

  }
  catch (e){
    return res.status(400).json("Datos no validos")
  }

}
);

eventoController.delete("/:id", middleware.userMiddleware, async (req, res) => { //anda
  const evento=(await eventoService.getEventoById(req.params.id))[0]
  if (evento !==undefined && evento.id_creator_user==req.id) {
    const borrado = await eventoService.EliminarEvento(req.params.id);

    if (borrado) {
      return res.status(200).json("borrado correctamente");
    } else {
      return res.status(400).json("Hay usuarios registrados en el evento");
    }
  } else {
    return res.status(404).json("Ese evento no existe o no fue creado por el usuario identificado");
  }
});

eventoController.post("/:id/enrollment",middleware.userMiddleware, async (req, res) => { //funky town (funca)

  const userId=req.id
  const eventId=req.params.id

  let eventEnrollment = new event_enrollment()

  eventEnrollment.id_event=eventId
  eventEnrollment.id_user=userId
  eventEnrollment.description = req.body.description == undefined ? null : req.body.description
  const now = new Date()
  eventEnrollment.registration_date_time =now
  eventEnrollment.attended=null
  eventEnrollment.observations=null
  eventEnrollment.rating=null
  
  if(!(await eventoService.eventoExists(eventId))){
    return res.status(404).json("El evento no existe")
  }

  if (await eventoService.checkEventoValido(eventId,userId)){
    eventoService.newEnrollment(eventEnrollment)
    return res.status(200).json("Registrado en el evento correctamente")
  }
  else return res.status(400).json("Ya esta registrado en el evento o el registro no esta habilitado o la capacidad maxima fue alcanzada o el evento ya paso")
});

eventoController.delete("/:id/enrollment",middleware.userMiddleware,async (req,res) =>{ //anda
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
  

  const rating = req.params.rating;
  const userId=req.id
  const eventId=req.params.id
  
  if (!(await eventoService.eventoExists(eventId))){
    return res.status(404).json("El evento no existe")
  }
  if (await eventoService.canGiveRating(eventId,userId,rating)){
    let eventEnrollment = new event_enrollment()

    eventEnrollment.observations= req.body.observations
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




export default eventoController;
