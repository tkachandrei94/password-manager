import React, { useState, useEffect } from 'react';
import {
    Box,
    Slider,
    FormControlLabel,
    Checkbox,
    Typography
} from '@mui/material';
import CustomTextField from './CustomTextField';

interface PasswordGeneratorProps {
    onPasswordGenerate: (password: string) => void;
}

export default function PasswordGenerator({ onPasswordGenerate }: PasswordGeneratorProps) {
    const [length, setLength] = useState(12);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');

    const generatePassword = () => {
        let charset = '';
        let password = '';

        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (charset === '') {
            setIncludeLowercase(true);
            charset = 'abcdefghijklmnopqrstuvwxyz';
        }

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        setGeneratedPassword(password);
        onPasswordGenerate(password);
    };

    useEffect(() => {
        generatePassword();
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography
                sx={{
                    mb: 1,
                    fontFamily: 'var(--font-tomorrow)',
                    color: '#833D3B',
                    letterSpacing: '2px'
                }}
            >
                Password Length: {length}
            </Typography>

            <Slider
                value={length}
                onChange={(_, newValue) => setLength(newValue as number)}
                min={8}
                max={32}
                sx={{
                    color: '#833D3B',
                    '& .MuiSlider-thumb': {
                        backgroundColor: '#833D3B',
                    },
                    '& .MuiSlider-track': {
                        backgroundColor: '#833D3B',
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: '#BD787D',
                    },
                }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={includeUppercase}
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                            sx={{
                                color: '#833D3B',
                                '&.Mui-checked': {
                                    color: '#833D3B',
                                },
                            }}
                        />
                    }
                    label="Uppercase"
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            fontFamily: 'var(--font-tomorrow)',
                            color: '#833D3B',
                            letterSpacing: '2px'
                        }
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={includeLowercase}
                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                            sx={{
                                color: '#833D3B',
                                '&.Mui-checked': {
                                    color: '#833D3B',
                                },
                            }}
                        />
                    }
                    label="Lowercase"
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            fontFamily: 'var(--font-tomorrow)',
                            color: '#833D3B',
                            letterSpacing: '2px'
                        }
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={includeNumbers}
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                            sx={{
                                color: '#833D3B',
                                '&.Mui-checked': {
                                    color: '#833D3B',
                                },
                            }}
                        />
                    }
                    label="Numbers"
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            fontFamily: 'var(--font-tomorrow)',
                            color: '#833D3B',
                            letterSpacing: '2px'
                        }
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={includeSymbols}
                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                            sx={{
                                color: '#833D3B',
                                '&.Mui-checked': {
                                    color: '#833D3B',
                                },
                            }}
                        />
                    }
                    label="Symbols"
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            fontFamily: 'var(--font-tomorrow)',
                            color: '#833D3B',
                            letterSpacing: '2px'
                        }
                    }}
                />
            </Box>

            <CustomTextField
                fullWidth
                value={generatedPassword}
                InputProps={{
                    readOnly: true,
                }}
            />
        </Box>
    );
} 