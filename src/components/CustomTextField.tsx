import { styled, TextField } from '@mui/material';

const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '50vh',
        fontFamily: 'var(--font-tomorrow)',
        backgroundColor: '#FFFFFF',
        background: 'rgba(221, 209, 220, 0.10)',

        '& fieldset': {
            borderColor: '#BD787D',
        },
        '&:hover fieldset': {
            borderColor: '#BD787D',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#BD787D',
        },
        '& input': {
            padding: '16px 24px',
        }
    },
    '& .MuiInputLabel-root': {
        fontFamily: 'var(--font-tomorrow)',
        color: '#BD787D',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '3.2px',
        marginLeft: '12px',
        '&.Mui-focused': {
            color: '#BD787D',
        },
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
            backgroundColor: '#DDD1DC',
            padding: '0 8px',
        },
    },
    '& .MuiInputBase-input': {
        fontFamily: 'var(--font-tomorrow)',
        color: '#BD787D',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '3.2px',
    },
});

export default CustomTextField; 