import process from './process';
import subProcess from './sub-process';
import startEvent from './start-event';
import endEvent from './end-event';
import throwEvent from './throw-event';
import catchEvent from './catch-event';
import boundaryEvent from './boundary-event';
import flow from './flow';
import task from './task';
import gateway from './gateway';
import data from './data';

const iconMap = (): any => ({
    ...process, ...subProcess,
    ...startEvent, ...endEvent, ...throwEvent, ...catchEvent, ...boundaryEvent,
    ...flow, ...task, ...gateway, ...data
});

export const formatIcon = (name: string = 'Process') => {
    return iconMap()[name];
};