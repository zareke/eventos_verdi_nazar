import Express from "express";
import Category from "../service/category-service.js";
const categoryController = Express.Router()
const categoryService = new Category();
import Middleware from '../../middleware.js'
const middleware=new Middleware

categoryController.get("/",middleware.pagination,async (req,res) => { 
    
    const pageSize = req.limit
    const page = req.offset
    
    let [allCategories,total] = await categoryService.getAllCategories(pageSize,page)
    
    res.locals.pagination.total=total

    if(res.locals.pagination.offset*res.locals.pagination.limit>=total){
        res.locals.pagination.nextPage=null
    }

    const response = {
        categories:allCategories.rows,
        pagination:res.locals.pagination
    }

    return res.status(200).json(response)
})


categoryController.get("/:id",async (req,res) => {

    const catId = req.params.id
    let category  = await categoryService.getCategoryById(catId)

    if ( category.rowCount<1){
        return res.status(404).json("La categoria no existe")
    }
    else{
        return res.status(200).json(category.rows)
    }
})

categoryController.post("/",async (req,res) => {
    const name = req.body.name
    const displayOrder = Number(req.body.display_order)
    
    if ( name == null || name.length<3){
        return res.status(400).json("El nombre no es valido")
    }
    else{
        await categoryService.newCategory(name,displayOrder)
        return res.status(201).json("Categoria creada")

    }

})

categoryController.put("/",async (req,res) => {
    const id = req.body.id
    const name = req.body.name
    const displayOrder = Number(req.body.display_order)

    if ( name == null || name.length<3){
        return res.status(400).json("El nombre no es valido")
    }
    else{
        let result = await categoryService.updateCategory(id,name,displayOrder)
        if (result.rowCount<1){
            return res.status(404).json("Categoria no encontrada")
        }
        else{
            return res.status(200).json("Categoria cambiada correctamente")
        }
    }
})

categoryController.delete("/:id",async (req,res) => {
    const id=req.params.id

    let result = await categoryService.deleteCategory(id)
    if (result.rowCount<1){
        return res.status(404).json("Categoria no encontrada")
    }
    else{
        return res.status(200).json("Categoria eliminada correctamente")
    }
})




export default categoryController