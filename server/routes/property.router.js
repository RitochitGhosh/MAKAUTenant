import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
    createPropertyController,
    deletePropertyHandler,
    getAllPropertiesController,
    getPropertiesByOwner,
    getSinglePropertyController,
    updatePropertyController,
} from '../controllers/property.controller.js';

const propertyRouter = express.Router();


propertyRouter.get("/", getAllPropertiesController);
propertyRouter.get("/:id", getSinglePropertyController);
propertyRouter.get("/owner/:id", verifyToken, getPropertiesByOwner); // api/property/owner/:id  -> get [get all properties by owner]

propertyRouter.post("/create", verifyToken, createPropertyController);
propertyRouter.put("/:id", verifyToken, updatePropertyController);
propertyRouter.delete("/delete/:id", verifyToken, deletePropertyHandler); // api/property/delete/:id -> delete [id = property._id - delete all properties created by the owner]


export default propertyRouter;