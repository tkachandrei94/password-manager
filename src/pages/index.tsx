import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, CircularProgress, Box } from '@mui/material';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        router.push(token ? '/passwords' : '/login');
    }, [router]);

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