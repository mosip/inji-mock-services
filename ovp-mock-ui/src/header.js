// src/components/Header.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 3, 
        py: 2, 
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <img
        alt="Inji Logo"
        src="https://docs.inji.io/~gitbook/image?url=https%3A%2F%2F1053354434-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252F-M1FyzBr-VmticWYm8QI%252Fsites%252Fsite_lJtL3%252Ficon%252FMPmBNxM36mUHTgZSaBWj%252Finji_docs_logo.png%3Falt%3Dmedia%26token%3Dd384b8d8-f4e3-4994-9437-ff7195d79316&width=32&dpr=2&quality=100&sign=81a11538&sv=2"
        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
      />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Inji
      </Typography>
    </Box>
  );
};

export default Header;
