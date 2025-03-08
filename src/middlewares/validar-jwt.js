import jwt from 'jsonwebtoken';
import Usuario from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({ msg: "No token in the request" });
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({ msg: "User does not exist in the database" });
        }

        if (!usuario.estado) {
            return res.status(401).json({ msg: "Invalid token - User with status: false" });
        }

        req.user = usuario;
        req.user.id = usuario._id.toString();

        next();
    } catch (e) {
        console.log("Error en validarJWT:", e);
        res.status(401).json({ msg: "Invalid token" });
    }
};
