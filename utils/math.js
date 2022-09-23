export const mediaPonderata = (oldV = 0, numScelte, newV) => {
  /* console.log("Vecchio Valore: ", oldV);
  console.log("Numero Scelte: ", numScelte);
  console.log("Nuovo Valore: ", newV); */
  return (oldV * (numScelte - 1) + newV * 2) / (numScelte + 1);
};

const mediaAritmetica = (values) => {
  console.log("Calcolo la media aritmetica di: ", values);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  const media = sum / values.length;
  console.log("Media aritmetica: ", media);
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

export function calcolaMediaPonderataDrinks(drinkArray) {
  const media = {};

  drinkArray.forEach((element, index) => {
    Object.entries(element).forEach(([key, value]) => {
      media[key] = mediaPonderata(media[key], index + 1, value);
    });
    //media.dolcezza = mediaPonderata(media.dolcezza, index + 1, dolcezza);
    //media.secco = mediaPonderata(media.secco, index + 1, secco);
    //media.speziato = mediaPonderata(media.speziato, index + 1, speziato);
  });

  return media;
}

export function calcolaDispersionePreferenze(drinkArray) {
  const dispersione = {};

  Object.entries(drinkArray[0]).forEach(([key, value]) => {
    const values = drinkArray.map((drink) => drink[key]);
    dispersione[key] = scartoQuadraticoMedio(drinkArray.map((x) => x[key]));
  });

  return dispersione;
}
