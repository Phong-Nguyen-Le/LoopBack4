function rentContainers(neededContainer, list) {
  let result = {};
  list.sort((a, b) => a.totalCost / a.container - b.totalCost / b.container);
  let rentedContainers = [];
  let remainingContainers = neededContainer;

  for (const container of list) {
    if (remainingContainers <= 0) break;
    const containersToRent = Math.min(remainingContainers, container.container);
    if (containersToRent > 0) {
      rentedContainers.push({
        name: container.name,
        rented: containersToRent,
        price: (container.totalCost / container.container) * containersToRent,
      });
      remainingContainers -= containersToRent;
    }
  }

  if (remainingContainers > 0) {
    result.message = 'Not enough containers';
  }

  result.rentedContainers = rentedContainers;

  const totalCost = rentedContainers.reduce((acc, cur) => {
    return (acc += cur.price);
  }, 0);

  result.totalCost = totalCost;
  console.log(result);
  return result;
}

const list = [
  {
    name: 'Container renter A',
    container: 1,
    totalCost: 1,
  },
  {
    name: 'Container renter B',
    container: 2,
    totalCost: 1,
  },
  {
    name: 'Container renter C',
    container: 3,
    totalCost: 3,
  },
];
