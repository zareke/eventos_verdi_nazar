export default class Eventos {
  getAllEventos(pageSize, requestedPage, evento) {
    //DATOS HARDCODEADOS ESTO HAY Q PONERLO DSPS
    /* 
        var query = `select * from events limit ${pageSize}`; //aca hay que hacer un recontra innerjoin para traer todo
        var query2 = 'select count (*) from events' //si hay un error capaz es q estan las ' en lugar de ´
        const eventsInDB = query.execute()
        */
    var datoshardcodeados = [
      {
        name: "lalapalaza",
        description: "lolapaloza2",
        location: "hipodromo de san isidro",
        fecha: "21/8/2020",
        duracion: "3", //asumiendo q la duracion es en horas
        precio: "$20000",
        habilitado: false,
        capacidad: "60000",
        creador: "zareke",
      },
      {
        name: "rubenrada",
        description: "concierto ruben rada",
        location: "luna park",
        fecha: "21/8/2020",
        duracion: "3", //asumiendo q la duracion es en horas
        precio: "$20000",
        habilitado: false,
        capacidad: "60000",
        creador: "zareke",
      },
    ];

    return {
      collection: datoshardcodeados /*query*/, //es posible que aca vaya eventsInDB
      pagination: {
        limit: pageSize,
        offset: requestedPage,
        nextPage: "http://localhost:3000/event?limit=15&offset=1",
        total: /*query2*/ 299998,
      },
    };
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

  getAllEventosFiltrado(pageSize, requestedPage, evento) {
    //estaria genial si revisamos este codigo
    var query =
      "select * from events ev inner join event_categories ec on ec.id=ev.id inner join event_tags et on et.id_event=ev.id inner join tags t on t.id = et.id where ";
    var query2 = "select count (*) from events";

    if (evento.nombre != "") {
      (query += "ev.name="), evento.nombre, " and";
      if (evento.categoria != "") {
        (query += "ec.name"), evento.categoria, " and";
      }
      if (evento.fechaDeInicio != "") {
        (query += "ev.start_date"), evento.fechaDeInicio, " and";
      }
      if (evento.tag != "") {
        (query += "t.name"), evento.tag, " and";
      }
      query = query.substring(0, query.length - 3);

      //const eventsInDB = query.execute();
      return {
        collection: query, //GOTO 8
        pagination: {
          limit: pageSize,
          offset: requestedPage,
          nextPage: "http://localhost:3000/event?limit=15&offset=1",
          total: query2,
        },
      };
    }
  }

  getEventoById(id) {
    var query = `select * from events where id=${id}`;
    return query;
  }
uId
  postNewEnrollment(
    userId,
    eventoId,
    description,
    attended,
    observations,
    rating
  ) {
    const enrollment = {
      id: 2,
      id_event: eventoId,
      id_user: userId,
      descripcion: description,
      registration_date_time: new Date().toDateString,
      attended: attended,
      observations: observations,
      rating: rating,
    };
uId = userId
    return enrollment
  }

  patchEnrollment(
    eventoId,
    description,
    attended,
    observations,
    rating
  ) {
    const enrollment = {
      id: 2,
      id_event: eventoId,
      id_user: this.uId,
      descripcion: description,
      registration_date_time: new Date().toDateString,
      attended: attended,
      observations: observations,
      rating: rating,
    };

    return enrollment
  }
}
