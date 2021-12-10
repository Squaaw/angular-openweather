import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Weather } from './models/weather';
import { WeatherService } from './service/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  /**
   * Tableau contenant les données météorologiques des villes ajoutées.
   */
  cities: Weather[] = [];
  
  /**
   * Erreur indiquant si la ville a déjà été ajoutée à la liste.
   */
  error: boolean = false;

  /**
   * Valeur qui sera envoyée en tant que 'Input' au composant enfant 'city-list'.
   */
  searchCity: string = '';

  weather: Weather = new Weather();

  constructor(
    private fb: FormBuilder,
    private weatherService: WeatherService
  ) { }

  /**
   * Initialisation du formulaire permettant de saisir le nom d'une ville.
   */
  cityForm = this.fb.group({
    cityName: ['', [Validators.required, Validators.pattern('[a-zA-Z éèà-]*')]],
  });

  /**
   * Au chargement du composant, on récupère les
   * données météorologiques enregistrées dans le localStorage.
   */
  ngOnInit() { 
    this.cities = this.weatherService.cities;
  }

  /**
   * La valeur saisie permet de rechercher un nom de ville existant.
   */
  onSubmit() {
    this.searchCity = this.cityForm.controls['cityName'].value;
  }

  /**
   * Cette fonction permet de rafraîchir les données météorologiques
   * des villes déjà enregistrées dans le localstorage.
   * @param refreshEvent
   */
  refreshEvent(refreshEvent: Weather){
    // Récupération de l'index de l'objet dans le tableau.
    const index = this.cities.indexOf(refreshEvent);

    // Récupération des informations météorologiques par l'id de la ville.
    this.weatherService.getWeather(refreshEvent.id)
    .subscribe(response => {
      // Récupération des données actuelles, telles que l'id, la ville, le pays, l'Etat...
      this.weather = this.cities[index];

      // Attribution des nouvelles données météorologiques.
      this.weather.description = response.weather[0].description;
      this.weather.icon = response.weather[0].icon;
      this.weather.currentTemp = this.convertToInt(response.main.temp);
      this.weather.feelsLike = this.convertToInt(response.main.feels_like);
      this.weather.minTemp = this.convertToInt(response.main.temp_min);
      this.weather.maxTemp = this.convertToInt(response.main.temp_max);
      this.weather.date = this.getDate(new Date());

      // Mise à jour de l'objet dans le tableau et dans le localstorage.
      this.cities[index] = this.weather;
      this.weatherService.cities = this.cities;

      // Réinitialisation de l'objet.
      this.weather = new Weather();
    });
  }

  /**
   * Cette fonction permet d'enregistrer une nouvelle ville dans la liste.
   * @param newCityEvent 
   * @returns 
   */
  saveCity(newCityEvent: any){
    // Vérification dans la liste de l'existence de la ville recherchée.
    const existingCity: Weather[] = this.cities.filter(city => city.id == newCityEvent.id);

    // Avertit l'utilisateur si la ville est déjà enregistrée dans la liste.
    if (existingCity.length > 0){
      this.error = true;
      this.cityForm.reset();
      this.searchCity = '';
      return;
    }

    // Récupération des données météorologiques de la ville recherchée (par id) + ajout dans la liste.
    this.weatherService.getWeather(newCityEvent.id)
    .subscribe(response => {
      this.weather.id = response.id;
      this.weather.cityName = response.name;
      this.weather.country = response.sys.country;
      this.weather.state = newCityEvent.state;
      this.weather.description = response.weather[0].description;
      this.weather.icon = response.weather[0].icon;
      this.weather.currentTemp = this.convertToInt(response.main.temp);
      this.weather.feelsLike = this.convertToInt(response.main.feels_like);
      this.weather.minTemp = this.convertToInt(response.main.temp_min);
      this.weather.maxTemp = this.convertToInt(response.main.temp_max);
      this.weather.date = this.getDate(new Date());

      // Ajout des nouvelles données dans le tableau + enregistrement dans le localstorage.
      this.cities.push(this.weather);
      this.weatherService.cities = this.cities;

      // Réinitialisation de l'objet et du formulaire de saisi.
      this.weather = new Weather();
      this.cityForm.reset();
      this.searchCity = '';
    })
  }

  /**
   * Cette fonction permet de supprimer une ville de la liste.
   * @param deleteEvent 
   * @returns 
   */
  deleteEvent(deleteEvent: any){
    const index = this.cities.indexOf(deleteEvent.weather);

    if (index < 0)
      return;

    this.cities.splice(index, 1);
    this.weatherService.cities = this.cities;
  }

  /**
   * Cette fonction permet de réinitialiser l'erreur lors de la saisie.
   * @param event 
   * @returns 
   */
  onKeyUp(event: any){
    if (!this.cityForm.controls['cityName'].value)
      return;

    this.error = false;

    if (event.keyCode == 8)
      this.searchCity = '';
  }

  /**
   * Cette fonction permet de prendre l'entier d'un nombre décimal.
   * @param value 
   * @returns 
   */
  convertToInt(value: number) {
    return value | 0;
}

/**
 * Cette fonction permet de récupérer la date dans le style dd/MM/yy HH:mm.
 * @param date 
 * @returns 
 */
  getDate(date: Date): string{
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  /**
   * Cette fonction permet de supprimer TOUTES les villes enregistrées.
   */
  deleteAll(){
    this.cities = [];
    this.weatherService.cities = this.cities;
  }

  /**
   * Cette fonction permet de rafraîchir TOUTES les données météorologiques des villes enregistrées.
   */
  refreshAll(){
    for (let i = 0; i < this.cities.length; i++){
      this.refreshEvent(this.cities[i]);
    }
  }
}