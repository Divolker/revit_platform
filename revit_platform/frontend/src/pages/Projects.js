import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:8000/api/projects/', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Server response:', result); // Для отладки

                // Проверяем формат данных
                if (result.status === 'success' && Array.isArray(result.data)) {
                    setProjects(result.data);
                } else if (Array.isArray(result)) {
                    // Если данные приходят напрямую как массив
                    setProjects(result);
                } else {
                    throw new Error('Неверный формат данных с сервера');
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error details:', error);
                setError(`Ошибка при загрузке проектов: ${error.message}`);
                setLoading(false);
            }
        };

        fetchProjects();
    }, [navigate]);

    // Временные демо-данные для тестирования
    const demoProjects = [
        {
            id: 1,
            title: "Тестовый проект 1",
            description: "Описание тестового проекта 1",
            status: "in_progress",
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            title: "Тестовый проект 2",
            description: "Описание тестового проекта 2",
            status: "completed",
            created_at: new Date().toISOString()
        }
    ];

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            'draft': 'bg-secondary',
            'in_progress': 'bg-primary',
            'completed': 'bg-success',
            'archived': 'bg-dark'
        };
        return statusClasses[status] || 'bg-secondary';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            'draft': 'Черновик',
            'in_progress': 'В разработке',
            'completed': 'Завершен',
            'archived': 'В архиве'
        };
        return statusTexts[status] || status;
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
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
                    <div className="mt-3">
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/login')}
                        >
                            Войти
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Используем projects или демо-данные, если projects пустой
    const displayProjects = projects.length > 0 ? projects : demoProjects;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Проекты</h1>
                <button className="btn btn-primary">
                    Создать новый проект
                </button>
            </div>

            {displayProjects.length === 0 ? (
                <div className="text-center mt-5">
                    <h3>Проекты не найдены</h3>
                    <p className="text-muted">
                        У вас пока нет проектов. Создайте свой первый проект!
                    </p>
                </div>
            ) : (
                <div className="row">
                    {displayProjects.map(project => (
                        <div key={project.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                {project.thumbnail && (
                                    <img 
                                        src={project.thumbnail}
                                        className="card-img-top" 
                                        alt={project.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{project.title}</h5>
                                    <p className="card-text">{project.description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className={`badge ${project.status === 'completed' ? 'bg-success' : 'bg-primary'}`}>
                                            {project.status}
                                        </span>
                                        <small className="text-muted">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button 
                                        className="btn btn-outline-primary w-100"
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                    >
                                        Открыть проект
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Projects;
