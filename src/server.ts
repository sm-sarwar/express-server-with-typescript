import express, { NextFunction, Request, Response } from "express"

import config from "./config"
import initDB, { pool } from "./config/db"
import { logger } from "./middleware/logger"
import { userRoutes } from "./modules/user/user.routes"
import { todosRoutes } from "./modules/todo/todo.routes"

const app = express()
const port = config.port


// perser 
app.use(express.json())


//DB creating pool for postgres 
initDB();

// users CRUD

app.use("/users", userRoutes)



// todos crud 


app.use("/todos", todosRoutes)



app.get('/', logger, (req: Request, res: Response) => {
    res.send('This is express practice!')
})

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Rout Not Found',
        path: req.path
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
