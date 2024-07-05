import Express from "express";
const eventoController = Express.Router();
import Eventos from "../service/evento-service.js";
import event_enrollment from "../models/event_enrollments.js";
import Middleware from "../../middleware.js";
import EventRepository from "../repositories/events-repository.js";
import Events from "../models/events.js";
import User from "../models/users.js";

const eventoService = new Eventos();
const middleware = new Middleware();

eventoController.get("/", middleware.pagination, async (req, res) => {
  let filtros = {
    nombre: "",
    categoria: "",
    fechaDeInicio: "",
    tag: "",
  };

  filtros.nombre = req.query.name;
  filtros.categoria = req.query.category;
  filtros.tag = req.query.tag;
if (req.query.startDate) {
  try {
      const fecha = new Date(req.query.startDate);
      if (isNaN(fecha.getTime())) {
          return res.status(400).json("Fecha inválida");
      }
      filtros.fechaDeInicio = req.query.startDate;
      console.log("Fecha recibida:", req.query.startDate);
      console.log("Fecha procesada:", filtros.fechaDeInicio);
  } catch (error) {
      return res.status(400).json("Formato de fecha inválido");
  }
}
  const pageSize = req.limit;
  const offset = req.offset;

  try {
    let allEvents, total;
    if (Object.values(filtros).some(i => i !== "" && i!==undefined)) {
      [allEvents, total] = await eventoService.getAllEventosFiltrado(
        pageSize,
        offset,
        filtros
      );
    } else {
      [allEvents, total] = await eventoService.getAllEventos(pageSize, offset);
    }
    
    res.locals.pagination.total = total;
    if (Number(res.locals.pagination.page) * Number(res.locals.pagination.limit) >= total) {
      res.locals.pagination.nextPage = null;
    }
      
    const response = {
      collection: allEvents.rows,
      pagination: res.locals.pagination,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json("Error interno del servidor");
  }
});

eventoController.get("/:id", async (req, res) => {
  

  const eventId = req.params.id;
  const event = await eventoService.getEventoById(eventId);
  if (Object.keys(event).length === 0) {
    return res.status(404).json("Evento no encontrado");
  } else {
    return res.status(200).json(event);
  }
});

eventoController.post("/", middleware.userMiddleware, async (req, res) => {
  try {
    let evento = new Events();

    evento.name = req.body.name;
    evento.description = req.body.description;

    if (evento.name.length < 3 || evento.description.length < 3)
      throw new Error("Nombre o descripcion no validos");

    evento.max_assistance = req.body.max_assistance;
    evento.id_event_location = req.body.id_event_location;

    if (
      eventoService.getMaxCapacity(evento.id_event_location) <
      evento.max_assistance
    )
      throw new Error("Capacidad maxima de personas exedida");

      evento.price = req.body.price;
      evento.duration_in_minutes = req.body.duration_in_minutes;
      
      if (evento.price <= 0 || evento.duration_in_minutes <= 0)
      throw new Error("Precio o duracion no validos");
    
    evento.enabled_for_enrollment = req.body.enabled_for_enrollment;
    evento.id_creator_user = req.id;
    evento.id_event_category = req.body.id_event_category;
    evento.start_date = req.body.start_date
      ? new Date(req.body.start_date)
      : undefined;
    await eventoService.PostEvent(evento);

    return res.status(201).json("Evento creado");
  } catch (error) {
    console.error(error)
    return res.status(400).json("Datos no validos");
  }
});

eventoController.put("/", middleware.userMiddleware, async (req, res) => {
  
  try {
    let evento = new Events();
    evento.id = req.body.id;
    if (!eventoService.eventoExists(evento.id))
      return res.status(404).json("El evento no existe");

    evento.name = req.body.name;
    evento.description = req.body.description;

    if (evento.name.length < 3 || evento.description.length < 3)
      throw new Error("Nombre o descripcion no validos");

    evento.max_assistance = req.body.max_assistance;
    evento.id_event_location = req.body.id_event_location;

    if (
      (await eventoService.getMaxCapacity(evento.id_event_location)) <
      evento.max_assistance
    )
      throw new Error("Capacidad maxima de personas exedida");
    evento.price = req.body.price;
    evento.duration_in_minutes = req.body.duration_in_minutes;

    if (evento.price <= 0 || evento.duration_in_minutes <= 0)
      throw new Error("Precio o duracion no validos");

    evento.enabled_for_enrollment = req.body.enabled_for_enrollment;
    evento.id_creator_user = req.id;
    evento.id_event_category = req.body.id_event_category;
    evento.start_date = req.body.start_date
      ? new Date(req.body.start_date)
      : undefined;

    await eventoService.PatchEvent(evento);
    return res.status(200).json("Evento actualizado");
  } catch (e) {
    return res.status(400).json("Datos no validos");
  }
});

eventoController.delete("/:id", middleware.userMiddleware, async (req, res) => {
  
  const evento = (await eventoService.getEventoById(req.params.id))[0];
  if (evento !== undefined && req.id == evento.id_creator_user) {
    const borrado = await eventoService.EliminarEvento(req.params.id);

    if (borrado) {
      return res.status(200).json("borrado correctamente");
    } else {
      return res.status(400).json("Hay usuarios registrados en el evento");
    }
  } else {
    return res
      .status(404)
      .json("Ese evento no existe o no fue creado por el usuario identificado");
  }
});

eventoController.get("/:id/enrollment",middleware.pagination, async (req,res) =>{
  const eventId = req.params.id
  let attended1 = req.query.attended
  if (attended1 !== undefined){
    attended1 = attended1 === 'true'.toLowerCase() ? true : false
  }
  let filters ={
  first_name:req.query.first_name,
  last_name:req.query.last_name,
  username:req.query.username,
  attended : attended1,
  rating : req.query.rating
  }
  const [enrollments,total] = await eventoService.getEnrollmentByEvent(eventId,filters,req.limit,req.offset)
  
  res.locals.pagination.total = total;
    if ( Number(res.locals.pagination.page) * Number(res.locals.pagination.limit) >= total) {
        res.locals.pagination.nextPage = null;
      }
      
      const response = {
        collection: enrollments,
        pagination: res.locals.pagination
  };
  return res.status(200).json(response);
  
})

eventoController.post(
  "/:id/enrollment",
  middleware.userMiddleware,
  async (req, res) => {

    const userId = req.id;
    const eventId = req.params.id;

    let eventEnrollment = new event_enrollment();

    eventEnrollment.id_event = eventId;
    eventEnrollment.id_user = userId;
    eventEnrollment.description =
      req.body.description == undefined ? null : req.body.description;
    const now = new Date();
    eventEnrollment.registration_date_time = now;
    eventEnrollment.attended = null;
    eventEnrollment.observations = null;
    eventEnrollment.rating = null;

    if (!(await eventoService.eventoExists(eventId))) {
      return res.status(404).json("El evento no existe");
    }

    if (await eventoService.checkEventoValido(eventId, userId)) {
      eventoService.newEnrollment(eventEnrollment);
      return res.status(200).json("Registrado en el evento correctamente");
    } else
      return res
        .status(400)
        .json(
          "Ya esta registrado en el evento o el registro no esta habilitado o la capacidad maxima fue alcanzada o el evento ya paso"
        );
  }
);

eventoController.delete(
  "/:id/enrollment",
  middleware.userMiddleware,
  async (req, res) => {
    const userId = req.id;
    const eventId = req.params.id;

    if (!eventoService.eventoExists(eventId)) {
      return res.status(404).json("El evento no existe");
    }

    if (await eventoService.isDeletePossible(userId, eventId)) {
      eventoService.DeleteEnrollment(userId, eventId);
      return res.status(200).json("Suscripcion anulada");
    } else
      return res
        .status(400)
        .json("El evento ya paso o usted no esta registrado en el evento");
  }
);

eventoController.patch(
  "/:id/enrollment/:rating",
  middleware.userMiddleware,
  async (req, res) => {

    const rating = req.params.rating;
    const userId = req.id;
    const eventId = req.params.id;

    if (!(await eventoService.eventoExists(eventId))) {
      return res.status(404).json("El evento no existe");
    }
    if (await eventoService.canGiveRating(eventId, userId, rating)) {
      let eventEnrollment = new event_enrollment();

      eventEnrollment.observations = req.body.observations;
      eventEnrollment.attended = true;
      eventEnrollment.rating = rating;
      eventEnrollment.id_user = userId;
      eventEnrollment.id_event = eventId;
      await eventoService.PatchEventEnrollment(eventEnrollment);
      return res.status(200).json("Registro actualizado");
    } else {
      return res.status(400).json("datos no validos");
    }
  }
);

export default eventoController;
