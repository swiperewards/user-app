import React, {Component} from 'react'

const Error = {
    padding: '12px',
    color: 'rgb(244, 67, 54)',
    fontSize: 11,
    position: 'absolute'
}

class RenderCheckbox extends Component {
    render() {
        return (
            <div>
                <div>

                    <label className="checkBoxContainer">
                    {
                        <input 
                            {...this.props.input} 
                            type="checkbox" 
                            checked={this.props.input.value}
                        />
                    }
                     
                        <span className="checkmark"></span>
                    </label>
                    <div style={{ position: 'relative', width: '80%', left: '25px', lineHeight: '13px' }}> {this.props.myLabel}</div>
                    <span style={Error}>{this.props.meta.touched ? this.props.meta.error : ''}</span>
                </div>

            </div>
        )
    }
}

export default RenderCheckbox;