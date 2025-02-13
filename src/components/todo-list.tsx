"use client"

import React, { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot 
} from "firebase/firestore"
import { PlusCircle, Trash2, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Todo));
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim() !== "") {
      try {
        await addDoc(collection(db, "todos"), {
          text: newTodo,
          completed: false,
          createdAt: new Date()
        });
        setNewTodo("")
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  const toggleComplete = async (id: string) => {
    const todoRef = doc(db, "todos", id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
      try {
        await updateDoc(todoRef, {
          completed: !todo.completed
        });
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  }

  const saveEdit = async (id: string) => {
    const todoRef = doc(db, "todos", id);
    try {
      await updateDoc(todoRef, {
        text: editText
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Agregar nueva tarea..."
          className="flex-1"
        />
        <Button type="submit">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </form>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComplete(todo.id)}
              className={todo.completed ? "line-through text-muted-foreground" : ""}
            >
              {todo.completed ? "✓" : "○"}
            </Button>

            {editingId === todo.id ? (
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={() => saveEdit(todo.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-1 items-center gap-2">
                <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                  {todo.text}
                </span>
                <div className="ml-auto flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditText(todo.text);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}