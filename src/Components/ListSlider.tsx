import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { IMovieAndTv } from "../api";
import { isDarkState } from "../atoms";
import { makeImagePath } from "../untils";
import ModalMovie from "./ModalMovie";
import ModalTv from "./ModalTv";

const Slider = styled.div`
    display: flex;
    margin-top: 10px;
    height: 131.13px;
    position: relative;

    @media screen and (max-width: 1480px) {
        height: 9vw;
    }
    @media screen and (max-width: 1024px) {
        height: 27.5vw;
    }
    @media screen and (max-width: 768px) {
        height: 36.5vw;
    }
    @media screen and (max-width: 480px) {
        height: 24.5vw;
    }

    &:before {
        content: "";
        position: absolute;
        top: 0;
        right: calc(100% + 10px);
        width: 100%;
        height: 100%;
        background-color: ${(props) => props.theme.bgColor};
        z-index: 1;
    }
    &:after {
        content: "";
        position: absolute;
        top: 0;
        left: calc(100% + 10px);
        width: 100%;
        height: 100%;
        background-color: ${(props) => props.theme.bgColor};
        z-index: 1;
    }
`;
const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    width: 100%;
    position: absolute;
    top: 0;
    
    @media screen and (max-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }
    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }
    @media screen and (max-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(1, 1fr);
    }
`;
export interface IRowVariants {
    iWidth: number;
    isPrev: boolean;
}
const rowVariants = {
    hidden : ({iWidth, isPrev}: IRowVariants) => ({
        x: isPrev ? -iWidth : iWidth,
    }),
    visible: {
        x: 0,
    },
    exit: ({iWidth, isPrev}: IRowVariants) => ({
        x: isPrev ? iWidth : -iWidth,
    }),
}

const Box = styled(motion.div)`
    margin-bottom: 10px;
    height: auto;
    font-size: 0;
    cursor: pointer;

    &:first-child > div {
        transform-origin: center left;
    }
    &:nth-child(6n) > div {
        transform-origin: center right;
    }

    & > div > div:hover {
        box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.46);
    }
    &:first-child > div > div:hover {
        box-shadow: 3px 3px 8px 4px rgba(0, 0, 0, 0.46);
    }
    &:nth-child(6n) > div > div:hover {
        box-shadow: -3px 3px 8px 4px rgba(0, 0, 0, 0.46);
    }

    @media screen and (max-width: 1024px) and (min-width: 769px) {
        &:nth-child(4n+1) > div {
            transform-origin: center left;
        }
        &:nth-child(4n) > div {
            transform-origin: center right;
        }
        &:nth-child(4n+1) > div > div:hover {
            box-shadow: 3px 3px 8px 4px rgba(0, 0, 0, 0.46);
        }
        &:nth-child(4n) > div > div:hover {
            box-shadow: -3px 3px 8px 4px rgba(0, 0, 0, 0.46);
        }
    }
    @media screen and (max-width: 768px) and (min-width: 481px) {
        &:nth-child(3n+1) > div {
            transform-origin: center left;
        }
        &:nth-child(3n) > div {
            transform-origin: center right;
        }
        &:nth-child(3n+1) > div > div:hover {
            box-shadow: 3px 3px 8px 4px rgba(0, 0, 0, 0.46);
        }
        &:nth-child(3n) > div > div:hover {
            box-shadow: -3px 3px 8px 4px rgba(0, 0, 0, 0.46);
        }
    }
    @media screen and (max-width: 480px) {
        &:nth-child(2n-1) > div {
            transform-origin: center left;
        }
        &:nth-child(2n) > div {
            transform-origin: center right;
        }
        &:nth-child(2n-1) > div > div:hover {
            box-shadow: 3px 3px 8px 4px rgba(0, 0, 0, 0.46);
        }
        &:nth-child(2n) > div > div:hover {
            box-shadow: -3px 3px 8px 4px rgba(0, 0, 0, 0.46);
        }
    }
`;
const BoxHoverMotion = styled(motion.div)`
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
    position: static;

    &:hover {
        position: relative;
        overflow: unset;
    }
    
    &:hover > div {
        display: block;
    }
`;
const BoxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.5,
        y: -80,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        },
    }
}

const BoxImg = styled.img`
    width: 100%;
    height: auto;
    font-size: 0;
    border-radius: 8px;
