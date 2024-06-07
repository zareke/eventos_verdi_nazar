import jwt  from "jsonwebtoken";
const secretkey = "ariaverdienspotify"
export default class Middleware{

 async userMiddleware (req, res, next) {
  
    
    let payloadOriginal= null
    try{
      let sentToken=req.headers.authorization.split(" ")[1]
      payloadOriginal= await jwt.verify(sentToken, secretkey)
      
    }
    catch(error){
      return res.status(401).json("token no valido o expirado")
    }
   
    req.id=payloadOriginal.id
    next()
  }

}