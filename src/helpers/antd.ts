import { BASE_API_URL } from "config/consts";

export const getUploadActionAndHeaders = () => ({
  action: `${BASE_API_URL}/api/upload-file`,
  headers: {
    authorization: JSON.parse(localStorage.getItem("token")),
  },
});
