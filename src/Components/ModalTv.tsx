import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getTvDetails, ITvDetails } from "../api";
import { isdarkState } from "../atoms";
import { makeImagePath } from "../untils";

interface IBtnTheme {
    isdark: boolean;
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
        border-color: ${(props) => props.isdark ? "#323232" : "#e7e7ed" };
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
            background-color: ${(props) => props.isdark ? "#333" : "#e2e2e7" };
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

export interface IModalTv {
    resultId: string;
    pathname: string;
}

function ModalTv({ resultId }: IModalTv) {
    const isdark = useRecoilValue(isdarkState);
    const { isLoading, data } = useQuery<ITvDetails>(["movie", "details"], () => getTvDetails(resultId));

    return (
        isLoading ? 
        <div>loading</div>
        : (
            <div>
                <ShortInfoGroup>
                    { data?.tagline ? <Tagline>" {data?.tagline} "</Tagline> : null }
                    { data?.tagline ? <Badge>{data?.seasons.length} SEASONS</Badge> : null }
                </ShortInfoGroup>
                <BigOverview>{data?.overview}</BigOverview>
                <InfoGroup isdark={isdark}>
                    <li>
                        <span>genres</span>
                        <ul>
                            { data?.genres.map((gen) => <li key={gen.id}>{gen.name}</li>) }
                        </ul>
                    </li>
                    <li>
                        <span>date </span>
                        <span>{ data?.first_air_date } ~ { data?.last_air_date } </span>
                    </li>
                    <li>
                        <span>country </span>
                        <span>{ data?.origin_country }</span>
                    </li>
                    <li>
                        <span>popularity </span>
                        <span>{ data?.popularity }</span>
                    </li>
                    {
                        data?.episode_run_time ? (
                            <li>
                                <span>runtime </span>
                                <span>{ data?.episode_run_time }</span>
                            </li>
                        ) : null
                    }
                    {
                        data?.homepage ? (
                            <li>
                                <span>homepage </span>
                                <span>{ data?.homepage }</span>
                            </li>
                        ) : null
                    }
                    
                </InfoGroup>
            </div>
        )
    )
}

export default ModalTv;