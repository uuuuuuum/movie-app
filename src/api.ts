const API_KEY = "48ceeee8fc360192a20f35921f409abd";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovieAndTv {
    adult: boolean;
    original_title: string;
    release_date: string;
    title: string;
    video: false;
    backdrop_path: string;
    first_air_date: string;
    genre_ids: [];
    id: number;
    name: string;
    origin_country: [string];
    original_language: string
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string
    vote_average: number;
    vote_count: number;
}
export interface IGetMoviesAndTvResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovieAndTv[];
    total_pages: number;
    total_results: number;
}

//Get Now Playing
export function getMoviesNowPlaying() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//Get Top Rated
export function getMoivesTopRated() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//Get Popular
export function getMoivesPopular() {
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
//Get Upcoming
export function getMoivesUpcoming() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
    
//Get Latest??????
export interface IMovieLatest {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection: null;
    budget: number;
    genres: [{    
        id: number;
        name: string;
    }];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    production_companies: [];
    production_countries: [];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: []
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}
export function getMoviesLatest() {
    return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}

// getMovieDetails for Modal
export interface IMovieDetails {
    adult: false
    backdrop_path: string;
    budget: number;
    genres: [{
        id: number;
        name: string;
    }];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: [{
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }];
    production_countries: [{
        iso_3166_1: string;
        name: string;
    }];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: [{
        english_name: string;
        iso_639_1: string;
        name: string;
    }]
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}
export function getMovieDetails(resultId:string) {
    return fetch(`${BASE_PATH}/movie/${resultId}?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}


export interface ITvDetails {
    adult: false
    backdrop_path: string;
    created_by: [{
        
    }]
    episode_run_time: [number]
    first_air_date: string;
    genres: [{
        credit_id: string;
        gender: number;
        id: number;
        name: string;
        profile_path: string | null
    }]
    homepage: string;
    id: number;
    in_production: boolean;
    languages: [string]
    last_air_date: string;
    last_episode_to_air: {
        air_date: string;
        episode_number: number;
        id: number;
        name: string;
        overview: string;
        production_code: string;
        runtime: string | null;
        season_number: number;
        still_path: string | null;
        vote_average: number;
        vote_count: number;
    }
    name: string;
    networks: [{
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }]
    next_episode_to_air: {
        air_date: string;
        episode_number: number;
        id: number;
        name: string;
        overview: string;
        production_code: string;
        runtime: string | null;
        season_number: number;
        still_path: string | null;
        vote_average: number;
        vote_count: number;
    }
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: [string]
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: [];
    production_countries: [];
    seasons:[{
        air_date: string;
        episode_count: number;
        id: number;
        name: string;
        overview: string;
        poster_path: string;
        season_number: number;
    }];
    spoken_languages: [{
        english_name: string;
        iso_639_1: string;
        name: string;
    }];
    status: string;
    tagline: string;
    type: string;
    vote_average: number;
    vote_count: number;
}
export function getTvDetails(resultId:string) {
    return fetch(`${BASE_PATH}/tv/${resultId}?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}


// getSearch
export interface IGetSearchResult {
    page: number;
    results: IMovieAndTv[];
    total_pages: number;
    total_results: number;
}

export function getSearchAll(keyword:string | null) {
    return fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}}&page=1&include_adult=false`).then(
        (response) => response.json()
    )
}
export function getSearchMovies(keyword:string | null) {
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}}&page=1&include_adult=false`).then(
        (response) => response.json()
    )
}
export function getSearchTv(keyword:string | null) {
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}}&page=1&include_adult=false`).then(
        (response) => response.json()
    )
}

// Tv Shows
export function getTvAiringToday() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}
export function getTvOntheAir() {
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}
export function getTvPopular() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}
export function getTvTopRated() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    )
}