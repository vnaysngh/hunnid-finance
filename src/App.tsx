import styled from "styled-components";
import "./App.css";
import LoanRequestForm from "./LoanRequestForm";
import Wallet from "./Wallet";
import { useState } from "react";
import LoanDetailsPage from "./LoanDetails";
import UserProfilePage from "./Profile";
import BrowseLoansPage from "./BrowseLoans";
// import PortfolioDashboard from "./Portfolio";

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

function App() {
  const [activeNavItem, setActiveNavItem] = useState("browse");

  const navItems = [
    { icon: "📊", text: "Browse", key: "browse" },
    { icon: "💱", text: "Start Borrowing", key: "start-borrowing" }
  ];

  return (
    <AppContainer>
      <Sidebar>
        <Logo>
          <img src="/pigpig-finance.png" width={"80%"} />
        </Logo>

        {navItems.map((item) => (
          <NavItem
            key={item.key}
            active={activeNavItem === item.key}
            onClick={() => setActiveNavItem(item.key)}
          >
            <NavText>{item.text}</NavText>
          </NavItem>
        ))}
      </Sidebar>
      <MainContent>
        <Header>
          <UserInfo>
            <Wallet />
          </UserInfo>
        </Header>
        {/* <LoanRequestForm /> */}
        {/* <LoanDetailsPage loanDetails={{}} /> */}
        {/* <UserProfilePage /> */}
        {/* <BrowseLoansPage /> */}
      </MainContent>
    </AppContainer>
  );
}

export default App;
