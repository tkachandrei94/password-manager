import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import CustomTitle from 'components/CustomTitle';
import CustomTextField from 'components/CustomTextField';
import CustomButton from 'components/CustomButton';
import CustomLink from 'components/CustomLink';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                setOpenSnackbar(true);
                setTimeout(() => {
                    router.push('/passwords');
                }, 1500);
            } else {
                setError(data.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
                        disabled={loading}
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

            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{
                        width: '100%',
                        fontFamily: 'var(--font-tomorrow)',
                        borderRadius: '8px'
                    }}
                >
                    Login successful! Redirecting...
                </Alert>
            </Snackbar>
        </Container>
    );
}