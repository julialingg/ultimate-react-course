import type { Movie } from "../App"

interface WatchedMovieProps {
  watchedMovie: Movie;

}


export default function WatchedMovie({ watchedMovie }: WatchedMovieProps) {


  return (
    <>


      <li className="movie">
        {/* 第一列 */}
        <img src={watchedMovie.Poster} alt={watchedMovie.Title}></img>

        {/* 第二列 */}

        < div className="watchedMovieTitle">{watchedMovie.Title}</div>
        <div style={{
          display: "flex", gap: "1rem"
        }}>
          < div className="watchedMovieInfo">⭐️{watchedMovie.imdbRating}</div>
          < div className="watchedMovieInfo">🌟{watchedMovie.userRating}</div>
          < div className="watchedMovieInfo">⏳{watchedMovie.Runtime}</div>
        </div>

      </li>
    </>
  )

}