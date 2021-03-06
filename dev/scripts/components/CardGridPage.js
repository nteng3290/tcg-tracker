import React from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import credentials from '../credentials';
import axios from 'axios';
import NavBar from "./NavBar.js"
import SingleCard from "./SingleCard";

// This component will query the pokemon API and get all cards in the Basic set
// Display the image for each card in JSX
// eventually: choose which set will be called, and add infinite scroll
// eventually: add ability to filter and sort as child component?

class CardGridPage extends React.Component {
    constructor() {
        super();
        this.state = {
            allCardsInSet: [],
            // cardName: [],
            page: 1,
            loadedCards: false,
            filteredCards: [],
            set: "",
            showFilteredCards: false,
        }

        this.loadCards = this.loadCards.bind(this);
        this.filterCard = this.filterCard.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.loadMoreCards = this.loadMoreCards.bind(this);
        this.searchBySet = this.searchBySet.bind(this);

        this.typeFilter = React.createRef();
    }

    componentDidMount() {
        this.setState({ page: 1 })
        this.loadCards(this.state.page, this.state.set);
    }

    loadCards(page, set) {
        // create the parameters and headers for axios call

        // make axio calls to retrive all cards in set
        // want to retrieve first 20 cards??
        axios.get(`${credentials.pokemonApiUrl}/cards`,  {
            params: {
                setCode: set,
                page: page,
                pageSize: "100",
            }
        }).then((res) => {
            const allCards = this.state.allCardsInSet.concat(res.data.cards);

            // console.log(this.state.allCardsInSet);
            // console.log(res.data.cards);
            // console.log(allCards);
            console.log(res.data.cards.length);
            this.setState({
                allCardsInSet: allCards,
                loadedCards: true,
            }) 
        });
    }

    loadMoreCards() {
        const newpage = this.state.page + 1;
        this.setState({ page: newpage })
        this.loadCards(this.state.page, this.state.set);
    }

    filterCard(e){
        this.clearFilters(e);
        // filterType is the value of checkbox that's selected
        const filterType = e.target.value;
        // console.log(filterType)
        // if this is the first checkbox selected, filter from allCardsInSet. if there are multiple checkboxes selected then filter the filteredCards. 
        this.setState({ 
            showFilteredCards: true
         });

        // create new array containing the specific cards that has the selected type
        const filteredCards = this.state.allCardsInSet.filter(card => {
            // if the card is missing "types" data then skip it
            if(card.types) {
                // console.log(card.types[0].toLowerCase());
                // console.log(filterType);
                // console.log(card.types[0].toLowerCase() === filterType);
                card.types.includes(filterType);
                return card.types[0].toLowerCase() === filterType;
            }
        });

        // set filtered cards into state.
        console.log(filteredCards);
        this.setState({ filteredCards });
    }

    clearFilters() {
        // e.preventDefault();
        this.setState({ 
            filteredCards : [],
            showFilteredCards: false,
        })
    }

    searchBySet(e) {
        // this.typeFilter.checked === false;
        this.setState({ 
            allCardsInSet : [],
            showFilteredCards : false,
            filteredCards: [],
            page: 1,
            set: e.target.value
         });
        this.loadCards(this.state.page, e.target.value);
    }

