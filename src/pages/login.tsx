import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import Link from "next/link"

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const { token } = await res.json();
                localStorage.setItem('token', token); // Сохраняем токен
                router.push('/passwords');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="dense"
                        size="small"
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="dense"
                        size="small"
                        required
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    >
                        Login
                    </Button>
                </form>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button
                        component={Link}
                        href="/register"
                        variant="text"
                        color="primary"
                    >
                        Немає акаунту? Зареєструватися
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}