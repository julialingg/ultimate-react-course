import React, { useEffect, useState } from 'react';
import './App.css';
import Movie from './component/Movie';
import WatchedMovie from './component/WatchedMovie';
import StarRating from './component/StarRating';

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;

  Runtime: string;
  imdbRating: number;
  Genre: string;
  Released: string;
  Writer: string;

  userRating: number;
}



const KEY = "6bc6360b";

function App() {
  const [query, setQuery] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [selectedId, setSelectedId] = useState<string>("");

  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);

  function handleSetWatchedMovie(newMovie: Movie) {
    setWatchedMovies(watchedMovies => [...watchedMovies, newMovie])
    setSelectedId("")

  }

  function onSelectId(id: string) {
    setSelectedId(id);
  }

  // fetch movies by searching 
  useEffect(
    function () {
      // 用来取消（中断）当前的 fetch 请求。
      // fetchMovies 会随着 query 的变化频繁触发，比如：用户快速输入：a → av → ave → avengers
      // 每一次输入都会触发一次请求
      // ⚠️ 问题是：// 旧请求可能比新请求更晚返回  会导致 数据错乱（race condition）
      const controller = new AbortController();  //会生成一个控制对象，里面有一个 signal

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }  //把signal传给fetch   让这个请求受 controller 控制
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          console.log(data.Search)
          setMovies(data.Search);
          setError("");
        } catch (err: any) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      // handleCloseMovie();
      fetchMovies();

      // useEffect 的 cleanup 函数
      //  React 规定：   如果 useEffect 返回一个函数，这个函数会在：
      // 依赖变化前执行
      // 组件卸载时执行
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <div >
      <SearchBar query={query} setQuery={setQuery} ></SearchBar>


      {/* 两列列表，左右排列 */}

      {/* 这一层相当于 Main  Main占据剩余空间*/}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* card类相当于 Box */}
        <div className="card" >
          {/* 渲染列表 加上ul li */}
          <ul>
            <MovieList>
              {movies?.map(
                m => <Movie movie={m} onSelectId={onSelectId} key={m.imdbID} ></Movie>
              )}
            </MovieList>
          </ul>
        </div>

        <div className="card">

          {selectedId !== "" ?
            <MovieDetails selectedId={selectedId} handleSetWatchedMovie={handleSetWatchedMovie}></MovieDetails> :
            <>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", paddingBottom: "1rem", backgroundColor: "#343a40", borderRadius: "1rem", paddingLeft: "1rem" }}>
                <h3> Movies You Watched</h3>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div>#️⃣XX movies</div>
                  <div>⭐️8.65</div>
                  <div>🌟9.5</div>
                  <div>⏳158</div>
                </div>
              </div>

              <ul>
                <WatchedMovies>
                  {watchedMovies.map(
                    m => <WatchedMovie watchedMovie={m} key={m.imdbID}></WatchedMovie>
                  )}
                </WatchedMovies>
              </ul>
            </>}

        </div>


      </div >
    </div >
  );
}

interface MovieDetailsProps {
  selectedId: string;
  handleSetWatchedMovie: (movie: Movie) => void;

}
function MovieDetails({ selectedId, handleSetWatchedMovie }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie>();
  const [userRating, setUserRating] = useState<number>(0);

  function handleSetUserRating(rating: number) {
    setUserRating(rating);
  }
  function handleAddWatched(movie: Movie) {
    console.log("userRating", userRating)
    if (userRating !== 0) {
      const newMovie = { ...movie, userRating: userRating }
      handleSetWatchedMovie(newMovie);
    }
  }


  //  search details    
  useEffect(function () {
    async function fetchMovieDetails() {
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      const data = await res.json()
      setMovie(data)
      console.log("MovieDetails", data)
    }
    fetchMovieDetails()


  }, [selectedId])

  return (
    <>
      {movie && (
        <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
          <div className='movieDetails'>
            {/* 第一列 */}
            <img src={movie.Poster} alt='movie poster' />
            {/* 第二列 */}
            <div>
              <h2>{movie.Title}</h2>
              <span>{movie.Released}</span> <span> ~ {movie.Runtime}</span>
              <h5>{movie.Writer}</h5>
              <h5>⭐️ {movie.imdbRating}</h5>
              {/* 用户评分 */}
              <h5>⭐️ {movie.userRating}</h5>

            </div>
          </div>
          <StarRating maxRating={10} handleSetUserRating={handleSetUserRating} />
          <button onClick={() => handleAddWatched(movie)}> Add to list</button>

        </div>)}

    </>
  )

}

interface SearchBarProps {
  query: string;
  // TODO type
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

// 更推荐的传递props方式：
// interface SearchBarProps {
//   query: string;
//   onQueryChange: (value: string) => void;
// }

// function SearchBar({ query, onQueryChange }: SearchBarProps) {
//   return (
//       <input
//         value={query}
//         onChange={(e) => onQueryChange(e.target.value)}
//       />    
//   );
// }
// 父组件里：
//  {/* <SearchBar query={query} onQueryChange={setQuery} /> */ }

//这里直接传入父组件的useState的两个return很方便    { query, setQuery }  直接就和input里面的值联系上了   但是更好的做法是把setQuery换成onQueryChange  其他都不变 
function SearchBar({ query, setQuery }: SearchBarProps) {

  return (
    // space-between 是左中右分散布局
    <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#6741d9" }}>
      <h3 style={{ marginLeft: "2rem" }} > 🍿 usePopcorn </h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        style={{ marginTop: "1rem", marginBottom: "1rem", borderRadius: "0.5rem", width: "15rem" }} />
      <h4 style={{ marginRight: "2rem" }}> Found 0 results</h4>
    </div>
  )

}

interface MovieListProps {
  children: React.ReactNode;

}
function MovieList({ children }: MovieListProps) {
  return (
    // TODO  why必须有<> </>   {children} 不保证只有一个根节点   它只是“一个值”，但这个值内部可以包含多个元素
    <>   {children}</>
  )

}

interface WatchedMoviesProps {
  children: React.ReactNode;

}
function WatchedMovies({ children }: WatchedMoviesProps) {
  return (
    <>   {children}</>
  )
}

export default App;
