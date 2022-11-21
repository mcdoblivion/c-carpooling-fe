/* begin general import */
import { Col, Row } from "antd";
import { AppUser, AppUserFilter } from "models/AppUser";
import { DatePicker, FormItem, Select } from "react3l-ui-library";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import useLeaveGroupRequestNormalDetail from "../LeaveGroupRequestNormalDetail/LeaveGroupRequestNormalDetailHook";

export interface LeaveGroupRequestNormalDetailProps extends DrawerProps {
  model?: AppUser;
  handleLoadList?: (filterParam?: any) => void;
}

function LeaveGroupRequestNormalDetail(
  props: LeaveGroupRequestNormalDetailProps
) {
  const { visible, model, handleClose, handleLoadList } = props;
  const {
    currentModel,
    directionTypeSearchFunc,
    handleChangeDayOfRequest,
    handleSave,
  } = useLeaveGroupRequestNormalDetail(model, handleLoadList, handleClose);

  return (
    <Drawer
      visible={visible}
      handleClose={handleClose}
      handleSave={handleSave}
      visibleFooter={true}
      titleButtonApply="Lưu"
      titleButtonCancel="Đóng"
      loading={false}
      size={"sm"}
      title={currentModel?.id ? currentModel?.id : "Tạo mới yêu cầu nghỉ phép"}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <DatePicker
              label="Ngày nghỉ phép"
              value={currentModel?.date}
              type={0}
              placeholder="Chọn ngày"
              onChange={handleChangeDayOfRequest("date")}
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <Select
              type={0}
              label="Chiều di chuyển"
              classFilter={AppUserFilter}
              placeHolder="Chọn chiều di chuyển"
              getList={directionTypeSearchFunc}
              onChange={handleChangeDayOfRequest("directionType")}
              value={currentModel?.directionTypeValue}
            />
          </FormItem>
        </Col>
      </Row>
    </Drawer>
  );
}

export default LeaveGroupRequestNormalDetail;
