import { FC, useEffect, useMemo, useState } from "react";
import { Close } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Divider,
  TextField,
  Theme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import useGetProducts from "../../hooks/useGetProducts";
import usePostRequest, { usePutRequest } from "../../hooks/useRequest";
import UserDetails from "./UserDetails";
import LoadingSpinner from "../LoadingSpinner";
import useFetch from "../../hooks/useFetch";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "#FAFAFA",
      height: "100%",
      padding: theme.spacing(0, 4),
    },
    orderContainer: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    },
    itemsContainer: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "calc(100% - 400px)",
    },
    items: {
      display: "flex",
      flexWrap: "wrap",
    },
    item: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2, 0),
      width: 200,
      height: 280,
      background: "#fff",
      boxShadow: "0px 4px 8px 2px rgba(26, 29, 63, 0.1)",
      borderRadius: 4,
      margin: theme.spacing(1),
    },
    image: {
      width: "100%",
      height: 140,
      objectFit: "cover",
      marginBottom: theme.spacing(2),
    },
    info: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2),
    },
    itemName: {
      fontSize: "1.2rem",
      color: "#000000",
      marginBottom: theme.spacing(1),
    },
    price: {
      fontSize: "1.2rem",
      color: "#000000",
      opacity: 0.4,
    },
    order: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: theme.spacing(2, 3),
      minWidth: 376,
      minHeight: 350,
      maxHeight: 678,
      float: "right",
      background: "#FFFFFF",
      boxShadow: "0px 4px 8px 2px rgba(26, 29, 63, 0.1)",
      borderRadius: 8,
    },
    orderItem: {
      display: "flex",
      height: 60,
      marginBottom: theme.spacing(2),
    },
    orderImage: {
      height: 60,
      width: 50,
      objectFit: "cover",
      marginRight: theme.spacing(2),
    },
    amountPrice: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    amount: {
      width: 93,
      "& input": {
        padding: 5,
      },
    },
  })
);

interface Item {
  name: string;
  price: string;
  quantity: number;
  image: string;
  _id: string;
}

const NewOrder: FC = () => {
  const classes = useStyles();
  const [orderItems, setOrderItems] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<Object>({});

  const { isLoading, data } = useGetProducts();

  const { orderNumber } = useParams<{ orderNumber: string }>();

  const { isLoading: loading, data: order } = useFetch(
    `/orders/${orderNumber}`,
    [`order-${orderNumber}`],
    {
      enabled: !!orderNumber,
    }
  );

  useEffect(() => {
    if (orderNumber && order?.result) {
      setOrderItems(order.result.products);
      setUserDetails(order.result.customer);
    }
    // eslint-disable-next-line
  }, [orderNumber, order?.result]);

  const handleAddItem = (item: Item) => {
    const selectedItem = orderItems.find((i) => i.name === item.name);

    if (selectedItem) {
      handleRemoveItem(selectedItem);
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (item: Item) => {
    setOrderItems(orderItems.filter((i) => i.name !== item.name));
  };

  const handleQuantityChange = (item: Item, quantity: number) => {
    setOrderItems(
      orderItems.map((i) => {
        if (i.name === item.name) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const totalPrice = useMemo(
    () =>
      orderItems.reduce((acc, item) => {
        return acc + parseFloat(item.price) * item.quantity;
      }, 0),
    [orderItems]
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSuccess = (data: any) => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes("orders"),
    });
    setOrderItems([]);
    setUserDetails({});
    setIsOpen(false);
    navigate(`/orders/${orderNumber || data?.data?.result?._id}`);
  };
  const onFailure = (err: any) => {
    // setError(err);
    console.log("ORDER CREATION ERROR", err);
  };

  const mutation = usePostRequest(
    "/orders",
    {
      products: orderItems,
      total: totalPrice,
      customer: {
        ...userDetails,
      },
    },
    onSuccess,
    onFailure
  );

  const editMutation = usePutRequest(
    `/orders/${orderNumber}`,
    {
      products: orderItems,
      total: totalPrice,
      customer: {
        ...userDetails,
      },
      ...(orderNumber && {
        payload: {
          event: {
            eventType: "Order Edited",
            eventDescription: `Order #${orderNumber} edited by admin`,
          },
          products: orderItems,
          total: totalPrice,
          customer: {
            ...userDetails,
          },
        },
        type: "ORDER_EDIT",
        orderNumber,
      }),
    },
    onSuccess,
    onFailure
  );

  const onSubmit = async (data: any) => {
    // setError(false);
    setUserDetails(data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (orderNumber) {
      editMutation.reset();
      editMutation.mutate();
      return;
    }
    mutation.reset();
    mutation.mutate();
  };

  const handleClose = () => setIsOpen(false);

  if (isLoading || loading) return <LoadingSpinner />;

  return (
    <>
      <UserDetails
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={onSubmit}
        isEdit={!!orderNumber}
        customer={order?.result?.customer}
      />
      <div className={classes.root}>
        <Box component="h1">{orderNumber ? "Edit" : "New"} Order</Box>

        <Box className={classes.orderContainer}>
          <Box className={classes.itemsContainer}>
            <Box className={classes.items}>
              {data.map((product: Item) => (
                <Box key={product._id} className={classes.item}>
                  <Box display="flex" justifyContent="flex-end">
                    <Checkbox
                      checked={orderItems.some((i) => i._id === product._id)}
                      onClick={() => handleAddItem(product)}
                    />
                  </Box>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={classes.image}
                  />
                  <Box className={classes.info}>
                    <Box component="span" className={classes.itemName}>
                      {product.name}
                    </Box>
                    <Box component="span" className={classes.price}>
                      ${product.price}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Box className={classes.order}>
            <Box>
              <Box component="h3">Selected Items</Box>
              {!orderItems.length && (
                <Alert severity="info">
                  <AlertTitle>No Selected Items</AlertTitle>
                  Select Items to create an — <strong>order!</strong>
                </Alert>
              )}
              {orderItems.map((product, i) => (
                <Box key={i} className={classes.orderItem}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={classes.orderImage}
                  />
                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <span>{product.name}</span>
                      <Close
                        sx={{ fontSize: 14, cursor: "pointer" }}
                        onClick={() => handleRemoveItem(product)}
                      />
                    </Box>
                    <Box className={classes.amountPrice}>
                      <TextField
                        type="number"
                        className={classes.amount}
                        variant="filled"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product,
                            parseInt(e.target.value || "0")
                          )
                        }
                      />
                      <span>${product.price}</span>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Divider />
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box component="h3">Total</Box>
                <Box fontWeight={600}>$ {totalPrice}</Box>
              </Box>
            </Box>

            {!!orderItems.length && (
              <Button variant="contained" onClick={() => setIsOpen(true)}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </div>
    </>
  );
};

export default NewOrder;
