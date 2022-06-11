import {
  Cancel,
  CheckCircle,
  Edit,
  LocalShipping,
  Preview,
} from "@mui/icons-material";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { ReactNode, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { formatAsLocalDateTime } from "../../utils/formatDates";
import ActionsMenu from "../ActionsMenu";
import EntityStatus from "../EntityStatus";
import LoadingSpinner, { RefreshingCard } from "../LoadingSpinner";
import TableLink from "../TableLink";
import OrderEvents from "./OrderEvents";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "#FAFAFA",
      height: "99%",
      padding: theme.spacing(0, 4),
    },
    paper: {
      width: "99%",
      border: `none !important`,
      boxShadow: "0px 1px 2px rgba(26, 29, 63, 0.1) !important",
      borderRadius: `20px !important`,
      padding: 14,
    },
    container: {
      maxHeight: 550,
    },
    cell: {
      fontSize: "0.8rem !important",
      color: `${theme.palette.text.secondary} !important`,
    },
    headerCell: {
      fontSize: "0.9rem !important",
      fontWeight: `900 !important`,
    },
  })
);

interface Order {
  _id: string;
  status: string;
  total: string;
  created_at: string;
  customerName: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  events: any[];
  driver?: {
    name: string;
    phone: string;
    car_make: string;
    car_identity: string;
  };
}

interface Column {
  name: string;
  id: string;
  align?: "left" | "right" | "inherit" | "center" | "justify" | undefined;
  format?: (value: any, row?: any) => ReactNode | string | undefined;
}
const ListOrders = () => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [orderToEdit, setOrderToEdit] = useState<boolean | Object>(false);
  const [updateType, setUpdateType] = useState<string>("");
  const navigate = useNavigate();
  const { orderStatus } = useParams();

  const { isLoading, isRefreshing, data } = useFetch("/orders", ["orders"]);

  const isCancelled = (order: Order) =>
    !["delivered", "cancelled"].includes(order.status);

  const actions = [
    {
      label: "Add Event",
      action: (order: any) => {
        setOrderToEdit(order);
        setIsOpen(true);
        setUpdateType("ADD_EVENT");
      },
      icon: () => <LocalShipping />,
    },
    {
      label: "View Events",
      action: (order: any) => navigate(`/orders/${order.orderNumber}`),
      icon: () => <Preview />,
    },
    {
      label: "Edit Order",
      action: (order: any) => navigate(`/orders/edit/${order.orderNumber}`),
      icon: () => <Edit />,
    },
    {
      label: "Cancel Order",
      format: () => <Typography sx={{ color: "red" }}>Cancel Order</Typography>,
      action: (order: any) => {
        setUpdateType("CANCEL_ORDER");
        setOrderToEdit(order);
        setIsOpen(true);
      },
      icon: () => <Cancel sx={{ color: "red" }} />,
    },
    {
      label: "Complete Order",
      format: () => (
        <Typography sx={{ color: "green" }}>Complete Order</Typography>
      ),
      action: (order: any) => {
        setOrderToEdit(order);
        setUpdateType("COMPLETE_ORDER");
        setIsOpen(true);
      },
      icon: () => <CheckCircle sx={{ color: "green" }} />,
    },
  ];

  const columns: Column[] = [
    {
      name: "Order Number",
      id: "orderNumber",
      align: "left",
      format: (value: string) => (
        <TableLink
          path={`/orders/${value}`}
          style={{ textTransform: "uppercase" }}
        >
          {value}
        </TableLink>
      ),
    },
    {
      name: "View Events",
      id: "events",
      align: "left",
      format: (value: string, row: any) => (
        <TableLink path={`/orders/${row.orderNumber}`}>View Events</TableLink>
      ),
    },
    { name: "Customer", id: "customerName" },
    {
      name: "Status",
      id: "status",
      format: (value: string) => <EntityStatus status={value} />,
    },
    {
      name: "Order Amount",
      id: "orderAmount",
      format: (value) => `$ ${value}`,
    },
    {
      name: "Created On",
      id: "createdOn",
      format: (value: any) => formatAsLocalDateTime(value),
    },
    {
      name: "Actions",
      id: "actions",
      format: (value: any, row: any) =>
        isCancelled(row) ? <ActionsMenu actions={actions} value={row} /> : "-",
    },
  ];

  const rows = (data || [])
    .filter((item: Order) => {
      if (orderStatus !== "all") {
        return item.status === orderStatus;
      }
      return true;
    })
    .map((order: Order) => {
      return {
        orderNumber: order._id,
        customerName: order?.customer?.name || "",
        customer: order?.customer || {},
        status: order.status,
        orderAmount: order.total,
        createdOn: order.created_at,
        events: order.events,
        custodian: order?.driver,
      };
    });

  if (isLoading) return <LoadingSpinner />;

  const onClose = () => {
    setIsOpen(false);
    setOrderToEdit(false);
  };

  return (
    <div className={classes.root}>
      {isRefreshing ? <RefreshingCard message="Refreshing orders" /> : <></>}
      <OrderEvents
        isOpen={isOpen}
        onClose={onClose}
        order={orderToEdit}
        updateType={updateType}
      />

      <Box component="h1">Orders</Box>

      <Paper className={classes.paper}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    classes={{ root: classes.headerCell }}
                    key={index}
                    align={column.align || "left"}
                  >
                    {column.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any, index: number) => {
                return (
                  <TableRow key={index}>
                    {columns.map((column, index) => {
                      const value = row[column.id];

                      return (
                        <TableCell
                          className={classes.cell}
                          key={index}
                          align={column.align || "left"}
                        >
                          {column.format
                            ? column.format(value, row)
                            : value || "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default ListOrders;
