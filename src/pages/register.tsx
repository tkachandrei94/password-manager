import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { useRouter } from 'next/router';
import CustomTitle from 'components/CustomTitle';
import CustomTextField from 'components/CustomTextField';
import CustomButton from 'components/CustomButton';
import CustomLink from 'components/CustomLink';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                router.push('/passwords');
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 12 }}>
            <Box sx={{ mt: 4 }}>
                <CustomTitle>
                    Register
                </CustomTitle>
                <form onSubmit={handleRegister}>
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
                        Register
                    </CustomButton>
                </form>
                <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <CustomLink href="/login">
                        Already have an account? Login
                    </CustomLink>
                </Box>
            </Box>
        </Container>
    );
} 