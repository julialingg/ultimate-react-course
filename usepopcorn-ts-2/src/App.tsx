import React, { useEffect, useState } from 'react';

import './App.css';
import StarRating from './StarRating';

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
  Plot: string;

  userRating: number;
}

const KEY = "6bc6360b";

function App() {
  const [query, setQuery] = useState<string>("");

  const [movies, setMovies] = useState<Movie[]>([]);

  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [selectedID, setSelectedID] = useState<string>("");

  useEffect(function () {
    async function FetchMovies() {
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);

      const data = await res.json();
      // 注意，你自己并不知道返回数据到底是什么样子的，所以要打印看看才知道到底用什么字段来setMovies
      // console.log("data", data)
      setMovies(data.Search);
    }

    FetchMovies();
  }, [query])


  function handleSelectMovie(movie: Movie) {
    // 选中和取消选中的逻辑都在这
    setSelectedID(selectedID => selectedID === movie.imdbID ? "" : movie.imdbID);

  }
  function handleSetWatched(movie: Movie) {
    setWatchedMovies(watchedMovies => [...watchedMovies, movie]);
    setSelectedID("");

  }
  return (
    <>
      <Header query={query} onSetQuery={setQuery} movies={movies} />
      <main style={{
        display: "flex", justifyContent: "center",
        gap: "4rem",
        // alignItems: "flex-start"
      }}>
        {/* singleShowCard 不要单独使用 style={{ marginRight: "4rem" }}  更好的策略是在上一层加gap */}
        <div className='singleShowCard' >
          <ul className='movies'>
            <MovieList >
              {movies?.map(m => <Movie movie={m} key={m.imdbID} onSelectMovie={handleSelectMovie} />)}
            </MovieList>
          </ul>
        </div>

        <div className='singleShowCard'>

          {/* moviesDetails 显示的时候宽度过大  TODO 怎么固定每个card的宽度不变 */}
          {/* flex 布局下子项默认会被内容撑开 */}
          {selectedID !== "" ? <MovieDetail selectedID={selectedID} onAddWatched={handleSetWatched} /> :
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h2>Movies You Watched</h2>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {/* 注意 有可能没有watched 所以要设置0 */}
                  <div>#️⃣ {watchedMovies.length || 0} movies</div>
                  <div>⭐️8.65</div>
                  <div>🌟9.5</div>
                  <div>⏳158</div>
                </div>
              </div>

              <ul className='movies' style={{ padding: "0 0" }}>
                <WatchedMovieList >
                  {watchedMovies?.map(m => <WatchedMovie movie={m} key={m.imdbID} />)}
                </WatchedMovieList>
              </ul>
            </>}
        </div>
      </main>
    </>
  );
}

interface MovieDetailProps {
  selectedID: string;
  onAddWatched: (movie: Movie) => void;

}
function MovieDetail({ selectedID, onAddWatched }: MovieDetailProps) {

  const [movie, setMovie] = useState<Movie>();
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(function () {
    async function fetchMovieDetails() {

      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`);
      const data = await res.json();
      // console.log("details", data);

      setMovie(data);
    }
    fetchMovieDetails()
  }, [selectedID])

  function handleSetUserRating(value: number) {

    setUserRating(value);

  }

  // 这个函数不需要有参数,因为这个组件里面就有movie这个state了  直接用就行.
  function handleSetWatchedMovie() {
    // 没有movie的这个提前返回很重要 不要会报错   因为  movie 可能是 undefined
    if (!movie) return;
    const watched = { ...movie, userRating: userRating }
    if (userRating !== 0) onAddWatched(watched);

  }

  return (
    //  TODO 如何避免movie && ?
    // movie 在某些时刻是 undefined，但你却直接访问了它的属性{movie.Poster}   所以会报错, 为了不报错才需要{movie && (...)}  这种解法简单直接,是比较常见的
    // 更好的解法是:
    //     if (!movie) return <p>Loading...</p>;
    // return (
    //   <div>
    //     正常代码
    //   </div>
    // );


    //     生命周期是这样的：
    // 组件第一次 render 👉 movie = undefined
    // 发起 fetch（异步）
    // 这时候 UI 已经开始渲染了
    // 你访问了 movie.Poster ❌ 崩了
    // fetch 返回 → setMovie(data) → 才有值

    <>

      {movie && (<>
        <div className='watchedMovieInfo'>
          <img src={movie.Poster} alt={`${movie.Title} Poster`} />
          <div>
            <h3>{movie.Title} </h3>
            <h5>{movie.Released} ~ {movie?.Runtime} </h5>
            <h5>{movie.Genre}  </h5>
            <h5>⭐️ {movie.imdbRating}  </h5>
          </div>
        </div>

        <StarRating onSetRating={handleSetUserRating} />

        <button onClick={handleSetWatchedMovie}>Add to list</button>
        <div>
          <p>{movie.Plot}</p>
        </div></>)}
    </>
  )
}



interface MovieProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
}
function Movie({ movie, onSelectMovie }: MovieProps) {
  return (
    <li onClick={() => onSelectMovie(movie)}>
      <img src={movie.Poster} alt={`${movie.Title} Poster`} />
      <div>
        <p style={{ margin: "0.5rem 0" }}>{movie.Title} </p>
        <p>{movie.Year} </p>
      </div>
    </li>
  )
}

interface WatchedMovieProps {
  movie: Movie;

}
function WatchedMovie({ movie }: WatchedMovieProps) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} Poster`} />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* css不对的时候看inspect里面每个元素的margin和padding  最快 */}
        <h4 style={{ margin: "0 0", textAlign: "start" }}>{movie.Title} </h4>
        <div style={{ display: "flex", gap: "1rem" }}>
          <h5>⭐️{movie.imdbRating} </h5>
          <h5>🌟{movie.userRating} </h5>
          <h5>⏳{movie.Runtime} </h5>


        </div>
      </div>
    </li>
  )
}


interface HeaderProps {
  query: string;
  onSetQuery: (query: string) => void;
  movies: Movie[];

}
function Header({ query, onSetQuery, movies }: HeaderProps) {

  // 当 movies 是 undefined 或 null 时   直接访问 .length 会崩
  // 加了问号   如果 movies 存在，就取 .length，否则返回 undefined，不要报错   || 0是提供一个默认值 
  // 常见场景：
  // API 数据还没返回
  // props 还没传下来（React 常见）
  // 可选字段（可能不存在） 

  const num = movies?.length || 0;
  return (

    <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#6741d9" }}>
      <h3>usePopcorn</h3>
      <input value={query} onChange={(e) => onSetQuery(e.target.value)} placeholder='Search....' />
      <h4>Found  {num} top results</h4>
    </div>
  )

}

interface MovieListProps {
  children: React.ReactNode;
}
function MovieList({ children }: MovieListProps) {
  return (
    <> {children}</>
  )
}

interface WatchedMovieListProps {
  children: React.ReactNode;
}
function WatchedMovieList({ children }: WatchedMovieListProps) {
  return (
    <> {children}</>
  )
}


export default App;
