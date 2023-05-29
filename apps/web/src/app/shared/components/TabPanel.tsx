import { Box } from '@mui/material';
import React from 'react';

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ height: 'calc(100% - 48px)' }} p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};
