import jwt  from "jsonwebtoken";
export const secretkey = "ariaverdienspotify"
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

  async pagination(req,res,next){

    if (req.query.limit===undefined || req.query.offset ===undefined){
      return res.status(400).json("Verifique que haya ingresado limit y offset")
    }
    req.limit = req.query.limit
    req.offset = req.query.offset
    const nextOffset=Number(req.offset)+1
    if (req.query.offset !== null && req.query.offset !== undefined && req.offset!=0) {
      req.offset = parseInt(req.query.offset) - 1;
    }


    let nextPage="http://"+req.get('host') +  req.baseUrl+ "/?limit="+req.limit+"&offset="+nextOffset




    const pagination = {
      limit: req.limit,
      offset:Number(req.offset)+1,
      nextPage:nextPage,
      total:null
    }
    res.locals.pagination=pagination 
    next()
  }

}