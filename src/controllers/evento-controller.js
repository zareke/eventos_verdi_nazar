import Express from "express";
const eventoController = Express.Router();
import Eventos from "../service/evento-service.js";
import jwt  from "jsonwebtoken";
import { secretkey } from "./user-controller.js";

var evento = {
  //filtros
  nombre: "",
  categoria: "",
  fechaDeInicio: "",
  tag: "",
};

const userMiddleware = async function (req, res, next) {
  

  let sentToken=req.headers.authorization.split(" ")[1]

  
  let payloadOriginal= null
  try{
    payloadOriginal= await jwt.verify(sentToken, secretkey)
    
  }
  catch(error){
    res.status(401).json("token no valido o expirado")
  }
 
  req.id=payloadOriginal.id
  next()
}

const eventoService = new Eventos();

eventoController.get("/", async (req, res) => {
  const pageSize = 4;
  const page = req.query.page;
  var allEvents;
  let error = false;

  Object.values(evento).forEach((i) => (i = ""));

  //LAS VALIDACIONES MITICAS (perdon por el codigo espagueti)
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
function ValidarStrings(strings) {
  return strings.some((str) => typeof str !== "string" || str.trim() === "");
}

function ValidarNumeros(numbers) {
  return numbers.some(
    (num) => num !== undefined && (isNaN(num) || typeof num !== "number")
  );
}
function ValidarNumerosEstricto(numeros) {
  return numeros.some(num => typeof num !== 'number' || isNaN(num) || num === null);
}
function ValidarStringsEstricto(strings) {
  return strings.some(str => typeof str !== 'string' || str.trim().length <= 3);
}


eventoController.post("/", userMiddleware, (req, res) => {
  let error = false;
  let name = req.body.name;

  

  //la validacion
  let description = req.body.description;
  error = ValidarStringsEstricto([name, description]);

  let id_event_category = Number(req.body.id_event_category);
  let id_event_location = Number(req.body.id_event_location);
  let start_date = Date.parse(req.body.start_date);
  let duration_in_minutes = Number(req.body.duration_in_minutes);
  
  let price = Number(req.body.price);
  let enabled_for_enrollment = Number(req.body.enabled_for_enrollment);
  let max_assistance = Number(req.body.max_assistance);
  let id_creator_user = req.id
  error = ValidarNumerosEstricto([
    id_event_category,
    id_event_location,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_creator_user,
  ]);
  if(error==false){
  let max_capacity = eventoService.getMaxCapacity(id_event_location)
  if(max_assistance > max_capacity){
    error = true
  }


}
if(error==false){
  if(price <0 || duration_in_minutes < 0){
    error=true
  }
}


  if (error) {
    return res.status(400).json("Datos no validos");
    
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
    return res.status(201).json(eventoService.PostEvent(object));
  }
});
//HACER VALIDACIONES DE PATCH
eventoController.patch("/:id", async (req, res) => {
  // Validar que haya al menos un dato para actualizar
  if (!Object.values(req.body).some((i) => i != null)) {
    return res.json("NO HAY NINGUN DATO PARA EDITAR");
  }

  const campos = [
    'name',
    'description',
    'id_event_category',
    'id_event_location',
    'start_date',
    'price',
    'enabled_for_enrollment',
    'max_assistance',
    'duration_in_minutes',
    'id_creator_user'
  ];

  let objetoActualizacion = {};
  let error = false;
  let stringsAValidar = [];
  let numerosAValidar = [];

  // Recorrer los campos esperados y agregar solo los proporcionados
  campos.forEach((campo) => {
    if (req.body[campo] !== undefined) {
      if (campo === 'start_date') {
        const fecha = new Date(req.body[campo]);
        if (!isNaN(fecha.getTime())) {
          objetoActualizacion[campo] = fecha.toISOString();
        } else {
          error = true;
        }
      } else if (['id_event_category', 'id_event_location', 'price', 'enabled_for_enrollment', 'max_assistance', 'duration_in_minutes', 'id_creator_user'].includes(campo)) {
        const valor = Number(req.body[campo]);
        if (!isNaN(valor)) {
          objetoActualizacion[campo] = valor;
          numerosAValidar.push(valor);
        } else {
          error = true;
        }
      } else {
        objetoActualizacion[campo] = req.body[campo];
        stringsAValidar.push(req.body[campo]);
      }
    }
  });

  // Validar los strings y los números solo si existen
  error = error || ValidarStrings(stringsAValidar) || ValidarNumeros(numerosAValidar);
  if(error == false){
    
  }
  if (error) {
    return res.json("Datos no válidos");
  } else {
    try {
      const result = await eventoService.patchEvent(req.params.id, objetoActualizacion);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      return res.status(500).json("Error interno del servidor");
    }
  }
});

eventoController.delete("/:id", (req, res) => {
  if (eventoService.getEventoById(req.params.id) != undefined)
    return res.json(eventoService.EliminarEvento(req.params.id));
  else return res.json("Ese evento no existe");
});

eventoController.post("/:id/enrollment", (req, res) => {
  if (
    !(
      /*comentario para zarek dormidoa para que no rompa el codigo gracias aunque ya lo rompi ahre*/ (
        Number.isInteger(Number(req.query.userId)) &&
        Number.isInteger(Number(req.params.id))
      )
    )
  ) {
    return res.json(
      "No hay ningun parametro de id de usuario o/y el id de evento no existe"
    );
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
      Number.isInteger(Number(req.query.rating)) &&
      Number.isInteger(Number(req.params.id))
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
