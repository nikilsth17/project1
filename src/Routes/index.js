import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from "./AuthProtected";

const Index = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
            />
          ))}
          <Route path="*" element={<Navigate to="/login" />} />
        </Route>

        <Route>
          {authProtectedRoutes.map((route, idx) => {
            // console.log("🚀 ~ {authProtectedRoutes.map ~ route:", route);
            return (
              <Route
                path={route.path}
                element={
                  <AuthProtected>
                    {route.path === "/admin-docs-viewer/:id" ? (
                      <NonAuthLayout>{route.component}</NonAuthLayout>
                    ) : route.path === "/customer-docs-viewer/:id" ? (
                      <NonAuthLayout>{route.component}</NonAuthLayout>
                    ) : route.path === "/manifest-docs-viewer/:id" ? (
                      <NonAuthLayout>{route.component}</NonAuthLayout>
                    ) : (
                      <VerticalLayout>{route.component}</VerticalLayout>
                    )}
                  </AuthProtected>
                }
                key={idx}
                exact={true}
              />
            );
          })}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
