import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Detail, Pokemon } from "./types/pokemon.type";
import PokemonCollection from "./components/PokemonCollection";

interface Pokemons {
  name: string;
  url: string;
}

const App: React.FC = () => {
  const [pokemons, setpokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setnextUrl] = useState<string>("");
  const [loading, setloading] = useState<boolean>(true);
  const [viewDetail, setviewDetail] = useState<Detail>({
    id: 0,
    isOpen: false,
  });
  useEffect(() => {
    const getPokemon = async () => {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=20&offset=20"
      );
      setnextUrl(res.data.next);
      res.data.results.forEach(async (pokemon: Pokemons) => {
        const poke = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        console.log("poke: ", poke);
        console.log("poke: ", poke);
        setpokemons((p) => [...p, poke.data]);
        setloading(false);
      });
    };
    getPokemon();
  }, []);

  const nextPage = async () => {
    setloading(true);
    let res = await axios.get(nextUrl);
    setnextUrl(res.data.next);
    res.data.results.forEach(async (pokemon: Pokemons) => {
      const poke = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      setpokemons((p) => [...p, poke.data]);
      setloading(false);
    });
  };
  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header">Pokemon</header>
        <PokemonCollection
          pokemons={pokemons}
          viewDetail={viewDetail}
          setDetail={setviewDetail}
        />
        {!viewDetail.isOpen && (
          <div className="btn">
            <button onClick={nextPage}>
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
