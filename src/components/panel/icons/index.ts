import process from './process';

const iconMap = (): any => ({...process});

export const formatIcon = (name: string = 'Process') => {
    return iconMap()[name];
};
