import React, { Component } from 'react';
import Map from './Map';

class Home extends Component {
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