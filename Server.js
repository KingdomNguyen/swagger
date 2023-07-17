const express = require("express")
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
require("dotenv").config() 

const mongoose = require("mongoose");
const cors = require("cors");
const app = express()
app.use(express.json());
const TodoRouter = require("./routes/Todo");
const UserRouter = require("./routes/User");

const PORT = process.env.PORT | 7000;

app.use(cors());

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Mongodb Connected..."))
    .catch((err) => console.error(err));


const swaggerOption = {
   definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo api",
            description: "CRUD API",
        },
        servers: [
            {
                url: "http://localhost:7000"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    value: 'Bearer <JWT token here>'
                }
            }
        },
    },
   
    security: [{
        bearerAuth: []
    }],
            apis: ["./routes/*.js"],
}

module.exports = swaggerOption

const swaggerDocs = swaggerJsDoc(swaggerOption)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))


app.use(TodoRouter);
app.use(UserRouter);

app.listen(PORT, ()=>{
    console.log("Hello")
})