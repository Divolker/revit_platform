import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaCubes, FaBook, FaUserCircle, FaList } from 'react-icons/fa';

function Home() {
    const [userData, setUserData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const fetchCategories = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/categories/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при получении категорий');
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError(error.message);
        }
    }, []);

    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8000/auth/users/me/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                // Пробуем обновить токен
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const refreshResponse = await fetch('http://localhost:8000/auth/jwt/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            refresh: refreshToken
                        }),
                    });

                    if (refreshResponse.ok) {
                        const { access } = await refreshResponse.json();
                        localStorage.setItem('token', access);
                        // Повторяем запрос с новым токеном
                        return fetchUserData();
                    }
                }
                // Если не удалось обновить токен, выходим
                handleLogout();
                return;
            }

            if (!response.ok) {
                throw new Error('Ошибка при получении данных пользователя');
            }

            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserData();
        fetchCategories();
    }, [fetchUserData, fetchCategories]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <h2>Загрузка...</h2>
                    <div className="spinner-border text-primary mt-3" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid vh-100 bg-light">
            {/* Header */}
            <div className="row py-4 bg-white shadow-sm">
                <div className="col">
                    <div className="container d-flex justify-content-between align-items-center">
                        <h1 className="h4 mb-0">Revit Platform</h1>
                        <div className="position-relative">
                            <button 
                                className="btn btn-link text-dark text-decoration-none"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <FaUserCircle size={24} className="me-2" />
                                {userData?.email}
                            </button>
                            {showDropdown && (
                                <div className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow-lg" style={{ minWidth: '200px', zIndex: 1000 }}>
                                    <button 
                                        className="btn btn-link text-dark text-decoration-none d-block w-100 text-start px-4"
                                        onClick={handleLogout}
                                    >
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-5">
                <div className="row g-4">
                    {/* Projects */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center p-4">
                                <FaBuilding size={48} className="text-primary mb-3" />
                                <h5 className="card-title">Проекты</h5>
                                <p className="card-text text-muted">
                                    Управление проектами Revit, совместная работа и контроль версий
                                </p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate('/projects')}
                                >
                                    Перейти к проектам
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Families */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center p-4">
                                <FaCubes size={48} className="text-primary mb-3" />
                                <h5 className="card-title">Семейства</h5>
                                <p className="card-text text-muted">
                                    Библиотека семейств Revit, категории и параметры
                                </p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate('/families')}
                                >
                                    Перейти к семействам
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center p-4">
                                <FaList size={48} className="text-primary mb-3" />
                                <h5 className="card-title">Категории</h5>
                                <div className="list-group">
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            className="list-group-item list-group-item-action text-start"
                                            onClick={() => navigate(`/categories/${category.id}`)}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
