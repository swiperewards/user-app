//react redux
import React, { Component } from 'react';
import { Field } from 'redux-form'
import { connect } from 'react-redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormLabel from '@material-ui/core/FormLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

//Validation
import { required, requiredCheckbox } from '../../utilities/validation'

//Components
import InputField from '../../components/inputField';
import { renderSelectField } from '../../components/selectControl';
import Loader from '../../components/loader';
import RenderSwitch from '../../components/switchControl';
import RenderCheckbox from '../../components/renderCheckbox';

//Data
import Data from '../../staticData'
var http = require('http');

const styles = {
    formControl: {
        minWidth: '100%',
        marginLeft: '0px',
    },
    selectControl: {
        fontSize: '12px',
    },
    row: {
        fontSize: '12px',
        '&:nth-of-type(odd)': {
            backgroundColor: '#f2f4f6',
        },
    },
};

class AccountSetup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            boardingStatus: 'Board Immediately',
            merchanttype: '',
            termsCheckedNo: true,
            termsCheckedYes: false,
            openMCCPopUp: false,
            openTermsPopUp: false,
            updatedList: Data.mccCodes,
            mccNumber: '',
            publicIp: undefined,
        };
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleMCCPopUp = (event) => {
        this.setState({ showLoader: true })
        event.target.blur()
        this.setState({ openMCCPopUp: true });
        this.setState({ updatedList: Data.mccCodes });
    };

    handleTermsPopUp = name => event => {
        this.setState({ [name]: event.target.checked });
        if(event.target.checked === true){
            this.setState({ openTermsPopUp: true });
        }
    };

    handleClose = () => {
        this.setState({ showLoader: false })
        this.setState({ openMCCPopUp: false });
        this.setState({openTermsPopUp: false});
    };

    selectMCCCode = (code, myProps) => {
        myProps.change('mccNumber', code);

        this.setState({ mccNumber: code })
        this.handleClose();
    }

    onHandleSearch = (searchValue) => {
        var filteredList

        if (searchValue.target.value === '') {
            filteredList = Data.mccCodes
        }
        else {
            const regex = new RegExp(searchValue.target.value, 'i');
            filteredList = Data.mccCodes.filter((datum) => {
                return (datum.edited_description.search(regex) > -1);
            });
        }

        this.setState({ updatedList: filteredList });
    }

    componentDidMount() {
        
        if (this.refs.termsCheckedYes) {
            this.setState({ termsCheckedYes: this.refs.termsCheckedYes.value })
        }
    }

    render() {

        const { myProps } = this.props;
        
        if(this.refs.boardingStatus === undefined){
            myProps.change('boardingStatus', 'Board Immediately')
        }

        if(this.refs.ipAddress === undefined && this.state.publicIp === undefined){

            http.get({'host': 'api.ipify.org'}, function(resp) {
                resp.on('data', function(ip) {
                  this.setState({publicIp:ip})
                  myProps.change('ipAddress',String.fromCharCode.apply(null, ip))
                }.bind(this));
            }.bind(this));
        }

        return (
            <div style={{ paddingBtotom: '20px' }}>
                <Loader status={this.state.showLoader} />
                <Paper className="pagePaper">
                    <div className="formContent">
                        <div className="appTitleLabel">
                            <FormLabel component="legend">ACCOUNT SETUP</FormLabel>
                        </div>
                        <Divider />
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3" >
                                Boarding Status*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field
                                        myType="text"
                                        name="boardingStatus"
                                        id="boardingStatus"
                                        ref="boardingStatus"
                                        fullWidth={true}
                                        disabled={true}
                                        component={InputField}
                                        validate={required}
                                />
                                {/* <FormControl style={styles.formControl}>
                                    <Field
                                        name="boardingStatus"
                                        component={renderSelectField}
                                        fullWidth={true}
                                        label={this.state.boardingStatus}
                                        ref="boardingStatus"
                                        defaultValue={1}
                                    >
                                        <MenuItem
                                            style={styles.selectControl}
                                            key="1"
                                            value="1"
                                            selected={0}
                                            >
                                            {"Board Immediately"}
                                        </MenuItem>
                                        
                                    </Field>
                                </FormControl> */}
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Add MCC* 
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field
                                    myType="number"
                                    name="mccNumber"
                                    id="mccNumber"
                                    ref="mccNumber"
                                    fullWidth={true}
                                    onFocus={this.handleMCCPopUp}
                                    component={InputField}
                                    validate={required}
                                />
                                <Dialog
                                    open={this.state.openMCCPopUp}
                                    onClose={this.handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">{"MCC CODES"}</DialogTitle>
                                    <DialogContent>
                                        <Field
                                            myType="text"
                                            myPlaceHolder="Search Text"
                                            name="searchBox"
                                            fullWidth={true}
                                            component={InputField}
                                            onChange={this.onHandleSearch}
                                        />
                                        <List>
                                            {
                                                this.state.updatedList.map((item, index) => {
                                                    return (
                                                        <ListItem key={index} button disableGutters divider onClick={() => this.selectMCCCode(item.mcc, myProps)}>
                                                            <ListItemText disableTypography primary={item.mcc + " - " + item.combined_description} />
                                                        </ListItem>
                                                    )

                                                })
                                            }
                                        </List>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className="row end-md">
                            <div className="col-xs-12 col-sm-6 col-md-3 start-md">
                                Merchant Type
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3 start-md">
                                <FormControl style={styles.formControl}>
                                    <Field
                                        name="merchantType"
                                        component={renderSelectField}
                                        fullWidth={true}
                                        onChange={this.handleChange}
                                    >
                                        {
                                            Data.merchantType.map((item, index) => {
                                                return <MenuItem
                                                    style={styles.selectControl}
                                                    key={index}
                                                    value={item.prefix}>
                                                    {item.name}
                                                </MenuItem>
                                            })
                                        }
                                    </Field>
                                </FormControl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Accept Terms and Conditions
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field
                                    name="termsCheckedYes"
                                    ref="termsCheckedYes"
                                    id="termsCheckedYes"
                                    component={RenderSwitch}
                                    onChange={this.handleCheckboxChange('termsCheckedYes')}
                                />
                            </div>
                        </div>
                        {this.state.termsCheckedYes === true ? (
                            <React.Fragment>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        IP Address
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <Field 
                                            myType="text" 
                                            name="ipAddress" 
                                            ref="ipAddress"
                                            fullWidth={true} 
                                            component={InputField} 
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6">
                                        <FormControlLabel
                                                    control={
                                                        <Field 
                                                            name="terms" 
                                                            id="terms" 
                                                            myStyle={styles} 
                                                            component={RenderCheckbox} 
                                                            onChange={this.handleTermsPopUp('terms')}
                                                            validate={requiredCheckbox}
                                                        />
                                                    }
                                                    label="Terms and Conditions"
                                        />   

                                        <Dialog
                                            open={this.state.openTermsPopUp}
                                            onClose={this.handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                        <DialogTitle id="alert-dialog-title">{"Terms and conditions"}</DialogTitle>
                                        <DialogContent>                                                    
                                                    <DialogContentText><b>Terms of Use</b></DialogContentText>
                                                    <DialogContentText>This service agreement (“Agreement”) that you are entering into with Swipe, Inc. (“Company”) is a legal document that details your rights and obligations. By visiting this website or using our goods and services you agree to be bound by the terms and conditions of this Agreement. If you do not agree please do not use or access our goods and services. The Company website and related services are offered to you conditioned upon your acceptance without modification of this Agreement. From time to time, it may be necessary for Company to update or revise certain provisions of this Agreement. By using this Web Site or joining Company and accepting the Agreement, you agree that Company may change the terms of this Agreement in its sole discretion without specific notice to you. If you don't agree to the changes proposed by Company, or to any terms in this Agreement, your only remedy is to cancel your use of the services offered under this agreement.</DialogContentText><br/>
                                                    <DialogContentText><b>1. Description of Service</b></DialogContentText>
                                                    <DialogContentText>Company operates a Web site and associated web pages, which, for purposes of this Agreement, will be referred to as the “Company Web Site(s)”. Company offers you access to the Company Web Sites, which provides you access to a collection of resources, including, but not limited to, a loyalty program, software programs, application-programming interface (API), mobile applications and downloadable services (the “Service”). Company offers you access to the Company Web Site and your agreement to accept and comply with the terms, conditions, policies and notices stated here and as may be modified by Company from time-to-time in its sole discretion without notice to you. Notwithstanding the foregoing, Company reserves the right to reject any registration for any reason. Unless explicitly stated otherwise, any new features or products that change, augment or enhance the current Service shall be subject to this Agreement.</DialogContentText><br/>
                                                    <DialogContentText>You will be charged a flat fee per month for the Service. We divert some of the money from your payment processing to fund the loyalty program in the form of “Rewards Pools”. We will take a variable amount, consisting of a fixed percentage fee plus a flat rate, as disclosed to you from each transaction and may vary that amount from time to time. The Reward Pool will be held and disbursed every two weeks to your most loyal customers in the form of cashback.</DialogContentText><br/>
                                                    <DialogContentText><i>Starting/Initial Processing Fee</i></DialogContentText>
                                                    <DialogContentText>Merchant agrees to pay a card processing fee for debit & credit payments handled by the Nouvo platform. The starting rate for processing cost is 2.65% of transaction volume before tax plus 10c (cents), and is subject to modification as outlined in Section 1 (description of service) and Section 3 (charges and billing).</DialogContentText><br/>
                                                    <DialogContentText><i>Starting/Initial Pool Fee</i></DialogContentText>
                                                    <DialogContentText>The starting rate for money diverted to Rewards Pool from each transaction is 0.25% of transaction volume before tax plus 10c (cents), and is subject to modification as outlined in Section 1 (description of service) and Section 3 (charges and billing). This amount is levied from the Processing Fee on card payments that merchant promises to pay for each transaction handled by Nouvo.</DialogContentText><br/>
                                                    <DialogContentText><b>2. General Use of the Company Web Site</b></DialogContentText>
                                                    <DialogContentText>You promise that you will not use the Company Web Site or the Service in whole or in part, for any purpose that is unlawful or prohibited by this Agreement. You agree that you will not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, frame in another web page, use on any other Web site, transfer, or sell any information, software, lists of users, databases or other lists, products or services provided through or obtained from the Company Web Site. This means, among other activities, that you agree not to engage in the practices of screen scraping, database scraping, or any other activity with the purpose of obtaining lists of users or other information. You agree that you will not use the Service in any manner that could damage, disable, overburden, or impair the Company Web Site or interfere with any other party's use and enjoyment of the Company Web Site. You may not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided for through the Company Web Site. Except with the written permission of Company, you agree that you will not access or attempt to access password protected, secure or non-public areas of the Company Web Site. Unauthorized individuals attempting to access prohibited areas of the Company Web Site may be subject to prosecution.</DialogContentText><br/>
                                                    <DialogContentText><b>3. Charges and Billing</b></DialogContentText>
                                                    <DialogContentText>You hereby authorize Company to charge your credit card or bank account in advance for all fees incurred by you in connection with your Company account and the service you have chosen. In most cases, we will be charging your designated credit card or checking account every month, but some charges may accumulate on your account before they are charged to your card. It is your responsibility to notify Company if your credit card has expired and to make changes or your service may be disconnected or interrupted. All fees shall be paid in U.S. dollars. Company reserves the right to change our fees or billing methods at any time, provided, however, that such modifications shall not take effect earlier than thirty (30) days after Company posts such modification on the Company Web Site. Company also has the right to collect applicable taxes and impose premium surcharges for some areas of the service and these surcharges may apply immediately after you register for the Service. We expect you to pay your account balance on time. Amounts not paid by you to Company when due will be assessed an additional 1.5% (or the highest amount allowed by law, whichever is lower) per month if your payment is more than thirty (30) days past due. That amount is also due immediately. You are responsible and liable for any fees, including attorney and collection fees, that Company may incur in its efforts to collect any remaining balances from you. You also agree that you will be billed for and will pay any outstanding balances if you cancel any Service. You should let Company know about any billing problems or discrepancies within thirty (30) days after they first appear on your account statement. If you do not bring them to Company’s attention within thirty (30) days, you agree that you waive your right to dispute such problems or discrepancies.</DialogContentText><br/>
                                                    <DialogContentText><b>4. Registration</b></DialogContentText>
                                                    <DialogContentText>In order for you to participate in the Service, Company will require that you provide specific information about yourself and/or your business. If you choose to participate, you agree to provide true, accurate and complete information and to refrain from impersonating or falsely representing your affiliation with any person or entity (such information being “Member Data”). Member Data and certain other information about you and/or your business are subject to our Privacy Policy. You agree and acknowledge that Member Data from the registration process is used to send you information about Company and the Service, including, but not limited to, the use of your email address for newsletters and other necessary company communication. For more information, Company urges you to review the Company Privacy Policy that is part of this Agreement.</DialogContentText><br/>
                                                    <DialogContentText><b>5. Third Party Content</b></DialogContentText>
                                                    <DialogContentText>The Company Web Site contains content and information from third party providers and/or links to their Web sites (“Third Party Content”). Such content is not under the control of Company and Company is not responsible for such content, including, without limitation, any link contained in such content, or any changes or updates to such content. Company is providing such Third Party Content to you only as a convenience, and the inclusion of such content does not imply endorsement by Company of such content or the affiliate. You may be subject to additional and/or different terms, conditions, and privacy policies when you use third party services, content, software, or sites. Company does reserve the right to remove content that, in Company’s judgment, does not meet its standards, but Company is not responsible for any failure or delay in removing such material. Company is not and will not be responsible for (i) the terms and conditions of any transaction between you and any third party, (ii) any insufficiency of or problems with any such third party's background, insurance, credit or licensing, or (iii) the quality of services performed by any such third party or any other legal liability arising out of or related to the performance of such services. In the event that you have a dispute with any such third party, you release Company (and its affiliates, suppliers, agents and employees) from any and all claims, demands and damages (actual and consequential) of every kind and nature, known and unknown, suspected and unsuspected, disclosed and undisclosed, arising out of or in any way connected with such disputes.</DialogContentText><br/>
                                                    <DialogContentText><b>6. DISCLAIMER OF WARRANTIES YOU EXPRESSLY UNDERSTAND AND AGREE THAT:</b>NEITHER PARTY SHALL BE LIABLE TO THE OTHER PARTY OR TO ANY OTHER THIRD PARTY FOR ANY CONSEQUENTIAL, INDIRECT, SPECIAL, INCIDENTAL, RELIANCE, OR EXEMPLARY DAMAGES ARISING OUT OF OR RELATING TO THIS AGREEMENT OR THE SERVICE, WHETHER FORESEEABLE OR UNFORESEEABLE, AND WHETHER BASED ON BREACH OF ANY EXPRESS OR IMPLIED WARRANTY, BREACH OF CONTRACT, MISREPRESENTATION, NEGLIGENCE, STRICT LIABILITY IN TORT, OR OTHER CAUSE OF ACTION (INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF DATA, GOODWILL, PROFITS, INVESTMENTS, USE OF MONEY, OR USE OF FACILITIES; INTERRUPTION IN USE OR AVAILABILITY OF DATA; STOPPAGE OF OTHER WORK OR IMPAIRMENT OF OTHER ASSETS; OR LABOR CLAIMS), EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. UNDER NO CIRCUMSTANCES SHALL COMPANY’S TOTAL LIABILITY TO YOU OR ANY THIRD PARTY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED A MAXIMUM OF ONE THOUSAND DOLLARS ($1,000.00) REGARDLESS OF WHETHER ANY ACTION OR CLAIM IS BASED ON WARRANTY, CONTRACT, TORT OR OTHERWISE.</DialogContentText><br/>
                                                    <DialogContentText><b>7. Company Software Licenses</b></DialogContentText>
                                                    <DialogContentText>Company provides you with a non-exclusive, non-transferable, limited license to use Company’s software, which you agree to use in accordance with this Agreement. You may not sub-license, or charge others to use or access, our software without first obtaining written permission from us. All software is owned by Company and/or its suppliers and is protected to the maximum extent permitted by copyright laws and international treaty provisions. Any reproduction, modification or redistribution of the software is expressly prohibited, and may result in severe civil and criminal penalties. Company’s software, its structure, sequence and organization and source code are considered trade secrets of Company and its suppliers and are protected by trade secret laws. WITHOUT LIMITED THE FOREGOING, COPYING OR REPRODUCING THE SOFTWARE TO ANY OTHER SERVER OR LOCATION FOR FURTHER REPORDUCTION OR REDISTRIBUTION IS EXPRESSLY PROHIBITED. YOU MAY NOT DECOMPILE OR DISASSEMBLE, REVERSE ENGINEER OR OTHERWISE ATTEMPT TO DISCOVER ANY SOURCE CODE CONTAINED IN ANY SOFTWARE PROVIDED HEREUNDER.</DialogContentText><br/>
                                                    <DialogContentText><b>8. Indemnification</b></DialogContentText>
                                                    <DialogContentText>You agree to indemnify, defend, and hold harmless Company, its employees, members, directors, managers, officers or agents from and against any loss, liability, damage, penalty or expense (including attorneys' fees, expert witness fees and cost of defense) they may suffer or incur as a result of (i) any failure by you or any employee, agent or you of you to comply with the terms of this Agreement; (ii) any warranty or representation made by you being false or misleading; (iii) any representation or warranty made by you or any employee or agent of You to any third person other than as specifically authorized by this Agreement, (iv) negligence of you or your subcontractors, agents or employees, or (v) any alleged or actual violations by you or your subcontractors, employees or agents of any card association rules, governmental laws, regulations or rules.</DialogContentText><br/>
                                                    <DialogContentText><b>9. Copyright and Trademark Notices</b></DialogContentText>
                                                    <DialogContentText>All materials on the Company Web Site (as well as the organization and layout of the Company Web Site) are owned and copyrighted or licensed by Company, its affiliates or its suppliers. All rights reserved. No reproduction, distribution, or transmission of the copyrighted materials at the Company Web Site is permitted without the written permission of Company. Any rights not expressly granted herein are reserved. Without Company’s prior permission, you agree not to display or use in any manner, any of Company trademarks, whether registered or not.</DialogContentText><br/>
                                                    <DialogContentText><b>10. Intellectual Property</b></DialogContentText>
                                                    <DialogContentText>"Intellectual Property" means all of the following owned by a party: (i) trademarks and service marks (registered and unregistered) and trade names, and goodwill associated therewith; (ii) patents, patentable inventions, computer programs, and software; (iii) databases; (iv) trade secrets and the right to limit the use or disclosure thereof; (v) copyrights in all works, including software programs; and (vi) domain names. The rights owned by a party in its Intellectual Property shall be defined, collectively, as "Intellectual Property Rights." Other than the express licenses granted by this Agreement, Company grants no right or license to you by implication, estoppel or otherwise to any Intellectual Property Rights of Company. Each party shall retain all ownership rights, title, and interest in and to its own products and services and all intellectual property rights therein, subject only to the rights and licenses specifically granted herein. Company (and not you) shall have the sole right, but not the obligation, to pursue copyright and patent protection, in its sole discretion, for any Intellectual Property Rights incorporated therein. You will cooperate with Company in pursuing such protection, including without limitation executing and delivering to Company such instruments as may be required to register or perfect Company’s interests in any Intellectual Property Rights and any assignments thereof. You shall not remove or destroy any proprietary, confidentiality, trademark, service mark, or copyright markings or notices placed upon or contained in any materials or documentation received from Company in connection with this Agreement.</DialogContentText><br/>
                                                    <DialogContentText><b>11. Modification</b></DialogContentText>
                                                    <DialogContentText>Company reserves the right at anytime and from time to time to modify, discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that Company shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</DialogContentText><br/>
                                                    <DialogContentText><b>12. Termination and Cancellation</b></DialogContentText>
                                                    <DialogContentText>Either you or Company may terminate or cancel the Service at any time. You understand and agree that the cancellation of your account is your sole right and remedy with respect to any dispute with Company. This includes, but is not limited to, any dispute related to, or arising out of: (1) any term of this Agreement or Company’s enforcement or application of any such term; (2) any policy or practice of Company, including Company’s Privacy Policy, or Company’s enforcement or application of these policies; (3) the content available through Company or any change in content provided through Company; or (4) the amount or type of fees, surcharges, applicable taxes, billing methods, or any change to the fees, applicable taxes, surcharges or billing methods. All other provisions of this Agreement which may reasonably be construed as surviving such termination will survive the termination of this agreement, including, but not limited to paragraphs 2, 3, 5, 6, 7, 8, 9, 10 11, 12, 13 and 14.</DialogContentText><br/>
                                                    <DialogContentText>13. Governing Law; Waiver of Jury Trial; Arbitration. This Agreement will be governed by and construed in accordance with the laws of the State of California without reference to conflict of law provisions. Any action, proceeding, arbitration or mediation relating to or arising from this Agreement must be brought, held, or otherwise occur in the federal judicial district that includes California. PLEASE READ THIS PROVISION CAREFULLY. IT PROVIDES THAT ANY DISPUTE MAY BE RESOLVED BY BINDING ARBITRATION. ARBITRATION REPLACES THE RIGHT TO GO TO COURT, INCLUDING THE RIGHT TO A JURY AND THE RIGHT TO PARTICIPATE IN A CLASS ACTION OR SIMILAR PROCEEDING. Any claim, dispute or controversy ("Claim") by either you or us against the other, or against the employees, agents, parents, subsidiaries, affiliates, beneficiaries, agents or assigns of the other, arising from or relating in any way to this Agreement or to our relationship, including Claims regarding the applicability of this arbitration clause or the validity of the entire Agreement, shall be resolved exclusively and finally by binding arbitration administered by the American Arbitration Association, under its Commercial Arbitration Rules in effect at the time the Claim is filed, except as otherwise provided below. All Claims are subject to arbitration, no matter what theory they are based on or what remedy they seek. This includes Claims based on contract, tort (including intentional tort), fraud, agency, your or our negligence, statutory or regulatory provisions, or any other sources of law. Claims and remedies sought as part of a class action, private attorney general or other representative action are subject to arbitration on an individual (non-class, non-representative) basis, and the arbitrator may award relief only on an individual (non-class, non-representative) basis. The arbitration will be conducted before a single arbitrator and will be limited solely to the Claim between you and us. The arbitration, or any portion of it, will not be consolidated with any other arbitration and will not be conducted on a class-wide or class action basis. If either party prevails in the arbitration of any Claim against the other, the non-prevailing party will reimburse the prevailing party for any fees it paid to the American Arbitration Association in connection with the arbitration, as well as for any reasonable attorneys' fees incurred by the prevailing party in connection with such arbitration. Any decision rendered in such arbitration proceedings will be final and binding on the parties, and judgment may be entered in a court of competent jurisdiction. Any arbitration hearing at which you appear will take place at a location within the federal judicial district that includes California. This arbitration agreement applies to all Claims now in existence or that may arise in the future. Nothing in this Agreement shall be construed to prevent any party's use of (or advancement of any Claims, defenses or offsets in) bankruptcy or repossession, replevin, judicial foreclosure or any other prejudgment or provisional remedy relating to any collateral, security or other property interests for contractual debts now or hereafter owed by either party to the other. IN THE ABSENCE OF THIS ARBITRATION AGREEMENT, YOU AND COMPANY MAY OTHERWISE HAVE HAD A RIGHT OR OPPORTUNITY TO LITIGATE CLAIMS THROUGH A COURT BEFORE A JUDGE OR A JURY, AND/OR TO PARTICIPATE OR BE REPRESENTED IN LITIGATION FILED IN COURT BY OTHERS (INCLUDING CLASS ACTIONS), BUT EXCEPT AS OTHERWISE PROVIDED ABOVE, THOSE RIGHTS, INCLUDING ANY RIGHT TO A JURY TRIAL, ARE WAIVED AND ALL CLAIMS MUST NOW BE RESOLVED THROUGH ARBITRATION.</DialogContentText><br/>
                                                    <DialogContentText><b>14. General Terms</b></DialogContentText>
                                                    <DialogContentText>If any provision of this Agreement is held by a court of competent jurisdiction to be invalid, void or unenforceable for any reason, the remaining provisions not so declared shall nevertheless continue in full force and effect, but shall be construed in a manner so as to effectuate the intent of this Agreement as a whole, notwithstanding such stricken provision or provisions. No provision of this Agreement shall be construed against any party merely because that party or counsel drafted or revised the provision in question. All parties have been advised and have had an opportunity to consult with legal counsel of their choosing regarding the force and effect of the terms set forth herein. This Agreement shall be deemed to be jointly prepared by the parties and therefore any ambiguity or uncertainty shall be interpreted accordingly. No term or provision of this Agreement shall be deemed waived and no breach excused, unless such waiver or consent shall be in writing and signed by the party claimed to have waived or consented. Any consent by any party to, or waiver of, a breach by the other party, whether express or implied, shall not constitute a consent to, waiver of, or excuse for any different or subsequent breach. You may not assign this Agreement without the written consent of Company. Company may assign this Agreement in its sole discretion without the written consent of you. The section headings contained in this Agreement are for convenient reference only, and shall not in any way affect the meaning or interpretation of this Agreement. This Agreement, including all schedules, exhibits and attachments thereto, sets forth the entire agreement and understanding of the parties hereto in respect of the subject matter contained herein, and supersedes all prior agreements, promises, covenants, arrangements, communications, representations or warranties, whether oral or written, by any officer, partner, employee or representative of any party hereto. This Agreement shall be binding upon and shall inure only to the benefit of the parties hereto and their respective successors and assigns. Nothing in this Agreement, express or implied, is intended to confer or shall be deemed to confer upon any persons or entities not parties to this Agreement, any rights or remedies under or by reason of this Agreement. This Agreement shall be governed by and construed in accordance with the laws of the State of California (irrespective of its choice of law principles).</DialogContentText><br/>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={this.handleClose} color="primary">
                                                Close
                                            </Button>
                                        </DialogActions>
                                    </Dialog>        
                                    </div>
                                </div>
                            </React.Fragment>

                        ) : (null
                            )}
                    </div>
                </Paper>
            </div>
        );
    }
}

export default connect(null, null)(AccountSetup);
