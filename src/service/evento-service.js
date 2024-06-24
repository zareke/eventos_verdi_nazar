


import EventRepository from "../repositories/events-repository.js";
import EventsRepository from "../repositories/events-repository.js"
import sql from 'mssql'

export default class Eventos {
  getAllEventos = async (pageSize, requestedPage) => {
    
  
    
    const eventrepo = new EventsRepository();
    let [returnEntity,total]= await eventrepo.getAllEvents(pageSize,requestedPage)
    
    
    return [returnEntity,total]
  }

  getDetalleEventos() {
    //quiza me equivoco pero zarek piensa que aca puede no funcionar el alias       sas
    var query = `select events.*,l.*,p.* from events limit ${pageSize}
        inner join event_locations l on events.start_date = l.name
        inner join locations on l.full_address = locations.name
        inner join provinces p on locations.name = p.full_name`;
    return {
      collection: query, //es posible que aca vaya eventsInDB
      pagination: {
        limit: pageSize,
        offset: requestedPage,
        nextPage: "http://localhost:3000/event?limit=15&offset=1",
        total: query2,
      },
    };
  }

  AñadirAQuery(nombre, propiedad) {
    return `${nombre} = ${propiedad} and`;
  }

  async getAllEventosFiltrado(pageSize, requestedPage, evento) {
    
    
    let returnEntity = null
    const eventrepo = new EventsRepository()
    returnEntity = await eventrepo.getAllEventsFiltrado(pageSize,requestedPage,evento)


      return {
        collection: returnEntity, //GOTO 8
        pagination: {
          limit: pageSize,
          offset: requestedPage,
          nextPage: "http://localhost:3000/event?limit=15&offset=1",
          total: 100000,
        }
    }
  }

  async getEventoById(id) {
   let returnEntity = null
    
   const eventrepo = new EventsRepository();
   returnEntity= await eventrepo.getEventById(id)
   
   return returnEntity
  }


  async checkEventoValido(idEvent,idUser){
    let result = true
    const eventrepo = new EventsRepository()

    result = result && !(await eventrepo.maxAssistanceReached(idEvent))
    result = result && !(await eventrepo.isPastEvent(idEvent))
    result = result && !(await eventrepo.isEnrollmentDisabled(idEvent))
    result = result && !(await eventrepo.isUserRegistered(idEvent,idUser))
    return result
  }

  async isDeletePossible(uid,eid){
    let result = true
    const eventrepo = new EventsRepository()
    result = result && !(await eventrepo.isPastEvent(eid))
    result = result && await eventrepo.isUserRegistered(eid,uid)
    return result
  }

  async DeleteEnrollment(user,event){
    const evrepo = new EventsRepository()
    await evrepo.DeleteEnrollment(user,event)
  }
    
  async eventoExists(idEvent){
    const evrepo=new EventsRepository()
    return await evrepo.eventExists(idEvent)

  }

  async newEnrollment(evEnrollment){
    const evrepo=new EventsRepository()
    await evrepo.newEnrollment(evEnrollment)
  }
  
  async getMaxCapacity(idlocation){
    let returnEntity = null
    const eventrepo = new EventsRepository()
    returnEntity = await eventrepo.getMaxCapacity(idlocation)
    return returnEntity
  }
  async PostEvent(event)
  {
    let returnEntity = null
    const eventrepo = new EventsRepository()
    returnEntity = await eventrepo.postEvent(event)
    return returnEntity
  }
  async PatchEvent(id,object)
  {
    let returnEntity = null
    const eventrepo = new EventsRepository()
    returnEntity = await eventrepo.patchEvent(id,object)
    return returnEntity
  }
  async EliminarEvento(id){
    let returnEntity = null//NOTA PARA ZAREK: PRIMERO LLAMAR A SETUPDELETECASCADE
    const eventrepo = new EventsRepository()
    if (!(await eventrepo.anyEnrolled(id)))
    {    
    returnEntity = await eventrepo.deleteEvent(id)
   
    return true
    }
    else return false
  }
  async canGiveRating(event,user,rating){
    const eventrepo = new EventsRepository()
    let result = rating >=1 && rating <=10 && (await eventrepo.isPastEvent(event)) && (await eventrepo.isUserRegistered(event,user))
    return result
  }
  async PatchEventEnrollment(enrollment){
    const eventrepo = new EventsRepository()
    await eventrepo.PatchEventEnrollment(enrollment)
  }
}
