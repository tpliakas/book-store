import { useEffect, useMemo, useState } from "react";
import { array, object } from "prop-types";
import axios from "axios";
import './styles.css';
import { formatDate, getRating } from "../helpers/funcs";
import { countriesAPI, emptyListMessage } from "../helpers/constants";

const ListItem = ({ authors, books, countriesList, store }) => {
  const {
    establishmentDate,
    name,
    rating,
    storeImage,
    website,
  } = store.attributes;

  const { countries } = store.relationships;
  const [country, setCountry] = useState(null);

  /**
   * Fetching countries and setting current country
   */
  useEffect(() => {
    if (!countries || !countriesList) return;
    let country;

    const countryCode = countriesList.find(
      (country) => country.id === countries.data?.id
    )?.attributes?.code;

    if (countryCode) {
      const fetchData = async () => {
        country = await axios(`${countriesAPI}${countryCode}`);

        setCountry(country);
      };

      fetchData();
    }
  }, [countries, countriesList]);

  /**
   * Filtering books list for current store
   */
  const booksList = useMemo(() => {
    if (!store || !books) return [];

    const storeBooks = store.relationships.books?.data;
    if (!storeBooks) return [];

    return books?.filter((book) =>
      storeBooks.find((item) => item.id === book.id)
    );
  }, [books, store]);

  return (
    <div className="store-item">
      <div className="store-main">
        <div className="store-img">
          <img src={storeImage} alt="store logo" title="store logo" />
        </div>
        <div className="store-details">
          <div className="store-header">
            <div className="store-name">{name}</div>
            <div className="rating tooltip">
              {getRating(rating, 5)}
              <span className="tooltiptext">{rating} stars rating!</span>
            </div>
          </div>
          <div className="store-best-selling">
            <table className="table">
              <thead>
                <tr>
                  <th colSpan="2">Best-selling books</th>
                </tr>
              </thead>
              <tbody>
                {booksList.length > 0 ? (
                  booksList.map(
                    (book, idx) =>
                      idx < 2 && (
                        <tr key={idx} className="book-item">
                          <td>{book.attributes.name}</td>
                          <td>
                            {
                              authors.find(
                                (author) =>
                                  book.relationships.author.data.id ===
                                  author.id
                              ).attributes.fullName
                            }
                          </td>
                        </tr>
                      )
                  )
                ) : (
                  <tr className="book-item">
                    <td>{emptyListMessage}</td>
                    <td />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="store-footer">
        <div className="store-footer-details">
          <div className="store-date">
            {formatDate(establishmentDate)}&nbsp;-&nbsp;
          </div>
          <a className="store-website" href={website} rel="noreferrer" target="_blank">
            {website.split("//")[1]}
          </a>
        </div>
        <div className="store-flag tooltip">
          <img src={country?.data?.flag} alt="store country" />
          <span className="tooltiptext-left">{country?.data?.name}</span>
        </div>
      </div>
    </div>
  );
};

ListItem.propTypes = {
  authors: array,
  books: array,
  countriesList: array,
  store: object,
};

export default ListItem;
