import React, { Component } from 'react';
import Map from './Map';

class Home extends Component {

	constructor( props ){
		super( props );
		this.state = {
				lat: 60.9271,
				lng: 79.8612
		}
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition((pos) => {
			const coords = pos.coords;
			console.log(coords);
			this.setState({
					lat: coords.latitude,
					lng: coords.longitude
			})
		});
	}

	render() {
		return(
			<div style={{ margin: '50px' }}>
				<Map
					google={this.props.google}
					height='500px'
					zoom={15}
				/>
			</div>
		);
	}
}

export default Home;