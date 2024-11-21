import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase-config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import "./App.css";

function App() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState("");
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Fetch books from Firestore
    const fetchBooks = async () => {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksData = querySnapshot.docs.map((doc) => doc.data());
        setBooks(booksData);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Handle adding a new book
    const handleAddBook = async () => {
        if (newBook) {
            await addDoc(collection(db, "books"), { title: newBook });
            setNewBook(""); // Clear the input
            fetchBooks(); // Refresh the book list
        }
    };

    // Handle user login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error("Error logging in:", error.message);
        }
    };

    // Handle user registration
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error("Error registering:", error.message);
        }
    };

    // Handle user logout
    const handleLogout = () => {
        auth.signOut();
        setUser(null);
    };

    return (
        <div className="App">
            <h1>Bookstore</h1>

            {user ? (
                <div>
                    <button onClick={handleLogout}>Logout</button>
                    <div>
                        <h3>Add a New Book</h3>
                        <input
                            type="text"
                            placeholder="Book title"
                            value={newBook}
                            onChange={(e) => setNewBook(e.target.value)}
                        />
                        <button onClick={handleAddBook}>Add Book</button>
                    </div>
                    <h2>Book List</h2>
                    <ul>
                        {books.map((book, index) => (
                            <li key={index}>{book.title}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h3>Login / Register</h3>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                    </form>
                    <button onClick={handleRegister}>Register</button>
                </div>
            )}
        </div>
    );
}

export default App;

