import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery, category);
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit} className="d-flex">
                <div className="input-group">
                    <select 
                        className="form-select flex-shrink-1" 
                        style={{ maxWidth: '150px' }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="all">Везде</option>
                        <option value="families">Семейства</option>
                        <option value="projects">Проекты</option>
                        <option value="blog">Блог</option>
                    </select>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                        <i className="bi bi-search"></i>
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <i className="bi bi-sliders"></i>
                    </button>
                </div>
            </form>

            {/* Расширенный поиск */}
            {showAdvanced && (
                <div className="advanced-search mt-2 p-3 border rounded">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-2">
                                <label className="form-label">Дата</label>
                                <select className="form-select">
                                    <option value="any">Любая дата</option>
                                    <option value="today">Сегодня</option>
                                    <option value="week">За неделю</option>
                                    <option value="month">За месяц</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-2">
                                <label className="form-label">Сортировка</label>
                                <select className="form-select">
                                    <option value="relevance">По релевантности</option>
                                    <option value="date">По дате</option>
                                    <option value="downloads">По популярности</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-2">
                                <label className="form-label">Тип</label>
                                <select className="form-select">
                                    <option value="all">Все типы</option>
                                    <option value="family">Семейства</option>
                                    <option value="project">Проекты</option>
                                    <option value="post">Статьи</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
