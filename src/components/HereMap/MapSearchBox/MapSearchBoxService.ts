import Axios, { AxiosInstance } from "axios";

export class MapSearchBoxService {
  public axios: AxiosInstance;
  public baseUrl: string =
    "https://places.api.here.com/places/v1/autosuggest?X-Map-Viewport=105.7637,21.0371,105.8006,21.0449&X-Political-View=VNM&result_types=address,place&size=5";
  public apiKey: string = "ohvnoVs8d_Eb17BxASziYhuKsTMXHIZJzgh96NID5pw" || "";
  public appCode: string = "tyYufmMV9EeUH7SwARwmqA";
  public appId: string = "blbsXQlQEqVQtNPzVKCg";

  constructor() {
    this.axios = Axios.create();
  }
  public useSuggest = (valueSearch: string) => {
    const queryParams = `&app_code=${this.appCode}&app_id=${this.appId}&q=${valueSearch}`;
    const searchURL = this.baseUrl + queryParams;
    return this.axios.get(searchURL).then((res) => {
      return res.data.results;
    });
  };
}
