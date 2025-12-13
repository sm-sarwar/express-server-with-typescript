import { Request, Response } from "express"
import { todoService } from "./todo.service"

const getTodos = async (req: Request, res: Response) => {
    try {
        const result = await todoService.getTodos()
        res.status(200).json({
            success: true,
            message: "todos fetched successfully",
            data: result.rows
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const createTodo = async (req: Request, res: Response) => {
    const { user_id, title } = req.body;

    try {
        const result = await todoService.createTodo(user_id, title)
        res.status(201).json({
            success: true,
            message: "todo created successfully",
            data: result.rows[0]
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getTodoById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const result = await todoService.getTodoById(id as string)

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "todo not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "todo fetched successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

const updateTodo = async (req: Request, res: Response) => {
    const { title } = req.body;
    try {
        const result = await todoService.updateTodo(
            title, req.params.id as string
        )
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "todo not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "todo updated successfully",
                data: result.rows[0]
            })
        }


    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message

        })
    }
}

const deleteTodo = async (req : Request, res : Response) =>{
    const { id } = req.params;
    try {
        const result = await todoService.deleteTodo( id as string)

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "todo not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "todo deleted successfully"
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const todosControllers = {
    getTodos, createTodo, getTodoById, updateTodo ,deleteTodo
}
