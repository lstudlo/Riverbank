import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Todo = {
	id: number;
	title: string;
	completed: number;
	created_at: number;
	updated_at: number;
};

function App() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [loading, setLoading] = useState(false);

	const fetchTodos = async () => {
		try {
			const response = await fetch("/api/todos");
			const data = await response.json();
			setTodos(data.todos || []);
		} catch (error) {
			console.error("Failed to fetch todos:", error);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	const addTodo = async () => {
		if (!newTodoTitle.trim()) return;

		setLoading(true);
		try {
			const response = await fetch("/api/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: newTodoTitle }),
			});

			if (response.ok) {
				setNewTodoTitle("");
				await fetchTodos();
			}
		} catch (error) {
			console.error("Failed to add todo:", error);
		} finally {
			setLoading(false);
		}
	};

	const toggleTodo = async (id: number) => {
		try {
			const response = await fetch(`/api/todos/${id}/toggle`, {
				method: "PATCH",
			});

			if (response.ok) {
				await fetchTodos();
			}
		} catch (error) {
			console.error("Failed to toggle todo:", error);
		}
	};

	const deleteTodo = async (id: number) => {
		try {
			const response = await fetch(`/api/todos/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				await fetchTodos();
			}
		} catch (error) {
			console.error("Failed to delete todo:", error);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			addTodo();
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle className="text-3xl">Todo List</CardTitle>
						<CardDescription>
							A simple todo app built with React, Hono, and Cloudflare D1
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="Add a new todo..."
								value={newTodoTitle}
								onChange={(e) => setNewTodoTitle(e.target.value)}
								onKeyPress={handleKeyPress}
								disabled={loading}
								className="flex-1"
							/>
							<Button onClick={addTodo} disabled={loading}>
								Add
							</Button>
						</div>

						<div className="space-y-2">
							{todos.length === 0 ? (
								<p className="text-center text-gray-500 py-8">
									No todos yet. Add one to get started!
								</p>
							) : (
								todos.map((todo) => (
									<div
										key={todo.id}
										className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
									>
										<Checkbox
											checked={todo.completed === 1}
											onCheckedChange={() => toggleTodo(todo.id)}
										/>
										<span
											className={`flex-1 ${
												todo.completed === 1
													? "line-through text-gray-500"
													: "text-gray-900"
											}`}
										>
											{todo.title}
										</span>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => deleteTodo(todo.id)}
										>
											Delete
										</Button>
									</div>
								))
							)}
						</div>

						{todos.length > 0 && (
							<div className="text-sm text-gray-500 text-center pt-4">
								{todos.filter((t) => t.completed === 0).length} of {todos.length}{" "}
								tasks remaining
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default App;
