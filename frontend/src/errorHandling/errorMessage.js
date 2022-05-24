/*
Student ID | Name
-----------------------
1155127438 | HONG Kai Yin 
1155141990 | NG Wing Ki Vickie
1155142639 | LAM Yan Yu
1155127411 | WONG Sai Ho
1155127379 | Tang Siu Cheong
1155133623 | Ho Lee Lee
*/

import React from "react";
import { Alert } from "react-bootstrap";

const ErrorMessage = ({ children }) => {
  return (
    <Alert variant="warning">
      <strong>{ children }</strong>
    </Alert>
  );
};

export default ErrorMessage;