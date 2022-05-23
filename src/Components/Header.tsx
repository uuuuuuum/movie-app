import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isDarkState } from "../atoms";
import { useRecoilState } from "recoil";

const Nav = styled(motion.nav)<{isDark: boolean}>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 60px;
    width: 100%;
    color: ${(props) => props.theme.textColor_1};
    font-size: 16px;
    font-weight: bold;
    letter-spacing: -0.33px;
    background: ${(props) => props.isDark ? null : "linear-gradient(to bottom, white, transparent)" };
    position: fixed;
    top: 0;
    z-index: 10000;

    @media screen and (max-width: 1024px) {
        padding: 15px 40px;
    }
    @media screen and (max-width: 768px) {
        padding: 20px 20px;
    }
`;
const navVariants = {
    top: {
        backgroundColor: "rgba(0, 0, 0, 0)",
    },
    scrollB: (headerBgColor: string) => ({
        backgroundColor: "rgba(0, 0, 0, 1)",
    }),
    scrollW: (headerBgColor: string) => ({
        backgroundColor: "rgba(237, 237, 237, 1)",
    })
}

const Col = styled.div`
    display: flex;
    align-items: center;

    @media screen and (max-width: 768px) {
        &:nth-child(1) {
            flex-direction: column;
        }
        ul {
            margin-top: 10px;
        }
    }
`;

const Logo = styled(motion.svg)`
    margin-right: 50px;
    width: 102.4px;
    height: 27.6742px;
    cursor: pointer;
    path {
        stroke-width: 14;
        stroke: black;
    }
`;
const LogoVariants = {
    normal: {
        fill: "rgba(229, 9, 20, 1)",
    },
    active: {
        fill: ["rgba(229, 9, 20, 1)", "rgba(255, 255, 255, 0.4)", "rgba(229, 9, 20, 1)"],
        transition: {
            repeat: Infinity,
            duration: 3,
        },
    },
}

const Items = styled.ul`
    display: flex;
    align-items: center;
`;
const Item = styled.li`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-right: 20px;
    color: ${(props) => props.theme.textColor_1};
    transition: color 0.3s ease-in-out;
    position: relative;

    &:hover {
        color: ${(props) => props.theme.red};
    }
`;
const Circle = styled(motion.span)`
    margin: 0 auto;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.red};
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
`;

const SearchBox = styled.div<IBtnTheme>`
    position: relative;

    @media screen and (max-width: 768px) {
        position: fixed;    right: auto;
        left: 50%;
        transform: translateX(-50%);
        top: 0;
        background-color: ${(props) => props.isDark ? props.theme.bgColor : "#bbb"};
        border-radius: 0 0 4px 4px;
        z-index: 1;
    }
`;

const Search = styled(motion.form)`
    display: flex;
    align-items: center;
    padding: 6px;
    color: white;
    background-color: rgba(17, 17, 17, 0);
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 4px;

    @media screen and (max-width: 768px) {
        background-color: inherit !important;
        border: 0 !important;
    }
`;
const SearchVriants = {
    normal: {
        backgroundColor: "rgba(17, 17, 17, 0)",
        border: "1px solid rgba(255, 255, 255, 0)",
    },
    active: {
        backgroundColor: "rgba(17, 17, 17, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
    }
}
const SvgSearch = styled(motion.svg)<{isDark: boolean}>`
    height: 25px;
    cursor: pointer;
    fill: ${(props) => props.isDark ? "white" : "black" };
`;
const SvgSearchVariants = {
    normal: {
    },
    active: {
        fill: "white"
    }
}
const Input = styled(motion.input)`
    padding: 0 8px;
    height: 30px;
    transform-origin: right center;
    background-color: rgba(255, 255, 255, 1);
    border: 0;
    border-radius: 2px;
