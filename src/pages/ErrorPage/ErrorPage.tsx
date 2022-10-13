import React from "react";
import errorPageStyle from "./ErrorPage.module.scss";

export function errorHandler(error: Error, info: { componentStack: string }) {
  // Do something with the error
  // E.g. log to an error logging client here
}

export default function ErrorPage() {
  return (
    <>
      <div className={errorPageStyle["container"]}>
        <h1>Error Boundary Page</h1>
        <h2>
          Unexpected Error In Client <b>:(</b>
        </h2>
        <div className={errorPageStyle["gears"]}>
          <div className={`${errorPageStyle["gear"]} ${errorPageStyle["one"]}`}>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
          </div>
          <div className={`${errorPageStyle["gear"]} ${errorPageStyle["two"]}`}>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
          </div>
          <div
            className={`${errorPageStyle["gear"]} ${errorPageStyle["three"]}`}
          >
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
          </div>
        </div>
      </div>
    </>
  );
}
