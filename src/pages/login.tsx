import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import CustomTitle from 'components/CustomTitle';
import CustomTextField from 'components/CustomTextField';
import CustomButton from 'components/CustomButton';
import CustomLink from 'components/CustomLink';

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
        <Container maxWidth="sm" sx={{ mt: 12 }}>
            <Box sx={{ mt: 4 }}>
                <CustomTitle>
                    Login
                </CustomTitle>
                <form onSubmit={handleLogin}>
                    <CustomTextField
                        sx={{ mb: 3 }}
                        label="Username"
                        variant="outlined"
                        fullWidth
                        size="medium"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <CustomTextField
                        sx={{ mb: 3 }}
                        label="Password"
                        type="password"
                        fullWidth
                        size="medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <CustomButton
                        type="submit"
                        fullWidth
                        size="large"
                    >
                        Login
                    </CustomButton>
                </form>
                <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <CustomLink href="/register">
                        Don't have an account? Register
                    </CustomLink>
                </Box>
            </Box>
        </Container>
    );
}