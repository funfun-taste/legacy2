import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";

export const footerLayout = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "auto",
});

export const information = style({
  backgroundColor: vars.colors.backgroundColor,
  color: vars.colors.black100,
  height: 140,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  padding: "0.8em 1em",
  justifyContent: "center",
});

export const informationLabel = style({
  color: vars.colors.gray500,
  fontWeight: 400,
  fontSize: 14,
});

export const copyright = style({
  backgroundColor: vars.colors.black000,
  color: vars.colors.white000,
  height: 90,
  display: "flex",
  width: "100%",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
});

export const copyrightLabel = style({
  color: vars.colors.white000,
  fontWeight: 400,
  fontSize: 14,
});
