/* begin general import */
import { Col, Row } from "antd";
import { AppUser } from "models/AppUser";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";

export interface DayOffRequestNormalPreviewProps extends DrawerProps {
  model?: AppUser;
}

function DayOffRequestNormalPreview(props: DayOffRequestNormalPreviewProps) {
  const { visible, model, handleClose } = props;

  return (
    <Drawer
      visible={visible}
      handleClose={handleClose}
      visibleFooter={false}
      loading={false}
      size={"sm"}
      title={`Yêu cầu nghỉ phép số ${model?.id}`}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Ngày nghỉ phép</span>
            <span>{model?.date}</span>
          </div>
        </Col>
        <Col lg={24} className="m-b--lg">
          <div className="text__with__label">
            <span>Chiều di chuyển</span>
            <span>{model?.directionType}</span>
          </div>
        </Col>
      </Row>
    </Drawer>
  );
}

export default DayOffRequestNormalPreview;
