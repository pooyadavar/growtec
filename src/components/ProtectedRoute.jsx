import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useIsSuperuser } from "../hooks/useIsSuperuser";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/Home" replace />;
  }

  return children;
};

export const SuperuserRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isSuperuser, isLoading } = useIsSuperuser();

  if (!isAuthenticated) {
    return <Navigate to="/Home" replace />;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isSuperuser) {
    return <Navigate to="/Home" replace />;
  }

  return children;
};

export default ProtectedRoute;
