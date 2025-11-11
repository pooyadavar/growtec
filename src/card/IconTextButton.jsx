import React from 'react';
import { ButtonBase, Paper, Typography, Box } from '@mui/material';

const IconTextButton = ({
  icon,
  text,
  bgColor = '#fff',
  textColor = '#333',
  onClick,
  // --- ورودی‌های جدید با مقادیر پیش‌فرض (اختیاری) ---
  width = 'auto', // عرض
  height = 'auto', // ارتفاع
  iconPosition = 'left', // موقعیت آیکون
  borderColor, // رنگ کادر (پیش‌فرض undefined)
  sx = {} // استایل‌های اضافی
}) => {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        // --- عرض و ارتفاع اینجا اعمال شد ---
        width: width,
        height: height,
        borderRadius: '10px',
        display: 'inline-block',
        ...sx, // اعمال sx سفارشی
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: '10px',
          padding: '12px 16px', // پدینگ داخلی
          display: 'flex',
          alignItems: 'center',
          // --- اینها برای چیدمان صحیح اضافه شدند ---
          justifyContent: 'space-between', // متن و آیکون را جدا می‌کند
          flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row', // موقعیت آیکون
          gap: 1,
          width: '100%', // Paper کل ButtonBase را پر می‌کند
          height: '100%', // Paper کل ButtonBase را پر می‌کند
          border: borderColor ? `1px solid ${borderColor}` : 'none', // اعمال کادر (اختیاری)
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 3px 10px 5px',
          transition: 'filter 0.2s ease',
          '&:hover': { filter: 'brightness(0.95)' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {typeof icon === 'string' ? (
            <img src={icon} alt={text} style={{ width: 24, height: 24 }} />
          ) : (
            icon // اجازه می‌دهد آیکون‌های JSX (مثل MUI) هم پاس داده شوند
          )}
        </Box>
        <Typography
          fontFamily="IRANSANS"
          fontSize="16px" // اندازه فونت برای خوانایی
          fontWeight="bold"
          sx={{
            flexGrow: 1, // متن فضای خالی را پر می‌کند
            textAlign: 'center', // متن در مرکز قرار می‌گیرد
          }}
        >
          {text}
        </Typography>
      </Paper>
    </ButtonBase>
  );
};

export default IconTextButton;