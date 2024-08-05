import styled from "styled-components";
import Wallet from "./Wallet";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        <img src="/peer-to-peer.png" height={32} width={32} />
      </Logo>
      <Nav>
        <Wallet />
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
