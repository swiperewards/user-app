//react redux
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

//Components
import UserList from '../../containers/user/userList'
import {renderSelectField} from '../../components/selectControl';
import InputField from '../../components/inputField';
import Loader from '../../components/loader';
import Register from '../../containers/account/register';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

//Data
import Data from '../../staticData';

const styles = {
    formControl: {
        minWidth: '100%',
        marginLeft:'0px',
      },
      selectControl:{
        fontSize: '12px',
      },
      appBar: {
        position: 'relative',
      },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
  }

class ManageMerchants extends Component {

    state = {
        name:'',
        status: '',
        openSignupPopUp: false,
    };

    componentWillMount(){
        this.setState({ openSignupPopUp: false });
    }
        
    //Method to handle change event for dropdown
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });

        if(event.target.value !== undefined || event.target.value !== ""){
            this.setState({disableReset:false});
        }
        else{
            this.setState({disableReset:true});
        }
    };

    onHandleSearch(){
        this.child.searchHandler();
    }

    addNewMerchant(){
        this.setState({ openSignupPopUp: true });
    }

    handleClose = () => {
        this.setState({ openSignupPopUp: false });
        this.onHandleReset();
    };

    onHandleReset(){
        this.setState({name:''});
        this.setState({status:''});
        this.setState({disableReset:true});
        this.props.reset();
        this.child.resetHandler();
    }

    render() {

        return (
          <div className="row">
            <div className="col-xs-12">
            <Loader status={this.state.showLoader} />

            <div>
                <Dialog
                    fullScreen
                    open={this.state.openSignupPopUp}
                    onClose={this.handleClose.bind(this)}
                    fullWidth={true}
                    maxWidth = {'sm'}
                    scroll = 'paper'
                    TransitionComponent={Transition}
                >
                    <AppBar style={styles.appBar} backgroundcolor="#5CBBFF">
                        <Toolbar>
                        <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        </Toolbar>
                    </AppBar>
                    <div>
                        <DialogContent>
                            <Register 
                                history={this.props.history} 
                                dismissPopUp={this.handleClose}
                            /> 
                        </DialogContent>
                    </div>
                </Dialog>
            </div>

            <div className="row">
            <div className="col-xs-12">
            <Paper className="pagePaper">
                <form size='large' className="form-horizontal">
                    <div className="row appTitleLabel">
                        MANAGE MERCHANT
                    </div>
                    <div className="row middle-md">
                        <div className="col-xs-12 col-sm-6 col-md-2">
                            <Field 
                            type="text"
                            name="name" 
                            myPlaceHolder="Name" 
                            fullWidth={true} 
                            component={InputField} 
                            onChange={this.handleChange}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-2">
                            <FormControl style={styles.formControl}>
                                <Field
                                    name="status"
                                    component={renderSelectField}
                                    fullWidth={true}
                                    onChange={this.handleChange}
                                    displayEmpty
                                    >
                                    <MenuItem value="" disabled>
                                        Status
                                    </MenuItem>
                                    {
                                    Data.userStatus.map((item) =>{
                                        return <MenuItem 
                                            style={styles.selectControl}
                                            key={item.id}
                                            value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    })
                                    }
                                </Field>    
                            </FormControl>  
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <button 
                                type="button"
                                onClick={this.onHandleReset.bind(this)}
                                style={{backgroundColor:'#BCBCBC'}}
                                disabled={this.state.disableReset}
                                className={this.state.disableReset ? "disabledButton button" : "enabledButton button"}
                                > Reset
                            </button>
                            <button 
                                type="button"
                                onClick={this.onHandleSearch.bind(this)}
                                className="button"
                                > Search
                            </button> 
                        </div>       
                        <div className="col-xs-12 col-sm-6 col-md-5 end-md">
                            <Button 
                                variant="fab"
                                type="button"
                                color="primary"
                                onClick={this.addNewMerchant.bind(this)}
                                style={{backgroundColor:'#27A24F'}}
                                > 
                                <AddIcon />
                            </Button> 
                        </div>
                    </div>
                </form>
            </Paper> 
            </div>
            </div>

            <UserList 
                name={this.state.name}
                status={this.state.status}
                userType="Merchant"
                resetUserType={false}
                resetStatus={true}
                history={this.props.history}
                isClick={true}
                source={"ManageMerchant"}
                onRef={ref => (this.child = ref)} 
            />
            
        </div> 
        </div>
        );
    }
}
  
  ManageMerchants = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      merchantPayload: state.merchant.merchantList === undefined ? undefined : state.merchant.merchantList,
      merchantDelete: state.merchant.deleteMerchant === undefined ? undefined : state.merchant.deleteMerchant
    }),
  )(ManageMerchants)
  
  export default reduxForm({form: 'FrmManageMerchant'})(ManageMerchants)