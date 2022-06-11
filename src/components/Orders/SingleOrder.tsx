import {
  Box,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Theme,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Badge, Home, LocalShipping, PhoneIphone } from "@mui/icons-material";

import EntityStatus from "../EntityStatus";
import { FC } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import LoadingSpinner, { RefreshingCard } from "../LoadingSpinner";
import { formatAsLocalDateTime } from "../../utils/formatDates";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "#FAFAFA",
      height: "95%",
      padding: theme.spacing(0, 4),
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    detailContainer: {
      display: "flex",
      alignItems: "flex-start",
      padding: 24,
      background: "#FFFFFF",
      boxShadow: "0px 1px 2px rgba(26, 29, 63, 0.1)",
      borderRadius: 20,
      minHeight: 200,
    },
    info: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(1),
    },
    icon: {
      marginRight: 8,
    },
    orderInfo: {
      display: "flex",
      justifyContent: "space-evenly",
      width: "100%",
    },
  })
);

interface DetailProps {
  classes: any;
  title: string;
  name: string;
  phone: string;
  address?: string;
  plateNumber?: string;
}

const Details: FC<DetailProps> = ({
  classes,
  title,
  name,
  phone,
  address,
  plateNumber,
}) => (
  <Box display="flex" flexDirection="column">
    <Box component="h3">{title}</Box>

    <Box className={classes.info}>
      <Badge className={classes.icon} /> <span>{name}</span>
    </Box>

    <Box className={classes.info}>
      <PhoneIphone className={classes.icon} /> <span>{phone}</span>
    </Box>

    {address && (
      <Box className={classes.info}>
        <Home className={classes.icon} /> <span>{address}</span>
      </Box>
    )}

    {plateNumber && (
      <Box className={classes.info}>
        <LocalShipping className={classes.icon} /> <span>{plateNumber}</span>
      </Box>
    )}
  </Box>
);

const SingleOrder = () => {
  const classes = useStyles();

  const { orderNumber } = useParams<{ orderNumber: string }>();

  const { isLoading, isRefreshing, data } = useFetch(`/orders/${orderNumber}`, [
    `order-${orderNumber}`,
  ]);

  if (isLoading) return <LoadingSpinner />;

  const customer = data?.result?.customer;
  const driver = data?.result?.driver;
  const logs = data?.result?.events;

  const eventTypes: any = {
    ORDER_PLACED: "Order Placed",
  };

  return (
    <div className={classes.root}>
      {isRefreshing ? <RefreshingCard message="Refreshing order" /> : <></>}

      <Box className={classes.header}>
        <Box display="flex" alignItems="center">
          <Box component="h1">Order#</Box>
          <Box
            fontSize="34px"
            marginLeft="16px"
            color="#484A65"
            textTransform={"uppercase"}
          >
            {" "}
            {orderNumber}
          </Box>
        </Box>

        <EntityStatus status={data?.result?.status} />
      </Box>

      <Box marginTop="16px" className={classes.detailContainer}>
        <Box className={classes.orderInfo}>
          <Box>
            <Details
              classes={classes}
              title="Customer Details"
              name={customer.name}
              phone={customer.phone}
              address={customer.address}
            />

            {driver && (
              <Details
                classes={classes}
                title="Driver Details"
                name={driver.name}
                phone={driver.phone}
                plateNumber={driver.plateNumber}
              />
            )}
          </Box>
          <Divider
            orientation="vertical"
            sx={{ margin: "0px 20px" }}
            flexItem
          />
          <Box>
            <Box component="h3">Activity Log</Box>
            <Stepper activeStep={logs.length} orientation="vertical">
              {logs.map((log: any, index: number) => (
                <Step key={index}>
                  <StepLabel
                    optional={
                      <Box>
                        <Box>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: log.eventMessage || log.eventDescription,
                            }}
                          />
                        </Box>
                        <Typography variant="caption">
                          {formatAsLocalDateTime(log.timestamp)}
                        </Typography>
                      </Box>
                    }
                  >
                    <Box fontWeight={600} fontSize="18px">
                      {eventTypes[log.eventType] || log.eventType}
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default SingleOrder;
