import { API_USER_PREFIX } from "config/api-consts";
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
    this.baseURL = new URL(API_USER_PREFIX, BASE_API_URL).href;
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
  public getMe = (): Observable<AppUser> => {
    return this.http
      .get(`users/me`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public delete = (id: any): Observable<AppUser> => {
    return this.http
      .delete(`users/${id}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public update = (appUser: AppUser): Observable<AppUser> => {
    return this.http
      .put(`users/${appUser.id}`, appUser)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export const userRepository = new UserRepository();
