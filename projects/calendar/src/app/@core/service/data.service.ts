import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable()
export class DataService {

  constructor(private httpClient : HttpClient) {}

  get_products(){
    const url = environment.apiUrl ;
    return this.httpClient.get(url + '/products');
  }
  get_families(){
    const url = environment.apiUrl ;
    return this.httpClient.get(url + '/families');
  }
  get_locations(){
    const url = environment.apiUrl ;
    return this.httpClient.get(url + '/locations');
  }
  get_transactions(){
    const url = environment.apiUrl ;
    return this.httpClient.get(url + '/families');
  }

}
