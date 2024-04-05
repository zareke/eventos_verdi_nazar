import Express from "express";
const eventoController = Express.Router();
import Eventos from "../service/evento-service.js";
var evento = { //filtros
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
  var allEvents

  evento.nombre = req.query.nombre;
  evento.categoria = req.query.categoria;
  evento.fechaDeInicio = req.query.fechaDeInicio;
  evento.tag = req.query.tag;

  var noHayFiltros
  Object.values(evento).forEach(i => i!==null || i!=="")
  if (noHayFiltros) {
    allEvents = eventoService.getAllEventos(pageSize, page);
  } else {
    allEvents = eventoService.getAllEventosFiltrado(pageSize, page);
  }

  return res.json(allEvents);
});

eventoController.get("/:id", (req, res) => {
  const id = req.params.id;
  const evento = eventoService.getEventoById(id);
  res.json(evento);
});
export default eventoController