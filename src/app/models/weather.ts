export class Weather{
    id!: number;
    cityName!: string;
    country!: string;
    state: string = '';
    description!: string;
    icon!: string;
    currentTemp!: number;
    feelsLike!: number;
    minTemp!: number;
    maxTemp!: number;
    date!: string;
}

/*
root:
    name: "Paris"
    cod: 200 (reponse OK) / 400 (reponse KO)

    sys:
        country: "FR"

    weather:
        description: "ciel dégagé"
        icon: "01d"

    main:
        temp: 3.09 (current)
        feels_like: 1.39 (ressenti)
        temp_min: 1.32
        temp_max: 4.5
*/