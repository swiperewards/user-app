//react redux
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

//Components
import InputField from '../../components/inputField';
import {renderSelectField} from '../../components/selectControl';
import TicketList from '../../containers/customerQueries/ticketList';
import Loader from '../../components/loader'

//Actions
import 
{ 
    getQueryType, 
} from '../../actions/ticketAction';

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

class CustomerQueries extends Component {

    state = {
        username:'',
        status: '',
        userType:'',
        ticketType:'',
        queryTypeList:'',
    };

    componentWillMount()
    {
        if(this.props.userData.user.responseData.token){
            this.props.getQueryType(this.props.userData.user.responseData.token);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {

            if (nextProps.queryTypeResponse){
                if(nextProps.queryTypeResponse.status === 200){
                    this.setState({queryTypeList: nextProps.queryTypeResponse.responseData})
                }
            }
        }
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

    onHandleReset(){
        this.setState({username:''});
        this.setState({status:''});
        this.setState({userType:''});
        this.setState({ticketType:''});
        this.setState({disableReset:true});
        this.props.reset();
        this.child.resetHandler();
    }

    render() {

        return (
  
        <div className="row">
                <Loader status={this.state.showLoader} />
            <div className="col-xs-12">
                <div className="row">
                    <div className="col-xs-12">
                        <Paper className="pagePaper">
                            <div className="row appTitleLabel">
                                TICKETS
                            </div>
                            <div className="row middle-md">
                                <div className="col-xs-12 col-sm-6 col-md-2">
                                    <Field 
                                    type="text"
                                    name="username" 
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
                                            Data.queryStatus.map((item) =>{
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
                                            name="userType"
                                            component={renderSelectField}
                                            fullWidth={true}
                                            onChange={this.handleChange}
                                            displayEmpty
                                            >
                                            <MenuItem value="" disabled>
                                                User Type
                                            </MenuItem>
                                            {
                                            Data.userType.map((item) =>{
                                                return <MenuItem 
                                                    style={styles.selectControl}
                                                    key={item.id}
                                                    value={item.name}>
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
                                            name="ticketType"
                                            component={renderSelectField}
                                            fullWidth={true}
                                            onChange={this.handleChange}
                                            displayEmpty
                                            >
                                            <MenuItem value="" disabled>
                                                Ticket Type
                                            </MenuItem>
                                            {
                                            (this.state.queryTypeList) ? 
                                                this.state.queryTypeList.map((item) =>{
                                                    return <MenuItem 
                                                        style={styles.selectControl}
                                                        key={item.id}
                                                        value={item.ticketTypeName}>
                                                        {item.ticketTypeName}
                                                    </MenuItem>
                                                }) : null
                                            }
                                        </Field>    
                                    </FormControl>  
                                </div>    
                                <div className="col-xs-12 col-sm-6 col-md-4 end-md">
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
                        </Paper> 
                    </div>
                </div>
            
                <TicketList 
                    username={this.state.username} 
                    status={this.state.status} 
                    userType={this.state.userType} 
                    ticketType={this.state.ticketType} 
                    onRef={ref => (this.child = ref)}                
                />
            </div>
        </div>    
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ 
        getQueryType,    
    }, dispatch)
  }
  
  CustomerQueries = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      queryTypeResponse: state.ticket === undefined ? undefined : state.ticket.queryType,
    }),
    mapDispatchToProps,
  )(CustomerQueries)
  
  export default reduxForm({form: 'FrmCustomerQueries'})(CustomerQueries)