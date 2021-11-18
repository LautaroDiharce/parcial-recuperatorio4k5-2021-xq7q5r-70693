import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Llamada } from '../models/llamada';

@Injectable({
  providedIn: 'root',
})
export class LlamadasService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = environment.ConexionWebApiProxy + 'Llamadas/';
  }

  get(Nombre: string, Habilitado: boolean) {
    //console.log(Nombre);
    let params = new HttpParams();
    if (Nombre != null) {
      params = params.append('Nombre', Nombre);
    }
    if (Habilitado != null) {
      params = params.append('Habilitado', Habilitado.toString());
    }
    //console.log(params);
    return this.httpClient.get(this.resourceUrl, { params: params });
  }

  post(obj: Llamada) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

  put(Id: number, obj: Llamada) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }

  delete(Id) {
    return this.httpClient.delete(this.resourceUrl + Id);
  }
}
