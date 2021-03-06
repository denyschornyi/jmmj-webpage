import React, { useState, useEffect } from "react";
import numeral from "numeral";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  ContentContainer,
  ContentContent,
  ContentTitle,
  ContentSubtitle,
  ContentPlanets,
  PlanetCard,
  PlanetImg,
  PlanetInfo,
  PlanetName,
  PlanetPopulation,
  PlanetDiameter
} from "./ContentElements";
import { Loader } from "../Loader/Loader";
import { SwapiService } from "../../service/SwapiService";
import { srcGenerator, transformPlanet } from "../../service/utils";
import CrashedImg from "../../img/planetCrash.jpg";
import StarWars404 from "../../img/starwars404.jpg";

export function Content() {
  const [planets, setPlanets] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [planetPage, setPlanetPage] = useState(1);
  const getData = new SwapiService();

  useEffect(() => {
    getData.getAllPlanets(planetPage).then((data) => {
      const planetData = data.results.map((planet) => transformPlanet(planet));
      setPlanets(planetData);
    });
  }, []);

  const fetchPlanets = () => {
    setPlanetPage(planetPage + 1);
    getData.getAllPlanets(planetPage + 1).then((data) => {
      if (data.next) {
        const planetData = data.results.map((planet) =>
          transformPlanet(planet)
        );
        setPlanets([...planets, ...planetData]);
      } else {
        setHasMore(false);
      }
    });
  };

  const addDefaultSrc = (e) => {
    e.target.src = StarWars404 || CrashedImg;
  };

  return (
    <ContentContainer>
      <ContentContent>
        <ContentTitle>Open API show off</ContentTitle>
        <ContentSubtitle>
          It’s up to you what you display down there and how you style it. Use
          fetch/axios (preffered) or if you’re already tired of this task - get
          the data from a JSON object. Lazy loading is optional but highly
          appreciated. List of APIs you could use:
          https://github.com/public-apis/public-apis
        </ContentSubtitle>
        <InfiniteScroll
          dataLength={planets.length}
          next={fetchPlanets}
          hasMore={hasMore}
          loader={<Loader />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Have a nice day 😉</b>
            </p>
          }
        >
          <ContentPlanets>
            {planets.length !== 0 ? (
              planets.map((planet) => {
                const { id, name, population, diameter } = planet;
                return (
                  <PlanetCard key={name + id}>
                    <PlanetImg src={srcGenerator(id)} onError={addDefaultSrc} />
                    <PlanetInfo>
                      <PlanetName>{name}</PlanetName>
                      <PlanetPopulation>
                        Population: {numeral(population).format("0,0")}
                      </PlanetPopulation>
                      <PlanetDiameter>
                        Diameter: {numeral(diameter).format("0,0")}
                      </PlanetDiameter>
                    </PlanetInfo>
                  </PlanetCard>
                );
              })
            ) : (
              <Loader />
            )}
          </ContentPlanets>
        </InfiniteScroll>
      </ContentContent>
    </ContentContainer>
  );
}
