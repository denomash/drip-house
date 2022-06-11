import { FC, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Theme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import TextField from "../TextField";
import { ALPHA_NUMERIC_REGEX, ALPHA_ONLY_REGEX } from "../../utils/constants";
import useFetch from "../../hooks/useFetch";
import { usePutRequest } from "../../hooks/useRequest";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "#FAFAFA",
      height: "100%",
      padding: theme.spacing(0, 2, 4, 2),
    },
    autoCompleteRoot: {
      width: "100% !important",
    },
    cancelBtn: {
      backgroundColor: "#F44336 !important",

      "&:hover": {
        backgroundColor: "#D32F2F !important",
      },
    },
    completeBtn: {
      backgroundColor: "#4CAF50 !important",

      "&:hover": {
        backgroundColor: "#388E3C !important",
      },
    },
    button: {},
  })
);

interface IOrderEvents {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  updateType: string;
}

const OrderEvents: FC<IOrderEvents> = ({
  isOpen,
  onClose,
  order,
  updateType,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const defaultValues: any = {
    driver: {},
    location: "",
    eventType: "",
  };
  const [values, setValues] = useState({
    ...defaultValues,
  });

  const { isLoading, data } = useFetch("/drivers", [order]);

  const { register, errors, handleSubmit } = useForm();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (order.custodian) setValues({ ...values, driver: order.custodian });
    // eslint-disable-next-line
  }, [order.custodian]);

  const events: any = {
    ASSIGNED: (driver: any, location: string) => ({
      eventType: "Order Assigned and Dispatched",
      eventDescription: `Order has been assigned to <strong>${driver.name}(${driver.car_identity})</strong> and dispatched from <strong>${location}</strong>`,
    }),
    UPDATE: (driver: any, location: string) => ({
      eventType: "Order Delivery Update",
      eventDescription: `Order custodian <strong>${driver.name}(${driver.car_identity})</strong>, current location <strong>${location}</strong>`,
    }),
    DELIVERED: (driver: any, location: string) => ({
      eventType: "Order Delivered",
      eventDescription: `Order has been delivered to <strong>${order.customer.name}</strong> at  <strong>${order.customer.address}</strong> by <strong>${driver.name}(${driver.car_identity})</strong>`,
    }),
    CANCELLED: (driver: any, location: string) => ({
      eventType: "Order Cancelled",
      eventDescription: `Order has been cancelled by admin`,
    }),
  };

  const getClassName = () => {
    switch (updateType) {
      case "CANCEL_ORDER":
        return classes.cancelBtn;
      case "COMPLETE_ORDER":
        return classes.completeBtn;

      default:
        return classes.button;
    }
  };

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes("orders"),
    });
    setOpen(false);
    setValues({ ...defaultValues });
    onClose();
  };
  const onFailure = (err: any) => {
    // setError(err);
    console.log("ORDER EVENT ERROR", err);
  };

  const mutation = usePutRequest(
    `/orders/${order.orderNumber}`,
    {
      type: values.eventType,
      orderNumber: order.orderNumber,
      payload: {
        event: {
          ...(values.eventType &&
            events[values.eventType](values.driver, values.location)),
        },
        driver: values.driver,
        location: values.location,
      },
    },
    onSuccess,
    onFailure
  );

  const onSubmit = async () => {
    !values.driver.name && delete values.driver.name;

    if (!order.custodian && updateType === "ADD_EVENT") {
      setValues({ ...values, eventType: "ASSIGNED" });
    } else if (updateType === "CANCEL_ORDER") {
      setValues({ ...values, eventType: "CANCELLED" });
    } else if (updateType === "COMPLETE_ORDER") {
      setValues({ ...values, eventType: "DELIVERED" });
    } else {
      setValues({ ...values, eventType: "UPDATE" });
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    mutation.reset();
    mutation.mutate();
  };

  const handleClose = () => {
    setValues({ ...defaultValues });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      fullWidth
    >
      <Box className={classes.root}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box component="h1">
            {updateType === "ADD_EVENT"
              ? order.custodian
                ? "Update Order Delivery Info"
                : "Assign and Dispatch Order"
              : ""}
            {updateType === "CANCEL_ORDER" && "Cancel Order"}
            {updateType === "COMPLETE_ORDER" && "Mark Order as Delivered"}
          </Box>

          <Close
            sx={{ fontSize: 26, cursor: "pointer" }}
            onClick={handleClose}
          />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {updateType === "ADD_EVENT" && (
            <Box display="flex" flexDirection="column">
              <Autocomplete
                id="drivers"
                sx={{ width: 300 }}
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.name === value.name
                }
                getOptionLabel={(option: any) => option?.name || ""}
                options={data || []}
                loading={isLoading}
                classes={{
                  root: classes.autoCompleteRoot,
                }}
                onChange={(event: any, value: any) => {
                  setValues({ ...values, driver: value });
                }}
                value={values.driver}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Driver"
                    variant="filled"
                    required
                    name="driver"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e)
                    }
                    inputRef={register({
                      required: "Driver is required!",
                      pattern: {
                        value: ALPHA_ONLY_REGEX,
                        message: "Use a valid driver name",
                      },
                    })}
                    error={Boolean(errors?.driver)}
                    helperText={errors?.driver?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                label="Location"
                variant="filled"
                required
                name="location"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                inputRef={register({
                  required: "Location is required!",
                  pattern: {
                    value: ALPHA_NUMERIC_REGEX,
                    message: "Use a valid location",
                  },
                })}
                error={Boolean(errors?.location)}
                helperText={errors?.location?.message}
              />
            </Box>
          )}

          {(updateType === "CANCEL_ORDER" ||
            updateType === "COMPLETE_ORDER") && (
            <Box display="flex" flexDirection="column">
              <TextField
                label="Reason"
                variant="filled"
                required
                name="location"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
              />
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isLoading}
            className={getClassName()}
          >
            {updateType === "ADD_EVENT"
              ? order.custodian
                ? "Update"
                : "Assign and Dispatch"
              : ""}
            {updateType === "CANCEL_ORDER" && "Cancel Order"}
            {updateType === "COMPLETE_ORDER" && "Mark Coplete"}
          </Button>
        </form>
      </Box>
    </Dialog>
  );
};

export default OrderEvents;
