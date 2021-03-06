import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from "react-google-autocomplete";
Geocode.setApiKey( "" );
Geocode.enableDebug();

class Map extends Component{

	constructor( props ){
		super( props );
		this.state = {
			address: '',
			city: '',
			area: '',
			state: '',
			mapPosition: {
				lat: '',
				lng: ''
			},
			markerPosition: {
				lat: '',
				lng: ''
			}
		}
	}
	
	componentDidMount() {
		navigator.geolocation.getCurrentPosition((pos) => {
			const coords = pos.coords;
			this.setState({
				markerPosition: {
					lat: coords.latitude,
					lng: coords.longitude
				},
				mapPosition: {
					lat: coords.latitude,
					lng: coords.longitude
				}
			})

			Geocode.fromLatLng( this.state.mapPosition.lat , this.state.mapPosition.lng ).then(
				response => {
					const address = response.results[0].formatted_address,
						  addressArray =  response.results[0].address_components,
						  city = this.getCity( addressArray ),
						  area = this.getArea( addressArray ),
						  state = this.getState( addressArray );
	
					this.setState( {
						address: ( address ) ? address : '',
						area: ( area ) ? area : '',
						city: ( city ) ? city : '',
						state: ( state ) ? state : '',
					} )
				},
				error => {
					console.error( error );
				}
			);
		});
	};

	getCity = ( addressArray ) => {
		let city = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
				city = addressArray[ i ].long_name;
				return city;
			}
		}
	};


	getArea = ( addressArray ) => {
		let area = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0]  ) {
				for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
					if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
						area = addressArray[ i ].long_name;
						return area;
					}
				}
			}
		}
	};


	getState = ( addressArray ) => {
		let state = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
					state = addressArray[ i ].long_name;
					return state;
				}
			}
		}
	};


	onChange = ( event ) => {
		this.setState({ [event.target.name]: event.target.value });
	};


	onInfoWindowClose = ( event ) => {
	};

	onSubmit = (event) => {
		if(event) event.preventDefault();
    	const enteredAddress = this.refs.enteredAddress.value;
		Geocode.fromAddress(enteredAddress).then(
			response => {
			  if(response){
				const address = response.results[0].formatted_address,
				addressArray =  response.results[0].address_components,
				city = this.getCity( addressArray ),
				area = this.getArea( addressArray ),
				state = this.getState( addressArray );
						
				const { lat, lng } = response.results[0].geometry.location;
				this.setState({
						address: ( address ) ? address : '',
						area: ( area ) ? area : '',
						city: ( city ) ? city : '',
						state: ( state ) ? state : '',

						markerPosition: {
							lat: lat,
							lng: lng
						},
						mapPosition: {
							lat: lat,
							lng: lng
						}
				})
			  }
			},
			error => {
			  console.error(error);
			}
		);
	}


	
	onMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
		    newLng = event.latLng.lng();

		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = this.getCity( addressArray ),
				      area = this.getArea( addressArray ),
				      state = this.getState( addressArray );
				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
					markerPosition: {
						lat: newLat,
						lng: newLng
					},
					mapPosition: {
						lat: newLat,
						lng: newLng
					},
				} )
			},
			error => {
				console.error(error);
			}
		);
	};

	onPlaceSelected = ( place ) => {
		const address = place.formatted_address,
		      addressArray =  place.address_components,
		      city = this.getCity( addressArray ),
		      area = this.getArea( addressArray ),
		      state = this.getState( addressArray ),
		      latValue = place.geometry.location.lat(),
		      lngValue = place.geometry.location.lng();
		
		this.setState({
			address: ( address ) ? address : '',
			area: ( area ) ? area : '',
			city: ( city ) ? city : '',
			state: ( state ) ? state : '',
			markerPosition: {
				lat: latValue,
				lng: lngValue
			},
			mapPosition: {
				lat: latValue,
				lng: lngValue
			},
		})
	};


	render(){
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap google={ this.props.google }
					           defaultZoom={ this.props.zoom }
					           defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
					>
				
						<InfoWindow
							onClose={this.onInfoWindowClose}
							position={{ lat: ( this.state.markerPosition.lat + 0.0010 ), lng: this.state.markerPosition.lng }}
						>
							<div>
								<span style={{ padding: 0, margin: 0 }}>{ this.state.address }</span>
							</div>
						</InfoWindow>
						{/*Marker*/}
						<Marker google={this.props.google}
						        name={'current location'}
						        draggable={true}
						        onDragEnd={ this.onMarkerDragEnd }
						        position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
						/>
						<Marker />
						{/* For Auto complete Search Box */}
						<Autocomplete
							style={{
								width: '100%',
								height: '40px',
								paddingLeft: '16px',
								marginTop: '2px',
								marginBottom: '500px'
							}}
							onPlaceSelected={ this.onPlaceSelected }
							types={[]}
						/>
					</GoogleMap>
				)
			)
		);
		let map;
		if( this.state.mapPosition.lat !== undefined ) {
			map = <div>
				<div>
					<div className="form-group">
						<label htmlFor="">District</label>
						<input type="text" name="city" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.city }/>
					</div>
					<div className="form-group">
						<label htmlFor="">Area</label>
						<input type="text" name="area" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.area }/>
					</div>
					<div className="form-group">
						<label htmlFor="">Province</label>
						<input type="text" name="state" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.state }/>
					</div>
					<div className="form-group">
						<label htmlFor="">Address</label>
						<input type="text" name="address" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.address }/>
					</div>

					<form onSubmit={this.onSubmit}>
          				<input placeholder="enter address" ref="enteredAddress" />
          				<input type="submit" value="Submit Address" />
       				</form>
				</div>

				<AsyncMap
					googleMapURL="https://maps.googleapis.com/maps/api/js?key=&libraries=places"
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: this.props.height }} />
					}
					mapElement={
						<div style={{ height: `100%` }} />
					}
				/>
			</div>
		} else {
			map = <div style={{height: this.props.height}} />
		}
		return( map )
	}
}
export default Map