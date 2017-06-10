import React, { Component } from 'react';

class FileUpload extends Component{
	constructor(props){
		super();
	}

	render(){
		return(
			<div>
				<progress value={this.props.onUploadValue} max='100'></progress>
				
				{this.props.onUploadValue} %
				
				<br/>
				
				<input type="file" onChange={this.props.onUpload}/>
			</div>
		);
	}
}

export default FileUpload;