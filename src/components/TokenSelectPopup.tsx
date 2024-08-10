import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PopupContainer = styled.div`
  background-color: #1a1b1e;
  border-radius: 16px;
  padding: 2rem;
  width: 50%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

const TokenList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

const TokenItem = styled.li<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 12px;
  background-color: ${(props) => (props.isSelected ? "#4a4b4e" : "inherit")};

  &:hover {
    background-color: #3a3b3f;
  }
`;

const TokenIconInfo = styled.div`
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 1rem;
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenName = styled.span`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
`;

const TokenSymbol = styled.span`
  color: #b3b3b3;
  font-size: 0.875rem;
`;

const TokenBalance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TokenAmount = styled.span`
  color: #ffffff;
  font-size: 0.875rem;
`;

const TokenUSDValue = styled.span`
  color: #b3b3b3;
  font-size: 0.75rem;
`;

const TokenSelectionPopup = ({
  isOpen,
  onClose,
  onCloseWithoutSubmit,
  onSelect,
  tokens,
  selectedTokenA,
  selectedTokenB,
  type
}: any) => {
  if (!isOpen) return null;

  const [sortedTokens, setSortedTokens] = useState(tokens);

  useEffect(() => {
    const sorted = [...tokens].sort((a, b) => b.usdBalance - a.usdBalance);
    setSortedTokens(sorted);
  }, [tokens]);

  const popupRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      onCloseWithoutSubmit &&
      popupRef.current &&
      !popupRef.current.contains(event.target as Node)
    ) {
      onCloseWithoutSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const selectedAddress =
    type === "selectedTokenA" ? selectedTokenA : selectedTokenB;

  return (
    <Overlay>
      <PopupContainer ref={popupRef}>
        <Title>Select Token</Title>
        <TokenList>
          {sortedTokens.map((token: any) => (
            <TokenItem
              key={token.address}
              onClick={() => onSelect(token)}
              isSelected={token.address === selectedAddress}
            >
              <TokenIconInfo>
                <TokenIcon src={token.image} alt={token.name} />
                <TokenInfo>
                  <TokenName>{token.name}</TokenName>
                  <TokenSymbol>{token.symbol}</TokenSymbol>
                </TokenInfo>
              </TokenIconInfo>
              <TokenBalance>
                <TokenAmount>
                  {token?.balance.toFixed(4)} {token.symbol}
                </TokenAmount>
                <TokenUSDValue>${token?.balanceUSD.toFixed(2)}</TokenUSDValue>
              </TokenBalance>
            </TokenItem>
          ))}
        </TokenList>
      </PopupContainer>
    </Overlay>
  );
};

export default TokenSelectionPopup;
