


import EventRepository from "../repositories/events-repository.js";
import EventsRepository from "../repositories/events-repository.js"
import sql from 'mssql'

export default class Eventos {
  getAllEventos = async (pageSize, offset) => {
    const eventrepo = new EventsRepository();
    let [returnEntity, total] = await eventrepo.getAllEvents(pageSize, offset);
    return [returnEntity, total];
  }

  


  async getAllEventosFiltrado(pageSize, offset, filtros) { 
    
    

    const eventrepo = new EventsRepository()
    
    let [returnEntity,total] = await eventrepo.getAllEventosFiltrado(pageSize,offset,filtros)


    return [returnEntity,total]
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
  async PatchEvent(event)
  {
    let returnEntity = null
    const eventrepo = new EventsRepository()
    returnEntity = await eventrepo.patchEvent(event)
    return returnEntity
  }
  async EliminarEvento(id){
    let returnEntity = null
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
  async getEnrollmentByEvent(event,filters,size,page){
    const eventrepo = new EventsRepository()
    return await eventrepo.getEnrollmentByEvent(event,filters,size,page)
  }
  
}
