import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    List,
    ListItem,
    ListItemText,
    Paper,
    IconButton
} from '@mui/material';
import { useRouter } from 'next/router';
import CustomTitle from '../components/CustomTitle';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import Image from 'next/image';
import { Visibility, VisibilityOff } from '@mui/icons-material';
interface Password {
    _id: string;
    title: string;
    password: string;
}

export default function Passwords() {
    const router = useRouter();
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [newPassword, setNewPassword] = useState({
        title: '',
        password: ''
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Перевірка авторизації при завантаженні сторінки
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, redirecting to login');
            router.push('/login');
            return;
        }

        // Перевірка валідності токена
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    console.log('Invalid token, redirecting to login');
                    localStorage.removeItem('token');
                    router.push('/login');
                    return;
                }

                // Токен валідний, завантажуємо паролі
                fetchPasswords();
            } catch (error) {
                console.error('Auth check error:', error);
                setError('Authentication error');
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const fetchPasswords = async () => {
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const res = await fetch('/api/passwords', { headers });

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/login');
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error('Failed to fetch passwords');
            }

            const data = await res.json();
            // Перевіряємо структуру відповіді
            if (data.data && Array.isArray(data.data)) {
                setPasswords(data.data);
            } else if (Array.isArray(data)) {
                setPasswords(data);
            } else {
                console.error('Unexpected response format:', data);
                setPasswords([]);
                setError('Unexpected data format received');
            }
        } catch (error) {
            console.error('Error fetching passwords:', error);
            setError(error instanceof Error ? error.message : 'Failed to load passwords');
            setPasswords([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
            const res = await fetch('/api/passwords', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    title: newPassword.title,
                    password: newPassword.password,
                }),
            });

            if (res.ok) {
                setNewPassword({ title: '', password: '' });
                fetchPasswords();
            }
        } catch (error) {
            console.error('Error adding password:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const handleGeneratedPassword = (password: string) => {
        setNewPassword({
            title: '',  // користувач має ввести назву
            password: password
        });
    };

    const togglePasswordVisibility = (passwordId: string) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [passwordId]: !prev[passwordId]
        }));
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <CustomTitle>
                        Password Manager
                    </CustomTitle>
                    <CustomButton
                        onClick={handleLogout}
                        size="small"
                    >
                        Logout
                    </CustomButton>
                </Box>

                <Paper sx={{ p: 3, mb: 3, borderRadius: '16px' }}>
                    <form onSubmit={handleAddPassword}>
                        <CustomTextField
                            label="Title"
                            value={newPassword.title}
                            onChange={(e) => setNewPassword({ ...newPassword, title: e.target.value })}
                            fullWidth
                            margin="normal"
                            required
                            sx={{ mb: 2 }}
                        />
                        <CustomTextField
                            label="Password"
                            value={newPassword.password}
                            onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                            fullWidth
                            margin="normal"
                            type="password"
                            required
                            sx={{ mb: 2 }}
                        />
                        <CustomButton
                            type="submit"
                            fullWidth
                        >
                            Add Password
                        </CustomButton>
                    </form>
                </Paper>

                <List>
                    {Array.isArray(passwords) ? passwords.map((pwd) => (
                        <ListItem
                            key={pwd._id}
                            component={Paper}
                            sx={{
                                mb: 2,
                                p: 2,
                                borderRadius: '16px',
                                backgroundColor: 'rgba(221, 209, 220, 0.10)'
                            }}
                        >
                            <ListItemText
                                primary={pwd.title}
                                secondary={pwd.password}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontFamily: 'var(--font-tomorrow)',
                                        color: '#833D3B',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        letterSpacing: '3.2px'
                                    },
                                    '& .MuiListItemText-secondary': {
                                        fontFamily: 'var(--font-tomorrow)',
                                        color: '#8F8483',
                                        fontSize: '14px',
                                        letterSpacing: '2.8px'
                                    }
                                }}
                            />
                            <IconButton
                                edge="end"
                                onClick={() => togglePasswordVisibility(pwd._id)}
                            >
                                {visiblePasswords[pwd._id] ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </ListItem>
                    )) : (
                        <ListItem component={Paper}>
                            <ListItemText primary="No passwords found" />
                        </ListItem>
                    )}
                </List>
            </Box>

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    right: 44,
                    zIndex: -1
                }}
            >
                <Image
                    src="/images/image.png"
                    alt="Decorative image"
                    width={706}
                    height={348}
                />
            </Box>
        </Container>
    );
} 