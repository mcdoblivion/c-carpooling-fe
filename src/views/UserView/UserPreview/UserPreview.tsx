import { Camera32, Close16, Save16 } from "@carbon/icons-react";
import { Col, Row, Spin, Upload } from "antd";
import PageHeader from "components/PageHeader/PageHeader";
import { getUploadActionAndHeaders } from "helpers/antd";
import {
  Button,
  DatePicker,
  EnumSelect,
  FormItem,
  InputText,
} from "react3l-ui-library";
import InputPassword from "./InputPassword/InputPassword";
import "./UserPreview.scss";
import useUserPreview from "./UserPreviewHook";

function UserPreview() {
  const {
    loading,
    model,
    isChangingPassword,
    handleChangeAvatar,
    handleChangeUserProfile,
    singleList2FAMethod,
    singleListGender,
    handleSave,
    goToHomePage,
  } = useUserPreview();

  return (
    <Spin spinning={loading}>
      <div className="page-content">
        {!isChangingPassword ? (
          <>
            <PageHeader
              title="Thông tin người dùng"
              breadcrumbItems={["Thông tin người dùng", "Cập nhật"]}
            />
            <div className="page page-detail p-t--lg p-l--sm p-r--sm p-b--lg">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={18}>
                  <Row
                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    className="w-100"
                  >
                    <Col lg={12} className="m-b--sm">
                      <FormItem>
                        <InputText
                          label="Họ"
                          type={0}
                          value={model?.userProfile?.firstName}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeUserProfile("firstName")}
                          placeHolder="Nhập họ và tên đệm..."
                          isRequired
                        />
                      </FormItem>
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
                          label="Tên người dùng"
                          type={0}
                          value={model?.username}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeUserProfile("username")}
                          placeHolder="Nhập tên người dùng..."
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
                          value={{ id: 0, name: model?.userProfile?.gender }}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={12} className="m-b--sm">
                      <FormItem>
                        <EnumSelect
                          placeHolder="Chọn phương thức xác thực..."
                          type={0}
                          getList={singleList2FAMethod}
                          onChange={handleChangeUserProfile("2FAMethod")}
                          label="Phương thức xác thực 2 bước"
                          value={{ id: 0, name: model["2FAMethod"] }}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    accept="image/png, image/jpeg, image/gif"
                    {...getUploadActionAndHeaders()}
                    onChange={handleChangeAvatar}
                  >
                    {model?.userProfile?.avatarURL ? (
                      <img
                        src={model.userProfile.avatarURL}
                        alt="avatar"
                        style={{ width: "100%", objectFit: "contain" }}
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
              </Row>
            </div>
          </>
        ) : (
          <>
            <PageHeader
              title="Thay đổi mật khẩu"
              breadcrumbItems={["Thông tin người dùng", "Đổi mật khẩu"]}
            />
            <div className="page page-detail p-t--lg p-l--sm p-r--sm p-b--lg">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={18}>
                  <Row
                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    className="w-100"
                  >
                    <Col lg={12} className="m-b--sm">
                      <FormItem>
                        <InputPassword
                          inputType="password"
                          label="Mật khẩu hiện tại"
                          value={model?.currentPassword}
                          onChange={handleChangeUserProfile("currentPassword")}
                          placeHolder="Nhập mật khẩu hiện tại"
                          isRequired
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row
                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    className="w-100"
                  >
                    <Col lg={12} className="m-b--sm">
                      <FormItem>
                        <InputPassword
                          inputType="password"
                          label="Mật khẩu mới"
                          value={model?.newPassword}
                          onChange={handleChangeUserProfile("newPassword")}
                          placeHolder="Nhập mật khẩu mới"
                          isRequired
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row
                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    className="w-100"
                  >
                    <Col lg={12} className="m-b--sm">
                      <FormItem>
                        <InputPassword
                          inputType="password"
                          label="Nhâp lại mật khẩu mới"
                          value={model?.subNewPassword}
                          onChange={handleChangeUserProfile("subNewPassword")}
                          placeHolder="Nhập lại mật khẩu mới"
                          isRequired
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </>
        )}
        <footer className="app-footer">
          <div className="app-footer__full d-flex justify-content-end align-items-center">
            <div className="app-footer__actions d-flex justify-content-end">
              <Button
                type="secondary"
                className="btn--lg"
                icon={<Close16 />}
                onClick={goToHomePage}
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

export default UserPreview;