    render() {
        // JavaScript Lives here!!
        // console.log(this.state.allCardsInSet);
        // make the dataset (current state) into a variable 
        // if cards are filtered, display the filteredCards. if no filters, display full list
        let cardSet;
        { this.state.showFilteredCards ?
            cardSet = this.state.filteredCards
            :
            cardSet = this.state.allCardsInSet
        }

        // console.log(this)
        // console.log(cardSet);
        return (
            <React.Fragment>
                <NavBar logInUser={this.logInUser} googleSignIn={this.googleSignIn} signOutUser={this.signOutUser} />
                <main className="CardGrid">
                    <div className="wrapper">
                        <div className="cardGridTitle">
                            <img src="../../../images/logoPokemon.png" alt="Pokemon Logo"/>
                        </div>
                       <form className="filter"> 
                           <h2>Filter By</h2>
                            <div className="selectSets">
                                <label htmlFor="set">
                                <h3>Set</h3>
                                </label>
                                <select id="selectSet" value={this.state.set} onChange={this.searchBySet}>
                                    <option value="sm5">Sun and Moon Ultra Prism</option>
                                    <option value="xy1">XY</option>
                                    <option value="sm1">Sun and Moon</option>
                                    <option value="bw1">Black and White</option>
                                    {/* <option value=“barbecue”>barbecue</option>
                                    <option value=“indian”>indian</option> */}
                                </select>
                            </div>
    
                            <div className="selectType" ref={this.typeFilter}>
                                <h3>Type</h3>
                                <div className="selectTypeContainer">
                                   <label htmlFor="lightning">
                                        <img src="../../../images/Lightning.png" alt="lightning type icon" title="Lightning Type Icon"/>
                                   </label>
                                   <input className="hide" onChange={(e) => this.filterCard(e)} type="radio" value="lightning" id="lightning" name="type"/>
       
                                   <label htmlFor="fighting">
                                        <img src="../../../images/Fighting.png" alt="fighting type icon" title="Fighting Type Icon" />
                                   </label>
                                   <input className="hide" onChange={(e) => this.filterCard(e)} type="radio" value="fighting" id="fighting" name="type"/>
       
                                   <label htmlFor="grass">
                                        <img src="../../../images/Grass.png" alt="grass type icon" title="Grass Type Icon" />
                                   </label>
                                   <input className="hide" onChange={(e) => this.filterCard(e)} type="radio" value="grass" id="grass" name="type"/>
       
                                   <label htmlFor="fire">
                                        <img src="../../../images/Fire.png" alt="fire type icon" title="Fire Type Icon"/>
                                   </label>
                                   <input className="hide" onChange={(e) => this.filterCard(e)} type="radio" value="fire" id="fire" name="type"/>
       
                                   <label htmlFor="psychic">
                                        <img src="../../../images/Psychic.png" alt="psychic type icon" title="Psychic Type Icon" />
                                   </label>
                                   <input className="hide" onChange={(e) => this.filterCard(e)} type="radio" value="psychic" id="psychic" name="type"/>
   
                                   <label htmlFor="metal">
                                        <img src="../../../images/Metal.png" alt="metal type icon" title="Metal Type Icon"/>
                                   </label>
                                   <input className="hide" onChange={(e) => this.filterCard(e)} type="radio" value="metal" id="metal" name="type" />
   
                                   <label htmlFor="fairy">
                                        <img src="../../../images/Fairy.png" alt="fairy type icon" title="Fairy Type Icon"/>
                                   </label>
                                   <input className="hide" onChange={(e) => this.filterCard(e)} type="radio" value="fairy" id="fairy" name="type" />
   
                                   <label htmlFor="colorless">
                                        <img src="../../../images/Colorless.png" alt="colorless type icon" title="Colorless Type Icon"/>
                                   </label>
                                   <input className="hide" onChange={(e) => this.filterCard(e)} id="colorless" type="radio" value="colorless" name="type" />
                                </div>
    
                                <div className="clearContainer">
                                    <input type="button" className="clear" onClick={this.clearFilters} value="Clear Filter"/>
                                 </div>
                            </div>
                            {/* <label htmlFor="set">Set</label>
                            <input type="" /> */}
                        </form>
                        <div className="displayCards">
                            {
                                this.state.loadedCards ? 
                                cardSet.map(card => {
                                    return (
                                        <Link key={card.id} to={`/franchises/pokemon/${card.id}`}  >
                                            <SingleCard data={card} key={card.id}/>
                                        </Link>
                                    )
                                })
                                : 
                                null 
                            }
                            
                        </div>
    
                        <button className="load" onClick={this.loadMoreCards}>Load More</button>
                    </div>
                </main>
            </React.Fragment>
        )
    }
}

export default CardGridPage;