`;

const BoxImgNull = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #aaa;
    font-size: 16px;
    letter-spacing: -1px;
    background: #444;
    border-radius: 8px;
`;

const InfoVoted = styled(motion.span)`
`;
const Info = styled(motion.div)<{isDark: boolean}>`
    display: flex;
    flex-direction: column;
    display: none;
    padding: 10px;
    width: 100%;
    background-image: ${(props) => props.isDark
        ? `linear-gradient(transparent -20%, ${props.theme.black.veryDark} 55%)`
        : `linear-gradient(transparent -20%, transparent, white 55%)`    
    };
    position: absolute;
    top: 0;
    opacity: 0;
    
    border-radius: 8px;
    color: ${(props) => props.isDark ? "#aaa" : "#666" };
    
    h4 {
        margin-top: 60px;
        margin-bottom: 10px;
        width: 100%;
        font-size: 16px;
        font-weight: 600;
        color: ${(props) => props.theme.textColor_1};
    }

    p {
        margin-bottom: 10px;
        font-size: 10px;
    }

    & > span {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
    }

    ${InfoVoted} {
        color: ${(props) => props.theme.textColor_1};
        position: absolute;
        top: 6px;
        right: 6px;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: -1.6px;
        filter: ${(props) => props.isDark ? `drop-shadow(2px 3px 1.5px ${props.theme.black.lighter})` : null};
        background-color: ${(props) =>  props.isDark ? null : "rgba(255,255,255,0.6)"};
        border-radius: 4px;
        padding: ${(props) =>  props.isDark ? null : "2px 8px 3px"};
        display: flex;
        align-items: center;
        justify-content: center
    }
`;
const InfoVariants = {
    normal: {
        opacity: 0,
    },
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        }
    }
}
const InfoOverview = styled(motion.p)`
    line-height: 1.1em;
    max-height: 3.3em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`;

