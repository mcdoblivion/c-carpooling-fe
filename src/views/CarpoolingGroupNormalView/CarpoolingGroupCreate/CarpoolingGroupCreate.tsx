/* begin general import */
import { Col, Row } from "antd";
import TimePicker from "components/TimePicker";
import { FormItem, InputText } from "react3l-ui-library";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import useCarpoolingGroupCreate from "./CarpoolingGroupCreateHook";

export interface CarpoolingGroupCreateProps extends DrawerProps {
  handleLoadList?: (filterParam?: any) => void;
}

function CarpoolingGroupCreate(props: CarpoolingGroupCreateProps) {
  const { visible, handleClose, handleLoadList } = props;
  const {
    currentModel,
    handleSave,
    handleChangeTime,
    handleChangeSingleField,
  } = useCarpoolingGroupCreate(handleLoadList, handleClose);

  return (
    <Drawer
      visible={visible}
      handleClose={handleClose}
      handleSave={handleSave}
      handleCancel={handleClose}
      visibleFooter={true}
      titleButtonApply="Tạo nhóm"
      titleButtonCancel="Đóng"
      loading={false}
      size={"sm"}
      title={"Tạo nhóm đi chung"}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <InputText
              value={currentModel.groupName}
              label="Tên nhóm đi chung"
              placeHolder="Nhập tên nhóm đi chung"
              onChange={handleChangeSingleField("groupName")}
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <TimePicker
              value={currentModel.departureTimeValue}
              label="Thời gian xuất phát"
              placeholder="Chọn thời gian"
              onChange={handleChangeTime("departureTime")}
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <TimePicker
              value={currentModel.comebackTimeValue}
              label="Thời gian trở về"
              placeholder="Chọn thời gian"
              onChange={handleChangeTime("comebackTime")}
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <InputText
              value={currentModel.delayDurationInMinutes}
              label="Thời gian trễ tối đa (phút)"
              placeHolder="Nhập tên nhóm đi chung"
              onChange={handleChangeSingleField("delayDurationInMinutes")}
            />
          </FormItem>
        </Col>
      </Row>
    </Drawer>
  );
}

export default CarpoolingGroupCreate;
