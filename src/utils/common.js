export const groupBy = (array, groupCalculator) => array.reduce((groups, element) => {
  const group = groupCalculator(element);

  if (!groups[group]) {
    groups[group] = [];
  }

  groups[group].push(element);

  return groups;
}, {});
