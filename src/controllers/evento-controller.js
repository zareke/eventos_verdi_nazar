import Express from "express"
const eventoController = Express.Router()
import Eventos from "../service/evento-service.js"
var evento = { //filtros
  nombre: "",
  categoria: "",
  fechaDeInicio: "",
  tag: "",
}

const eventoService = new Eventos()
//nota: aparentemente hay que validar TODO
eventoController.get("/", (req, res) => {
  const pageSize = 4
  const page = req.query.page
  var allEvents

  //LAS VALIDACIONES MITICAS
    
    Object.values(evento).forEach(i=>i="")

    error =false

    evento.nombre = (typeof req.query.nombre)!=='string' ? req.query.nombre : error=true
  
    evento.categoria = (typeof req.query.categoria)!=='string' ? req.query.categoria : error=true
    
    evento.fechaDeInicio = !isNaN(new Date(req.query.fechaDeInicio)) ? req.query.fechaDeInicio : error=true

    evento.rag = (typeof req.query.tag)!=='string' ? req.query.tag : error=true

    if(error){
        return "Datos no validos"
    }
  
  var noHayFiltros = true
  if(!Object.values(evento).find((i) => i!= null || i!=undefined || i!="")) {
    allEvents = eventoService.getAllEventos(pageSize, page)
  } else {
    allEvents = eventoService.getAllEventosFiltrado(pageSize, page)
  }

  return res.json(allEvents)
})

eventoController.get("/:id", (req, res) => {

if(Number.isInteger(Number(req.params.id))) {
  const id = req.params.id
  const evento = eventoService.getEventoById(id)
  return res.json(evento)

}
else
return "datos no validos"
})
export default eventoController