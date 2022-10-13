import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_API_URL, FORBIDENT_ROUTE } from "config/consts";
import * as Cookie from "js-cookie";
import { Repository } from "react3l-common";
import appMessageService, {
  messageType,
} from "services/common-services/app-message-service";
import { LOGIN_ROUTE } from "./route-consts";

export const httpConfig: AxiosRequestConfig = {
  withCredentials: false,
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

Repository.requestInterceptor = function (
  config: AxiosRequestConfig
): AxiosRequestConfig {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
};

Repository.responseInterceptor = function (
  response: AxiosResponse
): AxiosResponse {
  return response;
};

Repository.errorInterceptor = function (
  error: AxiosError
): void | Promise<void> {
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Bạn cần kiểm tra lại các trường dữ liệu",
          description: error.response.statusText,
        });
        break;
      case 401:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Bạn chưa đăng nhập để thực hiện thao tác",
          description: error.response.statusText,
        });
        localStorage.removeItem("currentUserInfo");
        Cookie.remove("Token");
        window.location.href = LOGIN_ROUTE;
        break;
      case 403:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Bạn không có quyền thực hiện thao tác",
          description: error.response.statusText,
        });
        window.location.href = FORBIDENT_ROUTE;
        break;
      case 420:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "lỗi BE",
          description: error.response.statusText,
        });
        break;
      case 500:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Lỗi hệ thống",
          description: error.response.statusText,
        });
        break;
      case 502:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Server BE không hoạt động",
          description: error.response.statusText,
        });
        break;
      case 504:
        appMessageService.messageFactory({
          type: messageType.ERROR,
          title: "Phản hồi quá chậm",
          description: error.response.statusText,
        });
        break;
      default:
        break;
    }
  }
  throw error;
};
