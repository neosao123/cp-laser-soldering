import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CWidgetStatsF,
  CWidgetStatsB,
  CRow,
  CHeaderDivider,
  CBreadcrumb,
  CBreadcrumbItem,
  CContainer,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilFolderOpen, cilInfo } from "@coreui/icons";
import "./TotalOutstanding.css";
import DataTable, { FilterComponent } from "react-data-table-component";
import { OutstandingList } from "../Helper/outstanding";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";
import { customerListApi } from "../Helper/customer";
import { fetchCustomerListApi } from "../Helper/order";

// const tabledata = [
//   {
//     id: 1,
//     customerName: 'Rowan',
//     noOfOrders: 2,
//     totalOutstanding: '123',
//     totalPayAmount: '78355'
//   },
//   {
//     id: 2,
//     customerName: 'Rowan',
//     noOfOrders: 7,
//     totalOutstanding: '123',
//     totalPayAmount: '876'
//   },
//   {
//     id: 3,
//     customerName: 'Ezra',
//     noOfOrders: 21,
//     totalOutstanding: '123',
//     totalPayAmount: '54354'
//   },
//   {
//     id: 4,
//     customerName: 'Jayden',
//     noOfOrders: 442,
//     totalOutstanding: '123',
//     totalPayAmount: '543'
//   },
//   {
//     id: 5,
//     customerName: 'Eliana',
//     noOfOrders: 42,
//     totalOutstanding: '123',
//     totalPayAmount: 'Kai'
//   },
//   {
//     id: 6,
//     customerName: 'Amara',
//     noOfOrders: 21,
//     totalOutstanding: '123',
//     totalPayAmount: '3453'
//   },
//   {
//     id: 7,
//     customerName: 'Nova',
//     noOfOrders: 32,
//     totalOutstanding: '123',
//     totalPayAmount: '3543'
//   },
//   {
//     id: 8,
//     customerName: 'Kai',
//     noOfOrders: 42,
//     totalOutstanding: '123',
//     totalPayAmount: '63543'
//   },
//   {
//     id: 9,
//     customerName: 'Kai',
//     noOfOrders: 12,
//     totalOutstanding: '123',
//     totalPayAmount: '121'
//   }

// ]

