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
//nota: aparentemente hay que validar TODO
eventoController.get("/", (req, res) => {
  const pageSize = 4;
  const page = req.query.page;
  var allEvents;
  let error = false;
  Object.values(evento).forEach((i) => (i = ""));
  //FALTA QUE PUEDA BUSCAR SOLO POR UN ELEMNTO O MAS PERO NO TODOS, Y TAMBIEN FALTA QUE FUNCIONE CUANDO BUSCO SIN FILTROS. LA FECHA ESTA BIEN VALIDADA.
  //LAS VALIDACIONES MITICAS
  evento.nombre = req.query.name

  evento.categoria = req.query.category
  evento.tag = req.query.tag
  if (req.query.startDate != undefined) {
    evento.fechaDeInicio = !isNaN(Date.parse(req.query.startDate)) ?
      req.query.startDate : (error = true); console.log(req.query.startDate)
  } else evento.fechaDeInicio = req.query.startDate

  if (
    Object.values(evento).some((i) => i != null)
  ) {

    if (error) {
      return res.json("Datos no validos");
    }
    allEvents = eventoService.getAllEventosFiltrado(pageSize, page, evento);

  } else {
    allEvents = eventoService.getAllEventos(pageSize, page);
    return res.json(allEvents);
  }






  return res.json(allEvents);
});

eventoController.get("/:id", (req, res) => {
  if (Number.isInteger(Number(req.params.id))) {
    const id = req.params.id;
    const evento = eventoService.getEventoById(id);
    return res.json(evento);
  } else return res.json("datos no validos");
});
eventoController.post("/", (req, res) => {
  //EL SUPER HIPER MEGA VALIDAZO
  let error = false;
  let name = req.body.name != undefined ? req.body.name : (error = true);

  let description =
    req.body.description != undefined
      ? req.body.description
      : (error = true);
  console.log(error)
  let id_event_category = Number(req.body.id_event_category);
  id_event_category =
    !isNaN(id_event_category) ? req.body.id_event_category : (error = true);
  let id_event_location = Number(req.body.id_event_location);

  id_event_location =
    !isNaN(id_event_location) ? id_event_location : (error = true);
  let start_date = Date.parse(req.body.start_date);
  start_date = !isNaN(start_date) ? req.body.start_date : (error = true);
  let duration_in_minutes = Number(req.body.duration_in_minutes);
  duration_in_minutes =
    !isNaN(duration_in_minutes) ? duration_in_minutes : (error = true);
  let price = Number(req.body.price);
  price = !isNaN(price) ? price : (error = true);
  let enabled_for_enrollment = Number(req.body.enabled_for_enrollment);
  enabled_for_enrollment =
    !isNaN(enabled_for_enrollment) ? enabled_for_enrollment : (error = true);
  let max_assistance = Number(req.body.max_assistance);
  max_assistance = !isNaN(req.body.max_assistance) ? max_assistance : (error = true);
  let id_creator_user = Number(req.body.id_creator_user);
  id_creator_user = !isNaN(id_creator_user) ? id_creator_user : (error = true);

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
    return res.json(eventoService.PostEvent(object)); // funcion que crea evento
  }
});
eventoController.patch("/:id", (req, res) => {
  //EL SUPER HIPER MEGA VALIDAZO 2 o 3 en realidad
  if (!Object.values(req.body).some((i) => i != null) ) {
    return res.json("NO HAY NINGUN DATO PARA EDITAR")
  }
  let error = false;
  let name = req.body.name

  let description = req.body.description
  let id_event_category = Number(req.body.id_event_category);
  if (req.body.id_event_category != undefined) {//si esta definido, chequear que sea un numero. 
    id_event_category =
      !isNaN(id_event_category) ? req.body.id_event_category : (error = true);
  } else id_event_category = req.body.id_event_category
  let id_event_location = Number(req.body.id_event_location);
  if (req.body.id_event_location != undefined) {
    id_event_location =
      !isNaN(id_event_location) ? id_event_location : (error = true);
  } else id_event_location = req.body.id_event_location
  let start_date = Date.parse(req.body.start_date);
  if (req.body.start_date != undefined) {
    start_date = !isNaN(start_date) ? req.body.start_date : (error = true);
  } else start_date = req.body.start_date
  let duration_in_minutes = Number(req.body.duration_in_minutes);
  if (req.body.duration_in_minutes != undefined) {
    duration_in_minutes =
      !isNaN(duration_in_minutes) ? duration_in_minutes : (error = true);
  } else duration_in_minutes = req.body.duration_in_minutes
  let price = Number(req.body.price);
  if (req.body.price != undefined) {
    price = !isNaN(price) ? price : (error = true);
  } else price = req.body.price
  let enabled_for_enrollment = Number(req.body.enabled_for_enrollment);
  if (req.body.enabled_for_enrollment != undefined) {
    enabled_for_enrollment =
      !isNaN(enabled_for_enrollment) ? enabled_for_enrollment : (error = true);
  } else enabled_for_enrollment = req.body.enabled_for_enrollment
  let max_assistance = Number(req.body.max_assistance);
  if (req.body.max_assistance != undefined) { max_assistance = !isNaN(req.body.max_assistance) ? max_assistance : (error = true); } else max_assistance = req.body.max_assistance
  let id_creator_user = Number(req.body.id_creator_user);
  if (req.body.id_creator_user != null) { id_creator_user = !isNaN(id_creator_user) ? id_creator_user : (error = true); } else id_creator_user = req.body.id_creator_user

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
    return res.json(eventoService.EditEvent(req.params.id, object)); // funcion que crea evento
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
