// import { webhookCallback } from "grammy"
import express from "express"
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// import {bot,token} from "./telegram-bot/bot.js"
import "./config/mongodb.js";
// import "./telegram-bot/modules/migrationModule.js"



import permissionRouter from "./router/permissionRouter.js";
import roleRouter from "./router/roleRouter.js";
import menuRouteRouter from "./router/menuRouteRouter.js";
import menuRouter from "./router/menuRouter.js";
import organizationRouter from "./router/organizationRouter.js";
import {teamRouter, tournamentRouter, matchRouter} from "./router/index.js"




const app = express()
app.use(express.json())
app.use(cors());



app.use("/permission",permissionRouter);
app.use("/role",roleRouter);
app.use("/route",menuRouteRouter);
app.use("/menu",menuRouter);
app.use("/organization",organizationRouter);
app.use("/team",teamRouter)
app.use("/tournament",tournamentRouter)
app.use("/match",matchRouter)


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public', express.static(path.join(__dirname, './public/photo')));











// app.use(`/${token}`, webhookCallback(bot, 'express'))


const port = process.env.PORT;

app.use((req, res) => {
    res.status(404).json({
        status: false,
        data: null,
        message: `server port ${port}`,
    })
})





app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`)
});
