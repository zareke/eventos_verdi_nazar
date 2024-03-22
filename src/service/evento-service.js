export class Eventos{
    getAllEventos(pageSize, requestedPage, evento) {

        var query = `select * from event  `;
        var query2 = 'select count (*) from pizzas' //si hay un error capaz es q estan las ' en lugar de ´
        
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
        var query = "select * from event where"
        
        if(evento.nombre !=""){
            query += AñadirAQuery("nombre",evento.nombre)
        }
        if(evento.categoria != ""){
            query += AñadirAQuery("category",evento.categoria)
        }
        if(evento.fechaDeInicio != ""){
            query += AñadirAQuery("start_date",evento.fechaDeInicio)
        }
        if(evento.tag != ""){
            query += AñadirAQuery("tag",evento.tag)
        }
    }
}