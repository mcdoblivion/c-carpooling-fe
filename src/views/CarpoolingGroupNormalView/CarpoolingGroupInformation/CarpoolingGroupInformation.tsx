import { Close16, Save16 } from "@carbon/icons-react";
import { Col, Row, Spin } from "antd";
import PageHeader from "components/PageHeader/PageHeader";
import { AppUser } from "models/AppUser";
import Avatar, { ConfigProvider } from "react-avatar";
import { Button, StandardTable } from "react3l-ui-library";
import useCarpoolingGroupInformation from "./CarpoolingGroupInformationHook";
import LeaveGroupRequestNormalDetail from "./LeaveGroupRequestNormalDetail/LeaveGroupRequestNormalDetail";

/* end individual import */
export interface CarpoolingGroupInformationProps {
  user: AppUser;
}

function CarpoolingGroupInformation(props: CarpoolingGroupInformationProps) {
  const { user } = props;

  const {
    loading,
    model,
    driverUser,
    vehicleForCarpooling,
    columns,
    carpoolers,
    currentItem,
    visibleDetail,
    handleGoCreate,
    handleCloseDetail,
    handleGoDayOffRequest,
    handleDeleteLeaveGroupRequest,
  } = useCarpoolingGroupInformation(user?.carpoolingGroupId);

  return (
    <Spin spinning={loading}>
      <div className="page-content">
        <PageHeader
          title={model?.groupName}
          breadcrumbItems={["Thông tin nhóm đi chung"]}
        />
        <div className="page page-detail p-t--lg p-r--sm p-l--sm p-b--lg">
          {/* Thông tin chung */}
          <div className="page-detail__title p-b--xs">THÔNG TIN CHUNG</div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Tên nhóm</span>
                <span>{model?.groupName}</span>
              </div>
            </Col>
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Thời gian đi</span>
                <span>{model?.departureTime}</span>
              </div>
            </Col>
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Thời gian về</span>
                <span>{model?.comebackTime}</span>
              </div>
            </Col>
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Thời gian chờ (phút)</span>
                <span>{model?.delayDurationInMinutes}</span>
              </div>
            </Col>
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Địa chỉ nhà</span>
                <span>
                  {driverUser?.addresses &&
                    driverUser?.addresses[0]?.fullAddress}
                </span>
              </div>
            </Col>
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Địa chỉ công ty</span>
                <span>
                  {driverUser?.addresses &&
                    driverUser?.addresses[1]?.fullAddress}
                </span>
              </div>
            </Col>
          </Row>
          {/* Thông tin tài xế */}
          <div className="page-detail__title p-b--xs">THÔNG TIN TÀI XẾ</div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
            <Col lg={6} className="m-b--xs">
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
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Tên tài xế</span>
                <span>
                  {driverUser?.userProfile?.firstName +
                    " " +
                    driverUser?.userProfile?.lastName}
                </span>
              </div>
            </Col>
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Email</span>
                <span>{driverUser?.email}</span>
              </div>
            </Col>
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Số điện thoại</span>
                <span>{driverUser?.phoneNumber}</span>
              </div>
            </Col>
          </Row>
          {/* Thông tin phương tiện */}
          <div className="page-detail__title p-b--xs">
            THÔNG TIN PHƯƠNG TIỆN
          </div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
            <Col lg={6} className="m-b--xs">
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
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Loại xe</span>
                <span>
                  {vehicleForCarpooling?.brand +
                    " - " +
                    vehicleForCarpooling?.color}
                </span>
              </div>
            </Col>
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Số chỗ</span>
                <span>{vehicleForCarpooling?.numberOfSeats}</span>
              </div>
            </Col>
            <Col lg={6} className="m-b--xs">
              <div className="text__with__label">
                <span>Biển số xe</span>
                <span>{vehicleForCarpooling?.licensePlate}</span>
              </div>
            </Col>
          </Row>
          {/* Thông tin thành viên */}
          <div className="page-detail__title p-b--xs">THÔNG TIN THÀNH VIÊN</div>
          <div className="p-b--lg">
            <StandardTable
              rowKey="id"
              columns={columns}
              dataSource={carpoolers}
              isDragable={true}
              tableSize={"lg"}
            />
          </div>
        </div>
        <footer className="app-footer">
          <div className="app-footer__full d-flex justify-content-end align-items-center">
            <div className="app-footer__actions d-flex justify-content-end">
              <Button
                type="secondary"
                className="btn--lg"
                icon={<Close16 />}
                onClick={handleGoCreate}
              >
                Yêu cầu rời nhóm
              </Button>
              <Button
                type="primary"
                className="btn--lg"
                icon={<Save16 />}
                onClick={handleGoDayOffRequest}
              >
                Tạo yêu cầu nghỉ phép
              </Button>
            </div>
          </div>
        </footer>
      </div>
      <LeaveGroupRequestNormalDetail
        visible={visibleDetail}
        handleClose={handleCloseDetail}
        model={currentItem}
        handleDeleteLeaveGroupRequest={handleDeleteLeaveGroupRequest}
      />
    </Spin>
  );
}
export default CarpoolingGroupInformation;
