import express from "express";
import eventoController from "./src/controllers/evento-controller.js";
import provinciaController from "./src/controllers/provincia-controller.js";
import userController from "./src/controllers/user-controller.js";
import locationController from "./src/controllers/location-controller.js";
import categoryController from "./src/controllers/category-controller.js";
import eventLocationController from "./src/controllers/event_location-controller.js";


const app = express(); 
app.use(express.json())
const port = 4587;

app.use("/event", eventoController);
app.use("/user",userController)
app.use("/province",provinciaController)
app.use("/location",locationController) 
app.use("/event-category",categoryController)
app.use("/event-location",eventLocationController)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); 
});

