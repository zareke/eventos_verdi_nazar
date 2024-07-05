import Express from "express";
import Category from "../service/category-service.js";
const categoryController = Express.Router()
const categoryService = new Category();
import Middleware from '../../middleware.js'
import event_category from "../models/event_categories.js";
const middleware=new Middleware

categoryController.get("/",middleware.pagination,async (req,res) => { 
    
    const pageSize = req.limit
    const page = req.offset
    
    let [allCategories,total] = await categoryService.getAllCategories(pageSize,page)
    
    res.locals.pagination.total=total

    if(Number(res.locals.pagination.page)*Number(res.locals.pagination.limit)>=total){
        res.locals.pagination.nextPage=null 
      }

    const response = {
        collection:allCategories.rows,
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
    let category = new event_category()
    category.name = req.body.name
    category.display_order = Number(req.body.display_order)
    
    if ( category.name == null || category.name.length<3){
        return res.status(400).json("El nombre no es valido")
    }
    else{
        await categoryService.newCategory(category)
        return res.status(201).json("Categoria creada")

    }

})


categoryController.put("/", async (req, res) => { 
  try {
    const updatedCategory = new event_category();

    
    if (req.body.name == null || req.body.name.length < 3) {
      throw new Error("El nombre no es valido");
    }

    updatedCategory.id = req.body.id;
    updatedCategory.name = req.body.name;
    updatedCategory.display_order = Number(req.body.display_order);

    const result = await categoryService.updateCategory(
      updatedCategory
    );

    if (result.rowCount < 1) {
      return res.status(404).json("Categoria no encontrada");
    } else {
      return res.status(200).json("Categoria cambiada correctamente");
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }
});


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