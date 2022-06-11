import { FiberManualRecordRounded } from "@mui/icons-material";
import { Box, Chip, Theme, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    chipContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    statusDot: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      borderRadius: "50%",
    },
    statusText: {
      textTransform: "uppercase",
      fontSize: "0.95em",
      color: "#484A65 !important",
    },
    info: {
      color: "#1A1D3F !important",
      backgroundColor: "#DBDDF8 !important",
    },
    complete: {
      color: "#41A15E !important",
      backgroundColor: "rgba(65, 161, 94, 0.08) !important",
    },
    neutral: {
      color: "#F1A40F !important",
      backgroundColor: "rgba(241, 164, 15, 0.13) !important",
    },
  })
);

type Props = {
  status: string;
};
const EntityStatus: React.FC<Props> = ({ status }: Props) => {
  const classes = useStyles();
  const getStatusAndClassName = (): any[] => {
    if (!status) status = ""; // failsafe. Sometimes status is null :/

    switch (status.toLowerCase()) {
      case "dispatched":
        return [status.toLowerCase(), classes.info];

      case "complete":
      case "delivered":
        return [status.toLowerCase(), classes.complete];

      case "cancelled":
      case "pending":
        return [status.toLowerCase(), classes.neutral];

      default:
        return [status.toLowerCase(), classes.neutral];
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.chipContainer}>
        <Chip
          size={"small"}
          icon={
            <FiberManualRecordRounded
              classes={{ root: classes.statusDot }}
              className={getStatusAndClassName()[1]}
            />
          }
          label={
            <Typography
              style={{ fontSize: "12px" }}
              className={classes.statusText}
            >
              {getStatusAndClassName()[0]}
            </Typography>
          }
          className={getStatusAndClassName()[1]}
        />
      </Box>
    </Box>
  );
};

export default EntityStatus;
