import { ListItem, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      height: '34px',
      alignItems: 'center',
      top: '10px',
    },
    textItem: {
      textTransform: 'capitalize',
      textDecoration: 'none',
      color: '#1A1D3F',
      top: '10px',
    },
    active: {
      color: theme.palette.grey[500],
      fontWeight: 'bold',
      top: '10px',
    },
  }),
);

type Props = {
  title: string;
  path: string;
};
const Navigation: React.FC<Props> = ({
  title,
  path,
}: Props) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const isActive = (routePath: string) =>
    location.pathname.startsWith(routePath);
  const handleOnclick = () => {
    history(path);
  };

  return (
    <>
      <ListItem
        button
        key={path}
        onClick={() => handleOnclick()}
        className={isActive(path) ? classes.active : classes.listItem}
      >
        <Link to={path} className={classes.textItem}>
          {title}
        </Link>
      </ListItem>
    </>
  );
};

export default Navigation;
