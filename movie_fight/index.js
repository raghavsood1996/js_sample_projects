
const autoCompleteConfig = {
  //how do we render movie options
  renderOption(movie){
    const imgSrc = movie.poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}"/>
    ${movie.Title}
    `;
  },


  //sets the input value after click
  inputValue(movie)
  {
    return movie.Title;
  },

  // fetch movie data
  async fetchData(searchTerm)
  {
    const response = await axios.get("http://www.omdbapi.com", {
      params: {
        apikey: "c6654452",
        s: searchTerm,
      },
    });
  
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  }

}
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  //what happens once we select the movie
  onOptionSelect(movie)
  {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }

})
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),

  //what happens once we select the movie
  onOptionSelect(movie)
  {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  }
  
})

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "c6654452",
      i: movie.imdbID,
    },
  });

 summaryElement.innerHTML = movieTemplate(response.data);

 if(side === "left")
 {
   leftMovie= response.data;
 }
 else{
   rightMovie = response.data;
 }

 if(rightMovie && leftMovie)
 {
   runComparison();
 }
};

const runComparison = () =>{
  
  const leftStats = document.querySelectorAll('#left-summary .notification');
  const rightStats = document.querySelectorAll('#right-summary .notification');

  leftStats.forEach((leftStat, index) => {
    const rightStat = rightStats[index];

    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);
    if(rightSideValue > leftSideValue)
    {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
    else
    {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

const movieTemplate = (movieDetail) => {

  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));

  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if(isNaN(value)){
      return prev;
    }
    else{
      return prev + value;
    }
  },0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}"/>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h1>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">BoxOffice</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB votes</p>
    </article>
  `;
};
