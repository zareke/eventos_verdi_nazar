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
  SearchProvincia() {
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
    return datoshardcodeados;
  }
  SearchProvinciaById(id) {
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
    return datoshardcodeados;
  }
  DeleteProvincia(id) {
    //query
    let datoshardcodeados = [
      {
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
}
