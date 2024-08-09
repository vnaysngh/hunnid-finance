import styled from "styled-components";
import "./App.css";
import Wallet from "./Wallet";
import { lazy, Suspense, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoanDetailsPage from "./LoanDetails";
import OnboardingPopup from "./Onboarding";
// import PortfolioDashboard from "./Portfolio";

const CreateLoan = lazy(() => import("./LoanRequestForm"));
const BrowseLoan = lazy(() => import("./BrowseLoans"));
const Portfolio = lazy(() => import("./Portfolio"));
const Profile = lazy(() => import("./Profile"));

const AppContainer = styled.div`
  display: flex;
  color: #ffffff;
  min-height: 100vh;
`;

const Sidebar = styled.nav`
  width: 240px;
  background-color: #1a1b1e;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  // justify-content: center;
  margin: 1rem 0;
`;

const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? "#2c2d30" : "transparent")};
  transition: background-color 0.3s;

  &:hover {
    background-color: #2c2d30;
  }
`;

const NavItemsContainer = styled.div`
  margin-top: 5rem;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.5rem;
  color: #ffffff;
  font-weight: 700;
  padding: 10px 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function App() {
  const location = useLocation();
  const navItems = [
    { icon: "🔍", text: "Browse", key: "browse", path: "/" },
    { icon: "💰", text: "Borrow", key: "create", path: "/create" },
    { icon: "📂", text: "Portfolio", key: "portfolio", path: "/portfolio" },
    { icon: "👤", text: "Profile", key: "profile", path: "/profile" }
  ];

  const routeMappings: Record<string, { title: string; navItem: string }> = {
    browse: { title: "Browse Active Loans", navItem: "browse" },
    create: { title: "Create Borrow Request", navItem: "create" },
    profile: { title: "User Profile", navItem: "profile" },
    portfolio: { title: "Portfolio Dashboard", navItem: "portfolio" }
  };

  const currentRoute = Object.keys(routeMappings).find((route) =>
    location.pathname.includes(route)
  );

  // Ensure currentRoute is defined; if not, default to 'browse'
  const { title: pageTitle, navItem: activeNavItem } = currentRoute
    ? routeMappings[currentRoute]
    : routeMappings["browse"];

  return (
    <>
      <AppContainer>
        <Sidebar>
          <Logo>
            <img src="/logo.png" width="80%" alt="Hunnid Finance Logo" />
          </Logo>
          <NavItemsContainer>
            {navItems.map((item) => (
              <StyledLink to={item.path}>
                <NavItem key={item.key} active={activeNavItem === item.key}>
                  {item.icon} {item.text}
                </NavItem>
              </StyledLink>
            ))}
          </NavItemsContainer>
        </Sidebar>
        <MainContent>
          <OnboardingPopup />

          <Header>
            <PageTitle>{pageTitle}</PageTitle>
            <UserInfo>
              <Wallet />
            </UserInfo>
          </Header>
          <Suspense fallback={<div>Loading</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/browse" />} />
              <Route path="/browse" element={<BrowseLoan />} />
              <Route path="/create" element={<CreateLoan />} />
              <Route path="/loan/:loanId" element={<LoanDetailsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/portfolio" element={<Portfolio />} />
            </Routes>
          </Suspense>
        </MainContent>
      </AppContainer>
    </>
  );
}

export default App;
