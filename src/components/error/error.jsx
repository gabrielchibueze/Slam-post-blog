/* eslint-disable react/prop-types */
import { Component } from "react";
import ErrorCanfirmPopup from "../errorCanfirmPopup/errorCanfirmPopup";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }

  }
  static getDerivedStateFromError(error) {
    if (error) {
      return { hasError: true }
    }
  }
  render() {
    if (this.state.hasError) {
      return <ErrorCanfirmPopup
        props={{
          title: "Error Message", message: "An Error Occured",
          buttonOneType: "button",
          buttonOneTitle: "Close", buttonOneFunction: () => this.setState({ hasError: false })
        }} />
    }
    
    return this.props.children
  }
}

export default ErrorBoundary