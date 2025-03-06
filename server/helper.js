const addIfExists = (key, value) =>
  value !== undefined && value !== "" ? { [key]: value } : {};

const getSortObject = (sortOrder) => {
  switch (sortOrder) {
    case "date_desc":
      return { date: -1, created_at: -1 };
    case "date_asc":
      return { date: 1, created_at: 1 };
    case "amount_desc":
      return { amount: -1 };
    case "amount_asc":
      return { amount: 1 };
    case "recipient_desc":
      return { recipient: -1 };
    case "recipient_asc":
      return { recipient: 1 };
    default:
      return { date: -1, created_at: -1 };
  }
};

module.exports = { addIfExists, getSortObject };
