import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import "moment-timezone";
import Moment from "react-moment";
import data from "../assets/data.json";
import moment from "moment-timezone";
import "./DataTableStyle.css";
var user = JSON.parse(localStorage.getItem("appointment"));
function createData(
  name,
  startdate,
  starttime,
  appointmentDuration,
  clinicianname,
  PatientId
) {
  return {
    name,
    startdate,
    starttime,
    appointmentDuration,
    clinicianname,
    PatientId,
  };
}
const rows = user.map((item) => {
  let startTime = moment(item.endDate);
  let endTime = moment(item.startDate);
  let duration = moment.duration(startTime.diff(endTime));
  let totalDuration = duration.format("hh:mm:ss");

  return createData(
    item.patient.name,
    item.startDate.substring(0, 10),
    item.startDate.substring(11, 16),
    totalDuration,
    item.clinicianName,
    item.id
  );
});
const DataTableRowGroupDemo = () => {
  const [customers, setCustomers] = useState(rows);
  const [expandedRows, setExpandedRows] = useState([]);
  const toast = useRef(null);

  const headerTemplate = (data) => {
    return (
      <React.Fragment>
        <span className="image-text">{data.clinicianname}</span>
      </React.Fragment>
    );
  };

  const footerTemplate = (data) => {
    return <React.Fragment></React.Fragment>;
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="image-text">{rowData.name}</span>
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.status}`}>
        {rowData.status}
      </span>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="image-text">{rowData.name}</span>
      </React.Fragment>
    );
  };

  const calculateCustomerTotal = (name) => {
    let total = 0;

    if (customers) {
      for (let customer of customers) {
        if (customer.patient.name === name) {
          total++;
        }
      }
    }

    return total;
  };

  return (
    <div className="datatable-rowgroup-demo">
      <Toast ref={toast}></Toast>

      <div className="card">
        <p>Clinician Name.</p>
        <DataTable
          value={customers}
          rowGroupMode="subheader"
          groupField="clinicianname"
          sortMode="single"
          sortField="clinicianname"
          sortOrder={1}
          expandableRowGroups
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowGroupHeaderTemplate={headerTemplate}
          rowGroupFooterTemplate={footerTemplate}
        >
          <Column field="name" header="Patient Name"></Column>
          <Column field="startdate" header="Start   Date"></Column>
          <Column field="starttime" header="Start Time"></Column>
          <Column field="appointmentDuration" header="Duration"></Column>
          <Column field="clinicianname" header="Clinician Name"></Column>
        </DataTable>
      </div>
    </div>
  );
};
export default DataTableRowGroupDemo;
