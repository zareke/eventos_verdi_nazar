import express from "express";
import controller from "./src/controllers/evento-controller.js";

const app = express(); // Init API REST
app.use(express.json()); // Middleware to parse JSON
const port = 4587;

app.use("/event", eventoController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
