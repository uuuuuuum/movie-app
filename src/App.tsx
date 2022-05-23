import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import { useRecoilValue } from "recoil";
import { isdarkState } from "./atoms";


const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Source+Sans+Pro:wght@300;400&display=swap');

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  body {
    line-height: 1;
    color: ${(props) => props.theme.textColor_1};
    background-color: ${(props) => props.theme.bgColor};
  }
  menu, ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Source Sans Pro', sans-serif;
    transition: background-color 0.24s ease-out, color 0.24s ease-out;
    overflow-x: hidden;
  }
  a {
    color: inherit;
    text-decoration: none;
  }

  @media screen and (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }
  @media screen and (max-width: 480px) {
    body {
      font-size: 12px;
    }
  }
`;

function App() {
  const isdark = useRecoilValue(isdarkState);
  
  return (
    <ThemeProvider theme={ isdark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Router>
        <Header />
        <Routes>
          <Route path="/tv" element={<Tv />}></Route>
          <Route path="/tv/:name/:resultId" element={<Tv />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/search/:name/:resultId" element={<Search />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/movies/:name/:resultId" element={<Home />}></Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App;
