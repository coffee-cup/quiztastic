import styled from "styled-components";
import { HeaderHeight } from "../styles";

const padding = 2;
const Center = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: calc(100vh - ${HeaderHeight}px);
  padding-top: ${padding}rem;
  padding-bottom: ${padding}rem;
  text-align: center;
`;

export default Center;
