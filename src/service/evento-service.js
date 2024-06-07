


import EventsRepository from "../repositories/events-repository.js"
import sql from 'mssql'

export default class Eventos {
  getAllEventos = async (pageSize, requestedPage) => {
    //DATOS HARDCODEADO S ESTO HAY Q PONERLO DSPS
    /* 
        var query = `select * from events limit ${pageSize}`; //aca hay que hacer un recontra innerjoin para traer todo
        var query2 = 'select count (*) from events' //si hay un error capaz es q estan las ' en lugar de ´
        const eventsInDB = query.execute()
        */
    let returnEntity = null
    
    const eventrepo = new EventsRepository();
    returnEntity= await eventrepo.getAllEvents(pageSize,requestedPage)
    
    
    return returnEntity
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

  postNewEnrollment(
    userId,
    eventoId,
    description,
    attended,
    observations,
    rating
  ) {
    const enrollment = {
      id: eventoId,
      id_event: eventoId,
      id_user: userId,
      descripcion: description,
      registration_date_time: new Date().toDateString,
      attended: attended,
      observations: observations,
      rating: rating,
    };

    return enrollment
  }
  async getMaxCapacity(idlocation){
    let returnEntity = null
    const eventrepo = new EventsRepository()
    returnEntity = await eventrepo.getMaxCapacity(idlocation)
    return returnEntity
  }
  async PostEvent(object)
  {
    let returnEntity = null
    const eventrepo = new EventsRepository()
    returnEntity = await eventrepo.postEvent(object)
    return returnEntity
  }
  async patchEvent(id,object)
  {
    let returnEntity = null
    const eventrepo = new EventsRepository()
    returnEntity = await eventrepo.patchEvent(id,object)
    return returnEntity
  }
  async EliminarEvento(id){
    let returnEntity = null
    const eventrepo = new EventsRepository()
    if (!(await eventrepo.anyEnrolled(id)))
    {    
    returnEntity = await eventrepo.deleteEvent(id)
    console.log("returnentity " ,returnEntity)
    return true
    }
    else return false
  }
  patchEnrollment(
    eventoId,
    description,
    attended,
    observations,
    rating
  ) {
   
    const enrollment = {
      id: eventoId,
      id_event: eventoId,
      id_user: 5,
      descripcion: description,
      registration_date_time: new Date().toDateString,
      attended: attended,
      observations: observations,
      rating: rating,
    };

    return enrollment
  }
}
