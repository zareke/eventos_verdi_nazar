export default class Provincias {
    CreateProvince(name,full_name,latitude,longitude,dO){

        //la super query vendria aca en vez de esto:
        let datoshardcodeados = {
            "name":name,
            "full_name":full_name,
            "latitude":latitude,
            "longitude":longitude,
            "dO":dO
        }
        return datoshardcodeados
    }
  }
  