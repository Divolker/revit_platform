import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Families from './pages/Families';
import Blog from './pages/Blog';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
// import SearchResults from './pages/SearchResults'; // временно уберем
import './App.css';

// Компонент для защищенных маршрутов
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    console.log('App rendering');
    return (
        <Router>
            <div className="app">
                <Header />
                <Routes>
                    {/* Публичные маршруты */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/blog" element={<Blog />} />

                    {/* Защищенные маршруты */}
                    <Route 
                        path="/projects" 
                        element={
                            <PrivateRoute>
                                <Projects />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/families" 
                        element={
                            <PrivateRoute>
                                <Families />
                            </PrivateRoute>
                        } 
                    />

                    {/* Перенаправление на главную страницу для неизвестных маршрутов */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                    {/* <Route path="/search" element={<SearchResults />} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
