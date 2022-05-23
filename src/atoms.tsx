import { atom } from "recoil";

// Theme Toggle
export const isDarkState = atom<boolean>({
    key: "toggletheme",
    default: true,
});