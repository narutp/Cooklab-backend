module.exports = {
  compareByDate: (a,b) => {
    if (a.timestamp < b.timestamp)
      return 1;
    if (a.timestamp > b.timestamp)
      return -1;
    return 0;
  },

  compareByCount: (a,b) => {
    if (a.count < b.count)
      return 1;
    if (a.count > b.count)
      return -1;
    return 0;
  },

  compareByTrophy: (a,b) => {
    if (a.trophies < b.trophies)
      return 1;
    if (a.trophies > b.trophies)
      return -1;
    return 0;
  },

  compareByExp: (a,b) => {
    if (a.experience < b.experience)
      return 1;
    if (a.experience > b.experience)
      return -1;
    return 0;
  }
}

