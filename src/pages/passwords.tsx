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
    Paper,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useRouter } from 'next/router';
import PasswordGenerator from '../components/PasswordGenerator';
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
    const [visiblePasswords, setVisiblePasswords] = useState<{[key: string]: boolean}>({});

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
                            value={newPassword.title}
                            onChange={(e) => setNewPassword({ ...newPassword, title: e.target.value })}
                            fullWidth
                            margin="dense"
                            size="small"
                            required
                        />
                        <TextField
                            label="Password"
                            value={newPassword.password}
                            onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                            fullWidth
                            margin="dense"
                            size="small"
                            type={showNewPassword ? "text" : "password"}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
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

                <PasswordGenerator onGenerate={handleGeneratedPassword} />

                <List dense>
                    {passwords.map((pwd) => (
                        <ListItem 
                            key={pwd._id}
                            component={Paper}
                            sx={{ mb: 0.5, p: 1 }}
                        >
                            <ListItemText
                                primary={pwd.title}
                                secondary={visiblePasswords[pwd._id] ? pwd.password : '••••••••'}
                                primaryTypographyProps={{ variant: 'body2' }}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                            <IconButton 
                                edge="end" 
                                onClick={() => togglePasswordVisibility(pwd._id)}
                            >
                                {visiblePasswords[pwd._id] ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
} 