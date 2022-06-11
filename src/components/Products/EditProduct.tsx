import React, { FC, useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useForm } from "react-hook-form";
import TextField from "../TextField";
import {
  ALPHA_ONLY_REGEX,
  FLOAT_NUMERIC_NUMBERS_REGEX,
  NUMERIC_NUMBERS_REGEX,
  URLS_REGEX,
} from "../../utils/constants";
import { usePutRequest } from "../../hooks/useRequest";
import { useQueryClient } from "react-query";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "#FAFAFA",
      height: "100%",
      padding: theme.spacing(0, 2, 4, 2),
    },
  })
);

interface IEditProduct {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

const EditProduct: FC<IEditProduct> = ({ isOpen, onClose, product }) => {
  const classes = useStyles();

  const defaultValues = {
    name: product?.name || "",
    image: product?.image || "",
    price: product?.price || "",
    quantity: product?.quantity || "",
  };
  const [values, setValues] = useState({
    ...defaultValues,
  });
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (product) {
      setValues({
        ...product,
      });
    }
  }, [product]);

  const { register, errors, handleSubmit } = useForm({ defaultValues });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes("products"),
    });
    onClose();
    setDisabled(false);
  };
  const onFailure = (err: any) => {
    // setError(err);
    setDisabled(false);
    console.log("ORDER CREATION ERROR", err);
  };

  const mutation = usePutRequest(
    `/products/${product?._id}`,
    {
      ...values,
    },
    onSuccess,
    onFailure
  );

  const onSubmit = (data: any) => {
    setDisabled(true);
    mutation.reset();
    mutation.mutate();
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
          <Box component="h1">Edit Product</Box>

          <Close sx={{ fontSize: 26, cursor: "pointer" }} onClick={onClose} />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
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
              label="Product Image"
              variant="filled"
              name="image"
              value={values.image}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              inputRef={register({
                pattern: {
                  value: URLS_REGEX,
                  message: "Enter a valid product image URL",
                },
              })}
              error={Boolean(errors?.image)}
              helperText={errors?.image?.message}
            />
            <TextField
              label="Product Price"
              variant="filled"
              value={values.price}
              required
              name="price"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              inputRef={register({
                required: "Product price is required",
                pattern: {
                  value: FLOAT_NUMERIC_NUMBERS_REGEX,
                  message: "Enter a valid price!",
                },
              })}
              error={Boolean(errors?.price)}
              helperText={errors?.price?.message}
            />
            <TextField
              label="Product Quantity"
              variant="filled"
              required
              name="quantity"
              type="number"
              value={values.quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              inputRef={register({
                required: "Product quantity is required",
                pattern: {
                  value: NUMERIC_NUMBERS_REGEX,
                  message: "Enter a valid quantity",
                },
              })}
              error={Boolean(errors?.quantity)}
              helperText={errors?.quantity?.message}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isLoading || disabled}
          >
            Edit Product
          </Button>
        </form>
      </Box>
    </Dialog>
  );
};

export default EditProduct;
