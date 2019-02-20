
const data={
    states:[
        { id:'1', prefix:'AL', name: 'Alabama'},
        { id:'2', prefix:'AK', name: 'Alaska'},
        { id:'3', prefix:'AZ', name: 'Arizona'},
        { id:'4', prefix:'AR', name: 'Arkansas'},
        { id:'5', prefix:'CA', name: 'California'},
        { id:'6', prefix:'CO', name: 'Colorado'},
        { id:'7', prefix:'CT', name: 'Connecticut'},
        { id:'8', prefix:'DE', name: 'Delaware'},
        { id:'9', prefix:'DC', name: 'District of Columbia'},
        { id:'10', prefix:'FL', name: 'Florida'},
        { id:'11', prefix:'GA', name: 'Georgia'},
        { id:'12', prefix:'HI', name: 'Hawaii'},
        { id:'13', prefix:'ID', name: 'Idaho'},
        { id:'14', prefix:'IL', name: 'Illinois'},
        { id:'15', prefix:'IN', name: 'Indiana'},
        { id:'16', prefix:'IA', name: 'Iowa'},
        { id:'17', prefix:'KS', name: 'Kansas'},
        { id:'18', prefix:'KY', name: 'Kentucky'},
        { id:'19', prefix:'LA', name: 'Louisiana'},
        { id:'20', prefix:'ME', name: 'Maine'},
        { id:'21', prefix:'MD', name: 'Maryland'},
        { id:'22', prefix:'MA', name: 'Massachusetts'},
        { id:'23', prefix:'MI', name: 'Michigan'},
        { id:'24', prefix:'MN', name: 'Minnesota'},
        { id:'25', prefix:'MS', name: 'Mississippi'},
        { id:'26', prefix:'MO', name: 'Missouri'},
        { id:'27', prefix:'MT', name: 'Montana'},
        { id:'28', prefix:'NE', name: 'Nebraska'},
        { id:'29', prefix:'NV', name: 'Nevada'},
        { id:'30', prefix:'NH', name: 'New Hampshire'},
        { id:'31', prefix:'NJ', name: 'New Jersey'},
        { id:'32', prefix:'NM', name: 'New Mexico'},
        { id:'33', prefix:'NY', name: 'New York'},
        { id:'34', prefix:'NC', name: 'North Carolina'},
        { id:'35', prefix:'ND', name: 'North Dakota'},
        { id:'36', prefix:'OH', name: 'Ohio'},
        { id:'37', prefix:'OK', name: 'Oklahoma'},
        { id:'38', prefix:'OR', name: 'Oregon'},
        { id:'39', prefix:'PA', name: 'Pennsylvania'},
        { id:'40', prefix:'RI', name: 'Rhode Island'},
        { id:'41', prefix:'SC', name: 'South Carolina'},
        { id:'42', prefix:'SD', name: 'South Dakota'},
        { id:'43', prefix:'TN', name: 'Tennessee'},
        { id:'44', prefix:'TX', name: 'Texas'},
        { id:'45', prefix:'UT', name: 'Utah'},
        { id:'46', prefix:'VT', name: 'Vermont'},
        { id:'47', prefix:'VA', name: 'Virginia'},
        { id:'48', prefix:'WA', name: 'Washington'},
        { id:'49', prefix:'WV', name: 'West Virginia'},
        { id:'50', prefix:'WI', name: 'Wisconsin'},
        { id:'51', prefix:'WY', name: 'Wyoming'},
        { id:'52', prefix:'AS', name: 'American Samoa'},
        { id:'53', prefix:'GU', name: 'Guam'},
        { id:'54', prefix:'MP', name: 'Northern Mariana Islands'},
        { id:'55', prefix:'PR', name: 'Puerto Rico'},
        { id:'56', prefix:'VI', name: 'U.S. Virgin Islands'}
    ],
    businessType:[
        { id:'1', prefix:'0', name: 'Sole '},
        { id:'2', prefix:'1', name: 'Corp'},
        { id:'3', prefix:'2', name: 'LLC'},
        { id:'4', prefix:'3', name: 'Partner'},
        { id:'6', prefix:'5', name: 'Nonprofit'},
        { id:'7', prefix:'6', name: 'Gov'}
    ],
    merchantType: [
        { id:'1', prefix:'0', name: 'None '},
        { id:'2', prefix:'supermarket', name: 'Grocery/Food Market'},
        { id:'3', prefix:'moto', name: 'Mail/Telephone Order'},
        { id:'4', prefix:'cardPresent', name: 'Retail'},
        { id:'6', prefix:'fuel', name: 'Fuel'},
        { id:'7', prefix:'serviceStation', name: 'Service Stations'},
        { id:'8', prefix:'restaurant', name: 'Restaurants & Food'},
        { id:'9', prefix:'ecommerce', name: 'E-commerce'}

    ],
    boardingStatus: [
        //{id:'0', name: 'Not Ready'},
        {id:'1', name: 'Board Immediately'}
    ],
    searchStatus: [
      {id:'0', name: 'Activate'},
      {id:'1', name: 'Deactivate'}
    ],
    dealStatus: [
      {id:'1', name: 'Active'},
      {id:'0', name: 'Expired'}
    ],
    queryStatus: [
      {id:'1', name: 'Pending'},
      {id:'3', name: 'Rejected'},
      {id:'2', name: 'Resolved'}
    ],
    redeemStatus: [
      {id:'1', name: 'Pending'},
      {id:'2', name: 'Approved'},
      {id:'3', name: 'Rejected'}
    ],
    userStatus: [
      {id:'1', name: 'Active'},
      {id:'0', name: 'Deactive'}
    ],
    userType: [
      {id:'0', name: 'Customer'},
      {id:'1', name: 'Merchant'}
    ],
    bankAccountType: [
        {id:'8', name: 'Checking'},
        {id:'9', name: 'Savings'},
        {id:'10', name: 'Corporate Checking'},
        {id:'11', name: 'Corporate Savings'}
    ],
    mccCodes : [
        {
          "mcc": "5814",
          "edited_description": "Fast Food Restaurants",
          "combined_description": "Fast Food Restaurants",
          "usda_description": "Fast Food Restaurants",
          "irs_description": "Fast Food Restaurants",
          "irs_reportable": "No1.6041-3(c)",
          "id": 804
        },
        {
          "mcc": "5999",
          "edited_description": "Miscellaneous and Specialty Retail Stores",
          "combined_description": "Miscellaneous and Specialty Retail Stores",
          "usda_description": "Miscellaneous and Specialty Retail Stores",
          "irs_description": "Miscellaneous Specialty Retail",
          "irs_reportable": "No1.6041-3(c)",
          "id": 854
        }
      ],
}

export default data;