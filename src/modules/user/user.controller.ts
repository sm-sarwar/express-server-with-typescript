import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    // console.log(req.body)
    try {
        const result =  await userService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "user created successfully",
            data: result.rows[0]
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

const getUsers = async (req: Request, res: Response) => {

    try {
        const result = await userService.getUsers()
        res.status(200).json({
            success: true,
            message: "data fetched successfully",
            data: result.rows,

        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }

}

const getUserById = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const result = await userService.getUserById(id as string)

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "user fetched successfully",
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

const updateUser = async (req: Request, res: Response) => {
    const { name, email} = req.body;

    try {
        const result = await userService.updateUser(name, email, req.params.id as string)

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "user updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {

    try {
        const result = await userService.deleteUser(req.params.id as string)
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "user deleted successfully"
            })
        }


    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const userControllers = {
    createUser, getUsers , getUserById ,updateUser, deleteUser
}