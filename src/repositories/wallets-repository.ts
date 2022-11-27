import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { AppUser } from "models/AppUser";
import { Repository } from "react3l-common";
import { Observable } from "rxjs";

export type KeyType = string | number;

export class WalletRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_PREFIX, BASE_API_URL).href;
  }

  public createCard = (
    appUserId: number,
    payload: any
  ): Observable<AppUser> => {
    return this.http
      .post(`users/${appUserId}/cards`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public getCards = (appUserId: number): Observable<AppUser> => {
    return this.http
      .get(`users/${appUserId}/cards`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public deleteCard = (
    appUserId: number,
    cardId: number
  ): Observable<AppUser> => {
    return this.http
      .delete(`users/${appUserId}/cards/${cardId}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public topUp = (appUserId: number, payload: any): Observable<AppUser> => {
    return this.http
      .post(`users/${appUserId}/top-up`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export const walletRepository = new WalletRepository();
