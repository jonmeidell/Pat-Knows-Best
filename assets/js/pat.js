
const pat = {

  // Variables For The Pat Class
  recommendations: [],
  gameType: "",

  /**
   * This is the main search method. Searches any api and returns the results in json.
   * @param {string} url - The Url you want to use in the fetch.
   * @param callback
   * @return {json}
   */
  search(url, callback) {
    $.ajax({
      url: url,
      method: "GET",
      success: function (result) {
        callback(result);
      }
    });
  },

  /**
   * Searches the rawg.io api for the game provided, along with what platform they would like.
   * @param {string} searchTerm - The game we are searching for.
   * @param {number} platform - The platform that we want to search under that we get from platform dropdown.
   * @param {Object} options - The Options for the search.
   * @param {number} [options.page=1] - The Page we are currently on.
   * @param {number} [options.limit=3] - The amount of items we will retrieve at a time.
   * @param {string} [options.order="raiting"] - Order the results by this.
   *
   * @param callback
   */
  searchVideoGames(searchTerm, platform, options, callback) {
    pat.gameType = "video-games";
    const page = options.page || 1;
    const limit = options.limit || 3;
    const baseUrl = "https://api.rawg.io/api/games";
    const queryString = "?platforms=" + platform + "&search=" + searchTerm + "&page=" + page  + "&page_size=" + limit;
    pat.search(baseUrl + queryString, function (response) {
      console.log("Search Video Games: ", response);
      callback(response);
    });
  },

  getVideoGameById(id, callback) {
    const baseUrl = "https://api.rawg.io/api/games/" + id;
    pat.search(baseUrl, function(result) {
      console.log("Video Game: ", result);
      callback(result);
    });
  },

  /**
   * Searches the boardgameatlas.com api for the game provided
   * @param {string} name - The board game we are searching for.
   * @param {Object} options - The Options for the search.
   * @param {number} [options.limit=10] - The amount of items to return
   * @param {string} [options.orderBy="popularity"] - The way the items are ordered by.
   * @param {boolean} [options.fuzzyMatch=true] - If set to true it helps with typos
   *
   * @param callback
   */
  searchBoardGames(name, options, callback) {
    pat.gameType = "board-games";
    const limit = options.limit || 3;
    const orderBy = options.orderBy || "popularity";
    const fuzzyMatch = options.fuzzyMatch || true;

    const baseUrl = "https://www.boardgameatlas.com/api/search";
    const queryString = "?name=" + name+ "&limit=" + limit + "&order_by=" + orderBy + "&fuzzy_match=" + fuzzyMatch + "&client_id=AoMOmUcuiK";

    pat.search(baseUrl + queryString, function(response) {
      console.log("Search Board Games: ", response);
      callback(response);
    });
  },

  getBoardGameById(id, callback) {
    const baseUrl = "https://www.boardgameatlas.com/api/search";
    const queryString = "?ids=" + id + "&client_id=AoMOmUcuiK";
    pat.search(baseUrl + queryString, function(response) {
      console.log("Search Board Games: ", response);
      callback(response);
    });
  },

  /**
   * Returns Pats recommendations to the user for video games
   * @param {number} gameId - The Id of the game we want to get recommendations for.
   * @param {number} platform - The id of the platform we are searching under.
   * @param {Object} options - The Options that for the query
   * @param {number} [options.limit=3] - The amount of items to return.
   * @param callback
   *
   * @returns {json}
   */
  recommendVideoGames(gameId, platform = 4, options, callback) {
    const limit = options.limit || 3;
    const baseUrl = "https://api.rawg.io/api/games/" + gameId + "/suggested";
      pat.search(baseUrl, function (response) {
        console.log("Video game recommendations: ", response);
        pat.recommendations = response;
        pat.recommendationsCurrentItem = 2;
        callback(response);
      });
  },

  /**
   *  Returns Pats recommendations to the user for board games
   * @param {Object} options - The Options that for the query
   * @param {number} [options.limit=3] - The number of items we want to retrieve.
   * @returns {json}
  */
  recommendBoardGames(options, callback) {
    const limit = options.limit || 10;
    const baseUrl = "https://www.boardgameatlas.com/api/search";
    const queryString = "?random=true&client_id=AoMOmUcuiK";
    for (let i = 0; i < limit; i++) {
      pat.search(baseUrl + queryString, function (response){
        console.log("random game is ", response);
        callback(response);
      });
    }

  },

  /**
   * Gets all the platforms and puts board game as the first choice.
   * @param callback
   */
  getPlatforms(callback) {
    let platforms = [{id:0, name:"Board Game", slug:"board-game"}];
    const url = "https://api.rawg.io/api/platforms";
    pat.search(url,function(response) {
      for(let i = 0; i < response.results.length; i++) {
        const platform = response.results[i];
        platforms.push(platform);
      }
       callback(platforms);
    });
  },

};