`;
const InputVariants = {
    normal: {
        width: 0,
        padding: 0,
        marginLeft: 0,
        transition: {
            type: "linear"
        }
    },
    active: {
        width: "200px",
        padding: "0 8px",
        marginLeft: "5px",
        transition: {
            type: "linear"
        }
    }
}

interface IBtnTheme {
    isDark: boolean;
}
const BtnTheme = styled.button<IBtnTheme>`
    display: flex;
    align-items: center;
    margin-left: 15px;
    padding: 6px;
    font-size: 12px;
    background-color: ${(props) => props.isDark ? "#131313" : "rgba(255, 255, 255, 0.6)" };
    border: 1px solid transparent;
    border-color: ${(props) => props.isDark ? "rgba(0,0,0,0.24)" : "#51454532" };
    border-radius: 12px;
    position: relative;
    width: 58px;
    height: 20px;
    cursor: pointer;

    transition: left 0.3s linear, background-color 0.3s linear;

    &:before {
        content: ${(props) => props.isDark ? `"Dark"` : `"Light"`};
        display: block;
        flex: 1;
        color: ${(props) => props.isDark ? "white" : "#444"};

        position: absolute;
        left: ${(props) => props.isDark ? "auto" : "8px"};
        right: ${(props) => props.isDark ? "8px" : "auto"};
    };
    &:after {
        content: '';
        display: inline-block;
        flex: 0 0 auto;

        width: 12px;
        height: 12px;
        background-color: ${(props) => props.isDark ? "#676c98" : "#eb8181"};
        border-radius: 6px;

        position: absolute;
        left: ${(props) => props.isDark ? "4px" : "calc(100% - 12px - 4px)"};

        transition: left 0.3s linear, background-color 0.3s linear;
    };

    @media screen and (max-width: 768px) {
        position: absolute;
        right: 20px;
        top: 20px;
    }
`;

interface IForm {
    keyword: string;
}

function Header() {
    const [isDark, setisDark] = useRecoilState(isDarkState);
    const ToggleDark = () => {
        setisDark((prev) => !prev);
    };

    const [searchOpen, setSearchOpen] = useState(false);
    const homeMatch = useMatch("/");
    const tvMatch = useMatch("/tv");

    const searchBoxAnimation = useAnimation();
    const inputAnimation = useAnimation();
    const SvgSearchAnimation = useAnimation();
    const toggleSearch = () => {
        if(searchOpen) {
            searchBoxAnimation.start("normal");
            inputAnimation.start("normal");
            SvgSearchAnimation.start("normal");
        } else {
            searchBoxAnimation.start("active");
            inputAnimation.start("active");
            SvgSearchAnimation.start("active");
        }
        setSearchOpen((prev) => !prev);
    };

    const { scrollY } = useViewportScroll();
    const navAnimation = useAnimation();
    useEffect(() => {
        scrollY.onChange(() => {
            if(scrollY.get() > 84) {
                if(isDark) {
                    navAnimation.start("scrollB");
                } else {
                    navAnimation.start("scrollW");
                }
            } else {
                navAnimation.start("top");
            }
        });
        if(scrollY.get() > 84) {
            if(isDark) {
                navAnimation.start("scrollB");
            } else {
                navAnimation.start("scrollW");
            }
        } else {
            navAnimation.start("top");
        }
    }, [scrollY, isDark]);

    //Search
    const navigate = useNavigate();
    const { register, handleSubmit, setValue } = useForm<IForm>();
    const onValid = (data: IForm) => {
        setValue("keyword", "");
        navigate(`/search?keyword=${data.keyword}`);
    }
    return (
        <Nav 
            isDark={isDark}
            variants={navVariants}
            initial={"top"}
            animate={navAnimation}
            >
            <Col>
                <Link to="/">
                    <Logo
                        xmlns="http://www.w3.org/2000/svg"
                        width="1024"
                        height="276.742"
                        viewBox="0 0 1024 276.742"
                    >
                        <motion.path 
                            variants={LogoVariants}
                            initial="normal"
                            whileHover="active"
                            d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
                    </Logo>
                </Link>
                <Items>
                    <Item>
                        <Link to="/">
                            Home
                            { homeMatch && <Circle layoutId="circle" /> }
                        </Link>
                    </Item>
                    <Item>
                        <Link to="/tv">
                            Tv Shows
                            { tvMatch && <Circle layoutId="circle" /> }
                        </Link>
                    </Item>
                </Items>
            </Col>
            <Col>
                <SearchBox isDark={isDark}>
                    <Search 
                        onSubmit={handleSubmit(onValid)}
                        variants={SearchVriants}
                        initial={"normal"}
                        animate={searchBoxAnimation}
                    >
                        <SvgSearch
                            isDark={isDark}
                            variants={SvgSearchVariants}
                            animate={SvgSearchAnimation}
                            onClick={toggleSearch}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                            ></path>
                        </SvgSearch>
                        <Input 
                            {...register("keyword", {required: true, minLength: 2})}
                            variants={InputVariants}
                            initial={"normal"}
                            animate={inputAnimation}
                            placeholder="Search for movie or tv show..." />
                    </Search>
                </SearchBox>
                <BtnTheme
                    onClick={ToggleDark}
                    isDark={isDark}
                ></BtnTheme>
            </Col>
        </Nav>        
    );
}

export default Header;