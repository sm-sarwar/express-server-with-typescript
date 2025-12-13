import express from "express";
import { todosControllers } from "./todo.controller";

const router = express.Router()

router.get("/", todosControllers.getTodos)

router.post("/", todosControllers.createTodo)

router.get("/:id", todosControllers.getTodoById)

router.put("/:id", todosControllers.updateTodo)

router.delete ("/:id", todosControllers.deleteTodo)


export const todosRoutes = router;