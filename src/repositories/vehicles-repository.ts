import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { AppUser } from "models/AppUser";
import { Repository } from "react3l-common";
import { Observable } from "rxjs";

export type KeyType = string | number;

export class VehicleRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_PREFIX, BASE_API_URL).href;
  }
  public getVehicles = (filter: any): Observable<AppUser> => {
    return this.http
      .get(
        `vehicles?page=${filter?.page}&limit=${
          filter?.limit
        }&filters={"fuelType":${
          filter.fuelType ? `"${filter?.fuelType}"` : null
        },"isVerified":${filter.isVerified}}&sort=${filter?.sort}&order=${
          filter?.order
        }`
      )
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public verify = (id: any): Observable<AppUser> => {
    return this.http
      .put(`vehicles/${id}/verify`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export const vehicleRepository = new VehicleRepository();
