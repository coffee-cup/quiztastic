import { Theme } from "../assets/styles";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
