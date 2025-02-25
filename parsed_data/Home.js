import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const navigate = useNavigate();

    useEffect(() => {
        // Проверяем валидность токена
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:8000/api/auth/users/me/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        // Если токен невалиден, очищаем localStorage
                        localStorage.removeItem('token');
                        localStorage.removeItem('username');
                        setIsAuthenticated(false);
                        setUsername('');
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    setIsAuthenticated(false);
                }
            }
        };

        checkAuth();
    }, []);

    const handleStartNow = () => {
        if (isAuthenticated) {
            navigate('/projects');
        } else {
            // Показываем модальное окно авторизации или перенаправляем на страницу входа
            navigate('/login');
        }
    };

    return (
        <div>
            <div className="hero-section text-center py-5">
                <div className="container">
                    <h1 className="display-4 mb-4">Добро пожаловать в RevitPlatform</h1>
                    <p className="lead mb-4">
                        Платформа для эффективной работы с Revit проектами и семействами
                    </p>
                    {isAuthenticated ? (
                        <div>
                            <h2 className="h4 mb-3">Привет, {username}!</h2>
                            <button 
                                className="btn btn-primary btn-lg"
                                onClick={() => navigate('/projects')}
                            >
                                Перейти к проектам
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="btn btn-primary btn-lg"
                            onClick={handleStartNow}
                        >
                            Начать работу
                        </button>
                    )}
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">Проекты Revit</h5>
                                <p className="card-text">
                                    Управляйте своими Revit проектами, делитесь ими с командой
                                    и отслеживайте изменения.
                                </p>
                                <Link to="/projects" className="btn btn-outline-primary">
                                    Перейти к проектам
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">Семейства Revit</h5>
                                <p className="card-text">
                                    Доступ к библиотеке семейств Revit, возможность загружать
                                    и делиться своими семействами.
                                </p>
                                <Link to="/families" className="btn btn-outline-primary">
                                    Перейти к семействам
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">Блог и Новости</h5>
                                <p className="card-text">
                                    Следите за последними новостями, обновлениями и полезными
                                    статьями о Revit.
                                </p>
                                <Link to="/blog" className="btn btn-outline-primary">
                                    Читать блог
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isAuthenticated && (
                <div className="cta-section text-center py-5 mt-5 bg-light">
                    <div className="container">
                        <h2 className="mb-4">Готовы начать?</h2>
                        <p className="lead mb-4">
                            Присоединяйтесь к нашему сообществу и получите доступ ко всем возможностям платформы.
                        </p>
                        <button 
                            className="btn btn-primary btn-lg"
                            onClick={handleStartNow}
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;