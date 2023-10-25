import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CCardHeader,
  CInputGroup,
  CInputGroupText,
  CRow,
  CContainer,
  CCardGroup,
  CFormLabel,
  CHeaderDivider,
  CBreadcrumb,
  CBreadcrumbItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import imageprofile from "../../Image/userp.png";
import { useSelector, useDispatch } from "react-redux";
// import {profilePhotoApi} from "../Helper/profilephto"
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { checkLogin } from "../Store/reducers/userReducer";
import { profilePhotoApi } from "../Helper/profilephto";

const Profilepage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const [validated, setValidated] = useState(false);
  const [profileNamerError, setprofileNamerError] = useState(false);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState();
  const [emailError, setemailError] = useState();
  const [imageError, setImageError] = useState(false);
  const [profilemail, setprofilEmail] = useState(userData.userinfo.email);
  const [profilName, setprofilName] = useState(userData.userinfo.name);
  const [loading, setLoading] = useState(false);

  let regx = /^[A-Za-z\s]*$/;
  let emailregx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  useEffect(() => {
    if (!image) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    if (image.type === "image/png" || image.type === "image/jpeg") {
      // console.log("ok")
      setPreview(objectUrl);
    } else {
      // console.log("notok");
      setPreview(null);
    }

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleFileChangeImage = (e) => {
    if (image !== null) {
      if (
        e.target.files[0].type == "image/png" ||
        e.target.files[0].type == "image/jpeg"
      ) {
        setImageError(false);
      } else {
        setImageError(true);
      }
      setImage(e.target.files[0]);
    } else {
      setImage("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validated) {
      // event.preventDefault();
      return false;
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", userData.userinfo.userId);
      formData.append("name", profilName);
      formData.append("email", profilemail);
      formData.append("profile_photo", image);

      profilePhotoApi(formData)
        .then(
          async (res) => {
            console.log(res);
            const userId = localStorage.getItem("userId");
            dispatch(checkLogin(userId));
            if (res.status === 200) {
              swal("Profile ", "Profile Updated sucessfully", "success").then(
                (ok) => {
                  if (ok) {
                    // window.location.reload();
                  }
                }
              );
              setLoading(false);
            } else {
              swal("warning", res, "warning");
              setLoading(false);
            }
          },
          (err) => {
            swal("Profile ", "Profile is not corret", "error");
            setLoading(false);
          }
        )
        .catch();
    }
  };

  console.log(image);
  const validationForm = (inputName, value) => {
    if (inputName === "name" && value && regx.test(value) === false) {
      setprofileNamerError(true);
      setValidated(true);
      return false;
    } else {
      setprofileNamerError(false);
    }
    if (inputName === "email" && emailregx.test(value) === false) {
      setemailError(true);
      setValidated(true);
      return false;
    } else {
      setemailError(false);
    }
    setValidated(false);
  };

  return (
    <>
      <CHeaderDivider />
      <CContainer fluid>
        <CRow>
          <CCol xs={12}>
            <h5 className="main-title">Profile</h5>
          </CCol>
          <CCol xs={8}>
            <CBreadcrumb
              className="m-0 ms-2"
              style={{ "--cui-breadcrumb-divider": "'>'" }}
            >
              <CBreadcrumbItem>
                <Link to="/dashboard">Home</Link>
              </CBreadcrumbItem>
              <CBreadcrumbItem actives>Profile</CBreadcrumbItem>
            </CBreadcrumb>
          </CCol>
          <CCol xs={4}>
            <div className="text-end">
              <Link to="/dashboard">
                <CButton
                  color="warning"
                  size="sm"
                  className="px-4 text-end text-white"
                  style={{ marginTop: "-52px" }}
                  type="button"
                >
                  Back
                </CButton>
              </Link>
            </div>
          </CCol>
        </CRow>
      </CContainer>
      <br />

      <CContainer>
        <CRow>
          <CCol md={12} sm={12} lg={5}>
            <CCard className="p-4">
              <CCardBody>
                <CForm
                  className="row g-3 needs-validation"
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                  method="post"
                  encType="multipart/form-data"
                >
                  <h4>Profile Update</h4>

                  <CCol xs={12}>
                    <div className="text-center">
                      {preview ? (
                        <img
                          src={preview}
                          className="imagePreview rounded-circle"
                        />
                      ) : (
                        <img
                          src={userData.userinfo.profile_photo}
                          className="imagePreview rounded-circle"
                        />
                      )}
                    </div>
                  </CCol>
                  <CCol md={12} sm={12} xs={12}>
                    <CFormLabel htmlFor="validationCustom02">Image</CFormLabel>
                    <CFormInput
                      name="image"
                      type="file"
                      id="validationTextarea"
                      aria-label="file example"
                      // value={profilPhoto}
                      // required
                      onChange={handleFileChangeImage}
                    />
                    {/* <CFormFeedback invalid>Please upload image </CFormFeedback> */}
                    {imageError === true ? (
                      <>
                        <CFormFeedback className="errorMessage">
                          Please upload image only
                        </CFormFeedback>
                      </>
                    ) : null}
                  </CCol>

                  <CFormLabel>Name</CFormLabel>
                  <CFormInput
                    placeholder="Name"
                    name="name"
                    type="text"
                    onChange={(e) => {
                      setprofilName(e.target.value);
                    }}
                    value={profilName}
                    // required
                  />
                  {/* <CFormFeedback invalid>Please Enter Name.</CFormFeedback> */}
                  {profileNamerError === true ? (
                    <>
                      <CFormFeedback className="errorMessage-customer">
                        Please Enter Name.
                      </CFormFeedback>
                    </>
                  ) : null}
                  <br />

                  <CFormLabel> Email</CFormLabel>
                  {/* <CFormInput
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={profilemail}
                    onChange={(e) => {
                      setprofilEmail(e.target.value);
                    }}
                  required
                  /> 
                   <CFormFeedback invalid>Please Enter Email.</CFormFeedback> */}

                  <CFormInput
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={profilemail}
                    onChange={(e) => {
                      setprofilEmail(e.target.value);
                      validationForm(e.target.name, e.target.value);
                    }}
                    required
                  />
                  {/* <CFormFeedback valid>Please Enter email.</CFormFeedback> */}
                  {emailError ? (
                    <>
                      <CFormFeedback className="errorMessage">
                        Please Enter Email.
                      </CFormFeedback>
                    </>
                  ) : (
                    <CFormFeedback invalid>Please Enter email.</CFormFeedback>
                  )}

                  <CRow>
                    <CCol xs={6}>
                      <br />
                      <CButton
                        color="primary"
                        className="px-4"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Wait.." : "Update"}
                        {/* Update */}
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
    </>
  );
};

export default Profilepage;
