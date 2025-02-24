import { styled, Button } from '@mui/material';

const CustomButton = styled(Button)({
    borderRadius: '50px',
    background: '#833D3B',
    color: '#8F8483',
    fontFamily: 'var(--font-tomorrow)',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '3.2px',
    padding: '10px 30px',
    textTransform: 'none', // щоб текст не був у верхньому регістрі
    '&:hover': {
        background: '#6D3230', // трохи темніший при наведенні
    },
    '&:disabled': {
        background: '#B38D8C',
        color: '#A99E9D',
    }
});

export default CustomButton; 