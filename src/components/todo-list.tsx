"use client"

import type React from "react"
import { useState } from "react"
import { PlusCircle, Trash2, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo("")
    }
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const startEdit = (id: number, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo)))
    setEditingId(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4">
        <h1 className="text-2xl font-bold text-center">My Todo List</h1>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <form onSubmit={addTodo} className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow"
          />
          <Button type="submit">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2 bg-secondary p-2 rounded">
              {editingId === todo.id ? (
                <>
                  <Input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={() => saveEdit(todo.id)} size="icon" variant="ghost">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => setEditingId(null)} size="icon" variant="ghost">
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="mr-2"
                  />
                  <span className={`flex-grow ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                    {todo.text}
                  </span>
                  <Button onClick={() => startEdit(todo.id, todo.text)} size="icon" variant="ghost">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => deleteTodo(todo.id)} size="icon" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>

      <footer className="bg-secondary py-4 mt-auto">
        <p className="text-center text-secondary-foreground">© 2023 My Todo List App</p>
      </footer>
    </div>
  )
}

