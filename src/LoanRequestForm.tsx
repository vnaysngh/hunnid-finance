import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 80vw;
  height: 80vh;
  margin: 0 auto;
  padding: 2vh 2vw;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 3.5vh;
  color: #333;
  margin-bottom: 3vh;
  text-align: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 2vw;
  flex: 1;
  overflow-y: auto;
`;

const InputSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 2vh;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 1vh;
  font-size: 2.2vh;
`;

const InputSelectWrapper = styled.div`
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  height: 5vh;
`;

const Input = styled.input`
  flex: 1;
  padding: 1vh 1vw;
  border: none;
  outline: none;
  font-size: 2vh;
`;

const Select = styled.select`
  padding: 1vh 2.5vw 1vh 1vw;
  border: none;
  border-left: 1px solid #ddd;
  background-color: #fff;
  outline: none;
  font-family: "Poppins";
  font-size: 2vh;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7vw top 50%;
  background-size: 1.5vh auto;
`;

const TermButtons = styled.div`
  display: flex;
  gap: 1vw;
  margin-top: 2vh;
`;

const TermButton = styled.button<{ active?: boolean }>`
  padding: 1vh 1.5vw;
  background-color: ${(props) => (props.active ? "#e0e0e0" : "white")};
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.8vh;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.active ? "#d0d0d0" : "#f0f0f0")};
  }
`;

const StartButton = styled.button`
  background-color: #4a90e2;
  color: white;
  padding: 1.5vh 2vw;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 2vh;
  width: 100%;
  font-size: 2.5vh;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3a7bc8;
  }
`;

const CoinIcon = styled.span`
  background-color: #4a90e2;
  color: white;
  border-radius: 50%;
  padding: 0.2vh 0.4vw;
  font-size: 1.5vh;
  margin-right: 0.5vw;
`;

const LoanBorrowingInterface = () => {
  const [term, setTerm] = useState("7 Days");

  return (
    <Container>
      <Title>Create a Loan Request</Title>
      <ContentWrapper>
        <InputSection>
          <InputGroup>
            <Label>I want to borrow</Label>
            <InputSelectWrapper>
              <Input type="number" defaultValue="100" />
              <Select>
                <option>
                  <CoinIcon>$</CoinIcon>BUSD
                </option>
              </Select>
            </InputSelectWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Collateral Amount</Label>
            <InputSelectWrapper>
              <Input type="number" defaultValue="0.24789545" />
              <Select>
                <option>
                  <CoinIcon>B</CoinIcon>BNB
                </option>
              </Select>
            </InputSelectWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Interest Rate (%)</Label>
            <InputSelectWrapper>
              <Input
                type="number"
                defaultValue="5"
                step="0.1"
                min="0"
                max="100"
              />
            </InputSelectWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Loan Term</Label>
            <span style={{ color: "#666", fontSize: "1.8vh" }}>
              No interest penalty for early repayment
            </span>
          </InputGroup>

          <TermButtons>
            {["7 Days", "14 Days", "30 Days", "90 Days", "180 Days"].map(
              (t) => (
                <TermButton
                  key={t}
                  active={term === t}
                  onClick={() => setTerm(t)}
                >
                  {t}
                </TermButton>
              )
            )}
          </TermButtons>

          <StartButton>Start Borrowing Now</StartButton>
        </InputSection>

        {/* <InfoBox></InfoBox> */}
      </ContentWrapper>
    </Container>
  );
};

export default LoanBorrowingInterface;
