import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: "0.8rem",
      color: "#484A65",
      textDecoration: "none",
      borderBottom: `1px solid #484A65`,
      
      "&:hover": {
        borderBottom: `1px solid #484A65`,
      },
    },
  })
);

type Props = {
  path: string;
  children: ReactNode | ReactNode[];
  style?: any;
};

const TableLink: React.FC<Props> = ({ path, children, style }: Props) => {
  const classes = useStyles();
  return (
    <NavLink className={classes.root} style={style} to={path}>
      {children}
    </NavLink>
  );
};

TableLink.defaultProps = {
  style: undefined,
};

export default TableLink;
