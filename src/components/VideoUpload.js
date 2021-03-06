import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import _ from 'lodash';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = { video: null, loading: false }
    }

    handleChange = event => {
        event.preventDefault();
        const video = event.target.files[0];

        this.setState({ video });
    }

    handleSubmit = event => {
        event.preventDefault();

        this.setState({ loading: true });
        this.fileUpload(this.state.video);
    }
 
    async fileUpload(video) {
        try {

            const userUid = firebase.auth().currentUser.uid;
            const filePath = `videos/${userUid}/${video.name}`;
            const videoStorageRef = firebase.storage().ref(filePath);
            const idToken = await firebase.auth().currentUser.getIdToken(true);
            const metadataForStorage = {
                customMetadata: {
                    idToken: idToken
                }
            };
            const fileSnapshot = await videoStorageRef.put(video,metadataForStorage);

            // mp4以外の動画は、Cloud Function上で、トランスコードした後にメタデータをFirestoreに保存する
            if (video.type === 'video/mp4') {
                const downloadURL = await videoStorageRef.getDownloadURL();
                let metadataForFirestore = _.omitBy(fileSnapshot.metadata, _.isEmpty);
                metadataForFirestore = Object.assign(metadataForFirestore,{downloadURL: downloadURL});

                this.saveVideoMetadata(metadataForFirestore);
            }

            if (fileSnapshot.state === 'success') {
                console.log(fileSnapshot);

                this.setState({ video: null, loading: false });
            } else {
                console.log(fileSnapshot);

                this.setState({ video: null, loading: false });
                alert('ファイルのアップロードに失敗しました！');
            }

        } catch(error) {
            console.log(error);

            return;
        }
    }

    saveVideoMetadata(metadata) {
        const collection = firebase.firestore().collection('videos');
        return collection.add(metadata);
    }

    render() {
        return (
            <LoadingOverlay
                active={this.state.loading}
                spinner
                text='Loading your content...'
            >
                <form onSubmit={e => this.handleSubmit(e)}>
                    <h2>Video Upload</h2>
                    <input 
                        type="file"
                        accept="video/*"
                        onChange={e => this.handleChange(e)}
                    />
                    <button type="submit">Upload Video</button>
                </form>
            </LoadingOverlay>
        );
    }
}

export default Upload;