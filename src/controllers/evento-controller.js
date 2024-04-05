import Express from "express";
const eventoController = Express.Router();
import EventoService from "../service/evento-service";
var evento = {
  nombre: "",
  categoria: "",
  fechaDeInicio: "",
  tag: "",
};

const eventoService = new Eventos();

eventoController.get("/", (req, res) => {
  const pageSize = 4;
  const page = req.query.page;
  evento.nombre = req.query.nombre;
  evento.categoria = req.query.categoria;
  evento.fechaDeInicio = req.query.fechaDeInicio;
  evento.tag = req.query.tag;

  if (Object.keys(evento).length === 0) {
    const allEvents = eventoService.getAllEventos(pageSize, page);
  } else {
    const allEvents = eventoService.getAllEventosFiltrado(pageSize, page);
  }

  return res.json(allEvents);
});

eventoController.get("/:id", (req, res) => {
  const id = req.params.id;
  const evento = eventoService.getEventoById(id);
  res.json(evento);
});
