/* begin general import */
import { Col, Row } from "antd";
import { AppUser } from "models/AppUser";
import { FormItem, InputNumber } from "react3l-ui-library";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import useTopup from "./TopupHook";

export interface TopupProps extends DrawerProps {
  model?: AppUser;
  handleLoadList?: (id: number) => void;
  setUser?: (value: any) => void;
}

function Topup(props: TopupProps) {
  const { visible, model, handleClose, handleLoadList, setUser } = props;
  const { currentModel, handleChangeSingleField, handleSave } = useTopup(
    model,
    handleClose,
    handleLoadList,
    setUser
  );

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
      title={`Nạp tiền vào thẻ số ${currentModel?.paymentMethodId}`}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <InputNumber
              value={currentModel?.amount}
              label="Số tiền cần nạp"
              placeHolder="Nhập Số tiền cần nạp"
              onChange={handleChangeSingleField("amount")}
            />
          </FormItem>
        </Col>
      </Row>
    </Drawer>
  );
}

export default Topup;
