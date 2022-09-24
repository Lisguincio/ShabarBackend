export const mediaPonderata = (values) => {
  let media = 0;
  let index = 1;
  values.forEach((value) => {
    media += value * index;
    index++;
  });

  const denominatore = ((index - 1) * index) / 2;
  return media / denominatore;
};

const mediaAritmetica = (values) => {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  const media = sum / values.length;
  return media;
};

export const scartoQuadraticoMedio = (values) => {
  //console.log(values);
  const media = mediaAritmetica(values);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += Math.pow(values[i] - media, 2);
  }
  return Math.sqrt(sum / values.length);
};

export function calcolaMediaPonderataDrinks(drinksArray) {
  const media = {};
  Object.entries(drinksArray[0]).forEach(([key, value]) => {
    //DOLCEZZA, SPEZIATO, SECCO
    const values = drinksArray.map((drink) => drink[key]);
    console.log(`values[${key}]`, values);
    media[key] = mediaPonderata(values);
  });

  return media;
}

export function calcolaDispersionePreferenze(drinksArray) {
  const dispersione = {};

  Object.entries(drinksArray[0]).forEach(([key, value]) => {
    const values = drinksArray.map((x) => x[key]);
    dispersione[key] = scartoQuadraticoMedio(values);
  });

  return dispersione;
}
