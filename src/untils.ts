export function makeImagePath(id:string, format?:string) {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`;
}

export function clickedMovieFn(bigMovieMatch:any, data:any) {
    if(bigMovieMatch.params.movieId) {
        return [data.results, bigMovieMatch.params.movieId];
    }
}