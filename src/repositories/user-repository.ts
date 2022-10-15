import { API_USER_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { kebabCase } from "lodash";
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
      .get(kebabCase(nameof(this.all)))
      .pipe(Repository.responseMapToModel<Model>(Model));
  };
}

export const userRepository = new UserRepository();
