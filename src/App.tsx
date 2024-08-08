import styled from "styled-components";
import "./App.css";
import Wallet from "./Wallet";
import { lazy, Suspense, useState } from "react";
import { Link, Route, RouterProvider, Routes } from "react-router-dom";
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
  justify-content: center;
  margin: 2.5rem 0;
`;

const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 8px;
  text-decoration: 
  background-color: ${(props) => (props.active ? "#2c2d30" : "transparent")};
  transition: background-color 0.3s;

  &:hover {
    background-color: #2c2d30;
  }
`;

const NavIcon = styled.span`
  margin-right: 10px;
  font-size: 20px;
`;

const NavText = styled.span`
  font-size: 16px;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40px;
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
  const [activeNavItem, setActiveNavItem] = useState("browse");

  const navItems = [
    { icon: "📊", text: "Browse", key: "browse", path: "/" },
    {
      icon: "💱",
      text: "Create Loan",
      key: "create-loan",
      path: "/create-loan"
    },
    { icon: "💱", text: "Portfolio", key: "portfolio", path: "/portfolio" },
    { icon: "💱", text: "Profile", key: "profile", path: "/profile" }
  ];

  return (
    <>
      <AppContainer>
        <Sidebar>
          <Logo>
            <img src="/logo.png" width="80%" alt="Hunnid Finance Logo" />
          </Logo>
          {navItems.map((item) => (
            <StyledLink to={item.path}>
              <NavItem key={item.key} active={activeNavItem === item.key}>
                {item.text}
              </NavItem>
            </StyledLink>
          ))}
        </Sidebar>
        <MainContent>
          <Header>
            <UserInfo>
              <Wallet />
            </UserInfo>
          </Header>
          <Suspense fallback={<div>Loading</div>}>
            <Routes>
              <Route path="/" element={<BrowseLoan />} />
              <Route path="/create-loan" element={<CreateLoan />} />
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
