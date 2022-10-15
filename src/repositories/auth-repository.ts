import { API_AUTH_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { kebabCase } from "lodash";
import { Model, Repository } from "react3l-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export type KeyType = string | number;

export class AuthRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_AUTH_PREFIX, BASE_API_URL).href;
  }

  public login = (account: any): Observable<Model> => {
    return this.http
      .post(kebabCase(nameof(this.login)), account)
      .pipe(Repository.responseMapToModel<Model>(Model));
  };
}

export const authRepository = new AuthRepository();
