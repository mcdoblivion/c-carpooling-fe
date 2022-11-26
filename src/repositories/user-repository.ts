import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { kebabCase } from "lodash";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Model, Repository } from "react3l-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export type KeyType = string | number;

export class UserRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_PREFIX, BASE_API_URL).href;
  }

  public all = (): Observable<Model> => {
    return this.http
      .get("users/" + kebabCase(nameof(this.all)))
      .pipe(Repository.responseMapToModel<Model>(Model));
  };
  public getUsers = (filter: AppUserFilter): Observable<AppUser> => {
    return this.http
      .get(
        `users?page=${filter?.page}&limit=${filter?.limit}&search=${filter?.search}&sort=${filter?.sort}&order=${filter?.order}`
      )
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public getUser = (id: any): Observable<AppUser> => {
    return this.http
      .get(`users/${id}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public getMe = (token: string): Observable<AppUser> => {
    return this.http
      .get(`users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      })
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public delete = (id: any): Observable<AppUser> => {
    return this.http
      .delete(`users/${id}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public activation = (id: any, payload: any): Observable<AppUser> => {
    return this.http
      .put(`users/${id}/activation`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public update = (appUser: AppUser): Observable<AppUser> => {
    return this.http
      .put(`users/${appUser.id}`, appUser)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public createAddress = (id: number, payload: any): Observable<AppUser> => {
    return this.http
      .post(`users/${id}/addresses`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public updateAddress = (
    id: number,
    addressesId: number,
    payload: any
  ): Observable<AppUser> => {
    return this.http
      .put(`users/${id}/addresses/${addressesId}`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public create = (appUser: AppUser): Observable<AppUser> => {
    return this.http
      .post(`users/${appUser.id}/profile`, appUser)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public save = (appUser: AppUser): Observable<AppUser> => {
    return appUser.userProfile ? this.update(appUser) : this.create(appUser);
  };
  public changePassword = (
    id: number,
    payload: AppUser
  ): Observable<AppUser> => {
    return this.http
      .put(`users/${id}/password`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public forgotPassword = (payload: AppUser): Observable<AppUser> => {
    return this.http
      .post(`users/password`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export const userRepository = new UserRepository();
