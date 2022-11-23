/* begin general import */
import { TrashCan16 } from "@carbon/icons-react";
import { Col, Row } from "antd";
import { AppUser } from "models/AppUser";
import moment, { Moment } from "moment";
import { useCallback } from "react";
import { Button, DatePicker, FormItem, InputText } from "react3l-ui-library";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import useLeaveGroupRequestNormalDetail from "./LeaveGroupRequestNormalDetailHook";

export interface LeaveGroupRequestNormalDetailProps extends DrawerProps {
  model?: AppUser;
  handleDeleteLeaveGroupRequest?: (id: any) => void;
}

function LeaveGroupRequestNormalDetail(
  props: LeaveGroupRequestNormalDetailProps
) {
  const { visible, model, handleClose, handleDeleteLeaveGroupRequest } = props;
  const { currentModel, handleChangeDayOfRequest, handleSave } =
    useLeaveGroupRequestNormalDetail(model, handleClose);
  const disabledDate = useCallback((current: Moment) => {
    return current && current.diff(moment(), "day") < 6;
  }, []);
  return (
    <Drawer
      visible={visible}
      handleClose={handleClose}
      handleSave={handleSave}
      handleCancel={handleClose}
      visibleFooter={true}
      titleButtonApply="Lưu"
      titleButtonCancel="Đóng"
      loading={false}
      size={"sm"}
      title={
        currentModel?.id
          ? `Thông tin Yêu cầu rời nhóm`
          : "Tạo mới Yêu cầu rời nhóm"
      }
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <InputText
              type={0}
              label="Tên nhóm"
              value={currentModel?.carpoolingGroup?.groupName}
              disabled
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <DatePicker
              label="Ngày rời nhóm"
              value={currentModel?.date}
              type={0}
              placeholder="Chọn ngày"
              onChange={handleChangeDayOfRequest()}
              disabledDate={disabledDate}
            />
          </FormItem>
        </Col>
        {currentModel?.id && (
          <Col lg={24} className="m-b--lg">
            <Button
              type="danger"
              className="btn--lg"
              icon={<TrashCan16 />}
              onClick={() => handleDeleteLeaveGroupRequest(currentModel.id)}
            >
              Xóa yêu cầu rời nhóm
            </Button>
          </Col>
        )}
      </Row>
    </Drawer>
  );
}

export default LeaveGroupRequestNormalDetail;
