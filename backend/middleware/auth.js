/************************************************************/
/************** Middleware auth *****************************/
/************************************************************/

const jwt = require('jsonwebtoken');
// variable d'environnement 
const keyToken = process.env.KEY_TOKEN;
 
module.exports = (req, res, next) => {
   try {
    // cas d'erreur pas de token
    if(!req.headers.authorization) {
        throw "L'utilisateur n'est pas authentifié"
    }
    else
       {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${keyToken}`);
        const userId = decodedToken.userId;
        req.auth = {
           userId: userId
       }
    };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};