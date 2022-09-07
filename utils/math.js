const mediaPonderata = (oldV = 0, numScelte, newV) => {
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

const scartoQuadraticoMedio = (values) => {
  console.log(values);
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
    const { dolcezza, secco, speziato } = element;
    media.dolcezza = mediaPonderata(media.dolcezza, index + 1, dolcezza);
    media.secco = mediaPonderata(media.secco, index + 1, secco);
    media.speziato = mediaPonderata(media.speziato, index + 1, speziato);
  });

  return media;
}

export function calcolaDispersionePreferenze(drinkArray) {
  const dispersione = {};

  dispersione.dolcezza = scartoQuadraticoMedio(
    drinkArray.map((element) => element.dolcezza)
  );
  dispersione.secco = scartoQuadraticoMedio(
    drinkArray.map((element) => element.secco)
  );
  dispersione.speziato = scartoQuadraticoMedio(
    drinkArray.map((element) => element.speziato)
  );

  return dispersione;
}
