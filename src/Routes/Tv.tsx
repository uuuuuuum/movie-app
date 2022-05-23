import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getTvAiringToday, getTvOntheAir, getTvPopular, getTvTopRated, IGetMoviesAndTvResult } from "../api";
import { isDarkState } from "../atoms";
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
interface IBanner {
    bgphoto: string;
    isDark: boolean;
}
const Banner = styled.div<IBanner>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    min-height: 100vh;
    background-image: linear-gradient(${(props) => props.isDark ?
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

const SliderWrapper = styled.div`
    margin: -100px auto 0;
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

function Tv()  {
    const isDark = useRecoilValue(isDarkState);

    const {data: dataAiringToday, isLoading: isLoadingAiringToday} = useQuery<IGetMoviesAndTvResult>(["tv", "airingToday"], getTvAiringToday);
    const {data: dataOntheAir, isLoading: isLoadingOntheAir} = useQuery<IGetMoviesAndTvResult>(["tv", "ontheAir"], getTvOntheAir);
    const {data: dataPopular, isLoading: isLoadingPopular} = useQuery<IGetMoviesAndTvResult>(["tv", "popular"], getTvPopular);
    const {data: dataTopRated, isLoading: isLoadingTopRated} = useQuery<IGetMoviesAndTvResult>(["tv", "topRated"], getTvTopRated);

    const isLoading = isLoadingAiringToday && isLoadingOntheAir && isLoadingPopular && isLoadingTopRated;
    return (
        <>
            <Helmet>
                <title>My Netflix - Tv Shows</title>
            </Helmet>
            <Wrapper>
                {isLoading ? <Loader>Loading...</Loader>
                : <>
                    <Banner 
                        isDark={isDark}
                        bgphoto={makeImagePath(dataAiringToday?.results[0].backdrop_path || "")}>
                        <div>
                            <Title>{dataAiringToday?.results[0].name}</Title>
                            <Overview>{dataAiringToday?.results[0].overview}</Overview>
                        </div>
                    </Banner>

                    <SliderWrapper>
                        <SliderGroup>
                            <h2>Airing Today TV Shows</h2>
                            { dataAiringToday && <ListSlider isLoading={isLoadingAiringToday} data={dataAiringToday} name={"airingToday"} /> }
                        </SliderGroup>
                        <SliderGroup>
                            <h2>On the Air TV Shows</h2>
                            { dataOntheAir && <ListSlider isLoading={isLoadingOntheAir} data={dataOntheAir} name={"ontheAir"} /> }
                        </SliderGroup>
                        <SliderGroup>
                            <h2>Popular TV Shows</h2>
                            { dataPopular && <ListSlider isLoading={isLoadingPopular} data={dataPopular} name={"popular"} /> }
                        </SliderGroup>
                        <SliderGroup>
                            <h2>Top Rated TV Shows</h2>
                            { dataTopRated && <ListSlider isLoading={isLoadingTopRated} data={dataTopRated} name={"topRated"} /> }
                        </SliderGroup>
                    </SliderWrapper>
                </>
                } 
            </Wrapper>
        </>
    );
}

export default Tv;