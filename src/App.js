 import React,{useState , useEffect, useCallback} from 'react';
 import AddMovie from './components/AddMovie';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [movies, setmovies] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState(null);

  const fetchmovieHandler = useCallback (async () => {
   setIsLoading(true);
   setError(null);
   try{
    const response =  await fetch('https://react-http-e7802-default-rtdb.firebaseio.com/movies.json');

    if (!response.ok){
      throw new error('something went wrong');
    }

    const data = await response.json()
    // console.log(data);
    const Loadedmovies = [];
    for ( const key in data){
      Loadedmovies.push({
        id: key,
        title: data[key].title,
        openingText: data[key].openingText,
        releaseDate: data[key].releaseDate,
      });
    }
          setmovies(Loadedmovies);
          // setIsLoading (false);
   }
   catch(error){
    setError(error.message);
  }
  setIsLoading (false);
  }, []);

  useEffect(() => {
    fetchmovieHandler();
  },[fetchmovieHandler]);
 async function addMovieHandler(movie){
  const response = await fetch('https://react-http-e7802-default-rtdb.firebaseio.com/movies.json',{
      method:'POST',
      body: JSON.stringify(movie),
      headers: {
      'content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);  
  }

  let content = <p>found no movies.</p>;
  if (movies.length > 0 ){
    content = <MoviesList movies={movies} />;
  }
  if (error){
     content = <p>{error}</p>
  }
  if (isLoading) {
      content = <p>Loading..</p>;
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchmovieHandler}>Fetch Movies</button>
      </section>
      <section>
     {content}
      </section>
    </React.Fragment>
  );
}

export default App;
