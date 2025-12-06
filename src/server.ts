import express, { NextFunction, Request, Response } from "express"
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

// DB 
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

// logger midlware 

const logger = (req : Request, res : Response, next : NextFunction) =>{
 console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
    next()
}
// users CRUD
app.post ('/users', async(req : Request, res : Response)=>{
    // console.log(req.body)
    const {name, email} = req.body;
    try {
        const result = await pool.query (`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email]);

        // console.log(result.rows[0])
        // res.send({message: "data inserted successfully"})
            res.status(201).json ({
            success: true,
            message: "data inserted successfully",
            data: result.rows[0]
        })

    }catch (err : any){
        res.status(500).json({
            success:false,
            message: err.message
        })
    }

})

// get request 
app.get ('/users' , async (req : Request, res : Response) => {

    try {
        const result = await pool.query (`SELECT * FROM users`)
        res.status (200).json({
            success: true,
            message: "data fetched successfully",
            data: result.rows,

        })

    }catch (err : any) {
        res.status (500). json({
            success: false,
            message: err.message,
            details : err
        })
    }
    
})

// Get single user
app.get ('/users/:id', async(req : Request, res : Response) =>{
    try {
        const result = await pool.query (`SELECT * FROM users WHERE id = $1`, [req.params.id])

        if(result.rows.length === 0){
            res.status (404).json ({
                success: false,
                message : "user not found"
            })
        }else {
            res.status(200).json ({
                success: true,
                message : "user fetched successfully",
                data : result.rows[0]
            })
        }

    }catch (err : any){
        res.status (500).json ({
            success : false,
            message : err.message
        })
    }
})

// update user

app.put ('/users/:id', async (req : Request, res : Response) =>{
    const {name, email} = req.body;

    try {
        const result = await pool.query (`UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`, [name, email, req.params.id])

        if (result.rows.length === 0) {
            res.status (404).json ({
                success : false,
                message : "user not found"
            })
        }else {
            res.status (200).json ({
                success : true,
                message : "user updated successfully",
                data: result.rows[0]
            })
        }

    }catch (err : any ){
        res.status (500).json ({
            success: false,
            message : err.message
        })
    }
})

// Delete user 
app.delete ('/users/:id', async (req : Request , res : Response)=> {

    try {
        const result = await pool.query (`DELETE FROM users WHERE id = $1`, [req.params.id])
        if (result.rowCount === 0){
            res.status (404).json ({
                success : false,
                message : "user not found"
            })
        }else {
            res.status (200).json ({
                success : true,
                message  : "user deleted successfully"
            })
        }


    }catch (err : any){
        res.status (500) .json ({
            success :false ,
            message : err.message
        })
    }
})

// todos crud 


app.get ("/todos", async (req : Request, res : Response) =>{
    try {
        const result =await pool.query (`SELECT * FROM todos`)
        res.status (200).json ({
            success : true,
            message : "todos fetched successfully",
            data : result.rows
        })

    }catch (err: any) {
        res.status (500).json({
            success: false,
            message: err.message
        })
    }
})

app.post ("/todos", async (req : Request, res : Response) =>{
    const {user_id, title} = req.body;

    try{
        const result = await pool.query (`INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *`, [user_id, title])
        res.status (201).json ({
            success: true,
            message : "todo created successfully",
            data : result.rows[0]
        })

    }catch (err : any ){
        res.status (500).json ({
            success: false,
            message : err.message
        })
    }
})

app.get ("/todos/:id", async (req : Request, res : Response) =>{
    try {
        const result = await pool.query (`SELECT * FROM todos WHERE id = $1`, [req.params.id])

        if (result.rows.length === 0){
            res.status (404).json ({
                success : false,
                message : "todo not found"
            })
        }else {
            res.status (200).json ({
                success : true,
                message : "todo fetched successfully",
                data : result.rows[0]
            })
        }

    }catch (err : any) {
        res.status (500).json ({
            success : false,
            message : err.message,
        })
    }
})

app.put ("/todos/:id", async (req : Request , res : Response) =>{
    const {title} = req.body;

    try {
        const result = await pool.query (`UPDATE todos SET title = $1 WHERE id = $2 RETURNING *`,
            [title, req.params.id]
        )
        if ( result.rows.length === 0){
            res.status (404).json ({
                success: false,
                message : "todo not found"
            })
        }else {
            res.status (200).json ({
                success : true,
                message : "todo updated successfully",
                data : result.rows[0]
            })
        }


    }catch (err : any ){
        res.status (500).json ({
            success : false,
            message : err.message

        })
    }
})

app.delete ("/todos/:id", async (req : Request, res : Response)=>{
    try {
        const result = await pool.query (`DELETE FROM todos WHERE id = $1`, [req.params.id])

        if (result.rowCount === 0){
            res.status (404).json ({
                success : false,
                message : "todo not found"
            })
        }else{
            res.status (200).json ({
                success : true,
                message : "todo deleted successfully"
            })
        }

    }catch (err : any){
        res.status (500).json ({
            success: false,
            message : err.message
        })
    }
})


app.get('/', logger, (req : Request, res : Response) => {
  res.send('This is express practice!')
})

app.use((req : Request, res : Response)=>{
    res.status (404).json ({
        success : false,
        message : 'Rout Not Found',
        path: req.path
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
