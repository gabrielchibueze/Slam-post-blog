/* eslint-disable react/prop-types */
import { Fragment, useContext } from "react";
import ErrorCanfirmPopup from "../errorCanfirmPopup/errorCanfirmPopup";
import { FeedContext } from "../feedContextProvider/feedContextProvider";

const ErrorBoundary = (props) => {

  const { state, errorHandler } = useContext(FeedContext)
  return (
    <Fragment>
      {state.error && state.error.length > 0 && <ErrorCanfirmPopup
        props={{ isError: state.error?.length > 0,
          title: state.error[0].title || "Error message", message: state.error[0].message,
          buttonOneType: "button",
          buttonOneTitle: "Close", buttonOneFunction: errorHandler
        }} />
      }
      {props.children}
    </Fragment>

  )

}


export default ErrorBoundary