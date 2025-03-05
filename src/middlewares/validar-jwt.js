<<<<<<< HEAD
import jwt from "jsonwebtoken";

const validarJWT = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default validarJWT;
=======
import jwt from 'jsonwebtoken';

import Usuario from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {

    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "No token in the request"
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: "User does not exist in the database",
            })
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: "Invalid token - User with status: false"
            })
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Invalid token"
        })
    }
}
>>>>>>> origin/develop
