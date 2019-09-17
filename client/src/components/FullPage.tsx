import styled from "styled-components";
import { HeaderHeight } from "../styles";

const FullPage = styled.div`
  min-height: calc(100vh - ${HeaderHeight}px);
`;

export default FullPage;
