import React, { useState } from "react";
import {useSelector} from 'react-redux'
import swal from "sweetalert";
import {passwordUpdateApi} from "../Helper/passwodUpdate"
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CHeaderDivider,
    CBreadcrumbItem,
    CBreadcrumb,
    CRow,
    CContainer,
  } from "@coreui/react";

  import {
    cilLockLocked,
  } from "@coreui/icons";
  import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
  const Changepass = () => {
      const [validated, setValidated] = useState(false);
      const [passwordError,setpasswordError]=useState(false);
      const [conformPasswordError,setconformPasswordError]=useState(false);
      const [passvalue,setpassvalue]=useState("");
      const [loading,setLoading]=useState(false);
      const [conformPassvalue,setconformPassvalue]=useState("");
      const userData = useSelector((state)=>state.userData);

const formeset=()=>{
  setpassvalue("");
  setconformPassvalue("");
}

      const handleSubmit = (event) => {
        // event.preventDefault();
          //  setLoading(true);
          const form = event.currentTarget
          if (form.checkValidity() === false) {
              event.preventDefault()
           }else{
              event.preventDefault();
            event.stopPropagation()
            
            if(passvalue === conformPassvalue &&  conformPassvalue.length === 6 &&  passvalue.length === 6){
              // console.log("code for update")
                          let payloadData = {
                            userId: userData.userinfo.userId,
                            password: passvalue,
                            confirmPassword:conformPassvalue,
                        };
                    
                        passwordUpdateApi(payloadData)
                            .then(
                              async (res) => {
                                // console.log(" success");
                                console.log("res", res);
                                swal("Customer", res.message, "success").then((ok) => {
                                  if (ok) {
                                    window.location.reload()
                                  }
                                })
                                // swal("Customer",  res.message, "success");
                                //    formeset("");
                                //    setLoading(false);
                              },
                              (err) => {
                                // console.log("error");
                                setLoading(false);
                                swal("Customer",  "invalid password", "error");
                                // formeset("");
                              }
                            )
                            .catch();
          
          }else{
        
            swal("Customer",  "invalid password", "error")
          //   // formeset("")
          }
            setValidated(true)
        }

      }

        const validationForm =(inputName,value)=>{
          
          if(inputName ==="password"  && value &&value.length !== 6){
            setpasswordError(true)
          }else{
            setpasswordError(false)
          }
          if(inputName === "Confirm_password" && value && value.length !== 6){
            setconformPasswordError(true)
          }else{
            setconformPasswordError(false)
          }
}
        
  return (
    <CContainer>
     <CHeaderDivider />
      <CContainer>
        <CRow>
          <CCol xs={12}>
            <h5 className="main-title">Password change </h5>
          </CCol>
          
            <CCol xs={8}>
              <CBreadcrumb
                className="m-0 ms-2"
                style={{ "--cui-breadcrumb-divider": "'>'" }}
              >
                <CBreadcrumbItem>
                  <Link to="/dashboard">Home</Link>
                </CBreadcrumbItem>
                <CBreadcrumbItem actives>Password change</CBreadcrumbItem>
              </CBreadcrumb>
            </CCol>
          

          <CCol xs={4}>
            <div className="text-end">
              <Link to="/dashboard">
                <CButton
                  color="info"
                  size="sm"
                  className="px-4 text-end text-white "
                  type="button"
                  style={{ marginTop: "-52px" }}
                >
                  Back
                </CButton>
              </Link>
            </div>
          </CCol>
        </CRow>
      </CContainer>
      <br />
    <CRow>
      <CCol md={12} sm={12} lg={12}>
        <CCard className="p-4">
          <CCardBody>
            <CForm
              className="row g-3 needs-validation"
              // noValidate
              validated={validated}
              onSubmit={handleSubmit}
              method="post"
              encType="multipart/form-data"
            >
              <h4>Change password </h4>
         
              <CCol md={6} lg={4}>
              <CFormLabel><CIcon icon={cilLockLocked} className="me-2" /> Password</CFormLabel>
              <CFormInput
                placeholder="Password"
                name="password"
                type="password"
                onChange={(e) => {
                  setpassvalue(e.target.value);
                  validationForm(e.target.name ,e.target.value)
                }}
                value={passvalue}
                required
              />
              
              <CFormFeedback invalid>Please Enter Password.</CFormFeedback>
            
              {passwordError === true ? (
              <>
                <CFormFeedback className="errorMessage-customer">
                  Please Enter 6 character password.
                </CFormFeedback>
              </>
            ) : null}
            </CCol>
              <br />
              <CCol md={6}  lg={4}>
              <CFormLabel> <CIcon icon={cilLockLocked} className="me-2" /> Confirm  password</CFormLabel>
              <CFormInput
                type="password"
                name="Confirm_password"
                placeholder="Confirm password"
                value={conformPassvalue}
                onChange={(e) => {
                        setconformPassvalue(e.target.value);
                         validationForm(e.target.name ,e.target.value)
                  }}
                required
              />
             
               {conformPasswordError === true ? (
              <>
                <CFormFeedback className="errorMessage-customer">
                  Please Enter 6 character password.
                </CFormFeedback>
              </>
            ) :  <CFormFeedback invalid>Please Enter Confirm Password.</CFormFeedback>}
            </CCol>
              <CRow>
                <CCol xs={6}>
                  <br />
                  <CButton
                    color="primary"
                    className="px-4"
                    type="submit"
                     disabled={loading}
                  >
                    {loading ? "Wait..":"Submit"}
                    
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
        <br />
      </CCol>
      </CRow>
      </CContainer>
  )
}

export default Changepass