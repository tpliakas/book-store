/**
 * @param rating
 * @param max
 * @returns {jsx}
 */
const getRating = (rating, max) => {
  if (!rating || !max) return [];
  let stars = [];
  for (let i = 1; i <= max; i++) {
    stars.push(
      <span key={i} className={`fa fa-star ${rating >= i ? "checked" : ""}`} />
    );
  }
  return stars;
};

/**
 * @param date
 * @returns {string}
 */
const formatDate = (date) => {
  if (!date) return "";
  const fullDate = new Date(date);
  return `${fullDate.getDate()}.${
    fullDate.getMonth() + 1
  }.${fullDate.getFullYear()}`;
};

export { formatDate, getRating };
