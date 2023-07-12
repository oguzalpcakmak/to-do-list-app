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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 64,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  todoText: {
    flex: 1,
  },
  deleteButton: {
    color: "red",
  },
  addButton: {
    backgroundColor: "blue",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
  },
});

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("<your-db-adress-here>/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch("<your-db-adress-here>/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
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
      await fetch(`<your-db-adress-here>/todos/${id}`, {
        method: "DELETE",
      });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const renderItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoText}>{item.title}</Text>
      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>

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
          placeholder="Enter a new todo"
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
