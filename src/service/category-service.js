
import sql from 'mssql'
import CategoryRepository from '../repositories/category-repository.js'
export default class Category{

    
async getAllCategories(pageSize,requestedPage){

    
    const categoryRepo = new CategoryRepository()
    let returnEntity = await categoryRepo.getAllCategories(pageSize,requestedPage * pageSize)

    return returnEntity
}

async getCategoryById(id){

    
    const categoryRepo = new CategoryRepository()
    let returnEntity= await categoryRepo.getCategoryById(id)

    return returnEntity
}
async newCategory(name,dispOrder){
    const categoryRepo=new CategoryRepository()
    await categoryRepo.newCategory(name,dispOrder)
}




}