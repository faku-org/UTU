import React from "react"
import { useState } from "react"
import "../App.css"

export function Form() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const types = ["Bug Report", "Feature Request", "General Feedback"]
    const [type, setType] = useState(types[0])
    const priorities = ["Low", "Medium", "High"]
    const [priority, setPriority] = useState(priorities[0])

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        title: "",
        description: "",
        type: types[0],
        priority: priorities[0]
    })

    const verifyLength = (value: string, min: number, max: number) => {
        return value.length >= min && value.length <= max
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()

        if (!verifyLength(username, 3, 20)) {
            alert("Username must be between 3 and 20 characters")
            return
        }

        if (!verifyLength(email, 5, 50) || !email.includes("@")) {
            alert("Please enter a valid email address")
            return
        }

        if (!verifyLength(title, 5, 100)) {
            alert("Title must be between 5 and 100 characters")
            return
        }

        if (!verifyLength(description, 10, 1000)) {
            alert("Description must be between 10 and 1000 characters")
            return
        }

        const response = await fetch("https://eternum.lat/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, title, description, type, priority }),
        })

        if (response.ok) {
            console.log("Form submitted successfully")
        } else {
            console.error("Submission failed:", response.statusText)
        }
    }

    return (

        <div className="flex m-auto justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="min-w-xl max-w-4xl mx-auto p-4 items-center bg-blue-300/20 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">Submit Problem</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                >
                    {types.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Priority</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                >
                    {priorities.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer">Submit</button>
        </form>
        </div>
    )
}