import * as React from 'react';
// Themes
import { useMainStyles } from 'Theme/Main';
import { TableCell, StyledTableRow2, useTableStyles } from 'Theme/Table';
// Material UI
import { Paper, makeStyles, Theme, createStyles, TableContainer, Table, TableHead, TableRow, TableBody, Button, Popper, Typography, PopperPlacementType, FormControlLabel, Radio, Grid, RadioGroup, ClickAwayListener, Tooltip } from '@material-ui/core';
import CustomDatePicker from 'Components/CustomDatePicker/CustomDatePicker';
// Icons
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import DeleteBinIcon from 'Assets/icons/icons8-delete-bin-500.svg';
import ClearOptionIcon from 'Assets/icons/icons8-clear-option-500.svg';
import LeftArrowIcon from 'Assets/icons/left-arrow.svg';
import RightArrowIcon from 'Assets/icons/right-arrow.svg';
import { useEffect } from 'react';
import { format } from 'date-fns';

/* STYLE */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        box: {
            display: 'flex',
            alignItems: 'center'
        },
        popup: {
            padding: theme.spacing(2),
            color: 'black',
            background: '#FCFCFC',
            boxShadow: '0px 0px 19px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
        },
        closeIcon: {
            color: theme.palette.grey[300],
            "&:hover": {
                color: 'black',
                cursor: 'pointer'
            }
        }
    })
);

/* INTERFACE */
interface ReportsTableProps {
    reports: Array<Report>;
    removeReport: (report: Report) => void;
    removeReportsOlderThan: (date: Date | null) => void;
    clearReports: () => void;
    setReport: (report: Report) => void;
}

/* COMPONENT */
const ReportsTable = (props: ReportsTableProps) => {
    const classes = useStyles();
    const mainClasses = useMainStyles();
    const tableClasses = useTableStyles();

    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [nbPages, setNbPages] = React.useState<number>(0);
    let nbElementsPerPage = 20;
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState<PopperPlacementType>();
    const [action, setAction] = React.useState('clearAll');
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date()
    );

    const handleClick = (newPlacement: PopperPlacementType) => (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };

    const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAction((event.target as HTMLInputElement).value);
    };

    const handleClear = () => {
        if (action == 'clearAll') {
            props.clearReports();
        } else if (action == 'olderThan') {
            props.removeReportsOlderThan(selectedDate);
        }

        setOpen(false);
    }

    const previousPage = () => {
        if (currentPage - 1 >= 1)
            setCurrentPage(currentPage - 1)
    }

    const nextPage = () => {
        if (currentPage + 1 <= nbPages)
            setCurrentPage(currentPage + 1)
    }

    const initPagination = () => {
        if (nbPages == 0 && props.reports.length > nbElementsPerPage) {
            setPagination();
            setCurrentPage(1);
        }
    }

    const setPagination = () => {
        let nbPages = Math.ceil(props.reports.length / nbElementsPerPage);
        setNbPages(nbPages);
        if (currentPage > nbPages)
            setCurrentPage(nbPages);
    }

    initPagination();

    useEffect(() => {
        setPagination();
        const handleEsc = (event: any) => {
            if (event.keyCode === 27) {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
    }, [props.reports]);

    let minIndex = (currentPage - 1) * nbElementsPerPage;
    let maxIndex = (currentPage * nbElementsPerPage) - 1;

    return <>
        <Paper className={mainClasses.paper}>
            {props.reports.length > 0 ?
                <>
                    <TableContainer style={{ height: '60vh', overflow: "auto" }} >
                        <Table aria-label="span" size="small" stickyHeader>
                            <TableHead>
                                <TableRow className={tableClasses.tableHeadRow}>
                                    <TableCell className={tableClasses.tableHeadCell}>Date</TableCell>
                                    <TableCell className={tableClasses.tableHeadCell}>Files</TableCell>
                                    <TableCell className={tableClasses.tableHeadCell}>Input</TableCell>
                                    <TableCell className={tableClasses.tableHeadCell}>Result</TableCell>
                                    <TableCell className={tableClasses.tableHeadCell}>Errors</TableCell>
                                    <TableCell className={tableClasses.tableHeadCell}>Passed</TableCell>
                                    <TableCell className={tableClasses.tableHeadCell}>Score</TableCell>
                                    <TableCell className={tableClasses.tableHeadCell}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.reports.map((report, index) => {
                                    if (props.reports.length <= nbElementsPerPage || (index >= minIndex && index <= maxIndex)) {
                                        return (
                                            <StyledTableRow2 key={index} onClick={() => props.setReport(report)}>
                                                <TableCell component="th" scope="row">
                                                    {format(report.date, 'dd/MM/yyyy')}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    1
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Tooltip title={report.filePath} aria-label={report.filePath} placement="bottom">
                                                        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.filePath}</div>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {report.result ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {report.errors}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {report.passed}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {report.score}%
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Button onClick={(event) => { event.stopPropagation(); props.removeReport(report) }}><img src={DeleteBinIcon} style={{ width: '24px' }} /></Button>
                                                </TableCell>
                                            </StyledTableRow2>
                                        );
                                    }
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container style={{ marginTop: '20px' }}>
                        <Grid item xs={4}>
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {nbPages > 1 ?
                                <>
                                    <img src={LeftArrowIcon} className={currentPage > 1 ? tableClasses.paginationArrow : tableClasses.paginationArrowDisabled} onClick={() => previousPage()} />
                                    <Typography className={tableClasses.pagination}>Page {currentPage} / {nbPages}</Typography>
                                    <img src={RightArrowIcon} className={currentPage < nbPages ? tableClasses.paginationArrow : tableClasses.paginationArrowDisabled} onClick={() => nextPage()} />
                                </>
                                : null
                            }
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                            <Button style={{ fontSize: '16px', textTransform: 'none', marginLeft: 'auto' }} onClick={handleClick("left-end")}><img src={ClearOptionIcon} style={{ width: '20px', marginRight: '8px' }} /> Clear options</Button>
                        </Grid>
                    </Grid>
                    <Popper open={open} anchorEl={anchorEl} placement={placement} style={{ marginRight: '5px' }}>
                        <ClickAwayListener onClickAway={() => setOpen(false)}>
                            <Paper className={classes.popup}>
                                <Grid container>
                                    <Grid item xs={12} style={{ textAlign: 'right' }}>
                                        <CloseIcon className={classes.closeIcon} style={{ width: '22px' }} onClick={() => setOpen(false)} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RadioGroup aria-label="action" name="action" value={action} onChange={handleActionChange}>
                                            <FormControlLabel value="clearAll" control={
                                                <Radio color="primary" />
                                            } label={
                                                <Typography style={{ fontSize: '16px' }}>Clear all</Typography>
                                            } />
                                            <FormControlLabel value="olderThan" control={
                                                <Radio color="primary" />
                                            } label={
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography style={{ fontSize: '16px', marginRight: '10px' }}>Older than</Typography>
                                                    <div style={{ width: '160px' }}><CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} /></div>
                                                </div>
                                            } />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <Button variant="contained" color="primary" style={{ textTransform: 'none', borderRadius: '5px' }} onClick={handleClear}>Clear</Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </ClickAwayListener>
                    </Popper>
                </>
                : <Typography>No data found.</Typography>
            }
        </Paper>
    </>
}

export default (ReportsTable);