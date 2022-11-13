/* begin general import */
import { Col, Row } from "antd";
import Avatar, { ConfigProvider } from "react-avatar";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";

export interface VehiclePreviewProps extends DrawerProps {
  model: any;
}

function VehiclePreview(props: VehiclePreviewProps) {
  const { visible, model, handleClose } = props;

  return (
    <Drawer
      visible={visible}
      handleClose={handleClose}
      visibleFooter={false}
      loading={false}
      size={"sm"}
      title="Thông tin chi tiết"
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Số đăng ký xe</span>
            <span>{model?.registrationCertificateNumber}</span>
          </div>
        </Col>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Tỷ lệ tiêu thụ nhiên liệu trên 100km</span>
            <span>{model?.fuelConsumptionPer100kms}</span>
          </div>
        </Col>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Ảnh mặt trước số đăng ký xe</span>
            {model?.registrationCertificateFrontPhotoURL ? (
              <img
                className="img-preview"
                src={model?.registrationCertificateFrontPhotoURL}
                alt="Ảnh mặt trước số đăng ký xe"
              />
            ) : (
              <ConfigProvider colors={["red", "green", "blue"]}>
                <Avatar
                  maxInitials={1}
                  round={true}
                  size="22"
                  name={model?.licensePlate}
                />
              </ConfigProvider>
            )}
          </div>
        </Col>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Ảnh mặt sau số đăng ký xe</span>
            {model?.registrationCertificateBackPhotoURL ? (
              <img
                className="img-preview"
                src={model?.registrationCertificateBackPhotoURL}
                alt="Ảnh mặt sau số đăng ký xe"
              />
            ) : (
              <ConfigProvider colors={["red", "green", "blue"]}>
                <Avatar
                  maxInitials={1}
                  round={true}
                  size="22"
                  name={model?.licensePlate}
                />
              </ConfigProvider>
            )}
          </div>
        </Col>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Ảnh phương tiện</span>
            {model?.photoURL ? (
              <img
                className="img-preview"
                src={model?.photoURL}
                alt="Ảnh phương tiện"
              />
            ) : (
              <ConfigProvider colors={["red", "green", "blue"]}>
                <Avatar
                  maxInitials={1}
                  round={true}
                  size="22"
                  name={model?.licensePlate}
                />
              </ConfigProvider>
            )}
          </div>
        </Col>
      </Row>
    </Drawer>
  );
}

export default VehiclePreview;
