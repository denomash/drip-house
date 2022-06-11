import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Header from "../Header/Header";
import Login from "../Login";
import PrivateRoute from "./PrivateRoute";

import ROUTES, { RouteType } from "./routesInfo";

type RouteProps = Omit<RouteType, "showOnNav" | "icon">;

export const RouteItem = ({
  path,
  component: Component,
  layout: Layout,
}: RouteProps) => {
  return (
    <Route
      path={path}
      element={
        <Layout>
          <Component />
        </Layout>
      }
    />
  );
};

const NotFound = () => {
  return <div>Page Not Found</div>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        {ROUTES.map(({ path, component: Component, layout: Layout }) => (
          <Route
            key={path}
            element={
              <Layout>
                <PrivateRoute component={Component} />
              </Layout>
            }
            path={path}
          />
        ))}
        {/* // Use it in this way, and it should work: */}
        <Route path="*" element={<PrivateRoute component={NotFound} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
