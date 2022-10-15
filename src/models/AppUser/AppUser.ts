import { Moment } from "moment";

export class AppUser {
  public id?: number;

  public username?: string;

  public email?: string;

  public displayName?: string;

  public address?: string;

  public phoneNumber?: string;

  public sexId?: number;

  public createdAt?: Moment;

  public avatar?: string;

  public department?: string;

  public organizationId?: number;

  public longitude?: number;

  public latitude?: number;

  public statusId?: number;
}
