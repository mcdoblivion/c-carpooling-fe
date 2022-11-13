/* begin general import */
import { Col, Row } from "antd";
import Avatar, { ConfigProvider } from "react-avatar";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";

export interface DriverPreviewProps extends DrawerProps {
  model: any;
}

function DriverPreview(props: DriverPreviewProps) {
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
            <span>Số giấy phép lái xe</span>
            <span>{model?.driverLicenseNumber}</span>
          </div>
        </Col>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Ảnh giấy phép lái xe mặt trước</span>
            {model?.driverLicenseFrontPhotoURL ? (
              <img
                className="img-preview"
                src={model?.driverLicenseFrontPhotoURL}
                alt="Ảnh giấy phép lái xe mặt trước"
              />
            ) : (
              <ConfigProvider colors={["red", "green", "blue"]}>
                <Avatar
                  maxInitials={1}
                  round={true}
                  size="22"
                  name={model?.user?.username}
                />
              </ConfigProvider>
            )}
          </div>
        </Col>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Ảnh giấy phép lái xe mặt sau</span>
            {model?.driverLicenseBackPhotoURL ? (
              <img
                className="img-preview"
                src={model?.driverLicenseBackPhotoURL}
                alt="Ảnh giấy phép lái xe mặt sau"
              />
            ) : (
              <ConfigProvider colors={["red", "green", "blue"]}>
                <Avatar
                  maxInitials={1}
                  round={true}
                  size="22"
                  name={model?.user?.username}
                />
              </ConfigProvider>
            )}
          </div>
        </Col>
      </Row>
    </Drawer>
  );
}

export default DriverPreview;