export default function TotalOutstanding() {
  const [data, setData] = useState();
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [filterdata, setfilterdata] = useState();
  const [customerId, setCustomerId] = useState("");
  const [totalRows, setTotalRows] = useState();
  const [perPage, setPerPage] = useState(10);
  const userData = useSelector((state) => state.userData);
  const [customerList, setCustomerList] = useState();
  const [listLoading, setListLoading] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const columns = [
    {
      name: " No",
      selector: (row, index) => index + 1,
    },
    // {
    //   name: 'Customer Id No',
    //   selector: row => row.customerId,
    // },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
    },
    {
      name: "Customer Phone",
      selector: (row) => row.customerPhone,
    },

    {
      name: "Total Outstanding",
      selector: (row) => row.totalOutStanding,
    },
    {
      name: "Total Paid",
      selector: (row) => row.totalPaid,
    },
    {
      name: "Balance",
      selector: (row) => row.remainingAmount,
    },
    // {
    //   name: 'Type',
    //   selector: row => row.type,
    // },
    {
      name: "View",
      selector: (row) => (
        <>
          <Link to={"/outstandingViewList/" + row.customerId}>
            <CButton
              color="secondary"
              title="View Outstanding"
              variant="outline"
              className="px-0 buttonsOrderPage "
            >
              <CIcon icon={cilFolderOpen} size="lg" />
            </CButton>
          </Link>
        </>
      ),
    },
  ];

  let userId = userData.userinfo.userId;

  function handlePerRowsChange(page) {
    console.log("cur", page);
    if (page === undefined) {
      page = 0;
    }
    var ofs = (page - 1) * perPage;
    console.log("Per Row ", ofs);
    OutstandingList(userId, ofs, "", "").then(
      (res) => {
        setData(res?.data);
        setData(res.data);
        setTotalRows(res.totalRecords);
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  function handlePageChange(page) {
    setListLoading(true);
    var offset = (page - 1) * perPage;
    OutstandingList(userId, offset < 0 ? 0 : offset, "", "").then(
      (res) => {
        if (res.status === 200) {
          console.log(res);
          setData(res.data);
          setTotalRows(res.totalRecords);
          setListLoading(false);
        }
      },
      (err) => {
        console.log(err);
        setListLoading(false);
      }
    );
  }

  useEffect(() => {
    handlePageChange(0);
    getCutomerlist();
  }, []);

  const paginationComponentOptions = {
    rowsPerPageText: "",
    noRowsPerPage: true,
  };

  const getCutomerlist = () => {
    fetchCustomerListApi().then((res) => {
      var result = res?.data;
      var customerLive = [];
      result.forEach((element) => {
        customerLive.push({
          value: element.customerId,
          label: element.customerName,
        });
      });
      setCustomerList(customerLive);
    });
  };

  const handleCustomer = (e) => {
    setSelectedCustomer(e.value);
  };

  var paidOption = "full paid";
  const handlePayment = (e) => {
    paidOption = e.target.value;
  };

  const handleSearch = async (page) => {
    setListLoading(true);
    OutstandingList(userId, 0, selectedCustomer, paidOption).then((res) => {
      console.log(res);
      setData(res?.data);
      setListLoading(false);
    });
    let customerId = selectedCustomer ?? "";
  };

  const handleClear = (e) => {
    e.preventDefault();
    window.location.reload();
  };
  const customStyles = {
    cells: {
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd"
      },
    },
    rdt_TableHeadRow:{
      style: {
        borderRight: "1px solid #ddd",
        borderLeft: "1px solid #ddd"
      },
    }
  };


  return (
    <div>
      <CHeaderDivider />
      <CContainer fluid>
        <CRow>
          <CCol xs={12}>
            <h5 className="main-title">Outstanding </h5>
          </CCol>
          <CCol xs={8}>
            <CBreadcrumb
              className="m-0 ms-2"
              style={{ "--cui-breadcrumb-divider": "'>'" }}
            >
              <CBreadcrumbItem>
                {" "}
                <Link to="/dashboard">Home</Link>
              </CBreadcrumbItem>
              <CBreadcrumbItem actives>Total Outstanding</CBreadcrumbItem>
            </CBreadcrumb>
          </CCol>
          <CCol xs={4}></CCol>
        </CRow>
      </CContainer>

      <CRow className="justify-content-center">
        <CCol md={12} lg={12} sm={12}>
          <CCard style={{ margin: "10px" }} className="mb-4">
            <CCardHeader>
              <strong>Total Outstanding</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="">
                <CCol md={12}>
                  <CFormLabel>
                    <b>Filter:</b>
                  </CFormLabel>
                </CCol>

                <CCol md={3}>
                  <CFormLabel>Customer Name</CFormLabel>
                  <Select
                    options={customerList}
                    placeholder={
                      <div className="select-placeholder-text">
                        Select Customer
                      </div>
                    }
                    className="text-start mb-3"
                    value={customerList?.find(
                      (obj) => obj.value === selectedCustomer
                    )}
                    onChange={handleCustomer}
                  />
                </CCol>

                <CCol md={3}>
                  <CFormLabel>Payment</CFormLabel>
                  <select
                    name="cars"
                    id="cars"
                    className="form-select"
                    onChange={handlePayment}
                  >
                    <option value="full paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="partial paid">Partially Paid</option>
                  </select>
                </CCol>
                <br />
                <CCol md={12}>
                  <div className="text-center mt-2">
                    <CButton
                      color="success"
                      className="m-2 text-white"
                      onClick={handleSearch}
                    >
                      Search
                    </CButton>
                    <CButton
                      color="dark"
                      className="text-white"
                      onClick={handleClear}
                    >
                      Clear
                    </CButton>
                  </div>
                </CCol>
              </CRow>

              <DataTable
                className=" mt-3 "
                columns={columns}
                data={data}
                highlightOnHover
                pagination
                paginationServer
                progressPending={listLoading}
                paginationRowsPerPageOptions={[]}
                paginationComponentOptions={paginationComponentOptions}
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                customStyles={customStyles}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
}
