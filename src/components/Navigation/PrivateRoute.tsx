import React, { FC } from "react";
import { LoadableComponent } from "@loadable/component";
import { Navigate } from "react-router-dom";

const PrivateRoute: FC<{
  component: LoadableComponent<any> | any;
}> = ({ component: Component }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate replace to="/login" />;
  }
  return <Component />;
};

export default PrivateRoute;
