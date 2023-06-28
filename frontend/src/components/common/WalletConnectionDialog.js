import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import {DialogTitle} from "@mui/material";

function WalletConnectionDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Connect a wallet</DialogTitle>
        </Dialog>
    );
}

WalletConnectionDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
}

export default WalletConnectionDialog;