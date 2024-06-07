import express from "express";
import eventoController from "./src/controllers/evento-controller.js";
import provinciaController from "./src/controllers/provincia-controller.js";
import userController from "./src/controllers/user-controller.js";
import locationController from "./src/controllers/location-controller.js";


const app = express(); // Init API REST
app.use(express.json()); // Middleware to parse JSON
const port = 4587;

app.use("/event", eventoController);
app.use("/user",userController)
app.use("/province",provinciaController)
app.use("/location",locationController)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); 
});
