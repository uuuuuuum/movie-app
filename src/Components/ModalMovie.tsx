import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getMovieDetails, IMovieDetails } from "../api";
import { isDarkState } from "../atoms";

interface IBtnTheme {
    isDark: boolean;
}

const BigOverview = styled.p`
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.4em;
    font-weight: 200;
    max-width: 79%;
    text-align: right;
    margin: 0 0 auto auto;

    @media screen and (max-width: 768px) {
        max-width: unset;
        text-align: left;
    }
`;
const InfoGroup = styled.ul<IBtnTheme>`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 40px;

    & > li {
        min-width: calc(100% / 4 - 15px);
        padding: 12px;
        border: 1px solid #323232;
        border-color: ${(props) => props.isDark ? "#323232" : "#e7e7ed" };
        border-radius: 2px;
    }
    li {
        display: flex;
        align-items: center;
        font-size: 14px;

        span:first-child {
            display: inline-block;
            margin-right: 10px;
            padding: 6px; 
            background-color: ${(props) => props.isDark ? "#333" : "#e2e2e7" };
            border-radius: 4px;
            font-size: 12px;
        }

        li {
            margin-right: 14px;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    ul {
        display: flex;
        align-items: center;
    }
`;

const ShortInfoGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin: 25px 0 15px;
`;

const Badge = styled.span`
    padding: 4px 6px;
    border-radius: 2px;
    background: ${(props) => props.theme.textColor_1};
    color: ${(props) => props.theme.bgColor};
    font-size: 12px;
`;

const Tagline = styled.span`
    font-size: 1.2em;
`;

export interface IModalMovie {
    resultId: string;
    pathname: string;
}

function ModalMovie({ resultId, pathname }: IModalMovie) {
    const isDark = useRecoilValue(isDarkState);
    const { isLoading, data } = useQuery<IMovieDetails>(["movie", "details"], () => getMovieDetails(resultId));

    return (
        isLoading ? 
        <div>loading</div>
        : (
            <div>
                <ShortInfoGroup>
                    { data?.tagline ? <Tagline>" {data?.tagline} "</Tagline> : null }
                </ShortInfoGroup>
                <BigOverview>{
                    data?.overview ? data?.overview : "there is no overview for this movie"
                }</BigOverview>
                <InfoGroup isDark={isDark}>
                    <li>
                        <span>genres</span>
                        <ul>
                            { data?.genres.map((gen) => <li key={gen.id}>{gen.name}</li>) }
                        </ul>
                    </li>
                    <li>
                        <span>date </span>
                        <span>{ data?.release_date }</span>
                    </li>
                    <li>
                        <span>status </span>
                        <span>{ data?.status }</span>
                    </li>
                    <li>
                        <span>popularity </span>
                        <span>{ data?.popularity }</span>
                    </li>
                    {
                        data?.runtime ? (
                            <li>
                                <span>runtime </span>
                                <span>{ data?.runtime }</span>
                            </li>
                        ) : null
                    }
                    
                </InfoGroup>
            </div>
        )
    )
}

export default ModalMovie;