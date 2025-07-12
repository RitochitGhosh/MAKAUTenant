import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
    createPropertyController,
    deletePropertyHandler,
    getAllPropertiesController,
    getSinglePropertyController,
    updatePropertyController,
} from '../controllers/property.controller.js';

const propertyRouter = express.Router();


propertyRouter.get("/", getAllPropertiesController);
propertyRouter.get("/:id", getSinglePropertyController);

propertyRouter.post("/create", verifyToken, createPropertyController);
propertyRouter.put("/update/:id", verifyToken, updatePropertyController);
propertyRouter.delete("/delete/:id", verifyToken, deletePropertyHandler);



export default propertyRouter;