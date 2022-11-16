import PageHeader from "components/PageHeader/PageHeader";
import {
  Button,
  DatePicker,
  EnumSelect,
  FormItem,
  InputText,
} from "react3l-ui-library";
import { Camera32, Close16, Save16 } from "@carbon/icons-react";
import useRegisterDriver from "./RegisterDriverHook";
import { Col, Row, Spin, Upload } from "antd";
import "./RegisterDriver.scss";
import { HereMap } from "components/HereMap/HereMap";

function RegisterDriver() {
  const {
    loading,
    model,
    imageUrl,
    enumGender,
    handleChangeAvatar,
    handleChangeUserProfile,
    singleListGender,
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
            <Col lg={18}>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={12} className="m-b--sm">
                  <HereMap
                    styles={{
                      height: "750px",
                      position: "relative",
                    }}
                  />
                </Col>
                <Col lg={12} className="m-b--sm">
                  <FormItem>
                    <InputText
                      label="Tên"
                      type={0}
                      value={model?.userProfile?.lastName}
                      className={"tio-account_square_outlined"}
                      onChange={handleChangeUserProfile("lastName")}
                      placeHolder="Nhập tên..."
                      isRequired
                    />
                  </FormItem>
                </Col>
                <Col lg={12} className="m-b--sm">
                  <FormItem>
                    <InputText
                      label="Số CMND/Số căn cước"
                      type={0}
                      value={model?.userProfile?.ICNumber}
                      className={"tio-account_square_outlined"}
                      onChange={handleChangeUserProfile("ICNumber")}
                      placeHolder="Nhập số CMND/Số căn cước..."
                      isRequired
                    />
                  </FormItem>
                </Col>
                <Col lg={12} className="m-b--sm">
                  <FormItem>
                    <InputText
                      label="Số điện thoại"
                      type={0}
                      value={model?.phoneNumber}
                      className={"tio-account_square_outlined"}
                      onChange={handleChangeUserProfile("phoneNumber")}
                      placeHolder="Nhập số điện thoại..."
                      isRequired
                    />
                  </FormItem>
                </Col>
                <Col lg={12} className="m-b--sm">
                  <FormItem>
                    <DatePicker
                      label="Ngày sinh"
                      value={model?.userProfile?.dateOfBirth}
                      type={0}
                      placeholder="Nhập ngày sinh"
                      onChange={handleChangeUserProfile("dateOfBirth")}
                    />
                  </FormItem>
                </Col>
                <Col lg={12} className="m-b--sm">
                  <FormItem>
                    <EnumSelect
                      placeHolder="Chọn giới tính..."
                      onChange={handleChangeUserProfile("gender")}
                      type={0}
                      getList={singleListGender}
                      label="Giới tính"
                      value={
                        model?.userProfile?.gender === "Female"
                          ? enumGender[0]
                          : enumGender[1]
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={handleChangeAvatar}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
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
