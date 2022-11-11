import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { kebabCase } from "lodash";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Model, Repository } from "react3l-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export type KeyType = string | number;

export class DriverRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_PREFIX, BASE_API_URL).href;
  }

  public all = (): Observable<Model> => {
    return this.http
      .get("drivers/" + kebabCase(nameof(this.all)))
      .pipe(Repository.responseMapToModel<Model>(Model));
  };
  public getDrivers = (filter: AppUserFilter): Observable<AppUser> => {
    return this.http
      .get(
        `drivers?page=${filter?.page}&limit=${filter?.limit}&search=${filter?.search}&sort=${filter?.sort}&order=${filter?.order}`
      )
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public getUser = (id: any): Observable<AppUser> => {
    return this.http
      .get(`drivers/${id}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public getMe = (token: string): Observable<AppUser> => {
    return this.http
      .get(`drivers/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      })
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public delete = (id: any): Observable<AppUser> => {
    return this.http
      .delete(`drivers/${id}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public activation = (id: any, payload: any): Observable<AppUser> => {
    return this.http
      .put(`drivers/${id}/activation`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public update = (appUser: AppUser): Observable<AppUser> => {
    return this.http
      .put(`drivers/${appUser.id}`, appUser)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export const driverRepository = new DriverRepository();
