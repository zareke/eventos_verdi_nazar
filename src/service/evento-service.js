export class Eventos{
    getAllEventos(pageSize, requestedPage, evento) {

        var query = `select * from event  `;
        var query2 = 'select count (*) from event' //si hay un error capaz es q estan las ' en lugar de ´
        //const eventsInDB = query.execute()
        return {
          collection: query,
          pagination: {
            limit: pageSize,
            offset: requestedPage,
            nextPage: "http://localhost:3000/event?limit=15&offset=1",
            total: query2,
          },
        };
      }


    AñadirAQuery(nombre,propiedad){
        return `${nombre} = ${propiedad} and`
      }

    getAllEventosFiltrado(pageSize,requestedPage,evento){
        var query = "select * from event ev inner join event_categories ec on ec.id=ev.id inner join event_tags et on et.id_event=ev.id inner join tags t on t.id = et.id where"
        var query2= "select count (*) from event"
        
        if(evento.nombre !=""){
            query += "ev.name=",evento.nombre," and"
        if(evento.categoria != ""){
            query += "ec.name",evento.categoria," and"
        }
        if(evento.fechaDeInicio != ""){
            query += "ev.start_date",evento.fechaDeInicio," and"
        }
        if(evento.tag != ""){
            query += "t.name", evento.tag," and"
        }
        query = query.substring(0,query.length-3)
        
        //const eventsInDB = query.execute();
        return {
            collection: query,
            pagination: {
              limit: pageSize,
              offset: requestedPage,
              nextPage: "http://localhost:3000/event?limit=15&offset=1",
              total: query2,
            },
          }
        }
    }

    getEventoById(id){
        var query = `select * from event where id=${id}`
        return query
    }

}
