import React from 'react';
import { ButtonBase, Paper, Typography, Box } from '@mui/material';

const IconTextButton = ({
  icon,
  text,
  bgColor = '#fff',
  textColor = '#333',
  onClick
}) => {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        borderRadius: '10px',
        display: 'inline-block',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 1,
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 3px 10px 5px',
          transition: 'filter 0.2s ease',
          '&:hover': { filter: 'brightness(0.95)' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {typeof icon === 'string' ? (
            <img src={icon} alt={text} style={{ width: 24, height: 24 }} />
          ) : (
            icon
          )}
        </Box>
        <Typography fontFamily="IRANSANS" fontSize="0.8rem" fontWeight="bold">
          {text}
        </Typography>
      </Paper>
    </ButtonBase>
  );
};

export default IconTextButton;
