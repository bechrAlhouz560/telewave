import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type ThemeValue = {
  activeTheme: string | null;
  mode: "dark" | "light";
  themes: {
    dark: Theme[];
    light: Theme[];
  };
};

export type Theme = {
  name: string;
  primary: string;
  text: string;
  secondary: string;
  background: string;
  border: string;
};

// Initial state with additional themes
const initialValue: ThemeValue = {
  activeTheme: "red",
  mode: "dark",
  themes: {
    dark: [
      {
        name: "cyan",
        background: "#202124",
        primary: "#0c8395",
        secondary: "#24A9B7",
        text: "#ebf5f6",
        border: "#3a3f42",
      },
      {
        name: "red",
        background: "#202124",
        primary: "#D84241",
        secondary: "#F05756",
        text: "#EBF4F6",
        border: "#3a3f42",
      },
      {
        name: "mint",
        background: "#202124",
        primary: "#6AC5A6",
        secondary: "#A7D9C6",
        text: "#EBF4F6",
        border: "#3a3f42",
      },
      {
        name: "orange",
        background: "#444444",
        primary: "#FF8B00",
        secondary: "#FFC60B",
        text: "#FEFFDB",
        border: "#3a3f42",
      },
      {
        name: "pink",
        background: "#202124",
        primary: "#F19ED2",
        secondary: "#E8C5E5",
        text: "#F7F9F2",
        border: "#3a3f42",
      },
      {
        name: "purple",
        background: "#202124",
        primary: "#937DC2",
        secondary: "#C689C6",
        text: "#F7F9F2",
        border: "#FFE6F720",
      },
    ],
    light: [
      {
        name: "cyan",
        background: "#FFFFFF",
        primary: "#0c8395",
        secondary: "#f05756",
        text: "#000000",
        border: "#eeeeee",
      },
      {
        name: "red",
        background: "#FFFFFF",
        primary: "#D84241",
        secondary: "#F05756",
        text: "#000000",
        border: "#eeeeee",
      },

      {
        name: "mint",
        background: "#FFFFFF",
        primary: "#6AC5A6",
        secondary: "#A7D9C6",
        text: "#000000",
        border: "#eeeeee",
      },

       {
        name: "orange",
        background: "#FEFFDB",
        primary: "#FF8B00",
        secondary: "#FFC60B",
        text: "#444444",
        border: "#eeeeee",
      },
      {
        name: "pink",
        background: "#F7F9F2",
        primary: "#F19ED2",
        secondary: "#E8C5E5",
        text: "#444444",
        border: "#eeeeee",
      },
   
    ],
  },
};

// Function to get the active theme based on the current mode and active theme name
export function getActiveTheme(state: { theme: ThemeValue }): Theme | undefined {
  const themes = state.theme.themes[state.theme.mode];
  return themes.find((theme: Theme) => theme.name === state.theme.activeTheme);
}

// Function to select the active theme name
export function selectActiveThemeName(state: { theme: ThemeValue }): string | null {
  return state.theme.activeTheme;
}
export function getActiveMode(state: { theme: ThemeValue }): string | null {
  return state.theme.mode;
}


export function selectAllThemeNames (state : RootState) : {

  name : string,
  color : string
}[] {

  return state.theme.themes[state.theme.mode].map(function (value) {
    return {
      name : value.name,
      color : value.primary
    };
  });

}
// Create the theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState: initialValue,
  reducers: {
    setActiveTheme(state, action) {
      state.activeTheme = action.payload;
    },
    setMode(state, action) {
      state.mode = action.payload;
    },
  },
});

// Export the actions and reducer
export const { setActiveTheme, setMode } = themeSlice.actions;
export default themeSlice.reducer;
