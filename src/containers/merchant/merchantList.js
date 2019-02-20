//react redux
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';

//Componentsgit 
import UserList from '../../containers/user/userList';
import InputField from '../../components/inputField';
import Loader from '../../components/loader'

class MerchantsList extends Component {

    state = {
        name:'',
        page: 0,
        rowsPerPage: 5,
        disableReset: true,
    };

    //Method to handle change event for dropdown
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });

        if(this.state.name===""){
            this.setState({disableReset: true});
        }
        else{
            this.setState({disableReset:false});
        }
    };

    onHandleSearch(){
        this.child.searchHandler();
    }

    onHandleReset(){
        this.setState({name:''});
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
                    <div className="row">
                        <div className="col-xs-12 col-md-2 appTitleLabel">
                            <FormLabel component="legend">ADD DEAL</FormLabel>
                        </div>  
                        <div className="col-xs-12 col-md-10">
                            <div style={{color:"red"}}>
                                *Select a user from list to proceed add new Deal
                            </div>   
                        </div>                      
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
                        <div className="col-xs-12 col-sm-6 col-md-6">
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
                    </div>
                </form>
            </Paper> 
            </div>
            </div>       

           <UserList 
                name={this.state.name}
                status="1"
                userType="Merchant"
                resetUserType={false}
                resetStatus={false}
                history={this.props.history}
                isClick={true}
                source={"MerchantList"}
                onRef={ref => (this.child = ref)} 
            />

        </div> 
        </div>
        );
    }
}
  
  MerchantsList = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      merchantPayload: state.merchant.merchantList === undefined ? undefined : state.merchant.merchantList,
    }),
  )(MerchantsList)
  
  export default reduxForm({form: 'FrmMerchantsList'})(MerchantsList)