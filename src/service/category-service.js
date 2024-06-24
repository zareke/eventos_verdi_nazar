
import CategoryRepository from '../repositories/category-repository.js'
export default class Category{

    
async getAllCategories(pageSize,requestedPage){

    
    const categoryRepo = new CategoryRepository()
    let [returnEntity,total] = await categoryRepo.getAllCategories(pageSize,requestedPage)

    return [returnEntity,total]
}

async getCategoryById(id){

    
    const categoryRepo = new CategoryRepository()
    let returnEntity= await categoryRepo.getCategoryById(id)

    return returnEntity
}
async newCategory(category){
    const categoryRepo=new CategoryRepository()
    await categoryRepo.newCategory(category)
}   

async updateCategory(cat){

    const cr = new CategoryRepository()
    return await cr.updateCategory(cat)
    

}

async deleteCategory(id){
    const cr = new CategoryRepository()
    return await cr.deleteCategory(id)
}

}