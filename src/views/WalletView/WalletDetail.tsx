/* begin general import */
import { Col, Row } from "antd";
import { AppUser } from "models/AppUser";
import { FormItem, InputNumber, InputText } from "react3l-ui-library";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import useWalletDetail from "./WalletDetailHook";
import Cards from "react-credit-cards";

export interface WalletDetailProps extends DrawerProps {
  model?: AppUser;
  handleLoadList?: (id: number) => void;
}

function WalletDetail(props: WalletDetailProps) {
  const { visible, model, handleClose, handleLoadList } = props;
  const {
    focused,
    currentModel,
    handleChangeSingleField,
    handleChangeDateField,
    handleSave,
  } = useWalletDetail(model, handleClose, handleLoadList);

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
      title={"Thêm thẻ"}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Cards
          cvc={currentModel?.cvc || 111}
          expiry={`${currentModel?.expiry}`}
          name="DONG MINH CUONG"
          number={currentModel?.cardNumber || "0000000000000000"}
          focused={focused}
        />
        <Col lg={24} className="m-b--lg m-t--lg">
          <FormItem>
            <InputNumber
              value={currentModel?.cardNumber}
              label="Số thẻ"
              placeHolder="Nhập Số thẻ"
              onChange={handleChangeSingleField("cardNumber")}
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <InputText
              value={currentModel?.expiry}
              label="Ngày hết hạn ghi trên thẻ"
              placeHolder="Nhập Ngày hết hạn ghi trên thẻ"
              onChange={handleChangeDateField("expiry")}
              maxLength={5}
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--lg">
          <FormItem>
            <InputNumber
              value={currentModel?.cvc}
              label="cvc"
              placeHolder="Nhập CVC"
              onChange={handleChangeSingleField("cvc")}
              max={9999}
            />
          </FormItem>
        </Col>
      </Row>
    </Drawer>
  );
}

export default WalletDetail;
