import { ORDERBOOK_LEVELS } from "./constants";

export const roundToNearest = (value: number, interval:number) => {
    return Math.floor(value / interval) * interval;
  };

export const groupByPrice = (levels: number[][]): number[][] => {
    return levels.map((level, idx) => {
      const nextLevel = levels[idx + 1];
      const prevLevel = levels[idx - 1];
  
      if(nextLevel && level[0] === nextLevel[0]) {
        return [level[0], level[1] + nextLevel[1]]
      } else if(prevLevel && level[0] === prevLevel[0]) {
        return [];
      } else {
        return level;
      }
    }).filter(level => level.length > 0);
  };
  
export const groupByTicketSize = (levels: number[][], ticketSize: number): number[][] => {
  return groupByPrice(levels.map(level => [roundToNearest(level[0], ticketSize), level[1]]));
};
  
export const formatNumber = (arg: number): string => {
  return new Intl.NumberFormat('en-US').format(arg);
};

export const removePriceLevel = (price: number, levels: number[][]): number[][] => levels.filter(level => level[0] !== price);

export const updatePriceLevel = (updatedLevel: number[], levels: number[][]): number[][] => {
  return levels.map(level => {
    if (level[0] === updatedLevel[0]) {
      level = updatedLevel;
    }
    return level;
  });
};

export const levelExists = (deltaLevelPrice: number, currentLevels: number[][]): boolean => currentLevels.some(level => level[0] === deltaLevelPrice);

export const addPriceLevel = (deltaLevel: number[], levels: number[][]): number[][] => {
  return [ ...levels, deltaLevel ];
};

export const applyDeltas = (currentLevels: number[][], orders: number[][]): number[][] => {
  let updatedLevels: number[][] = currentLevels;

  orders.forEach((deltaLevel) => {
    const deltaLevelPrice = deltaLevel[0];
    const deltaLevelSize = deltaLevel[1];

    if (deltaLevelSize === 0 && updatedLevels.length > ORDERBOOK_LEVELS) {
      updatedLevels = removePriceLevel(deltaLevelPrice, updatedLevels);
    } else {
      if (levelExists(deltaLevelPrice, currentLevels)) {
        updatedLevels = updatePriceLevel(deltaLevel, updatedLevels);
      } else {
        if (updatedLevels.length < ORDERBOOK_LEVELS) {
          updatedLevels = addPriceLevel(deltaLevel, updatedLevels);
        }
      }
    }
  });

  return updatedLevels;
}

export const addTotalSums = (orders: number[][]): number[][] => {
  const totalSums: number[] = [];

  return orders.map((order: number[], idx) => {
    const size: number = order[1];
    if (typeof order[2] !== 'undefined') {
      return order;
    } else {
      const updatedLevel = [ ...order];
      const totalSum: number = idx === 0 ? size : size + totalSums[idx - 1];
      updatedLevel[2] = totalSum;
      totalSums.push(totalSum);
      return updatedLevel;
    }
  });
};

export const addDepths = (orders: number[][], highestTotal: number): number[][] => {
  return orders.map(order => {
    if (typeof order[3] !== 'undefined') {
      return order;
    } else {
      const calculatedTotal: number = order[2];
      const depth = (calculatedTotal / highestTotal) * 100;
      const updatedOrder = [ ...order ];
      updatedOrder[3] = depth;
      return updatedOrder;
    }
  });
};

export const getHighestTotal = (orders: number[][]): number => {
  const totalSums: number[] = orders.map(order => order[2]);
  return Math.max.apply(Math, totalSums);
}