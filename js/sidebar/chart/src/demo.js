import {getDaysFromNowToTheEndOfTheMonth,
  getDatesForThePeriod, rand
} from '../../../utils/date-utils.js'

const getFakeData = (dates) => {
  let output = [];

  for(let date of dates) {
    for(let i = 0; i < rand(1, 14); i++) {
      output.push({
        text: 'Sometimes the same is different',
        priority: rand(0, 2),
        date: date
      });
    }
  }

  return output;
};

export default [
  getFakeData(getDatesForThePeriod(30)),
  getFakeData(getDaysFromNowToTheEndOfTheMonth().filter(e => rand(0, 1)))
];
