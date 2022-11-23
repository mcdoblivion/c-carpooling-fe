import { Camera32, Close16, Save16 } from "@carbon/icons-react";
import { Col, Row, Spin, Upload } from "antd";
import PageHeader from "components/PageHeader/PageHeader";
import { getUploadActionAndHeaders } from "helpers/antd";
import { AppUserFilter } from "models/AppUser";
import {
  Button,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react3l-ui-library";
import useVehicleNormalDetail from "./VehicleNormalDetailHook";

function VehicleNormalDetail() {
  const {
    loading,
    model,
    handleChangeSingleField,
    handleSave,
    handleChangeAvatar,
    goToVehicleMenu,
    fuelTypeSearchFunc,
    handleChangeFuelType,
  } = useVehicleNormalDetail();

  return (
    <Spin spinning={loading}>
      <div className="page-content">
        <PageHeader
          title="Phương tiện"
          breadcrumbItems={["Phương tiện", model?.id ? "Cập nhật" : "Tạo mới"]}
        />
        <div className="page page-detail p-t--lg p-l--sm p-r--sm p-b--lg">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
            <Col lg={8} className="m-b--sm">
              <FormItem>
                <InputText
                  label="Số đăng ký xe"
                  type={0}
                  value={model?.registrationCertificateNumber}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField(
                    "registrationCertificateNumber"
                  )}
                  placeHolder="Số đăng ký xe..."
                  isRequired
                />
              </FormItem>
            </Col>
            <Col lg={8} className="m-b--sm">
              <FormItem>
                <InputNumber
                  label="Biển số"
                  type={0}
                  value={model?.licensePlate}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField("licensePlate")}
                  placeHolder="Biển số..."
                  isRequired
                />
              </FormItem>
            </Col>
            <Col lg={8} className="m-b--sm">
              <FormItem>
                <InputNumber
                  label="Số chỗ ngồi"
                  type={0}
                  value={model?.numberOfSeats}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField("numberOfSeats")}
                  placeHolder="Số chỗ ngồi..."
                  isRequired
                />
              </FormItem>
            </Col>
            <Col lg={8} className="m-b--sm">
              <FormItem>
                <InputText
                  label="Thương hiệu"
                  type={0}
                  value={model?.brand}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField("brand")}
                  placeHolder="Thương hiệu..."
                  isRequired
                />
              </FormItem>
            </Col>
            <Col lg={8} className="m-b--sm">
              <FormItem>
                <InputText
                  label="Màu sắc"
                  type={0}
                  value={model?.color}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField("color")}
                  placeHolder="Màu sắc..."
                  isRequired
                />
              </FormItem>
            </Col>
            <Col lg={8} className="m-b--sm">
              <FormItem>
                <InputNumber
                  label="Tỷ lệ tiêu thụ nhiên liệu trên 100km"
                  type={0}
                  value={model?.fuelConsumptionPer100kms}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField("fuelConsumptionPer100kms")}
                  placeHolder="Tỷ lệ tiêu thụ nhiên liệu trên 100km..."
                  isRequired
                />
              </FormItem>
            </Col>
            <Col lg={8} className="m-b--sm">
              <FormItem>
                <Select
                  label="Loại nhiên liệu"
                  classFilter={AppUserFilter}
                  placeHolder="Chọn loại nhiên liệu"
                  getList={fuelTypeSearchFunc}
                  onChange={handleChangeFuelType}
                  value={model?.fuelTypeValue}
                  isRequired
                  type={0}
                />
              </FormItem>
            </Col>
            <Col lg={8} className="m-b--sm"></Col>
            <Col lg={8} className="m-b--sm"></Col>
            <Col lg={8} className="m-b--xxxl">
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept="image/png, image/jpeg, image/gif"
                {...getUploadActionAndHeaders()}
                onChange={handleChangeAvatar("photoURL")}
              >
                {model?.photoURL ? (
                  <img
                    src={model.photoURL}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <Camera32 />
                )}
              </Upload>
              <div className="text-align-center">
                <div className="text__with__label">
                  <span>Ảnh đại diện</span>
                  <span>Recommended size: 500 x 600 px (maximum 1MB)</span>
                </div>
              </div>
            </Col>
            <Col lg={8} className="m-b--xxxl">
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept="image/png, image/jpeg, image/gif"
                {...getUploadActionAndHeaders()}
                onChange={handleChangeAvatar(
                  "registrationCertificateFrontPhotoURL"
                )}
              >
                {model?.registrationCertificateFrontPhotoURL ? (
                  <img
                    src={model.registrationCertificateFrontPhotoURL}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <Camera32 />
                )}
              </Upload>
              <div className="text-align-center">
                <div className="text__with__label">
                  <span>Ảnh mặt trước đăng ký xe</span>
                  <span>Recommended size: 500 x 600 px (maximum 1MB)</span>
                </div>
              </div>
            </Col>
            <Col lg={8} className="m-b--xxxl">
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept="image/png, image/jpeg, image/gif"
                {...getUploadActionAndHeaders()}
                onChange={handleChangeAvatar(
                  "registrationCertificateBackPhotoURL"
                )}
              >
                {model?.registrationCertificateBackPhotoURL ? (
                  <img
                    src={model.registrationCertificateBackPhotoURL}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <Camera32 />
                )}
              </Upload>
              <div className="text-align-center">
                <div className="text__with__label">
                  <span>Ảnh mặt sau đăng ký xe</span>
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
                onClick={goToVehicleMenu}
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

export default VehicleNormalDetail;
