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

//Components
import BusinessList from '../../containers/business/businessList'
import {renderSelectField} from '../../components/selectControl';
import InputField from '../../components/inputField';
import Loader from '../../components/loader'

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
};

class ManageBusiness extends Component {

    state = {
        name:'',
        status: '',
        location:'',
    };

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
        this.props.history.push(
            {pathname:'/addNewMerchant',
            state: { emailId: this.props.location.state ? this.props.location.state.emailId : ""}}
        )

    }

    onHandleReset(){
        this.setState({name:''});
        this.setState({status:''});
        this.setState({location:''});
        this.setState({disableReset:true});
        this.props.reset();
        this.child.resetHandler();
    }
    
    render() {

        return (
          <div className="row">
            <div className="col-xs-12">
            <Loader status={this.state.showLoader} />

            <div className="row">
            <div className="col-xs-12">
            <Paper className="pagePaper">
                <form size='large' className="form-horizontal">
                    <div className="row appTitleLabel">
                        MANAGE BUSINESS
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
                                    Data.searchStatus.map((item) =>{
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
                        <div className="col-xs-12 col-sm-6 col-md-2">
                            <FormControl style={styles.formControl}>
                                <Field
                                    name="location"
                                    component={renderSelectField}
                                    fullWidth={true}
                                    onChange={this.handleChange}
                                    displayEmpty
                                    >
                                    <MenuItem value="" disabled>
                                        Location
                                    </MenuItem>
                                    {
                                    Data.states.map((item) =>{
                                        return <MenuItem 
                                            style={styles.selectControl}
                                            key={item.id}
                                            value={item.prefix}>
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
                        <div className="col-xs-12 col-sm-6 col-md-3 end-md">
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
            <BusinessList 
                userId={this.props.location.state ? this.props.location.state.userId : 0} 
                name={this.state.name}
                status={this.state.status}
                location={this.state.location} 
                history={this.props.history}
                onRef={ref => (this.child = ref)} 
            />
            
        </div> 
        </div>
        );
    }
}
  
ManageBusiness = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      merchantPayload: state.merchant.merchantList === undefined ? undefined : state.merchant.merchantList,
      merchantDelete: state.merchant.deleteMerchant === undefined ? undefined : state.merchant.deleteMerchant
    }),
  )(ManageBusiness)
  
  export default reduxForm({form: 'FrmManageBusiness'})(ManageBusiness)