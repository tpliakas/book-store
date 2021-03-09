import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ListItem from "./ListItem";
import { storesAPI } from "../helpers/constants";

const List = () => {
  const [stores, setStores] = useState([]);
  const [relationships, setRelationships] = useState([]);

  /**
   * Fetching stores, setting stores & relationships
   */
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(storesAPI);

      setStores(result.data.data);
      setRelationships(result.data.included);
    };

    fetchData();
  }, []);

  /**
   * Creating arrays of authors, books, countries
   */
  const { authors, books, countries } = useMemo(() => {
    if (!relationships)
      return {
        authors: [],
        books: [],
        countries: [],
      };

    return {
      authors: [...relationships.filter((rel) => rel.type === "authors")],
      books: [...relationships.filter((rel) => rel.type === "books")],
      countries: [...relationships.filter((rel) => rel.type === "countries")],
    };
  }, [relationships]);

  /**
   * Sorting books based on copies sold
   */
  const sortedBooks = useMemo(() => {
    if (books.length === 0) return;

    return books.sort((a, b) =>
      a.attributes.copiesSold > b.attributes.copiesSold
        ? -1
        : a.attributes.copiesSold < b.attributes.copiesSold
        ? 1
        : 0
    );
  }, [books]);

  return stores.length ? (
    <>
      <h1>Book Stores</h1>
      {stores.map((store, idx) => (
        <ListItem
          authors={authors}
          books={sortedBooks}
          countriesList={countries}
          key={idx}
          store={store}
        />
      ))}
    </>
  ) : (
    "No stores retrieved"
  );
};

export default List;
