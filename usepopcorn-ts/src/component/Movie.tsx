import type { Movie } from "../App"

interface MovieProps {
  movie: Movie;
  onSelectId: (id: string) => void;

}


export default function Movie({ movie, onSelectId }: MovieProps) {
  function handleSelect(id: string) {

    onSelectId(id)

  }


  return (
    // li可以onclicke
    <li className="movie" onClick={() => handleSelect(movie.imdbID)}>
      {/* 第一列 */}
      <img src={movie.Poster} alt={movie.Title} ></img>

      {/* 第二列 */}

      < div className="movieTitle">{movie.Title}</div>
      <div className="movieYear">{movie.Year}</div>


    </li>
  )

}