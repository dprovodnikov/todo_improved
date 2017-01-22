const rand = (l, h) => Math.floor((h-l+1)*Math.random())+Math.floor(l);

const getDatesForThePeriod = (period) => {
  let date, output, day;

  date = new Date();
  day = date.getDate();
  output = [];

  for(let i = 0; i < period; i++)
    output.push(
      new Date(date.getFullYear(), date.getMonth(), day--)
    );

  return output;
};

const getFakeData = (period) => {
  let dates, output;

  dates = getDatesForThePeriod(period);
  output = [];

  for(let date of dates) {
    for(let i = 0; i < rand(1, 11); i++) {
      output.push({
        text: 'Sometimes the same is different',
        date: date
      });
    }
  }

  return output;
};


let data = getFakeData(30);

const data3 = [
  {date: new Date(2017, 0, 17)},
  {date: new Date(2017, 0, 17)},
  {date: new Date(2017, 0, 17)},

  {date: new Date(2017, 0, 22)},
  {date: new Date(2017, 0, 22)},

  {date: new Date(2017, 0, 23)},
  {date: new Date(2017, 0, 23)},
  {date: new Date(2017, 0, 23)},
  {date: new Date(2017, 0, 23)},
  {date: new Date(2017, 0, 23)},

  {date: new Date(2017, 0, 25)},
  {date: new Date(2017, 0, 25)},
  {date: new Date(2017, 0, 25)},

  {date: new Date(2017, 0, 28)},
  {date: new Date(2017, 0, 28)},
  {date: new Date(2017, 0, 28)},
  {date: new Date(2017, 0, 28)},
  {date: new Date(2017, 0, 28)},

  {date: new Date(2017, 0, 30)},
  {date: new Date(2017, 0, 30)},
  {date: new Date(2017, 0, 30)},
  {date: new Date(2017, 0, 30)},
  {date: new Date(2017, 0, 30)},
  {date: new Date(2017, 0, 30)},
];

export default [data, [], data3];
