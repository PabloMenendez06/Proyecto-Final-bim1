'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/users/user.routes.js";
import categoryRoutes from "../src/category/category.routes.js";
import productRoutes from "../src/product/product.routes.js";
import cartRoutes from "../src/cart/cart.routes.js";
import orderRoutes from "../src/order/order.routes.js";
import invoiceRoutes from "../src/invoice/invoice.routes.js";

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

const routes = (app) => {
    app.use("/Proyecto-Final/v1/auth", authRoutes);
    app.use("/Proyecto-Final/v1/users", userRoutes);
    app.use("/Proyecto-Final/v1/category", categoryRoutes);
    app.use("/Proyecto-Final/v1/product", productRoutes);
    app.use("/Proyecto-Final/v1/cart", cartRoutes);
    app.use("/Proyecto-Final/v1/order", orderRoutes);
    app.use("/Proyecto-Final/v1/invoice", invoiceRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexion a la base de datos exitosa");
    } catch (error) {
        console.error('Error Conectando a la base de datos', error);
        process.exit(1);
    }  
};

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3001;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
};
