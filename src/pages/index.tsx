import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, CircularProgress, Box } from '@mui/material';

export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            router.push(token ? '/passwords' : '/login');
        } catch (error) {
            console.error('Помилка перевірки токена:', error);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    if (!isLoading) return null;

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress />
            </Box>
        </Container>
    );
} 