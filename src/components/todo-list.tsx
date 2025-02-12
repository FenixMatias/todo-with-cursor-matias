import React, { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore"

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
}