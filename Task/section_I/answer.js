function rentContainers(neededContainer, list) {
  const totalContainer = list.reduce((acc, cur) => (acc += cur.container), 0);
  if (totalContainer < neededContainer)
    return console.log(`Not enough containers`);

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
  return rentedContainers;
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
