import * as React from "react";
import {
    BlauLogo,
  EsimflagLogo,
  Logo,
  MovistarLogo,
  O2Logo,
  O2NewLogo,
  TelefonicaLogo,
  TuLogo,
  VivoLogo
} from "@telefonica/mistica/";
import { Box, ResponsiveLayout, useTheme } from "@telefonica/mistica/";
import { Meta, StoryFn } from "@storybook/react";

const COLOR_OPTIONS = [
  "default",
  "neutralHigh",
  "neutralMedium",
  "#000000",
] as const;

type ColorOption = (typeof COLOR_OPTIONS)[number];

type Args = {
  type: "isotype" | "imagotype" | "vertical";
  size: number;
  inverse: boolean;
  action: "none" | "onPress" | "href" | "to";
  forceBrandLogo: boolean;
  brand:
    | "Movistar"
    | "O2"
    | "O2-new"
    | "Vivo"
    | "Telefonica"
    | "Blau"
    | "Tu"
    | "Esimflag";
  color: ColorOption;
};

export default {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    fullScreen: true,
  },
  argTypes: {
    color: {
      options: COLOR_OPTIONS,
      control: { type: "select" },
    },
  },
} as Meta<Args>;

const getLogoActionProps = (action: string) => {
  return action === "onPress"
    ? {
        onPress: () => {
          window.alert("pressed!");
        },
        "aria-label": "pressable logo",
      }
    : action === "href"
    ? {
        href: "https://www.google.com",
        newTab: true,
        "aria-label": "logo-link",
      }
    : action === "to"
    ? {
        to: "#",
        replace: true,
        "aria-label": "logo-link",
      }
    : {};
};

export const Default: StoryFn<Args> = ({
  type,
  size,
  inverse,
  action,
  forceBrandLogo,
  brand,
  color,
}) => {
  const { colorValues } = useTheme();
  const logoProps = {
    ...getLogoActionProps(action),
    type,
    size,
    color:
      color === "default" ? undefined : colorValues[color as never] || color,
  };

  const CurrentLogo = {
    default: Logo,
    Movistar: MovistarLogo,
    Vivo: VivoLogo,
    O2: O2Logo,
    "O2-new": O2NewLogo,
    Telefonica: TelefonicaLogo,
    Blau: BlauLogo,
    Tu: TuLogo,
    Esimflag: EsimflagLogo,
  }[forceBrandLogo ? brand : "default"];

  return (
    <ResponsiveLayout isInverse={inverse} fullWidth>
      <Box padding={16}>
        <CurrentLogo {...logoProps} dataAttributes={{ testid: "logo" }} />
      </Box>
    </ResponsiveLayout>
  );
};

Default.storyName = "Logo";

Default.args = {
  type: "isotype",
  action: "none",
  size: 48,
  inverse: false,
  forceBrandLogo: false,
  brand: "Movistar",
  color: "default",
};

Default.argTypes = {
  brand: {
    options: [
      "Movistar",
      "O2",
      "O2-new",
      "Vivo",
      "Telefonica",
      "Blau",
      "Tu",
      "Esimflag",
    ],
    control: { type: "select" },
    if: { arg: "forceBrandLogo" },
  },
  type: {
    options: ["isotype", "imagotype", "vertical"],
    control: { type: "select" },
  },
  action: {
    options: ["none", "onPress", "href", "to"],
    control: { type: "select" },
  },
  size: {
    control: { type: "range", min: 8, max: 480, step: 8 },
  },
};
