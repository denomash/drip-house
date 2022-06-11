import { FC, useState } from "react";

import { Box, Button, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import useGetProducts from "../../hooks/useGetProducts";
import LoadingSpinner, { RefreshingCard } from "../LoadingSpinner";
import EditProduct from "./EditProduct";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "#FAFAFA",
      height: "100%",
      padding: theme.spacing(0, 4),
    },
    productsContainer: {
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
      paddingBottom: theme.spacing(1),
      width: 200,
      minHeight: 280,
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
    actions: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "auto",
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [product, setProduct] = useState<Object | boolean>(false);

  const { isLoading, isRefreshing, data } = useGetProducts();

  if (isLoading) return <LoadingSpinner />;

  const handleClose = () => setIsOpen(false);
  const handleEdit = (item: Item) => {
    setProduct(item);
    setIsOpen(true);
  };

  return (
    <div className={classes.root}>
      {isRefreshing ? <RefreshingCard message="Refreshing products" /> : <></>}
      <EditProduct isOpen={isOpen} onClose={handleClose} product={product} />
      <Box component="h1">Products</Box>

      <Box className={classes.productsContainer}>
        <Box className={classes.items}>
          {data.map((product: Item) => (
            <Box key={product._id} className={classes.item}>
              <Box display="flex" justifyContent="flex-end"></Box>
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  paddingTop="10px"
                  fontWeight={500}
                >
                  <span>Stock Level:</span>
                  <span>{product.quantity} pcs</span>
                </Box>
              </Box>

              <Box className={classes.actions}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default NewOrder;
