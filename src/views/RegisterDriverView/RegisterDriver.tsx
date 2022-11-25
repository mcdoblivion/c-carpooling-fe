import PageHeader from "components/PageHeader/PageHeader";
import { BadgeText, Button, FormItem, InputText } from "react3l-ui-library";
import { Camera32, Close16, Save16 } from "@carbon/icons-react";
import useRegisterDriver from "./RegisterDriverHook";
import { Col, Row, Spin, Upload } from "antd";
import "./RegisterDriver.scss";
import { getUploadActionAndHeaders } from "helpers/antd";

function RegisterDriver() {
  const {
    loading,
    model,
    handleChangeDriverLicenseNumber,
    handleChangeFrontPhoto,
    handleChangeBackPhoto,
    handleSave,
  } = useRegisterDriver();

  return (
    <Spin spinning={loading}>
      <div className="page-content">
        <PageHeader
          title="Đăng ký trở thành tài xế"
          breadcrumbItems={["Đăng ký trở thành tài xế", "Cập nhật"]}
        />
        <div className="page page-detail p-t--lg p-l--sm p-r--sm p-b--lg">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
            <Col lg={12} className="m-b--sm">
              <FormItem>
                <InputText
                  label="Số giấy phép lái xe"
                  type={0}
                  value={model?.driverLicenseNumber}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeDriverLicenseNumber()}
                  placeHolder="Nhập số giấy phép lái xe..."
                  isRequired
                />
              </FormItem>
            </Col>

            <Col
              lg={12}
              style={{ placeSelf: "center" }}
              className="badget-text-container"
            >
              {model?.status && (
                <BadgeText
                  value={model?.status}
                  color={"#fff"}
                  backgroundColor={
                    model?.status === "Pending" ? "#f1c21b" : "#c21e25"
                  }
                  className="badget-text"
                />
              )}
            </Col>

            <Col lg={12}>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept="image/png, image/jpeg, image/gif"
                {...getUploadActionAndHeaders()}
                onChange={handleChangeFrontPhoto}
              >
                {model?.driverLicenseFrontPhotoURL ? (
                  <img
                    src={model?.driverLicenseFrontPhotoURL}
                    alt="avatar"
                    style={{ width: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <Camera32 />
                )}
              </Upload>
              <div className="text-align-center">
                <div className="text__with__label">
                  <span>Ảnh giấy phép lái xe mặt trước</span>
                  <span>Recommended size: 500 x 600 px (maximum 1MB)</span>
                </div>
              </div>
            </Col>
            <Col lg={12}>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept="image/png, image/jpeg, image/gif"
                {...getUploadActionAndHeaders()}
                onChange={handleChangeBackPhoto}
              >
                {model?.driverLicenseBackPhotoURL ? (
                  <img
                    src={model?.driverLicenseBackPhotoURL}
                    alt="avatar"
                    style={{ width: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <Camera32 />
                )}
              </Upload>
              <div className="text-align-center">
                <div className="text__with__label">
                  <span>Ảnh giấy phép lái xe mặt sau</span>
                  <span>Recommended size: 500 x 600 px (maximum 1MB)</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <footer className="app-footer">
          <div className="app-footer__full d-flex justify-content-end align-items-center">
            <div className="app-footer__actions d-flex justify-content-end">
              <Button
                type="secondary"
                className="btn--lg"
                icon={<Close16 />}
                // onClick={handleGoMaster}
              >
                Đóng
              </Button>
              <Button
                type="secondary"
                className="btn--lg"
                icon={<Save16 />}
                onClick={handleSave}
              >
                Lưu
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </Spin>
  );
}

export default RegisterDriver;
