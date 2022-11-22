/* begin general import */
import { Col, Row } from "antd";
import React from "react";
import Avatar, { ConfigProvider } from "react-avatar";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";

export interface CarpoolingGroupFindingPreviewProps extends DrawerProps {
  model: any;
  handleOpenPopupFee: () => void;
}

function CarpoolingGroupFindingPreview(
  props: CarpoolingGroupFindingPreviewProps
) {
  const { visible, model, handleClose, handleOpenPopupFee } = props;

  const driverUser = model?.driverUser;
  const vehicleForCarpooling = model?.driverUser?.driver;

  return (
    <Drawer
      visible={visible}
      handleClose={handleClose}
      handleSave={handleOpenPopupFee}
      handleCancel={handleClose}
      visibleFooter={true}
      titleButtonApply="Tham gia nhóm"
      titleButtonCancel="Đóng"
      loading={false}
      size={"sm"}
      title={model?.groupName}
    >
      <div>
        {/* Thông tin chung */}
        <div className="page-detail__title p-b--xs">THÔNG TIN CHUNG</div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Tên nhóm</span>
              <span>{model?.groupName}</span>
            </div>
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Thời gian đi</span>
              <span>{model?.departureTime}</span>
            </div>
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Thời gian về</span>
              <span>{model?.comebackTime}</span>
            </div>
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Thời gian chờ (phút)</span>
              <span>{model?.delayDurationInMinutes}</span>
            </div>
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Địa chỉ nhà</span>
              <span>
                {driverUser?.addresses && driverUser?.addresses[0]?.fullAddress}
              </span>
            </div>
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Địa chỉ công ty</span>
              <span>
                {driverUser?.addresses && driverUser?.addresses[1]?.fullAddress}
              </span>
            </div>
          </Col>
        </Row>
        {/* Thông tin tài xế */}
        <div className="page-detail__title p-b--xs">THÔNG TIN TÀI XẾ</div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
          <Col lg={24} className="m-b--xs">
            {driverUser?.userProfile?.avatarURL ? (
              <img
                className="avatar-xl rounded-circle"
                src={driverUser?.userProfile?.avatarURL}
                alt="Ảnh đại diện"
              />
            ) : (
              <ConfigProvider colors={["red", "green", "blue"]}>
                <Avatar
                  maxInitials={1}
                  round={true}
                  size="10rem"
                  name={model?.driverUser?.userProfile?.lastName}
                />
              </ConfigProvider>
            )}
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Tên tài xế</span>
              <span>
                {driverUser?.userProfile?.firstName +
                  " " +
                  driverUser?.userProfile?.lastName}
              </span>
            </div>
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Email</span>
              <span>{driverUser?.email}</span>
            </div>
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Số điện thoại</span>
              <span>{driverUser?.phoneNumber}</span>
            </div>
          </Col>
        </Row>
        {/* Thông tin phương tiện */}
        <div className="page-detail__title p-b--xs">THÔNG TIN PHƯƠNG TIỆN</div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
          <Col lg={24} className="m-b--xs">
            {vehicleForCarpooling?.photoURL ? (
              <img
                className="avatar-xl rounded-circle"
                src={vehicleForCarpooling?.photoURL}
                alt="Ảnh đại diện"
              />
            ) : (
              <ConfigProvider colors={["red", "green", "blue"]}>
                <Avatar
                  maxInitials={1}
                  round={true}
                  size="10rem"
                  name={vehicleForCarpooling?.brand}
                />
              </ConfigProvider>
            )}
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Loại xe</span>
              <span>
                {vehicleForCarpooling?.brand +
                  " - " +
                  vehicleForCarpooling?.color}
              </span>
            </div>
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Số chỗ</span>
              <span>{vehicleForCarpooling?.numberOfSeats}</span>
            </div>
          </Col>
          <Col lg={24} className="m-b--xs">
            <div className="text__with__label">
              <span>Biển số xe</span>
              <span>{vehicleForCarpooling?.licensePlate}</span>
            </div>
          </Col>
        </Row>
        {/* Thông tin thành viên */}
        <div className="page-detail__title p-b--xs">THÔNG TIN THÀNH VIÊN</div>
        <span>
          {model?.carpoolers &&
            model?.carpoolers?.length > 0 &&
            model?.carpoolers.map((carpooler: any, index: number) => {
              return (
                <div
                  key={index}
                  className="m-t--xxs d-flex"
                  style={{ alignItems: "center" }}
                >
                  <div className="m-l--xxxs m-r--xxxs">
                    {carpooler?.userProfile?.avatarURL ? (
                      <img
                        className="avatar-xs rounded-circle"
                        src={carpooler?.userProfile?.avatarURL}
                        alt="Ảnh đại diện"
                      />
                    ) : (
                      <ConfigProvider colors={["red", "green", "blue"]}>
                        <Avatar
                          maxInitials={1}
                          round={true}
                          size="2rem"
                          name={carpooler?.userProfile?.firstName || "U"}
                        />
                      </ConfigProvider>
                    )}
                  </div>

                  {carpooler?.userProfile?.firstName +
                    " " +
                    carpooler?.userProfile?.lastName}
                </div>
              );
            })}
        </span>
      </div>
    </Drawer>
  );
}

export default CarpoolingGroupFindingPreview;
