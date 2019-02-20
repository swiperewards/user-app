import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import TextField from '@material-ui/core/TextField';

const isObject = val => {
    return typeof val === 'object' && val !== null;
  };
  
  export const classnames = (...args) => {
    const classes = [];
    args.forEach(arg => {
      if (typeof arg === 'string') {
        classes.push(arg);
      } else if (isObject(arg)) {
        Object.keys(arg).forEach(key => {
          if (arg[key]) {
            classes.push(key);
          }
        });
      } else {
        throw new Error(
          '`classnames` only accepts string or object as arguments'
        );
      }
    });
  
    return classes.join(' ');
  };

  
class LocationSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      errorMessage: '',
      latitude: null,
      longitude: null,
      isGeocoding: false,
      anchorEl: null,
    };
  }

  handleChange = address => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: '',
    });
  };

  handleSelect = selected => {
    this.setState({ isGeocoding: true, address: selected });
    geocodeByAddress(selected)
      .then(res => getLatLng(res[0]))
      .then(({ lat, lng }) => {
        this.setState({
          latitude: lat,
          longitude: lng,
          isGeocoding: false,
        });
      })
      .catch(error => {
        this.setState({ isGeocoding: false });
        console.log('error', error); // eslint-disable-line no-console
      });
  };

  handleCloseClick = () => {
    this.setState({
      address: '',
      latitude: null,
      longitude: null,
    });
  };

  handleError = (status, clearSuggestions) => {
    console.log('Error from Google Maps API', status); // eslint-disable-line no-console
    this.setState({ errorMessage: status }, () => {
      clearSuggestions();
    });
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };


  render() {
    const {
      address,
      errorMessage,
      latitude,
      longitude,
      isGeocoding,
    } = this.state;

    return (
        <div>
        <PlacesAutocomplete
          onChange={this.handleChange}
          value={address}
          onSelect={this.handleSelect}
          onError={this.handleError}
          shouldFetchSuggestions={address.length > 2}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => {
            return (
                <div>
                    <div>
                        <TextField {...this.props.input}
                            {...getInputProps({
                                placeholder: 'Search Store ...',
                                className: 'location-search-input',
                            })}
                            error={this.props.meta.touched ? this.props.meta.invalid : false}
                            helperText={this.props.meta.touched ? this.props.meta.error : ''}
                            fullWidth={true}
                        />
                    </div>
                        
                    {suggestions.length > 0 && (
                        <div className="autocomplete-container">
                        {
                            suggestions.map((suggestion, index) => {
                                const className = classnames('suggestion-item', {
                                    'suggestion-item--active': suggestion.active,
                                });

                            return (                                
                              <div
                                  {...getSuggestionItemProps(suggestion, { className })}>
                                  <strong>
                                      {suggestion.formattedSuggestion.mainText}
                                  </strong>{' '}
                                  <small>
                                      {suggestion.formattedSuggestion.secondaryText}
                                  </small>
                              </div>
                                            
                            );
                            })}
                        </div>
                    )}
                </div>
            );
          }}
        </PlacesAutocomplete>
        {errorMessage.length > 0 && (
          <div className="Demo__error-message">{this.state.errorMessage}</div>
        )}

        {((latitude && longitude) || isGeocoding) && (
          <div>
            <h3 className="Demo__geocode-result-header">Geocode result</h3>
            {isGeocoding ? (
              <div>
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner" />
              </div>
            ) : (
              <div>
                <div className="Demo__geocode-result-item--lat">
                  <label>Latitude:</label>
                  <span>{latitude}</span>
                </div>
                <div className="Demo__geocode-result-item--lng">
                  <label>Longitude:</label>
                  <span>{longitude}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default LocationSearchBar;
