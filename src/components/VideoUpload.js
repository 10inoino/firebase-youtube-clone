import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = { video: null }
    }

    handleChange = event => {
        event.preventDefault();
        const video = event.target.files[0];

        this.setState({ video });
    }

    handleSubmit = event => {
        event.preventDefault();

        this.fileUpload(this.state.video);
    }
 
    async fileUpload(video) {
        try {
            const userUid = firebase.auth().currentUser.uid;
            const filePath = 'videos/${userUid}/${video.name}';
            const videoStorageRef = firebase.storage().ref(filePath);
            const fileSnapshot = await videoStorageRef.put(video);

            console.log(fileSnapshot);
        } catch(error) {
            console.log(error);

            return;
        }
    }

    render() {
        return (
            <from onSubmit={e => this.handleSubmit(e)}>
                <h2>Video Upload</h2>
                <input 
                    type='file'
                    accept="video/*"
                    onChange={e => this.handleChange(e)}
                />
                <button type="submit">Upload</button>
            </from>
        );
    }
}

export default Upload;