const BtnSlider = styled(motion.button)<{isDark: boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 48px;
    border: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    cursor: pointer;
    z-index: 2;
    left: -20px;
    background: linear-gradient(to right, ${(props) => props.isDark ? "black -30%, transparent 80%" : 
        `${props.theme.bgColor} -30%, transparent 80%`
    });

    &:last-child {
        left: auto;
        right: -20px;
        background: linear-gradient(to left, ${(props) => props.isDark ? "black -30%, transparent 80%" : 
            `${props.theme.bgColor} -30%, transparent 80%`
        });
    }
    
    svg line {
        stroke: ${(props) => props.isDark ? "white" : "black"};
    }
`;
const BtnSliderVariants = {
    normal: {
        opacity: 0
    },
    hover: {
        opacity: 1
    }
}

const Overlay = styled(motion.div)`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    opacity: 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
`;
const BigMovie = styled(motion.div)`
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 800px;
    width: 80%;
    height: 80vh;
    background-color: ${(props) => props.theme.modalBgColor};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    border-radius: 15px;
    overflow: hidden;
    z-index: 20000;
    box-shadow: 6px 6px 16px 6px ${(props) => props.theme.boxShadowColor};

    @media screen and (max-width: 768px) {
        width: calc(100% - 40px);
    }
`;
const BtnIcon = styled(motion.button)<{isDark: boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    background-color: ${(props) => props.isDark ? "transparent" : "rgba(255, 255, 255, 0.6)"};
    border-radius: 4px;
    border: 0;
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 1;
    cursor: pointer;


    svg {
        width: 30px;
        height: 30px;
        fill: ${(props) => props.theme.textColor_1};
        filter: drop-shadow(4px 4px 5px ${(props) => props.theme.bgColor});
    }
`;

interface IBtnTheme {
    isDark: boolean;
}
const BigCoverBox = styled.div<IBtnTheme>`
    position: relative;

    &:after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-image: ${(props) => props.isDark 
            ? `linear-gradient(to bottom, transparent -10%, ${props.theme.modalBgColor} 80%)`
            : `linear-gradient(to bottom, transparent 50%, ${props.theme.modalBgColor})`
        };
    }
`;
const BigCover = styled.img`
    width: 100%;
    height: auto;
`;
const BigModalInfoBox = styled.div<IBtnTheme>`
    flex: 1;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 300px;
    width: 100%;
    height: calc(100% - 300px);
    overflow-y: auto;
    padding: 0 30px 30px;
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {        
        border-radius: 8px;
        background-color: ${(props) => props.isDark ? "#555" : "#666"};
    }
    &::-webkit-scrollbar-track {
        background-color: transparent;
        border-radius: 8px;
    }

    & > div:first-child {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 15px;
    }

    @media screen and (max-width: 1024px) {
        top: 250px;
        width: 100%;
        height: calc(100% - 250px);
    }
    @media screen and (max-width: 768px) {
        top: 200px;
        width: 100%;
        height: calc(100% - 200px);
    }
    @media screen and (max-width: 480px) {
        padding: 0 20px 20px;
        height: calc(100% - 100px);
        top: 100px;
    }
`;

const BigTitle = styled.h3`
    display: inline-block;
    color: ${(props) => props.theme.textColor_1};
    font-size: 2em;
    font-weight: 600;
    line-height: 1.4em;
    text-decoration: underline;
    text-decoration-color: ${(props) => props.theme.red};
    word-break: break-word;

    @media screen and (max-width: 480px) {
        max-width: 72%;
    }
    
`;
const VoteAverage = styled.span`
    font-size: 4em;
    font-weight: 600;
    filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.44));
`;

export interface IGetMoviesAndTvResultProp {
    isLoading: boolean;
    data: {
        dates: {
            maximum: string;
            minimum: string;
        };
        page: number;
        results: IMovieAndTv[];
        total_pages: number;
        total_results: number;
    }
    name: string;
}

function ListSlider({ isLoading, data, name } : IGetMoviesAndTvResultProp) {
    const isDark = useRecoilValue(isDarkState);
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname.includes("/tv") ? "tv" : location.pathname.includes("/search") ? "search" : "movies";

    // 무비 클릭시 무비아이디로 URL 변경하고 모달 뜨게하기
    const bigMovieMatch = useMatch(`/${pathname}/${name}/:resultId`);

    const onBoxClicked = (resultId:number) => {
        navigate(`/${pathname}/${name}/${resultId}`);
    }
    const onModalClose = () => {
        navigate(-1);
    };

    const [isPrev, setIsPrev] = useState(false);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    
    const nextIndex = () => {
        setIsPrev(false);
        if(data) {
            if(leaving) return
            setLeaving(true);
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }
    };
    const prevIndex = () => {
        setIsPrev(true);
        if(data) {
            if(leaving) return
            setLeaving(true);
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev <= 0 ? maxIndex - 1 : prev - 1));
        }
    };

    let iWidth = window.innerWidth;
    if(iWidth >= 1480) {
        iWidth = 1480
    }
    const iWidthFn = () => {
        if(iWidth >= 1024) {
            return 6;
        } else if(iWidth > 768) {
            return 8;
        } else if(iWidth > 480) {
            return 6;
        } else {
            return 2;
        }
    }
    const [offset, setOffset] = useState(iWidthFn);
    useEffect(() => {
        window.addEventListener("resize", () => {
            iWidth = window.innerWidth;
            if(iWidth >= 1480) {
                iWidth = 1480
            }
            if(iWidth >= 1024) {
                setOffset(6);
            } else if(iWidth > 768) {
                setOffset(8);
            } else if(iWidth > 480) {
                setOffset(6);
            } else {
                setOffset(2);
            }
        });
    }, [iWidth]);

    const toggleLeaving = () => setLeaving((prev) => !prev);
    const clickedMovie = bigMovieMatch?.params.resultId && data.results.find(movie => String(movie.id) === bigMovieMatch.params.resultId);    

    return (
        isLoading ? <div>loading...</div> :
        <>
            <Slider>
                <AnimatePresence initial={false} custom={{iWidth, isPrev}} onExitComplete={toggleLeaving}>
                    <Row
                        key={index} 
                        custom={{iWidth, isPrev}}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{type: "tween", duration: 1}}
                    >
                        {data?.results.slice(1).slice(index*offset, index*offset+offset).map((result) => {
                            return (
                                <Box
                                    layoutId={name + result.id}
                                    key={name + result.id}
                                    onClick={() => onBoxClicked(result.id)}
                                >  
                                    <BoxHoverMotion
                                        variants={BoxVariants}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{
                                            type: "tween",
                                        }}
                                    >
                                            {
                                                result.backdrop_path !== null ? (
                                                    <BoxImg src={makeImagePath(result.backdrop_path, "w500")} alt="img" />
                                                ) : result.poster_path !== null
                                                ? (
                                                    <BoxImg as="div" style={{ minHeight: "100px", height: "100%", background: `url(${makeImagePath(result.poster_path, "w500")}) center 30% / cover` }} />
                                                )
                                                : <BoxImgNull>Has No Image</BoxImgNull>
                                            }
                                        
                                        <Info 
                                            isDark={isDark}
                                            variants={InfoVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{
                                                type: "tween",
                                            }}
                                        >   
                                            <InfoVoted>{result.vote_average}</InfoVoted>
                                            <h4>{ result.title ? result.title : result.name }</h4>
                                            <InfoOverview>{result.overview}</InfoOverview>
                                            <span>
                                                <span>{ result.release_date ? result.release_date : result.first_air_date + "~" }</span>
                                                <span>voted👩🏼‍🤝‍🧑🏽 {result.vote_count}</span>
                                            </span>
                                        </Info>
                                       
                                    </BoxHoverMotion>
                                </Box>
                            )
                        })}
                    </Row>
                </AnimatePresence>
                <BtnSlider 
                    isDark={isDark}
                    onClick={prevIndex}
                    variants={BtnSliderVariants}
                    initial="normal"
                    whileHover="hover"
                    >
                    <svg width="30" height="80">
                        <line x1="30" y1="0" x2="0" y2="43" strokeWidth="2" stroke="white" />
                        <line x1="30" y1="80" x2="0" y2="42" strokeWidth="2" stroke="white" />
                    </svg>
                </BtnSlider>
                <BtnSlider
                    isDark={isDark}
                    onClick={nextIndex}
                    variants={BtnSliderVariants}
                    initial="normal"
                    whileHover="hover"
                    >
                    <svg width="30" height="80">
                        <line x1="0" y1="0" x2="30" y2="43" strokeWidth="2" stroke="white" />
                        <line x1="0" y1="80" x2="30" y2="42" strokeWidth="2" stroke="white" />
                    </svg>
                </BtnSlider>
            </Slider>

            <AnimatePresence>
                {bigMovieMatch && clickedMovie ? (
                    <>
                        <Overlay 
                            onClick={onModalClose}
                            transition={{
                                delay: 0.3,
                                duration: 0.4
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <BigMovie
                            layoutId={name + bigMovieMatch.params.resultId}
                            transition={{
                                delay: 0.3,
                                duration: 0.4
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {
                                clickedMovie && 
                                <>  
                                    <BtnIcon isDark={isDark} onClick={onModalClose}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M12.45 37.65 10.35 35.55 21.9 24 10.35 12.45 12.45 10.35 24 21.9 35.55 10.35 37.65 12.45 26.1 24 37.65 35.55 35.55 37.65 24 26.1Z" /></svg>
                                    </BtnIcon>
                                    <BigCoverBox isDark={isDark}>
                                        { clickedMovie.backdrop_path
                                            ? <BigCover src={makeImagePath(clickedMovie.backdrop_path)} alt="movie image" />
                                            : <BigCover as="div" style={{ height: "45vw", maxHeight: "400px", background: `url("${makeImagePath(clickedMovie.poster_path)}") no-repeat center / cover` }} />
                                        }
                                    </BigCoverBox>
                                    <BigModalInfoBox isDark={isDark}>
                                            <div>
                                                <BigTitle>
                                                    { clickedMovie.title ? clickedMovie.title : clickedMovie.name }
                                                </BigTitle>
                                                <VoteAverage>{ clickedMovie?.vote_average }</VoteAverage>
                                            </div>
                                            {
                                                bigMovieMatch.params.resultId && pathname === "tv"
                                                ? <ModalTv resultId={bigMovieMatch.params.resultId} pathname={pathname} />
                                                : bigMovieMatch.params.resultId && pathname === "search" && name.includes("Tv")
                                                ? <ModalTv resultId={bigMovieMatch.params.resultId} pathname={pathname} />
                                                : bigMovieMatch.params.resultId && pathname === "search" && name.includes("Movies")
                                                ? <ModalMovie resultId={bigMovieMatch.params.resultId} pathname={pathname} />
                                                : bigMovieMatch.params.resultId && <ModalMovie resultId={bigMovieMatch.params.resultId} pathname={pathname} />
                                            }
                                    </BigModalInfoBox>
                                </>
                            }
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
}

export default ListSlider;