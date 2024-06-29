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

  async pagination(req,res,next){ // empezamos desde la pagina 1 y no la pagina 0

    if (req.query.limit===undefined || req.query.page ===undefined || req.query.page<=0){
      return res.status(400).json("Verifique que haya ingresado limit y page correctamente")
    }

    req.limit = req.query.limit
    req.offset = (req.query.page-1) * req.limit

    

    
    const nPage = Number(Number(req.query.page)+Number(1)) //javascript
    const reqpath = req.path === "/" ? "" : req.path
    let nextPage="http://"+req.get('host') +  req.baseUrl+reqpath+ "/?limit="+req.limit+"&page="+nPage




    const pagination = {
      limit: req.limit,
      page:req.query.page,
      nextPage:nextPage,
      total:null
    }
    res.locals.pagination=pagination 
    next()
  }

}