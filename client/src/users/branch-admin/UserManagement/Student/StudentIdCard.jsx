import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import "./StudentCard.css";
import email from "../../../../assets/email.png";
import call from "../../../../assets/call.png";
import facebook from "../../../../assets/facebook.png";
import centeredImage from "../../../../assets/Layer.png";
import logoTop from "../../../../assets/logo-top.png";
import { baseURL } from "../../../../index";

const StudentIdCard = forwardRef(({ student }, ref) => {
  return (
    <div ref={ref} id="container">
      {/* Page 1 */}
      <div id="page1">
        <div id="topHead"></div>
        <img src={logoTop} alt="logo" id="logo-top" />
        <div id="head-text-container">
          <p id="text-school">BLUE JAYS SCHOOL SYSTEM</p>
          <p id="dec-school">Education is our passion</p>
        </div>
        <div id="pic-container">
          <img
            src={`${baseURL}student/${student.photo}`}
            alt="profile"
            id="pic"
          />
        </div>
        <div className="flex-1 flex flex-col space-y-2 justify-center items-center ">
          <div className="flex items-center  w-full justify-center text-center">
            <span className="font-bold text-base text-[#1b096c] ">Name</span>
            <span className="font-bold text-base text-[#1b096c]">:</span>
            <span className="font-bold text-base text-[#1b096c] pl-2">
              {student.fullName}
            </span>
          </div>

          <div className="flex items-center  w-full justify-center text-center">
            <span className="font-bold text-base text-[#1b096c] ">Class</span>
            <span className="font-bold text-base text-[#1b096c]">:</span>
            <span className="font-bold text-base text-[#1b096c] pl-2">
              {student.classId?.className || "N/A"}
            </span>
          </div>

          <div className="flex items-center  w-full justify-center text-center">
            <span className="font-bold text-base text-[#1b096c] ">Section</span>
            <span className="font-bold text-base text-[#1b096c]">:</span>
            <span className="font-bold text-base text-[#1b096c] pl-2">
              {student.sectionId?.sectionName || "N/A"}
            </span>
          </div>
          <div className="flex items-center  w-full justify-center text-center">
            <span className="font-bold text-base text-[#1b096c] ">
              Roll Number
            </span>
            <span className="font-bold text-base text-[#1b096c]">:</span>
            <span className="font-bold text-base text-[#1b096c] pl-2">
              {student.rollNumber || "N/A"}
            </span>
          </div>
        </div>

        <div className=" z-50  absolute bottom-0 left-0 right-0 w-full">
          <div className="bg-[#009fec] w-[100px] text-center text-custom-shadow">
            <b className="text-sm text-white">
              {student.branchId.branchType} Branch
            </b>
          </div>
          <div className="h-[25px] w-full bg-[#1b096c] px-2 py-1">
            <p className="text-sm text-white font-semibold text-center">
              {student.branchId.branchAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Page 2 */}
      <div id="page2">
        <img
          src={centeredImage}
          alt="Centered Image"
          style={{
            width: "65%",
            height: "40%",
          }}
        />
        <div
          id="text-con-2"
          className="space-y-3 flex-1 justify-center items-center"
        >
          <div className="info-section">
            <u>
              <b>
                <b className="info-title text-2xl ">Guardian CNIC Number</b>
              </b>
            </u>
            <p className="info-value font-medium pt-2">
              {student.guardianId.cnicNumber}
            </p>
          </div>
          <div className="info-section">
            <u>
              <b>
                <h6 className="info-title text-2xl">Contact Number</h6>
              </b>
            </u>
            <p className="info-value font-medium pt-2">
              {student.guardianId.guardianPhoneNumber}
            </p>
          </div>
          <div className="info-section">
            <u>
              <b>
                <h6 className="info-title text-2xl">Emergency Number</h6>
              </b>
            </u>
            <p className="info-value font-medium pt-2">
              {student.emergencyPhoneNumber}
            </p>
          </div>
          <div className="info-section">
            <u>
              <b>
                <h6 className="info-title text-2xl">Father Name</h6>
              </b>
            </u>
            <p className="info-value font-medium pt-2">
              {student.emergencyContactPerson}
            </p>
          </div>
          <div className="info-section">
            <u>
              <b>
                <h6 className="info-title text-2xl">Residential Address</h6>
              </b>
            </u>
            <p className="info-value font-medium pt-2">
              {student.permanentAddress}
            </p>
          </div>
        </div>
        <div className="h-[24%] text-center w-full flex flex-col justify-between items-center">
          <div id="foot-con-21" className="flex-1">
            <p className="font-semibold">BLUE JAYS SCHOOL SYSTEM</p>
            <p className="font-normal">Education is our passion</p>
          </div>

          <div className="mt-4 gap-3 flex justify-center items-center mb-2 ">
            <img
              style={{ width: "20px", height: "20px", position: "relative" }}
              src={call}
              alt="phone"
            />
            <p id="foot-text">
              {student.branchId.branchPhoneNumber || "Phone Not Available"}
            </p>
          </div>
          <div className="flex gap-2 w-full justify-center items-center space-x-3  ">
            <div className="flex  justify-between  items-center  ">
              <img
                style={{
                  width: "20px",
                  height: "20px",
                  position: " relative",
                  marginRight: "8px",
                }}
                src={facebook}
                alt="facebook"
              />
              <p id="foot-text">BlueJaysEdu</p>
            </div>
            <div className="flex justify-between items-center">
              <img
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                  position: "relative",
                }}
                src={email}
                alt="email"
              />
              <p className="text-[13px] text-white font-medium   ">
                {student.branchId.branchEmailAddress || "Email Not Available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

StudentIdCard.propTypes = {
  student: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    studentId: PropTypes.string.isRequired,
    cnicNumber: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    photo: PropTypes.string,
    classId: PropTypes.shape({
      className: PropTypes.string,
    }),
    sectionId: PropTypes.shape({
      sectionName: PropTypes.string,
    }),
    branchId: PropTypes.shape({
      branchType: PropTypes.string.isRequired,
      branchAddress: PropTypes.string.isRequired,
      branchPhoneNumber: PropTypes.string.isRequired,
      branchEmailAddress: PropTypes.string.isRequired,
    }).isRequired,
    email: PropTypes.string,
  }).isRequired,
};

export default StudentIdCard;
