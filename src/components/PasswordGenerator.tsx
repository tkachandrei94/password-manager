import React from 'react';
import {
  Box,
  Slider,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper
} from '@mui/material';
import CustomButton from './CustomButton';

interface PasswordGeneratorProps {
  passwordLength: number;
  setPasswordLength: (length: number) => void;
  includeLowercase: boolean;
  setIncludeLowercase: (include: boolean) => void;
  includeUppercase: boolean;
  setIncludeUppercase: (include: boolean) => void;
  includeNumbers: boolean;
  setIncludeNumbers: (include: boolean) => void;
  includeSymbols: boolean;
  setIncludeSymbols: (include: boolean) => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  passwordLength,
  setPasswordLength,
  includeLowercase,
  setIncludeLowercase,
  includeUppercase,
  setIncludeUppercase,
  includeNumbers,
  setIncludeNumbers,
  includeSymbols,
  setIncludeSymbols,
}) => {
  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ px: 1 }}>
          <Slider
            value={passwordLength}
            onChange={(_, value) => setPasswordLength(value as number)}
            min={6}
            max={32}
            valueLabelDisplay="on"
            valueLabelFormat={(value) => `${value}`}
            sx={{
              color: '#BD787D',
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(189, 120, 125, 0.16)',
                },
              },
              '& .MuiSlider-valueLabel': {
                backgroundColor: '#BD787D',
                fontFamily: 'var(--font-tomorrow)',
                fontSize: '14px',
                padding: '2px 6px',
                borderRadius: '4px',
              },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            mb: 1,
            fontFamily: 'var(--font-tomorrow)',
            color: '#833D3B'
          }}
        >
          Include:
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              sx={{
                color: '#BD787D',
                '&.Mui-checked': {
                  color: '#BD787D',
                },
              }}
            />
          }
          label="Lowercase letters (a-z)"
          sx={{
            '& .MuiFormControlLabel-label': {
              fontFamily: 'var(--font-tomorrow)',
              color: '#833D3B'
            }
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              sx={{
                color: '#BD787D',
                '&.Mui-checked': {
                  color: '#BD787D',
                },
              }}
            />
          }
          label="Uppercase letters (A-Z)"
          sx={{
            '& .MuiFormControlLabel-label': {
              fontFamily: 'var(--font-tomorrow)',
              color: '#833D3B'
            }
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
                />
              }
              label="Numbers"
              sx={{
                color: '#BD787D',
                '&.Mui-checked': {
                  color: '#BD787D',
                },
              }}
            />
          }
          label="Numbers (0-9)"
          sx={{
            '& .MuiFormControlLabel-label': {
              fontFamily: 'var(--font-tomorrow)',
              color: '#833D3B'
            }
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              sx={{
                color: '#BD787D',
                '&.Mui-checked': {
                  color: '#BD787D',
                },
              }}
            />
          }
          label="Symbols (!@#$%^&*)"
          sx={{
            '& .MuiFormControlLabel-label': {
              fontFamily: 'var(--font-tomorrow)',
              color: '#833D3B'
            }
          }}
        />
      </Box>
    </div>
  );
};

export default PasswordGenerator; 