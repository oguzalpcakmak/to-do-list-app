import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

type TodoItem = {
  id: number;
  title: string;
  completed: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoText, setEditTodoText] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://192.168.0.102:3000/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    try {
      fetchTodos();
      const response = await fetch("http://192.168.0.102:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo, completed: false }),
      });
      const newTodoItem = await response.json();
      setTodos((prevTodos) => [...prevTodos, newTodoItem]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      fetchTodos();
      await fetch(`http://192.168.0.102:3000/todos/${id}`, {
        method: "DELETE",
      });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      fetchTodos();
      await fetch(`http://192.168.0.102:3000/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const startEditing = (id: number, title: string) => {
    setEditTodoId(id);
    setEditTodoText(title);
  };

  const cancelEditing = () => {
    setEditTodoId(null);
    setEditTodoText("");
  };

  const saveEdit = async () => {
    try {
      fetchTodos();
      const response = await fetch(
        `http://192.168.0.102:3000/todos/${editTodoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: editTodoText }),
        }
      );
      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === editTodoId ? updatedTodo : todo))
      );
      setEditTodoId(null);
      setEditTodoText("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const renderItem = ({ item }: { item: TodoItem }) => {
    if (editTodoId === item.id) {
      return (
        <View className="flex-row items-center p-2">
          <TextInput
            value={editTodoText}
            onChangeText={setEditTodoText}
            className="flex-1 border p-2"
          />
          <TouchableOpacity onPress={saveEdit}>
            <Text className="text-blue-500 ml-2">Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelEditing}>
            <Text className="text-red-500 ml-2">Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex-row items-center p-2">
        <TouchableOpacity
          onPress={() => toggleComplete(item.id, item.completed)}
        >
          <Text
            className={`flex-1 ${
              item.completed ? "line-through text-gray-500" : ""
            }`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => startEditing(item.id, item.title)}>
          <Text className="text-blue-500 ml-2">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
          <Text className="text-red-500 ml-2">Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4">Todo App</Text>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        className="mb-2 grow"
      />

      <View className="flex-row mb-2">
        <TextInput
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Enter a new todo"
          className="flex-1 border p-2"
        />
        <TouchableOpacity onPress={addTodo}>
          <Text className="bg-blue-500 text-white px-4 py-2 rounded">Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={fetchTodos}>
        <Text className="bg-green-500 text-white px-4 py-2 rounded mb-2">
          Fetch Todos
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
