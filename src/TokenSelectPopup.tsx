import React, { useState, useEffect, useRef } from "react";
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
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #3a3b3f;
  border: 1px solid #4a4b4f;
  border-radius: 12px;
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1.5rem;

  &::placeholder {
    color: #b3b3b3;
  }

  &:focus {
    outline: none;
    border-color: #5a5b5f;
  }
`;

const TokenList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

const TokenItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 12px;

  &:hover {
    background-color: #3a3b3f;
  }
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

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
`;

const TokenSelectionPopup = ({
  isOpen,
  onClose,
  onSelect,
  tokens,
  selectedToken
}: any) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(tokens);

  useEffect(() => {
    setFilteredTokens(
      tokens.filter(
        (token: any) =>
          token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, tokens]);

  const popupRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      onClose &&
      popupRef.current &&
      !popupRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <Overlay>
      <PopupContainer ref={popupRef}>
        <Title>Select Token</Title>
        {/* <CloseButton onClick={onClose}>&times;</CloseButton> */}
        {/* <SearchInput
          type="text"
          placeholder="Search tokens"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
        <TokenList>
          {filteredTokens.map((token: any) => (
            <TokenItem key={token.address} onClick={() => onSelect(token)}>
              <TokenIcon src={token.logoURI} alt={token.name} />
              <TokenInfo>
                <TokenName>{token.name}</TokenName>
                <TokenSymbol>{token.symbol}</TokenSymbol>
              </TokenInfo>
            </TokenItem>
          ))}
        </TokenList>
      </PopupContainer>
    </Overlay>
  );
};

export default TokenSelectionPopup;
