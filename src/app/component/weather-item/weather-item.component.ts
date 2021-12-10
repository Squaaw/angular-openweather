import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Weather } from 'src/app/models/weather';

@Component({
  selector: 'app-weather-item',
  templateUrl: './weather-item.component.html',
  styleUrls: ['./weather-item.component.scss']
})
export class WeatherItemComponent {

  /**
   * Récupération des données météorologiques enregistrées.
   */
  @Input() weather: Weather = new Weather();

  /**
   * Envoi des informations de la ville sélectionnée afin de mettre à jour ses données météorologiques.
   */
  @Output() refreshEvent = new EventEmitter();

  /**
   * Envoi des informations de la ville sélectionnée afin de la supprimer de la liste.
   */
  @Output() deleteEvent = new EventEmitter();

  /**
   * Nom de classe permettant d'afficher/masquer la div permettant de rafraichir ou supprimer les données.
   */
  hide: string = 'hide';

  constructor() { }

  ngOnInit() { }

  /**
   * Cette fonction envoie les informations de la ville sélectionnée
   * au composant parent afin de mettre à jour ses données météorologiques.
   */
  refresh(){
    this.refreshEvent.emit(this.weather);
  }

  /**
   * Cette fonction envoie les informations de la ville sélectionnée
   * au composant parent afin de supprimer ses données météorologiques.
   */
  delete(){
    this.deleteEvent.emit({ weather: this.weather });
  }

  /**
   * Cette fonction permet d'afficher la div contenant les boutons
   * de rafraichissement et de suppression en passant la souris sur le composant.
   */
  mouseOver(){
    this.hide = '';
  }

  /**
   * Cette fonction permet de masquer la div contenant les boutons
   * de rafraichissement et de suppression en passant la souris sur le composant.
   */
  mouseDown(){
    this.hide = 'hide';
  }

  /**
   * Cette fonction permet d'afficher le nom des villes avec leur Etat s'il est indiqué.
   * @returns 
   */
  displayCityName(){
    const cityName = this.weather.cityName;
    const state = this.weather.state;

    if (state)
      return `${cityName}, ${state}`;

    return cityName;
  }
}
