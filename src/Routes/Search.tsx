import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getSearchMovies, getSearchTv, IGetMoviesAndTvResult } from "../api";
import { isdarkState } from "../atoms";
import ListSlider from "../Components/ListSlider";
import { makeImagePath } from "../untils";

const Wrapper = styled.div`
    background: ${(props) => props.theme.bgColor};
`
const Loader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20vh;
`
const Banner = styled.div<{bgphoto:string, isdark:boolean}>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    min-height: 100vh;
    background-image: linear-gradient(${(props) => props.isdark ?
        "rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1) 80%"
        : "rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), #ededed 70%"
    }), url(${(props) => props.bgphoto});
    background-position: 80% top;
    background-size: cover;
    position: relative;

    & > div {
        padding: 60px;
        position: absolute;
        left: 0;
        bottom: 20%;

        @media screen and (max-width: 1024px) {
            padding: 40px;
        }
        @media screen and (max-width: 768px) {
            padding: 20px;
        }
    }
`;
const Title = styled.h2`
    margin-bottom: 20px;
    font-size: 4.2em;
    line-height: 1.2em;
    font-weight: 900;

    @media screen and (max-width: 480px) {
        font-size: 3.2em;
    }
`;
const Overview = styled.p`
    width: 50%;
    max-height: 7em;
    font-size: 1.3em;
    font-weight: 300;
    line-height: 1.4em;
    letter-spacing: -0.5px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    
    @media screen and (max-width: 480px) {
        width: 70%;
    }
`;

const SearchFormBox = styled.div`
    margin: 0 auto 80px;
    max-width: 650px;
`;
const SearchForm = styled(motion.form)<{isdark: boolean}>`
    display: flex;
    align-items: center;
    padding: 0;
    color: white;
    background-color: rgba(17, 17, 17, 0);
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 4px;
    position: relative;

    button {
        padding: 8px 16px;
        border: 0;
        background-color: transparent;

        @media screen and (max-width: 480px) {
            & {
                padding: 8px;
            }
            svg {
                height: 30px;
            }
        }
    }
    svg {
        height: 36px;
        cursor: pointer;
        fill: ${(props) => props.isdark ? "white" : "1px solid black"};
    }

    input {
        border: ${(props) => props.isdark ? null : "1px solid black"};
    }
`;
const Input = styled.input`
    padding: 0 12px;
    width: 100%;
    height: 60px;
    transform-origin: right center;
    background-color: rgba(255, 255, 255, 1);
    border: 0;
    border-radius: 2px;
    font-size: 2.4em;
    line-height: 60px;
    text-align: center;

    @media screen and (max-width: 768px) {
        height: 50px;
        line-height: 50px;
        font-size: 2.1em;
    }

    @media screen and (max-width: 480px) {
        height: 40px;
        line-height: 40px;
        font-size: 1.8em;
    }
`;

const SliderWrapper = styled.div`
    margin: -140px auto 0;
    padding: 0 20px 80px;
    max-width: 1480px;
    position: relative;

    @media screen and (max-width: 768px) {
        padding-bottom: 60px;
    }
    
    @media screen and (max-width: 480px) {
        padding-bottom: 40px;
    }
`;
const SliderGroup = styled.div`
    display: flex;
    flex-direction: column;
    h2 {
        margin-bottom: 8px;
        font-size: 1.4em;
        font-weight: bold;

        @media screen and (max-width: 480px) {
            margin-bottom: 0;
        }
    }

    & + div {
        margin-top: 100px;

        @media screen and (max-width: 768px) {
            margin-top: 80px;
        }
        @media screen and (max-width: 480px) {
            margin-top: 60px;
        }
    }
`;

interface IForm {
    keyword: string;
}
function Search()  {
    const isdark = useRecoilValue(isdarkState);
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const keyword = search.get("keyword");

    const { 
        data : dataSearchMovies,
        isLoading: isLoadingSearchMovies
    } = useQuery<IGetMoviesAndTvResult>(["search", "movies"], () => getSearchMovies(keyword));

    const {
        data : dataSearchTv,
        isLoading: isLoadingSearchTv
    } = useQuery<IGetMoviesAndTvResult>(["search", "tv"], () => getSearchTv(keyword));

    const isLoading = isLoadingSearchMovies && isLoadingSearchTv;
    
    //Search
    const navigate = useNavigate();
    const { register, handleSubmit, setValue } = useForm<IForm>();
    setValue("keyword", keyword ? keyword : "");
    const onValid = (data: IForm) => {
        setValue("keyword", "");
        navigate(`/search?keyword=${data.keyword}`);
        window.location.reload();
    }

    return (
        <>
            <Helmet>
                <title>My Netflix - Search</title>
            </Helmet>
            {
                isLoading ? <Loader>Loading...</Loader>
                : (
                    <>
                        <Banner 
                            isdark={isdark}
                            bgphoto={
                                dataSearchMovies?.results[0].backdrop_path 
                                ? makeImagePath(dataSearchMovies?.results[0].backdrop_path || "")
                                : makeImagePath(dataSearchMovies?.results[0].poster_path || "")
                            }>
                            <div>
                                <Title>{dataSearchMovies?.results[0].title}</Title>
                                <Overview>{dataSearchMovies?.results[0].overview}</Overview>
                            </div>
                        </Banner>
                        <SliderWrapper>
                            <SearchFormBox>
                                <SearchForm 
                                    isdark={isdark}
                                    onSubmit={handleSubmit(onValid)}
                                >
                                    <Input 
                                        {...register("keyword", {required: true, minLength: 2})}
                                        placeholder="Search for movie or tv show..." />
                                    <button type="submit">
                                        <motion.svg
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                            ></path>
                                        </motion.svg>
                                    </button>
                                </SearchForm>
                            </SearchFormBox>
                            {
                                dataSearchMovies &&
                                <SliderGroup>
                                    <h2>Movies</h2>
                                    <ListSlider isLoading={isLoadingSearchMovies} data={dataSearchMovies} name={"searchMovies"} />
                                </SliderGroup>
                            }
                            {
                                dataSearchTv &&
                                <SliderGroup>
                                    <h2>Tv Shows</h2>
                                    <ListSlider isLoading={isLoadingSearchTv} data={dataSearchTv} name={"searchTv"} />
                                </SliderGroup>
                            }

                            

                        </SliderWrapper>
                    </>
                )
            }
            
        </>
    );
}

export default Search;