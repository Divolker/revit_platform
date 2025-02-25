import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Families() {
    const [families, setFamilies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Временные данные для демонстрации
    const demoFamilies = [
        {
            id: 1,
            name: "Окно стандартное",
            description: "Стандартное окно с двойным остеклением",
            category: "windows",
            image: "https://via.placeholder.com/300x200"
        },
        {
            id: 2,
            name: "Дверь входная",
            description: "Входная дверь с усиленной конструкцией",
            category: "doors",
            image: "https://via.placeholder.com/300x200"
        },
        {
            id: 3,
            name: "Стол офисный",
            description: "Офисный стол стандартных размеров",
            category: "furniture",
            image: "https://via.placeholder.com/300x200"
        }
    ];

    const demoCategories = [
        { id: "windows", name: "Окна" },
        { id: "doors", name: "Двери" },
        { id: "furniture", name: "Мебель" }
    ];

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:8000/api/families/', {
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

                const data = await response.json();
                // Убедимся, что data это массив
                setFamilies(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching families:', error);
                setError(`Ошибка при загрузке семейств: ${error.message}`);
                setLoading(false);
            }
        };

        fetchFamilies();
    }, [navigate]);

    const filteredFamilies = selectedCategory === 'all'
        ? families
        : families.filter(family => family.category === selectedCategory);

    // Фильтрация семейств по поисковому запросу
    const filteredSearchFamilies = families.filter(family =>
        family.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Семейства Revit</h1>
                <button className="btn btn-primary">
                    Добавить семейство
                </button>
            </div>
            
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Категории</h5>
                            <div className="list-group">
                                <button
                                    className={`list-group-item list-group-item-action ${selectedCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    Все категории
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        className={`list-group-item list-group-item-action ${selectedCategory === category.id ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-9">
                    {/* Поиск */}
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Поиск семейств..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {filteredSearchFamilies.length === 0 ? (
                        <div className="text-center mt-5">
                            <h3>Семейства не найдены</h3>
                            <p className="text-muted">
                                {searchTerm ? 
                                    'Попробуйте изменить параметры поиска' : 
                                    'Пока нет добавленных семейств'}
                            </p>
                        </div>
                    ) : (
                        <div className="row">
                            {filteredSearchFamilies.map(family => (
                                <div key={family.id} className="col-md-4 mb-4">
                                    <div className="card h-100">
                                        {family.preview_image && (
                                            <img 
                                                src={family.preview_image}
                                                className="card-img-top" 
                                                alt={family.title}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div className="card-body">
                                            <h5 className="card-title">{family.title}</h5>
                                            <p className="card-text">{family.description}</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted">
                                                    Версия: {family.revit_version}
                                                </small>
                                                <small className="text-muted">
                                                    Размер: {family.file_size}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <button 
                                                className="btn btn-outline-primary w-100"
                                                onClick={() => window.open(family.file_url, '_blank')}
                                            >
                                                Скачать
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Families;
