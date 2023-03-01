import React from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import imageCompression from 'browser-image-compression';
import { Link } from '@reach/router';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.imageCanvas = React.createRef();

        this.state = {
            imageSrc: null,
            imageFile: null,
            width: 0,
            height: 0,
            cropper: null,
            ratio: 1 / 1,
            vertical: false,
            loading: false,
            quality: 0.8,
        };
    }

    setFile = (image) => {
        let reader = new FileReader();
        this.setState({
            imageFile: image,
        });
        reader.onload = (e) => {
            const $this = this;
            var image = new Image();
            image.src = e.target.result;
            image.addEventListener('load', function () {
                $this.setState({
                    imageSrc: e.target.result,
                    height: this.height,
                    width: this.width,
                    vertical: this.height > this.width,
                });
            });
        };

        reader.readAsDataURL(image);
    };

    setCropper = (cropper) => {
        this.setState({
            cropper,
        });
    };

    changeRatio = (ratio) => {
        this.setState({
            ratio,
        });
    };

    download = () => {
        this.setState({
            loading: true,
        });
        let croppedData = this.state.cropper.getCroppedCanvas().toBlob((blob) => {
            let options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                initialQuality: this.state.quality,
                fileType: 'image/jpeg',
            };
            let $this = this;
            imageCompression(blob, options)
                .then(function (compressedFile) {
                    const blobUrl = URL.createObjectURL(compressedFile);
                    const link = document.createElement('a');

                    // Set link's href to point to the Blob URL
                    link.href = blobUrl;
                    link.download = $this.state.imageFile.name.slice(0, -4) + '.jpg';

                    // Append link to the body
                    document.body.appendChild(link);

                    // Dispatch click event on the link
                    // This is necessary as link.click() does not work on the latest firefox
                    link.dispatchEvent(
                        new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                        })
                    );

                    // Remove link from body
                    document.body.removeChild(link);

                    $this.setState({
                        loading: false,
                    });
                })
                .catch(function (error) {
                    console.log(error.message);
                });
        });
    };

    setQuality = (quality) => {
        this.setState({
            quality: quality.target.value,
        });
    };

    render() {
        return (
            <div className="container">
                <div class="mt-2 d-flex justify-content-end">
                    <Link to="directory-image-optimizer">Directory Image Optimizer</Link>
                </div>
                <div className="row my-4">
                    <h1>Colby Web Image Optimizer</h1>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div>
                            <Cropper
                                key={this.state.ratio}
                                style={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    height: `${this.state.vertical ? '600px' : 'auto'}`,
                                }}
                                initialAspectRatio={this.state.ratio}
                                aspectRatio={this.state.ratio}
                                src={this.state.imageSrc}
                                zoomable={false}
                                viewMode={1}
                                guides={true}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                onInitialized={(instance) => {
                                    this.setCropper(instance);
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-md-4 ">
                        <div className="border bg-light p-3">
                            <div className="mb-3 mt-2">
                                <h4>Upload an image</h4>
                                <input
                                    className="form-control"
                                    id="formFileSm"
                                    type="file"
                                    onChange={(e) => this.setFile(e.target.files[0])}
                                />
                            </div>
                            {this.state.imageFile && (
                                <>
                                    <hr />
                                    {/*<div>
                                        <div className="input-group my-3">
                                            <span className="input-group-text" id="basic-addon1">
                                                Width
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={this.state.width}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text" id="basic-addon1">
                                                Height
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={this.state.height}
                                            />
                                        </div>
                                    </div>*/}
                                    <div>
                                        <div
                                            className="btn-group mt-3"
                                            role="group"
                                            aria-label="Basic radio toggle button group"
                                        >
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="btnradio"
                                                id="radio-1:1"
                                                autoComplete="off"
                                                checked={this.state.ratio === 1 / 1}
                                                onClick={this.changeRatio.bind(null, 1 / 1)}
                                            />
                                            <label
                                                className="btn btn-outline-primary"
                                                for="radio-1:1"
                                            >
                                                1/1
                                            </label>
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="btnradio"
                                                id="radio-3:2"
                                                autoComplete="off"
                                                checked={this.state.ratio === 3 / 2}
                                                onClick={this.changeRatio.bind(null, 3 / 2)}
                                            />
                                            <label
                                                className="btn btn-outline-primary"
                                                for="radio-3:2"
                                            >
                                                3/2
                                            </label>

                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="btnradio"
                                                id="radio-4:3"
                                                autoComplete="off"
                                                checked={this.state.ratio === 4 / 3}
                                                onClick={this.changeRatio.bind(null, 4 / 3)}
                                            />
                                            <label
                                                className="btn btn-outline-primary"
                                                for="radio-4:3"
                                            >
                                                4/3
                                            </label>

                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="btnradio"
                                                id="radio-16:9"
                                                autoComplete="off"
                                                checked={this.state.ratio === 16 / 9}
                                                onClick={this.changeRatio.bind(null, 16 / 9)}
                                            />
                                            <label
                                                className="btn btn-outline-primary"
                                                for="radio-16:9"
                                            >
                                                16/9
                                            </label>

                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="btnradio"
                                                id="radio-custom"
                                                autoComplete="off"
                                                checked={this.state.ratio === 'custom'}
                                                onClick={this.changeRatio.bind(null, 'custom')}
                                            />
                                            <label
                                                className="btn btn-outline-primary"
                                                for="radio-custom"
                                            >
                                                Custom Ratio
                                            </label>
                                        </div>
                                        <div className="mt-3">
                                            <label for="customRange3" className="form-label">
                                                Quality{' '}
                                                <span className="badge bg-secondary">
                                                    {this.state.quality * 100 + ' %'}
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={this.state.quality}
                                                id="customRange3"
                                                onChange={this.setQuality}
                                            />
                                        </div>
                                        <div className="my-3 d-flex">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={this.download}
                                                style={{ marginRight: '6px' }}
                                            >
                                                {this.state.loading && (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="visually-hidden">
                                                            Loading...
                                                        </span>
                                                    </>
                                                )}
                                                {!this.state.loading && (
                                                    <>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="currentColor"
                                                            className="bi bi-cloud-arrow-down"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708l2 2z"
                                                            />
                                                            <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                                                        </svg>{' '}
                                                        Download
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => window.location.reload()}
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
