import { FC, MouseEvent, useState } from "react";
import { MoreVert } from "@mui/icons-material";
import {
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Box } from "@mui/system";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    normalBtn: {
      background: "#FFFFFF",
      borderBottom: "1px solid #00000014",

      "&:hover": {
        backgroundColor: "#f2f2f2",
      },
    },
    label: {
      fontWeight: 800,
      fontSize: "0.85rem",
    },
    menuItem: {
      padding: theme.spacing(1),
      marginBottom: theme.spacing(1),
      minWidth: 200,
      borderRadius: 4,
    },

    menuItemNoIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    menuItemWithIcon: {
      display: "grid",
      gridTemplateColumns: "50px 1fr",
    },
    icon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing(2),
    },
  })
);

const ActionsMenu: FC<{ actions: any[]; value: string }> = ({
  actions,
  value,
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton size="small" onClick={handleOpen}>
        <MoreVert />
      </IconButton>

      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {actions.map((action, i) => (
          <Box className={classes.normalBtn} key={`key-${i}`}>
            <MenuItem
              classes={{ root: classes.menuItem }}
              className={
                action.icon ? classes.menuItemWithIcon : classes.menuItemNoIcon
              }
              key={action.label.toString()}
              onClick={() => {
                action.action && action.action(value);
                handleClose();
              }}
              disabled={action.disabled}
            >
              {action.icon ? (
                <span className={classes.icon}>{action.icon()}</span>
              ) : (
                <></>
              )}
              <Typography
                classes={{ root: classes.label }}
                aria-haspopup="true"
                className={classes.label}
              >
                {action.format ? action.format() : action.label || "-"}
              </Typography>
            </MenuItem>
          </Box>
        ))}
      </Menu>
    </div>
  );
};

export default ActionsMenu;
