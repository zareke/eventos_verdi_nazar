export default class Provincias {
  CreateProvince(name, full_name, latitude, longitude, dO) {
    //la super query vendria aca en vez de esto:
    let datoshardcodeados = {
      name: name,
      full_name: full_name,
      latitude: latitude,
      longitude: longitude,
      dO: dO,
    };
    return datoshardcodeados;
  }
  SearchProvinces(pageSize,requestedPage) {
    //query
    let datoshardcodeados = [
      {
        name: "BSAS",
        full_name: "Buenos Aires",
        latitude: 14,
        longitude: 214,
        dO: 1,
      },
      {
        name: "RSR",
        full_name: "Rosario",
        latitude: 14,
        longitude: 214,
        dO: 1,
      },
    ];
    return {
      collection: datoshardcodeados, //GOTO 8
      pagination: {
        limit: pageSize,
        offset: requestedPage,
        nextPage: "http://localhost:3000/event?limit=15&offset=1",
        total: 100000,
      }
  }
  }
  SearchProvinceById(id) {
    //query
    let datoshardcodeados = [
      {
        name: "RSR",
        full_name: "Rosario",
        latitude: 14,
        longitude: 214,
        dO: 1,
      }
    ];
    return datoshardcodeados;
  }
  DeleteProvince(id) {
    //query
    let datoshardcodeados = [
      {
        "infohardcodeada": "ELIMINADO!",
        name: "BSAS",
        full_name: "Buenos Aires",
        latitude: 14,
        longitude: 214,
        dO: 1,
      },
    ];
    return datoshardcodeados;
  }
  EditarPorId(name, full_name, latitude, longitude, dO,id) {
    //la super query vendria aca en vez de esto:
    let datoshardcodeados = {
      name: name,
      full_name: full_name,
      latitude: latitude,
      longitude: longitude,
      dO: dO,
    };
    return datoshardcodeados;
  }
  ChequearProvinciaExiste(id){
    //La super query iria aca
    return true
  }
}
