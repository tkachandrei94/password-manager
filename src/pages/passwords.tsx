import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Button, 
    TextField, 
    List, 
    ListItem, 
    ListItemText,
    Box,
    Paper
} from '@mui/material';
import { useRouter } from 'next/router';

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

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h1">
                        Password Manager
                    </Typography>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>

                <Paper sx={{ p: 1.5, mb: 1.5 }}>
                    <form onSubmit={handleAddPassword}>
                        <TextField
                            label="Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            required
                        />
                        <TextField
                            label="Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            type="password"
                            required
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            size="small"
                            sx={{ mt: 1 }}
                        >
                            Add Password
                        </Button>
                    </form>
                </Paper>

                <List dense>
                    {passwords.map((pwd) => (
                        <ListItem 
                            key={pwd._id}
                            component={Paper}
                            sx={{ mb: 0.5, p: 1 }}
                        >
                            <ListItemText
                                primary={pwd.title}
                                secondary={pwd.password}
                                primaryTypographyProps={{ variant: 'body2' }}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
} 