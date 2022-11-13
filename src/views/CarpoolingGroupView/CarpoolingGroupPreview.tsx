/* begin general import */
import { Col, Row } from "antd";
import Avatar, { ConfigProvider } from "react-avatar";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";

export interface CarpoolingGroupPreviewProps extends DrawerProps {
  model: any;
}

function CarpoolingGroupPreview(props: CarpoolingGroupPreviewProps) {
  const { visible, model, handleClose } = props;
  const vehicleForCarpooling = model?.driverUser?.driver?.vehicleForCarpooling;

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
            <span>Thành viên</span>
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
        </Col>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Biển số phương tiện</span>
            <span>{vehicleForCarpooling?.licensePlate}</span>
          </div>
        </Col>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Ảnh phương tiện</span>
            {vehicleForCarpooling?.photoURL ? (
              <img
                className="img-preview"
                src={vehicleForCarpooling?.photoURL}
                alt="Ảnh phương tiện"
              />
            ) : (
              <ConfigProvider colors={["red", "green", "blue"]}>
                <Avatar maxInitials={1} round={true} size="22" name={"U"} />
              </ConfigProvider>
            )}
          </div>
        </Col>
      </Row>
    </Drawer>
  );
}

export default CarpoolingGroupPreview;
