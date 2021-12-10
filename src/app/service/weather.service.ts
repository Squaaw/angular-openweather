import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

import { environment as env } from '../../environments/environment';
import { Weather } from '../models/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeather(cityId: number): Observable<any> {
    return this.http.get<any>(env.config.feedroot + cityId);
  }

  get cities(): Weather[]{
    return JSON.parse(localStorage.getItem('cities') || '');
  }

  set cities(city: Weather[]){
    localStorage.setItem('cities', JSON.stringify(city));
  }

  getCityList(): Observable<any> {
    return this.http.get<any>('../../assets/city.list.json');
  }
}
