import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

type TodoItem = {
  id: number;
  title: string;
  completed: boolean;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 64,
    backgroundColor: "#30396B",
  },
  title: {
    fontSize: 50,
    marginBottom: 16,
    color: "grey",
    fontFamily: "Impact",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "antiquewhite",
    marginBottom: 10,
    
  },
  
   completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  todoText: {
    flex: 1,
    color: "black",
    fontFamily: "arial",
  },
  deleteButton: {
    color: "red",
    textAlign: "right",
    marginRight: 8,
  },
  editButton: {
    color: "blue",
    marginLeft: 8,
  },
  completeButton: {
    color: "green",
    marginLeft: 8,
  },
  fetchButton: {
    backgroundColor: "green",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  fetchButtonText: {
    color: "white",
  },
  addButton: {
    backgroundColor: "#D67E3C",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    borderRadius: 15,
  },
  addButtonText: {
    color: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    backgroundColor: "white",
    fontFamily: "arial",
    borderRadius: 15 ,
  },
});

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
      const response = await fetch("http://192.168.1.178:3000/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    try {
      fetchTodos();
      const response = await fetch("http://192.168.1.178:3000/todos", {
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
      await fetch(`http://192.168.1.178:3000/todos/${id}`, {
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
      await fetch(`http://192.168.1.178:3000/todos/${id}`, {
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
        `http://192.168.1.178:3000/todos/${editTodoId}`,
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
        <View style={styles.todoItem}>
          <TextInput
            value={editTodoText}
            onChangeText={setEditTodoText}
            style={styles.todoText}
          />
          <TouchableOpacity onPress={saveEdit}>
            <Text style={styles.editButton}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelEditing}>
            <Text style={styles.deleteButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.todoItem}>
        <TouchableOpacity
          onPress={() => toggleComplete(item.id, item.completed)}
        >
          <Text
            style={[styles.todoText, item.completed && styles.completedText]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => startEditing(item.id, item.title)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskMaster</Text>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ marginBottom: 8 }}
      />

      <View style={{ flexDirection: "row" }}>
        <TextInput
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Enter your task!"
          style={styles.input}
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}