import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Временно закомментируем bootstrap пока не настроим
// import { Modal, Button } from 'react-bootstrap';
import SearchBar from './SearchBar';
import AuthModal from './AuthModal';
import './Header.css';

function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [error, setError] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (username) => {
        setIsAuthenticated(true);
        setUsername(username);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername('');
        navigate('/');
    };

    const handleSearch = (searchQuery, category) => {
        // Навигация на страницу результатов поиска с параметрами
        navigate(`/search?q=${searchQuery}&category=${category}`);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">RevitPlatform</Link>
                
                {/* Поисковая строка */}
                <div className="search-container flex-grow-1 mx-4">
                    <SearchBar onSearch={handleSearch} />
                </div>
                
                <div className="navbar-nav ms-auto">
                    {!isAuthenticated ? (
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowAuthModal(true)}
                        >
                            Войти
                        </button>
                    ) : (
                        <div className="d-flex align-items-center">
                            <span className="me-3">Привет, {username}!</span>
                            <Link to="/projects" className="btn btn-outline-primary me-2">Проекты</Link>
                            <Link to="/families" className="btn btn-outline-primary me-2">Семейства</Link>
                            <Link to="/blog" className="btn btn-outline-primary me-2">Блог</Link>
                            <button 
                                className="btn btn-outline-danger" 
                                onClick={handleLogout}
                            >
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <AuthModal 
                show={showAuthModal}
                onHide={() => setShowAuthModal(false)}
                onLogin={handleLogin}
            />
        </nav>
    );
}

export default Header;
