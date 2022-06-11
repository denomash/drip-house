import loadable, { LoadableComponent } from "@loadable/component";
import { ShoppingCart, Cabin, OtherHouses } from "@mui/icons-material";
import SingleOrder from "../Orders/SingleOrder";

const DefaultLayout = loadable(
  () => import(/* webpackPrefetch: true */ "../DefaultLayout")
);

const NewOrder = loadable(
  () => import(/* webpackPrefetch: true */ "../Orders/NewOrder")
);

const Products = loadable(
  () => import(/* webpackPrefetch: true */ "../Products/Products")
);

const ListOrders = loadable(
  () => import(/* webpackPrefetch: true */ "../Orders/ListOrders")
);

export type NavRouteType = {
  title: string;
  path: string;
};

export type RouteType = {
  name: string;
  path: string;
  component: LoadableComponent<any> | any;
  layout: LoadableComponent<any> | any;
  showOnNav: boolean;
  icon: any;
  subRoutes?: NavRouteType[];
};

const ORDERS_LINKS: {
  title: string;
  path: string;
}[] = [
  {
    title: "All Orders",
    path: "/orders/list/all",
  },
  {
    title: "Dispatched Orders",
    path: "/orders/list/dispatched",
  },
  {
    title: "Cancelled Orders",
    path: "/orders/list/cancelled",
  },
  {
    title: "Completed Orders",
    path: "/orders/list/delivered",
  },
];

const ROUTES: RouteType[] = [
  {
    name: "New order",
    path: "/dashboard",
    component: NewOrder,
    showOnNav: true,
    icon: ShoppingCart,
    layout: DefaultLayout,
  },
  {
    name: "Products",
    path: "/products",
    component: Products,
    showOnNav: true,
    icon: OtherHouses,
    layout: DefaultLayout,
  },
  {
    name: "Orders",
    path: "/orders/:orderNumber",
    component: SingleOrder,
    showOnNav: false,
    icon: "",
    layout: DefaultLayout,
  },
  {
    name: "Orders",
    path: "/orders/list/:orderStatus",
    component: ListOrders,
    showOnNav: true,
    icon: Cabin,
    layout: DefaultLayout,
    subRoutes: ORDERS_LINKS,
  },
  {
    name: "Orders",
    path: "/orders/edit/:orderNumber",
    component: NewOrder,
    showOnNav: false,
    icon: "",
    layout: DefaultLayout,
  },
];

export default ROUTES;
