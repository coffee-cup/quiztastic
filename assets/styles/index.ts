import { css } from "styled-components";

export type Colour = string;

export interface Theme {
  colours: {
    text: Colour;
    bg: Colour;
    purple: Colour;
    pink: Colour;
    orange: Colour;
    yellow: Colour;
  };
}

const sunset = {
  purple: "#2d3561",
  pink: "#c05c7e",
  orange: "#f3826f",
  yellow: "#ffb961",
};

// https://colorhunt.co/palette/152688
export const theme: Theme = {
  colours: {
    text: "white",
    bg: sunset.pink,
    ...sunset,
  },
};

export const HeaderHeight = 48;

export const sizes = {
  phone: "480px",
  tablet: "768px",
  laptop: "1200px",
};

export const NarrowScreenWidth = sizes.phone;

export const forNarrowScreen = (first, ...interpolations) => css`
  @media only screen ${NarrowScreenWidth != null &&
      css` and (max-width: ${NarrowScreenWidth})`} {
    ${css(first, ...interpolations)}
  }
`;

export const forWideScreen = (first, ...interpolations) => css`
  @media only screen ${NarrowScreenWidth != null &&
      css` and (min-width: ${NarrowScreenWidth})`} {
    ${css(first, ...interpolations)}
  }
`;
