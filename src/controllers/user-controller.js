import Express from "express"
const userController = Express.Router()
// import Eventos from "../service/evento-service.js" // que importe el service de user
// const eventoService = new Eventos()

//hola zarek y dante del futuro les dejo comentarios para que entiendan mi codigo a la hora de hacer el service -dante del pasado

userController.post("/login", (req,res) =>{
    
    const token = (Math.random() + 1).toString(36).substring(7)
    correct = userService.Login(req.query.username,req.query.password,token) //guarda en la bd un token asociado al usuario si la password esta correct y devuelve true si es correct
    
    if (correct) {res.json("Token: " , token)}
    e
})

userController.post("/register", (req,res) => {
    let error=false
    let first_name=(typeof req.query.first_name == "string") ? req.query.first_name : error = true
    let last_name= (typeof req.query.last_name == "string") ? req.query.last_name : error = true
    //let username= (userService.UsernameExists(req.query.username)) ? req.query.username : error = true //username exists es una funcion imaginaria que deveulve true o false si el usuario ya existe bastante self explanatory
    let username = req.query.username //temporal
    let contraseña=req.query.password
    let password=(contraseña.length>7 && typeof contraseña == "string" && /\d/.test(contraseña) ) ? contraseña : error = "la contraseña es no valida" //la cosa mas obscure que vi en mi vida javascript es ese /\d/ rarisimo
    
    if (error==false){
        return res.json("perfectou")
        //userService.Register(first_name,last_name,username,password)
    }
    else if (error=="la contraseña es no valida"){
        
        return res.json(error)
    }
    else {
        console.log("datardos no validardos")
        return res.json("datos no validos")
    }
})

export default userController