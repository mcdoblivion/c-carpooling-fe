import { BehaviorSubject, Observable } from "rxjs";
import * as Cookie from "js-cookie";
import { LOGIN_ROUTE } from "config/route-consts";

class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  constructor() {
    const currentUserInfo = localStorage.getItem("currentUserInfo");
    this.currentUserSubject = new BehaviorSubject<any>(
      currentUserInfo ? JSON.parse(currentUserInfo) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
    if (this.currentUserSubject.value && this.currentUserSubject.value.token) {
      Cookie.set("Token", this.currentUserSubject.value.token);
    }
  }

  public login(loginInfo: { userName: string; password: string }) {
    const loginPromise = new Promise((resolve, reject) => {
      //Fake login:
      localStorage.setItem("currentUserInfo", JSON.stringify(loginInfo));
      Cookie.set("Token", "a6e0459b-9f50-42f8-b9d0-20cc9b4ce225");
      this.currentUserSubject.next(loginInfo);
      resolve(loginInfo);

      //Real login
      // profileRepository.login(loginInfo).subscribe(res => {
      //   if (res) {
      //     localStorage.setItem('currentUserInfo', JSON.stringify(res));
      //     Cookie.set("Token", res.token);
      //     this.currentUserSubject.next(res);
      //     resolve(res);
      //   }
      // }, err => {
      //   reject(err);
      // });
    });
    return loginPromise;
  }

  public logout() {
    localStorage.removeItem("currentUserInfo");
    Cookie.remove("Token");
    this.currentUserSubject.next(null);
    window.location.href = LOGIN_ROUTE;
  }
}

export default new AuthenticationService();
