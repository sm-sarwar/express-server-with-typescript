import express, { Request, Response } from "express"
import {Pool} from "pg"
import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(process.cwd(), '.env')})
const app = express()
const port = 8000


// perser 
app.use (express.json())


//DB creating pool for postgres 
const pool = new Pool ({
    connectionString: `${process.env.CONNECTION_STRING}`
})


const initDB = async () =>{
    await pool.query (`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          age INT,
          phone VARCHAR (15),
          address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);

        await pool.query (`
            CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(150) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)
}
initDB ();


app.post ('/post', (req : Request, res : Response)=>{
    console.log(req.body)


    res.status(200).json ({
        success: true,
        message : "API is working fine"
    })
})



app.get('/', (req : Request, res : Response) => {
  res.send('This is express practice!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
