import React from "react";
import "./CreditCard.scss";

export interface CreditCardProps {
  cardType?: string;
  lastFourDigits?: string;
}

const CreditCard = (props: CreditCardProps) => {
  const { cardType, lastFourDigits } = props;
  return (
    <div className="Wrap" style={{ padding: "10px" }}>
      <div className="Base">
        <div className="Inner-wrap">
          <div className="d-flex justify-content-between">
            <img
              src={require("assets/images/creditCard.svg").default}
              alt=""
              width={80}
              height={"auto"}
            />
            <img
              src={require("assets/images/logoCreditCard.svg").default}
              alt=""
              width={24}
              height={24}
            />
          </div>
          <div className="w-100 m-t--sm">
            <img
              src={require("assets/images/chipCreditCard.svg").default}
              alt=""
              width={50}
              height={50}
            />
          </div>

          <div className="Card-number m-t--xs">
            <ul>
              <li id="first-li">****</li>
              <li>****</li>
              <li>****</li>
              <li id="last-li">{lastFourDigits}</li>
            </ul>
          </div>
          <div className="d-flex justify-content-between">
            <div className="w-100">
              <div className="Expire">
                <p>02/30</p>
              </div>
              <div className="Name">
                <h3>DONG MINH CUONG</h3>
              </div>
            </div>

            {cardType === "visa" ? (
              <img
                src={require("assets/images/logoVisa.svg").default}
                alt=""
                width={60}
                height={"auto"}
              />
            ) : (
              <img
                src={require("assets/images/mastercard.svg").default}
                alt=""
                width={50}
                height={"auto"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
