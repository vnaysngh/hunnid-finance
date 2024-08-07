import { createBrowserRouter } from "react-router-dom";
import LoanRequestForm from "./LoanRequestForm";
import BrowseLoansPage from "./BrowseLoans";
import LoanDetailsPage from "./LoanDetails";
import UserProfilePage from "./Profile";
import PortfolioDashboard from "./Portfolio";
import ErrorPage from "./ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BrowseLoansPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/create-loan",
    element: <LoanRequestForm />
  },
  {
    path: "/loan",
    element: <LoanDetailsPage />
  },
  {
    path: "/profile",
    element: <UserProfilePage />
  },
  {
    path: "/portfolio",
    element: <PortfolioDashboard />
  }
]);

export default router;
