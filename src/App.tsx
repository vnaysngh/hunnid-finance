import styled from "styled-components";
import "./App.css";
import Wallet from "./components/Wallet";
import { lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoanDetailsPage from "./pages/LoanDetails";
import OnboardingPopup from "./components/Onboarding";
import Loader from "./components/Loader";
import { useStateContext } from "./context";
import { navItems, routeMappings } from "./constants";
// import PortfolioDashboard from "./Portfolio";

const CreateLoan = lazy(() => import("./pages/LoanRequestForm"));
const BrowseLoan = lazy(() => import("./pages/BrowseLoans"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
// const Profile = lazy(() => import("./pages/Profile"));

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

// Updated styled components for partnered logos section
const PartnerLogosContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #2c2d30;
`;

const PartnerLogosTitle = styled.h3`
  font-size: 2rem;
  color: #a0a0a0;
  margin-bottom: 1rem;
`;

const PartnerLogoList = styled.div`
  background: #fff2dbed;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PartnerLogo = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  height: 3rem;
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

const BlockscoutIcon = styled.a`
  display: flex;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
`;

const NetworkBanner = styled.div`
  background-color: #ffa500; // Warning orange
  color: #000000;
  padding: 10px 20px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #ff8c00;
  }
`;

function App() {
  const location = useLocation();
  const { address, chain } = useStateContext();
  const currentRoute = Object.keys(routeMappings).find((route) =>
    location.pathname.includes(route)
  );

  // Ensure currentRoute is defined; if not, default to 'browse'
  const { title: pageTitle, navItem: activeNavItem } = currentRoute
    ? routeMappings[currentRoute]
    : routeMappings["browse"];

  // Sample partner logos (replace with actual partner logos)
  const partnerLogos = [
    { src: "/base-logo.png", alt: "Base" },
    { src: "/optimism-logo.svg", alt: "Optimism" },
    {
      src: "/blockscout.svg",
      alt: "Blockscout"
    },
    { src: "/thirdweb-logo.png", alt: "Thirdweb" }
  ];

  return (
    <AppContainer>
      <Sidebar>
        <Logo>
          <img src="/logo.png" width="80%" alt="Hunnid Finance Logo" />
        </Logo>
        <NavItemsContainer>
          {navItems.map((item) => (
            <StyledLink to={item.path} key={item.key}>
              <NavItem active={activeNavItem === item.key}>
                {item.icon} {item.text}
              </NavItem>
            </StyledLink>
          ))}
        </NavItemsContainer>
        <PartnerLogosContainer>
          <PartnerLogosTitle>Powered By</PartnerLogosTitle>
          <PartnerLogoList>
            {partnerLogos.map((logo, index) => (
              <PartnerLogo key={index} src={logo.src} alt={logo.alt} />
            ))}
          </PartnerLogoList>
        </PartnerLogosContainer>
      </Sidebar>
      <MainContent>
        <NetworkBanner>
          <span>
            Please use only Base Mainnet or Optimism Mainnet for this
            application. Other networks are not supported.
          </span>
        </NetworkBanner>
        <OnboardingPopup />
        <Header>
          <PageTitle>{pageTitle}</PageTitle>
          <UserInfo>
            <Wallet />
            {address && (
              <BlockscoutIcon
                href={`https://${chain}.blockscout.com/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/blockscout-logo.png"
                  alt="Blockscout Explorer"
                  style={{ height: "4rem", width: "4rem", borderRadius: "50%" }}
                />
              </BlockscoutIcon>
            )}
          </UserInfo>
        </Header>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/browse" />} />
            <Route path="/browse" element={<BrowseLoan />} />
            <Route path="/create" element={<CreateLoan />} />
            <Route path="/loan/:loanId" element={<LoanDetailsPage />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Suspense>
      </MainContent>
    </AppContainer>
  );
}

export default App;
