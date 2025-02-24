import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    List,
    ListItem,
    ListItemText,
    Paper
} from '@mui/material';
import { useRouter } from 'next/router';
import CustomTitle from '../components/CustomTitle';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import Image from 'next/image';
import PasswordGenerator from '../components/PasswordGenerator';

interface Password {
    _id: string;
    title: string;
    password: string;
}

export default function Passwords() {
    const router = useRouter();
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchPasswords();
    }, []);

    const fetchPasswords = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
            const res = await fetch('/api/passwords', { headers });
            if (res.ok) {
                const data = await res.json();
                setPasswords(data);
            }
        } catch (error) {
            console.error('Error fetching passwords:', error);
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
                    title: newTitle,
                    password: newPassword,
                }),
            });

            if (res.ok) {
                setNewTitle('');
                setNewPassword('');
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
        setNewPassword(password);
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
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <PasswordGenerator onPasswordGenerate={handleGeneratedPassword} />
                        <CustomButton
                            type="submit"
                            fullWidth
                        >
                            Add Password
                        </CustomButton>
                    </form>
                </Paper>

                <List>
                    {passwords.map((pwd) => (
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
                        </ListItem>
                    ))}
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