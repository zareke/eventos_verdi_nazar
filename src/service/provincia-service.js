import ProvinciaRepository from '../repositories/provincia-repository.js'
export default class Provincias {
  async newProvincia(provincia) {
    const provrepo = new ProvinciaRepository()

    await provrepo.newProvincia(provincia)
  }
  async getAllProvinces(pageSize,requestedPage) {
    const provRepo = new ProvinciaRepository()

    let [returnEntity,total] = await provRepo.getAllProvincias(pageSize,requestedPage)

    return [returnEntity,total]
  }
  async getProvinciaById(id) {
    const provinceRepo = new ProvinciaRepository()
    let returnEntity = await provinceRepo.getProvinciaById(id)
    return returnEntity
  }
  async DeleteProvincia(id) {
    const provrepo = new ProvinciaRepository()
    const returnEntity = await provrepo.DeleteProvincia(id)
    return returnEntity
  }
  async UpdateProvincia(prov){
    const provrepo=new ProvinciaRepository()
    const success = await provrepo.UpdateProvincia(prov)
    return success
  }
  async getAllLocationsProvince(pageSize,page,idProvince){
    const provinceRepo = new ProvinciaRepository()
    let [returnEntity,total] = await provinceRepo.getAllLocationsProvince(pageSize,page,idProvince)
    return [returnEntity,total]
  }
}
