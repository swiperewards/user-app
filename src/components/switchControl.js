import React, {Component} from 'react';
import Switch from '@material-ui/core/Switch';

class RenderSwitch extends Component {
    render() {
        return (
            <div>
                <Switch
                    {...this.props.input}
                    checked={this.props.input.value}
                    color="primary"
                    value="checked"
                />

            </div>
        )
    }
}

export default RenderSwitch;