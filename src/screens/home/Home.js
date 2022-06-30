import React, { Component } from "react";
import "./Home.css";
import Header from "../../common/header/Header";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  upcomingMoviesHeading: {
    textAlign: "center",
    background: "#ff9999",
    padding: "8px",
    fontSize: "1rem",
  },
  gridListUpcomingMovies: {
    flexWrap: "nowrap",
    transform: "translateZ(0)",
    width: "100%",
  },
  gridListMain: {
    transform: "translateZ(0)",
    cursor: "pointer",
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 240,
    maxWidth: 240,
  },
  title: {
    color: theme.palette.primary.light,
  },
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      movieName: "",
      upcomingMovies: [],
      releasedMovies: [],
      genres: [],
      artists: [],
      genresList: [],
      artistsList: [],
      releaseDateStart: "",
      releaseDateEnd: "",
    };
  }

  componentWillMount() {
    // Get upcoming movies

    fetch(
      "http://localhost:8085/api/v1/movies?page=1&limit=10&status=published",
      { method: "GET" }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          upcomingMovies: data.movies,
        });
      });

    // Get released movies

    fetch(
      "http://localhost:8085/api/v1/movies?page=1&limit=10&status=Released",
      { method: "GET" }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          releasedMovies: data.movies,
        });
      });

    // Get filters

    fetch("http://localhost:8085/api/v1/genres", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          genresList: data.genres,
        });
      });

    // Get artists

    fetch("http://localhost:8085/api/v1/artists?page=1&limit=10", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          artistsList: data.artists,
        });
      });
  }

  movieNameChangeHandler = (event) => {
    this.setState({ movieName: event.target.value });
  };

  genreSelectHandler = (event) => {
    this.setState({ genres: event.target.value });
  };

  artistSelectHandler = (event) => {
    this.setState({ artists: event.target.value });
  };

  releaseDateStartHandler = (event) => {
    this.setState({ releaseDateStart: event.target.value });
  };

  releaseDateEndHandler = (event) => {
    this.setState({ releaseDateEnd: event.target.value });
  };

  movieClickHandler = (movieId) => {
    this.props.history.push("/movie/" + movieId);
  };

  filterApplyHandler = () => {
    let queryString = "&status=Released";
    if (this.state.movieName !== "") {
      queryString += "&title=" + this.state.movieName;
    }
    if (this.state.genres.length > 0) {
      queryString += "&genres=" + this.state.genres.toString();
    }
    if (this.state.artists.length > 0) {
      queryString += "&artists=" + this.state.artists.toString();
    }
    if (this.state.releaseDateStart !== "") {
      queryString += "&start_date=" + this.state.releaseDateStart;
    }
    if (this.state.releaseDateEnd !== "") {
      queryString += "&end_date=" + this.state.releaseDateEnd;
    }

    fetch( "http://localhost:8085/api/v1/movies?page=1&limit=10" +
    encodeURI(queryString), {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
            releasedMovies: data.movies,
        });
      });

  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header baseUrl={this.props.baseUrl} />

        <div className={classes.upcomingMoviesHeading}>
          <span>Upcoming Movies</span>
        </div>

        <GridList cols={5} className={classes.gridListUpcomingMovies}>
          {this.state.upcomingMovies.map((movie) => (
            <GridListTile key={"upcoming" + movie.id}>
              <img
                src={movie.poster_url}
                className="movie-poster"
                alt={movie.title}
              />
              <GridListTileBar title={movie.title} />
            </GridListTile>
          ))}
        </GridList>

        <div className="flex-container">
          <div className="left">
            <GridList
              cellHeight={350}
              cols={4}
              className={classes.gridListMain}
            >
              {this.state.releasedMovies.map((movie) => (
                <GridListTile
                  onClick={() => this.movieClickHandler(movie.title)}
                  className="released-movie-grid-item"
                  key={"grid" + movie.id}
                >
                  <img
                    src={movie.poster_url}
                    className="movie-poster"
                    alt={movie.title}
                  />
                  <GridListTileBar
                    title={movie.title}
                    subtitle={
                      <span>
                        Release Date:{" "}
                        {new Date(movie.release_date).toDateString()}
                      </span>
                    }
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
          <div className="right">
            <Card>
              <CardContent>
                <FormControl className={classes.formControl}>
                  <Typography className={classes.title} color="textSecondary">
                    FIND MOVIES BY:
                  </Typography>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                  <Input
                    id="movieName"
                    onChange={this.movieNameChangeHandler}
                  />
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-checkbox">
                    Genres
                  </InputLabel>
                  <Select
                    multiple
                    input={<Input id="select-multiple-checkbox-genre" />}
                    renderValue={(selected) => selected.join(",")}
                    value={this.state.genres}
                    onChange={this.genreSelectHandler}
                  >
                    {this.state.genresList.map((genre) => (
                      <MenuItem key={genre.id} value={genre.genre}>
                        <Checkbox
                          checked={this.state.genres.indexOf(genre.genre) > -1}
                        />
                        <ListItemText primary={genre.genre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-checkbox">
                    Artists
                  </InputLabel>
                  <Select
                    multiple
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={(selected) => selected.join(",")}
                    value={this.state.artists}
                    onChange={this.artistSelectHandler}
                  >
                    {this.state.artistsList.map((artist) => (
                      <MenuItem
                        key={artist.id}
                        value={artist.first_name + " " + artist.last_name}
                      >
                        <Checkbox
                          checked={
                            this.state.artists.indexOf(
                              artist.first_name + " " + artist.last_name
                            ) > -1
                          }
                        />
                        <ListItemText
                          primary={artist.first_name + " " + artist.last_name}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <TextField
                    id="releaseDateStart"
                    label="Release Date Start"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{ shrink: true }}
                    onChange={this.releaseDateStartHandler}
                  />
                </FormControl>

                <FormControl className={classes.formControl}>
                  <TextField
                    id="releaseDateEnd"
                    label="Release Date End"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{ shrink: true }}
                    onChange={this.releaseDateEndHandler}
                  />
                </FormControl>
                <br />
                <br />
                <FormControl className={classes.formControl}>
                  <Button
                    onClick={() => this.filterApplyHandler()}
                    variant="contained"
                    color="primary"
                  >
                    APPLY
                  </Button>
                </FormControl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);

