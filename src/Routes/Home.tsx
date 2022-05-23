import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getMoivesPopular, getMoivesTopRated, getMoivesUpcoming, getMoviesNowPlaying, IGetMoviesAndTvResult } from "../api";
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

function Home()  {
    const isdark = useRecoilValue(isdarkState);
    
    const {data: dataNowPlaying, isLoading: isLoadingNowPlaying} = useQuery<IGetMoviesAndTvResult>(["movie", "nowPlaying"], getMoviesNowPlaying);
    const {data: dataTopLated, isLoading: isLoadingTopLated } = useQuery<IGetMoviesAndTvResult>(["movie", "topLated"], getMoivesTopRated);
    const {data: dataPopular, isLoading: isLoadingPopular } = useQuery<IGetMoviesAndTvResult>(["movie", "popular"], getMoivesPopular);
    const {data: dataUpcoming, isLoading: isLoadingUpcoming } = useQuery<IGetMoviesAndTvResult>(["movie", "upcoming"], getMoivesUpcoming);

    const isLoading = isLoadingNowPlaying && isLoadingTopLated && isLoadingPopular && isLoadingUpcoming;
    return (
        <>
            <Helmet>
                <title>My Netflix - Home</title>
            </Helmet>
            <Wrapper>
                {isLoading ? <Loader>Loading...</Loader>
                : <>
                    <Banner 
                        isdark={isdark}
                        bgphoto={makeImagePath(dataNowPlaying?.results[0].backdrop_path || "")}>
                        <div>
                            <Title>{dataNowPlaying?.results[0].title}</Title>
                            <Overview>{dataNowPlaying?.results[0].overview}</Overview>
                        </div>
                    </Banner>

                    <SliderWrapper>
                        <SliderGroup>
                            <h2>Now Playing Movies</h2>
                            { dataNowPlaying && <ListSlider isLoading={isLoadingNowPlaying} data={dataNowPlaying} name={"nowPlaying"} /> }
                        </SliderGroup>
                        
                        <SliderGroup>
                            <h2>Top Lated Movies</h2>
                            { dataTopLated && <ListSlider isLoading={isLoadingTopLated} data={dataTopLated} name={"topLated"} /> }
                        </SliderGroup>

                        <SliderGroup>
                            <h2>Popular Movies</h2>
                            { dataPopular && <ListSlider isLoading={isLoadingPopular} data={dataPopular} name={"popular"} /> }
                        </SliderGroup>

                        <SliderGroup>
                            <h2>Upcoming Movies</h2>
                            { dataUpcoming && <ListSlider isLoading={isLoadingUpcoming} data={dataUpcoming} name={"upcoming"} /> }
                        </SliderGroup>
                    </SliderWrapper>
                </>
                }
            </Wrapper>
        </>
    );
}

export default Home;