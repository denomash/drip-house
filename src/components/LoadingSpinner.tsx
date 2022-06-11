import { CircularProgress, Slide, Snackbar, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: '#3a3a3a50',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: theme.zIndex.snackbar + theme.zIndex.tooltip,
    },
  }),
);

interface LoaderProps {
  color?: 'primary' | 'secondary';
}
const LoadingSpinner: React.FC<LoaderProps> = ({
  color = 'secondary',
}: LoaderProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress color={color} />
    </div>
  );
};

LoadingSpinner.defaultProps = {
  color: 'secondary',
};

interface RefreshingCardProps {
  message?: string;
}

export const RefreshingCard: React.FC<RefreshingCardProps> = ({
  message,
}: RefreshingCardProps) => (
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    open
    autoHideDuration={6000}
    TransitionComponent={Slide}
    onClose={() => {}}
    message={message}
  />
);

RefreshingCard.defaultProps = {
  message: 'Refreshing ...',
};

export default LoadingSpinner;
