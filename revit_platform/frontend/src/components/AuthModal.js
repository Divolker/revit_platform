import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import './AuthModal.css';

function AuthModal({ show, onHide, onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin 
            ? 'http://localhost:8000/api/auth/jwt/create/'
            : 'http://localhost:8000/api/auth/users/';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    isLogin ? {
                        username: e.target.username.value,
                        password: e.target.password.value,
                    } : {
                        username: e.target.username.value,
                        email: e.target.email.value,
                        password: e.target.password.value,
                        re_password: e.target.password.value,
                    }
                ),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.access);
                    localStorage.setItem('username', e.target.username.value);
                    onLogin(e.target.username.value);
                    onHide();
                } else {
                    setIsLogin(true);
                    setError('Регистрация успешна! Теперь вы можете войти.');
                }
            } else {
                setError(Object.values(data).flat().join(', '));
            }
        } catch (error) {
            setError('Ошибка сервера');
            console.error('Auth error:', error);
        }
    };

    const handleGoogleAuth = () => {
        window.location.href = 'http://localhost:8000/api/auth/google/';
    };

    const handleGithubAuth = () => {
        window.location.href = 'http://localhost:8000/api/auth/github/';
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isLogin ? 'Вход' : 'Регистрация'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="social-auth-buttons mb-4">
                    <Button 
                        variant="outline-danger" 
                        className="w-100 mb-2"
                        onClick={handleGoogleAuth}
                    >
                        <FaGoogle /> Продолжить с Google
                    </Button>
                    <Button 
                        variant="outline-dark" 
                        className="w-100"
                        onClick={handleGithubAuth}
                    >
                        <FaGithub /> Продолжить с GitHub
                    </Button>
                </div>

                <div className="separator mb-4">
                    <span>или</span>
                </div>

                <Form onSubmit={handleEmailAuth}>
                    <Form.Group className="mb-3">
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            required
                            placeholder="Введите имя пользователя"
                        />
                    </Form.Group>

                    {!isLogin && (
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                required
                                placeholder="Введите email"
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            required
                            placeholder="Введите пароль"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <p>
                    {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                    <Button
                        variant="link"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                    >
                        {isLogin ? 'Зарегистрироваться' : 'Войти'}
                    </Button>
                </p>
            </Modal.Footer>
        </Modal>
    );
}

export default AuthModal;
