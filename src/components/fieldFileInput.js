import React, {Component} from 'react'

export default class FieldFileInput  extends Component{
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.props.imageChange(e.target.files[0])
  }

  render(){
    const {label} = this.props  //whatever props you send to the component from redux-form Field
    return(
     <div><label>{label}</label>
     <div>
       <input
        type='file'
        accept='.jpg, .png, .jpeg'
        onChange={this.onChange}
       />
     </div>
     </div>
    )
}
}