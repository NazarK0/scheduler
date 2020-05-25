const sessionStoreOptions = (db) => {
  return {
    mongooseConnection: db.connection,
    ttl: 2 * 24 * 60 * 60,
  };
};

module.exports = sessionStoreOptions;
