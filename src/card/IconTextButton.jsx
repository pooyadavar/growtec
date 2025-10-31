import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

/**
 * کامپوننت دکمه سفارشی با آیکون در چپ و متن در راست
 * @param {object} props
 * @param {string | React.ReactNode} props.icon - آدرس عکس یا کامپوننت آیکون
 * @param {string} props.text - متن دکمه
 * @param {string} [props.bgColor] - رنگ پس‌زمینه دکمه (اختیاری)
 * @param {string} [props.textColor] - رنگ متن دکمه (اختیاری)
 * @param {function} props.onClick - تابعی که هنگام کلیک اجرا می‌شود
 */
const IconTextButton = ({ 
  icon,
  text,
  bgColor = '#fff',     // رنگ پس‌زمینه پیش‌فرض
  textColor = '#333',  // رنگ متن پیش‌فرض
  onClick 
}) => {

  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '10px',
        padding: '12px 16px', // پدینگ مناسب
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // چیدمان از چپ به راست
        gap: 1, // فاصله بین آیکون و متن
        cursor: 'pointer',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 3px 10px 5px', // سایه ملایم‌تر
        transition: 'filter 0.2s ease',
        '&:hover': {
          filter: 'brightness(0.95)', // افکت هاور ساده
        },
      }}
    >
      {/* بخش آیکون (سمت چپ) */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {typeof icon === 'string' ? (
          <img 
            src={icon} 
            alt={text} 
            style={{ width: '24px', height: '24px', display: 'block' }} 
          />
        ) : (
          icon // اگر آیکون یک کامپوننت React (مثل <InfoIcon />) باشد
        )}
      </Box>

      {/* بخش متن (سمت راست) */}
      <Typography 
        fontFamily={"IRANSANS"} 
        variant="body1" 
        sx={{ 
          fontWeight: 'bold', 
          fontSize: '0.7rem',
          lineHeight: 1.2
        }}
      >
        {text}
      </Typography>
    </Paper>
  );
};

export default IconTextButton;
