import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    List,
    ListItem,
    ListItemText,
    Paper,
    InputAdornment,
    IconButton,
    TextField,
    Button
} from '@mui/material';
import { useRouter } from 'next/router';
import PasswordGenerator from '../components/PasswordGenerator';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CustomTitle from 'components/CustomTitle';
import CustomButton from 'components/CustomButton';
import CustomTextField from 'components/CustomTextField';
import Image from 'next/image';
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
                            required
                            sx={{ mb: 2 }}
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
                        <CustomButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ mt: 1 }}
                        >
                            Add Password
                        </CustomButton>
                    </form>
                </Paper>

                <PasswordGenerator onGenerate={handleGeneratedPassword} />

                <List dense>
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