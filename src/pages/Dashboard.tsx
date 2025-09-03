import { Navigate } from "react-router-dom";

export default function Dashboard() {
  // Redirect to Product Registration as default page
  return <Navigate to="/product-registration" replace />;
}