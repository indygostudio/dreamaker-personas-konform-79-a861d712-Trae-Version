
import React from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // This page now redirects to HomePage
  return <Navigate to="/" replace />;
};

export default Index;
