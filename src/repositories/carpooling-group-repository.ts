import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { AppUser } from "models/AppUser";
import { Repository } from "react3l-common";
import { Observable } from "rxjs";

export type KeyType = string | number;

export class CarpoolingGroupRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_PREFIX, BASE_API_URL).href;
  }
  public search = (filter?: any): Observable<AppUser> => {
    return this.http
      .get(
        `carpooling-groups/search?page=${filter?.page}&limit=${filter?.limit}&search=${filter?.search}&sort=${filter?.sort}&order=${filter?.order}`
      )
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public getCarpoolingGroups = (id: number): Observable<AppUser> => {
    return this.http
      .get(`carpooling-groups/${id}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public getFee = (id: number): Observable<AppUser> => {
    return this.http
      .get(`carpooling-groups/${id}/fee`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public join = (id: number): Observable<AppUser> => {
    return this.http
      .post(`carpooling-groups/${id}/join`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public findCarpoolingGroups = (filter?: any): Observable<AppUser> => {
    return this.http
      .get(
        `carpooling-groups?departureTime=${filter?.departureTime}&comebackTime=${filter?.comebackTime}`
      )
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public create = (payload: AppUser): Observable<AppUser> => {
    return this.http
      .post(`carpooling-groups`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export const carpoolingGroupRepository = new CarpoolingGroupRepository();
