import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WeatherService } from 'src/app/service/weather.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent {

  /**
   * Récupération du nom de ville saisi depuis le composant parent 'app'.
   */
  @Input() cityName: string = '';

  /**
   * Envoi des données de la ville sélectionnée au parent 'app'.
   */
  @Output() newCityEvent = new EventEmitter();

  /**
   * Tableau contenant les données des villes en rapport avec la recherche effectuée.
   */
  cityList: any[] = [];

  /**
   * Erreur si la ville recherchée est introuvable.
   */
  error: boolean = false;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() { }

  /**
   * Récupération de la valeur saisie dans le champs permettant de rechercher une ville.
   */
  ngOnChanges() {
    this.cityList = [];
    this.error = false;

    if (this.cityName)
      this.getCityList();
  }

  /**
   * Cette fonction permet de récupérer les informations de villes correspondantes à la saisie.
   * Les données des villes se situent dans assets/city.list.json
   */
  getCityList() {
    this.weatherService.getCityList()
    .subscribe(response => {
      for (let i = 0; i < response.length; i ++){      
        /**
         * On recherche des noms de villes en rapport avec la saisie de l'utilisateur.
         * On remplace certains caractères afin de proposer une sélection pertinente de villes à l'utilisateur.
         */
        if (!response[i].name
            .replaceAll('-', ' ')
            .replaceAll('é', 'e')
            .replaceAll('è', 'e')
            .toLowerCase()
            .includes(
              this.cityName
              .split('-').join(' ')
              .split('é').join('e')
              .split('è').join('e')
              .toLowerCase()
            )
          )
            continue;

        /**
         * Dans la liste des villes, certaines d'entre elles sont en doublon.
         * On s'assure alors d'afficher la ville qu'une seule fois.
         */
        const existingCity = this.cityList.filter(
          city => city.name == response[i].name
          && city.state == response[i].state
          && city.country == response[i].country
        )

        if (existingCity.length == 0){
          this.cityList.push(response[i]);
        }
      }

      /**
       * Si aucune ville n'a été trouvée, on indique une erreur à l'utilisateur.
       * Sinon, on trie les villes par ordre alphabétique.
       */
      if (this.cityList.length == 0)
        this.error = true;
      else
        this.cityList.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    })
  }

  /**
   * Lorsqu'un utilisateur sélectionne une ville de la liste,
   * on envoie les informations de cette ville au composant parent afin de l'enregistrer.
   * @param city 
   */
  selectCity(city: any){
    this.newCityEvent.emit(city);
  }

  /**
   * Cette fonction permet d'afficher le nom des villes avec leur Etat s'il est indiqué.
   * @param city 
   * @returns 
   */
  displayCityName(city: any): string{
    if (!city.state)
      return `${city.name} (${city.country})`;

    return `${city.name}, ${city.state} (${city.country})`;
  }

}
