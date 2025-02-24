import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Slider, 
  TextField,
  Typography 
} from '@mui/material';
import { generatePassword, PasswordOptions } from '../utils/passwordGenerator';

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
}

export default function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false
  });

  const handleGenerate = () => {
    const password = generatePassword(options);
    onGenerate(password);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Генератор паролю</Typography>
      
      <Box sx={{ my: 2 }}>
        <Typography>Довжина: {options.length}</Typography>
        <Slider
          value={options.length}
          min={8}
          max={32}
          onChange={(_, value) => setOptions({ ...options, length: value as number })}
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={options.includeUppercase}
              onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
            />
          }
          label="Великі літери"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={options.includeLowercase}
              onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
            />
          }
          label="Малі літери"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={options.includeNumbers}
              onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
            />
          }
          label="Цифри"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={options.includeSymbols}
              onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
            />
          }
          label="Спеціальні символи"
        />
      </Box>

      <Button 
        variant="contained" 
        onClick={handleGenerate}
        sx={{ mt: 2 }}
      >
        Згенерувати пароль
      </Button>
    </Box>
  );
} 