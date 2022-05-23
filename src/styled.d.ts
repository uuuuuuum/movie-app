// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    red: string;
    bgColor: string;
    textColor_1: string;
    modalBgColor: string;
    boxShadowColor: string;
    black: {
        veryDark: string;
        darker: string;
        lighter: string;
    },
    white: {
        lighter: string;
        darker: string;
    },
  }
}