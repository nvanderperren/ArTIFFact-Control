import { Reducer } from 'redux';
import * as fs from 'fs';
import * as path from 'path';
import { remote } from 'electron';
import { ReportsAction, SET_REPORT, ADD_REPORTS, REMOVE_REPORTS, LOAD_REPORTS } from 'Actions/ReportActions';
import { format } from 'date-fns';
import { getPath } from './ConfigurationReducer'

/* Typescript interfaces and types */

export interface ReportsState {
    reports: Array<ReportParent>;
    report: ReportParent | null
}


/* Functions and objects */

const defaultState: ReportsState = {
    reports: [],
    report: null
};

/**
 * Save reports to disk
 * @param reports reports to save to disk
 */
const saveReportsToDisk = (reports: ReportParent) => {
    const content = JSON.stringify(reports, null, 4);
    const { app } = remote;
    const filePath = `${getPath()}reports`;
    const name = `report-${format(reports.reports[0].date, 'dd-MM-yyyy-hh-mm-ss')}`;
    fs.writeFileSync(`${filePath}/${name}.json`, content);
}

/**
 * Load the reports from disk and convert them to report parent objects
 */
const loadReportsFromDisk = () => {
    const dirPath = `${getPath()}reports/`;
    const filePaths = fs.readdirSync(dirPath);
    const reportParents: Array<ReportParent> = [];
    filePaths.forEach((file: string) => {
        if (file.endsWith('.json')) {
            let data = fs.readFileSync(path.join(dirPath, file)).toString();
            let report: ReportParent = JSON.parse(data) as ReportParent;
            for (let i = 0; i < report.reports.length; i++) {
                report.reports[i].date = new Date(Date.parse(report.reports[i].date as unknown as string));
            }
            reportParents.push(report);
        }
    });
    return reportParents;
}


/**
 * Removes reports from disk
 * @param reports Reports to remove
 */
const eraseConfigFromDisk = (reports: ReportParent) => {
    const name = `report-${format(reports.reports[0].date, 'dd-MM-yyyy-hh-mm-ss')}`;
    const filePath = `${getPath()}reports/${name}.json`;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    else {
        console.log(`File ${filePath} does not exist`);
    }
}


/**
 * The actual reports reducer:
 *  - ADD_REPORTS: add reports to the current state and save it to disk
 *  - REMOVE_REPORTS: remove reports from current state and remove it from disk
 *  - LOAD_REPORTS: load the reports from disk if they are not loaded yet
 * @param state current reports state
 * @param action action to perform on the state
 */
export const reportsReducer: Reducer<ReportsState, ReportsAction> = (
    state = defaultState,
    action: ReportsAction
) => {
    switch (action.type) {
        case SET_REPORT: {
            return {
                ...state,
                report: action.report
            }
        }
        case ADD_REPORTS: {
            const { reports } = action;
            if (!state.reports.includes(reports)) {
                saveReportsToDisk(reports);
                return {
                    ...state,
                    reports: [...state.reports, reports]
                };
            }
            return state;
        }
        case REMOVE_REPORTS: {
            let newReports = [...state.reports];
            const index = newReports.indexOf(action.reports);
            if (index !== -1) {
                newReports.splice(index, 1);
                eraseConfigFromDisk(action.reports)
            }
            return { ...state, reports: newReports }
        }
        case LOAD_REPORTS: {
            let reportsFromDisk = loadReportsFromDisk();
            return { ...state, reports: reportsFromDisk }
        }
        default:
            return state;
    }
};