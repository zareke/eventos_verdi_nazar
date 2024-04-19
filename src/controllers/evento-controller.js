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
  let error = false
  Object.values(evento).forEach(i=>i="")
  //LAS VALIDACIONES MITICAS
  evento.nombre = (typeof req.query.nombre)!=='string' || evento.nombre==null ? req.query.nombre : error=true
  
    evento.categoria = (typeof req.query.categoria)!=='string' || evento.categoria==null ? req.query.categoria : error=true
    
    evento.fechaDeInicio = !isNaN(new Date(req.query.fechaDeInicio)) ||evento.fechaDeInicio==null ? req.query.fechaDeInicio : error=true

    evento.rag = (typeof req.query.tag)!=='string' || evento.rag == null? req.query.tag : error=true

  
console.log(evento.fechaDeInicio)
if(!Object.values(evento).find((i) => i!= null || i!=undefined || i!="")){
  allEvents = eventoService.getAllEventos(pageSize, page)
  return res.json(allEvents)
}

if(error){
        return res.json("Datos no validos")
    }
  
  var noHayFiltros = true
 
    allEvents = eventoService.getAllEventosFiltrado(pageSize, page) //no le mandamos los flitros mepa lol
  

  return res.json(allEvents)
})

eventoController.get("/:id", (req, res) => {

if(Number.isInteger(Number(req.params.id))) {
  const id = req.params.id
  const evento = eventoService.getEventoById(id)
  return res.json(evento)

}
else
return res.json("datos no validos")
})



  eventoController.post("/:id/enrollment", (req, res) => { 

    if(!(/*comentario para zarek dormidoa para que no rompa el codigo gracias aunque ya lo rompi ahre */Number.isInteger(Number(req.query.userId)) && Number.isInteger(Number(req.params.id)))) 
   { return res.json(req.params.id)}
    
      const user = req.query.userId
      const evento = req.params.id
      const descripcion = "n"
      const attended = 0
      const observations = "o"
      const rating = 0
      const enrollment = eventoService.postNewEnrollment(user, evento, descripcion, attended, observations, rating)
      return res.json(enrollment)
    
    
   
    })


    eventoController.patch("/:id/enrollment",(req,res) => {
      if(!(Number.isInteger(Number(req.query.rating)) && Number.isInteger(Number(req.query.attended)))) 
    return res.json("datos no validos")
    
      const evento = req.params.id
      const descripcion = req.query.description
      const attended = req.query.attended
      const observations = req.query.observations
      const rating = req.query.rating
      const enrollment = eventoService.patchEnrollment(evento, descripcion, attended, observations, rating)
      return res.json(enrollment)
    })

   
    

export default eventoController