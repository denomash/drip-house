import { FC, useEffect, useState } from "react";
import { Box, Button, Dialog, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useForm } from "react-hook-form";

import TextField from "../TextField";
import {
  ALPHA_NUMERIC_REGEX,
  ALPHA_ONLY_REGEX,
  EMAIL_ADDRESS_REGEX,
  GENERIC_PHONE_NUMBER_REGEX,
} from "../../utils/constants";
import { Close } from "@mui/icons-material";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "#FAFAFA",
      height: "100%",
      padding: theme.spacing(0, 2, 4, 2),
    },
  })
);

interface IUserDetails {
  isOpen: boolean;
  isEdit: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  customer: any;
}

const UserDetails: FC<IUserDetails> = ({
  isOpen,
  onClose,
  onSubmit,
  isEdit,
  customer,
}) => {
  const classes = useStyles();
  const defaultValues = {
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
  };
  const [values, setValues] = useState({
    ...defaultValues,
  });
  const [disabled, setDisabled] = useState(false);

  const { register, errors, handleSubmit } = useForm({ defaultValues });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (isEdit && customer) {
      setValues({
        ...customer,
      });
    }
    setDisabled(false);
  }, [isEdit, customer]);

  const submit = (data: any) => {
    setDisabled(true);
    onSubmit(data);
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
          <Box component="h1">User Details</Box>

          <Close sx={{ fontSize: 26, cursor: "pointer" }} onClick={onClose} />
        </Box>

        <form onSubmit={handleSubmit(submit)}>
          <Box display="flex" flexDirection="column">
            <TextField
              label="Name"
              variant="filled"
              required
              name="name"
              value={values.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              inputRef={register({
                required: "Name is required",
                pattern: {
                  value: ALPHA_ONLY_REGEX,
                  message: "Use a valid name",
                },
              })}
              error={Boolean(errors?.name)}
              helperText={errors?.name?.message}
            />
            <TextField
              label="Phone"
              variant="filled"
              value={values.phone}
              required
              name="phone"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              inputRef={register({
                required: "phone is required",
                pattern: {
                  value: GENERIC_PHONE_NUMBER_REGEX,
                  message: "Use a valid phone address",
                },
              })}
              error={Boolean(errors?.phone)}
              helperText={errors?.phone?.message}
            />
            <TextField
              label="Address"
              variant="filled"
              required
              name="address"
              value={values.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              inputRef={register({
                required: "Address is required",
                pattern: {
                  value: ALPHA_NUMERIC_REGEX,
                  message: "Use a valid address address",
                },
              })}
              error={Boolean(errors?.address)}
              helperText={errors?.address?.message}
            />
            <TextField
              label="Email"
              variant="filled"
              name="email"
              value={values.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              inputRef={register({
                pattern: {
                  value: EMAIL_ADDRESS_REGEX,
                  message: "Use a valid email address",
                },
              })}
              error={Boolean(errors?.email)}
              helperText={errors?.email?.message}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit(submit)}
            disabled={disabled}
          >
            {isEdit ? "Edit" : "Create"} Order
          </Button>
        </form>
      </Box>
    </Dialog>
  );
};

export default UserDetails;
