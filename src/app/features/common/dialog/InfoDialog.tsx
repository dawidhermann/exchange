import * as React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import * as Labels from '../../../labels';
import './InfoDialog.css';

interface IInfoDialogProps {
    message: string;
    isOpen: boolean;
    dialogType: DialogType;
}
export type InfoDialogProps = IInfoDialogProps;

export enum DialogType {
    INFO = "INFO",
    ERROR = "ERROR"
}

export default function InfoDialog(props: InfoDialogProps) {
    return (
        <Dialog aria-labelledby="simple-dialog-title" open={props.isOpen}>
            <DialogTitle id="simple-dialog-title">{getTitle(props.dialogType)}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

function getTitle(dialogType: DialogType) {
    if (dialogType === DialogType.ERROR) {
        return Labels.LABEL_ERROR;
    }
    return Labels.LABEL_INFO;
}