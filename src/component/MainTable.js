import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { GroupingState, IntegratedGrouping } from "@devexpress/dx-react-grid";
import FilterListIcon from "@material-ui/icons/FilterList";
import MaterialTable from "material-table";
import "moment-timezone";
import Moment from "react-moment";
import data from "../assets/data.json";
import moment from "moment-timezone";
import {
  Grid,
  TableHeaderRow,
  TableGroupRow,
} from "@devexpress/dx-react-grid-material-ui";

import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));
export default function EnhancedTable() {
  const classes = useStyles();
  const [appointment, setAppointment] = React.useState(data);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("startdate");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [patientname, setPatientname] = React.useState("");
  const [clinicianName, setClinicianName] = React.useState("");
  const [startdate, setStartdate] = React.useState("");
  const [enddate, setEnddate] = React.useState("");

  localStorage.setItem("appointment", JSON.stringify(appointment));
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
  function handleData(e) {
    e.preventDefault();
    let id = Math.random();
    if (
      appointment !== 0 &&
      patientname !== "" &&
      clinicianName !== "" &&
      startdate !== "" &&
      enddate !== ""
    ) {
      setAppointment([
        ...appointment,
        {
          id: id.toString(),
          clinicianName: clinicianName,
          endDate: enddate,
          startDate: startdate,
          patient: { id: id, name: patientname },
        },
      ]);
      localStorage.setItem("appointment", JSON.stringify(appointment));
      let data = [
        ...appointment,
        {
          id: id.toString(),
          clinicianName: clinicianName,
          endDate: enddate,
          startDate: startdate,
          patient: { id: id, name: patientname },
        },
      ];
    }
  }

  const handleDelete = (event) => {
    const result = appointment.filter((id) => id.id !== event.target.value);
    setAppointment(result);
    localStorage.setItem("appointment", JSON.stringify(appointment));
  };
  function handleChangePatientname(e) {
    setClinicianName(e.target.value);
  }
  function handleChangeClinicianName(e) {
    setPatientname(e.target.value);
  }
  function handleStartdate(e) {
    setStartdate(e.target.value);
  }
  function handleChangeEnddate(e) {
    setEnddate(e.target.value);
  }

  const columns = [
    { title: "patient", field: "patient.name" },
    { title: "start date", field: "startDate" },
    { title: "clinician name", field: "clinicianName" },
    { title: "Status", field: "status" },
  ];
  const rows = appointment.map((item) => {
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

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Patient Name" },
    {
      id: "startdate",
      numeric: true,
      disablePadding: false,
      label: "Start Date",
    },
    {
      id: "starttime",
      numeric: true,
      disablePadding: false,
      label: "Start Time",
    },
    {
      id: "appointmentDuration",
      numeric: true,
      disablePadding: false,
      label: "Duration",
    },
    {
      id: " clinicianname",
      numeric: false,
      disablePadding: false,
      label: "Clinician Name",
    },
    {
      id: " PatientId",
      numeric: false,
      disablePadding: false,
      label: "PatientId",
    },
  ];

  function EnhancedTableHead(props) {
    const {
      classes,
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all desserts" }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
  }));

  const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} Selected/Deleted
          </Typography>
        ) : (
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          ></Typography>
        )}

        {numSelected > 0 ? (
          ""
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={Math.random()}
                      selected={isItemSelected}
                      style={
                        parseInt(row.appointmentDuration) > 1 &&
                        parseInt(row.appointmentDuration) < 10
                          ? { background: "#ff6347" }
                          : { background: "white" }
                      }
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.startdate}</TableCell>
                      <TableCell align="right">{row.starttime}</TableCell>
                      <TableCell align="right">
                        {row.appointmentDuration}
                      </TableCell>
                      <TableCell align="right">{row.clinicianname}</TableCell>
                      <TableCell align="right">
                        {row.PatientId}
                        <button value={row.PatientId} onClick={handleDelete}>
                          {" "}
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <form>
        <TextField
          id="standard-basic"
          label="Clinician  Name"
          type="text"
          value={clinicianName}
          onChange={handleChangePatientname}
        ></TextField>
        <TextField
          id="standard-basic"
          label="Patient  Name"
          type="text"
          value={patientname}
          onChange={handleChangeClinicianName}
        ></TextField>
        <br />
        <TextField
          id="datetime-local"
          label="Next appointment from"
          type="datetime-local"
          defaultValue="2017-05-24T10:30"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleStartdate}
        />
        <TextField
          id="datetime-local"
          label="Next appointment to"
          type="datetime-local"
          defaultValue="2017-05-24T10:30"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChangeEnddate}
        />
        <br />

        <button
          className={classes.root}
          onClick={handleData}
          style={{
            background: "#4CAF50",
            border: "none",
            color: "white",
            padding: "5px 3px",
            display: "inline-block",
            margin: " 4px 2px",
          }}
        >
          <h3>ADD</h3>
        </button>
      </form>
    </div>
  );
}
