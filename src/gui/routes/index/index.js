import {h, Component} from 'preact';
import style from './style';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.handleBtn = this.handleBtn.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.scaleImage = this.scaleImage.bind(this);
        this.scaleCanvasWithAlgorithm = this.scaleCanvasWithAlgorithm.bind(this);
        this.getHalfScaleCanvas = this.getHalfScaleCanvas.bind(this);
        this.applyBilinearInterpolation = this.applyBilinearInterpolation.bind(this);
        this.state = {
            imgData: null,
            previewImg: null,
            score: null,
            scoreLabels: []
        };
        this.config = {
            maxWidth: 800,
            maxHeight: 600,
            quality: 0.9
        }
    }

    render() {
        return (
            <div>
                <div class="jumbotron" style="background-color: #48B7E2; color: #ffffff;">
                    <div class="container">
                        <h1 class="display-3">Know your food!</h1>
                        <p>Upload a picture and we will try to tell you how healthy your food is ;)</p>
                        <p>
                            <button type="button" class="btn btn-primary btn-lg" onClick={this.handleBtn} style="background-color: #092768;"><i class="fa fa-file-image-o"></i> Upload Image</button>
                            <input type="file" accept="image/*" id="file" name="file" capture="camera"
                                   onChange={this.handleImage} style="display: none;" ref={(uploadInput) => {
                                this.uploadInput = uploadInput;
                            }}/>
                        </p>
                    </div>
                </div>
                <div class="container">
                    <div class="row justify-content-center">
                        {this.state.previewImg &&
                        <div class="col-lg-4 col-md-4 col-sm-8 col-xs-8">
                            <div class="card" style="width: 20rem;">
                                <img class="card-img-top" src={this.state.previewImg} ref={(img) => {
                                    this.imgRef = img;
                                }} onLoad={this.handleUpload}/>
                                <div class="card-body">
                                    <ul>
                                        {this.state.scoreLabels.map((scoreLabel) =>
                                            <li>{scoreLabel}</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        }
                        {this.state.score &&
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                            <div class={style.scoreCircle}>
                                <div data-name="your score" data-percent={this.state.score + "% healthy"}>
                                    <svg viewBox="-10 -10 220 220">
                                        <g fill="none" stroke-width="20" transform="translate(100,100)">
                                            <path d="M 0,-100 A 100,100 0 0,1 86.6,-50" stroke="url(#cl1)"/>
                                            <path d="M 86.6,-50 A 100,100 0 0,1 86.6,50" stroke="url(#cl2)"/>
                                            <path d="M 86.6,50 A 100,100 0 0,1 0,100" stroke="url(#cl3)"/>
                                            <path d="M 0,100 A 100,100 0 0,1 -86.6,50" stroke="url(#cl4)"/>
                                            <path d="M -86.6,50 A 100,100 0 0,1 -86.6,-50" stroke="url(#cl5)"/>
                                            <path d="M -86.6,-50 A 100,100 0 0,1 0,-100" stroke="url(#cl6)"/>
                                        </g>
                                    </svg>
                                    <svg viewBox="-10 -10 220 220">
                                        <path
                                            d="M200,100 C200,44.771525 155.228475,0 100,0 C44.771525,0 0,44.771525 0,100 C0,155.228475 44.771525,200 100,200 C155.228475,200 200,155.228475 200,100 Z"
                                            stroke-dashoffset={(this.state.score / 100) * 629}></path>
                                    </svg>
                                </div>
                            </div>
                            <svg width="0" height="0">
                                <defs>
                                    <linearGradient id="cl1" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1"
                                                    y2="1">
                                        <stop stop-color="#490A3D"/>
                                        <stop offset="100%" stop-color="#C02942"/>
                                    </linearGradient>
                                    <linearGradient id="cl2" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0"
                                                    y2="1">
                                        <stop stop-color="#C02942"/>
                                        <stop offset="100%" stop-color="#D95B43"/>
                                    </linearGradient>
                                    <linearGradient id="cl3" gradientUnits="objectBoundingBox" x1="1" y1="0" x2="0"
                                                    y2="1">
                                        <stop stop-color="#D95B43"/>
                                        <stop offset="100%" stop-color="#E97F02"/>
                                    </linearGradient>
                                    <linearGradient id="cl4" gradientUnits="objectBoundingBox" x1="1" y1="1" x2="0"
                                                    y2="0">
                                        <stop stop-color="#E97F02"/>
                                        <stop offset="100%" stop-color="#F8CA00"/>
                                    </linearGradient>
                                    <linearGradient id="cl5" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="0"
                                                    y2="0">
                                        <stop stop-color="#F8CA00"/>
                                        <stop offset="100%" stop-color="#CFF09E"/>
                                    </linearGradient>
                                    <linearGradient id="cl6" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1"
                                                    y2="0">
                                        <stop stop-color="#CFF09E"/>
                                        <stop offset="100%" stop-color="#8A9B0F"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

    handleBtn(e) {
        e.preventDefault();
        this.uploadInput.click();
    }

    handleImage(e) {
        let fileReader = new FileReader();

        fileReader.onload = (loadEvent) => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    imgData: e.target.files[0],
                    previewImg: loadEvent.target.result
                };
            });
        };

        fileReader.readAsDataURL(e.target.files[0]);
    }

    handleUpload() {
        let formData = new FormData();
        //let scaledImg = this.scaleImage();
        //let imgType = scaledImg.split(';')[0].split(':')[1];

        //console.log("scaled: ", scaledImg);
        //formData.append('file', scaledImg.split(',')[1]);
        formData.append('file', this.state.imgData);

        let xhr = new XMLHttpRequest();
        xhr.open('post', '/api/food/score', true);

        xhr.onload = () => {
            if (xhr.status == 200) {
                console.log("file successfully uploaded", xhr);
                let response = JSON.parse(xhr.response);
                let score = Math.round(response.score);

                this.setState((prevState) => {
                    return {
                        ...prevState,
                        score: score,
                        scoreLabels: response.labels
                    };
                });
            } else {
                console.error("file upload failed :(", xhr);
            }
        };

        xhr.send(formData);
    }

    scaleImage() {
        let img = this.imgRef;

        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

        while (canvas.width >= (2 * this.config.maxWidth)) {
            canvas = this.getHalfScaleCanvas(canvas);
        }

        if (canvas.width > this.config.maxWidth) {
            canvas = this.scaleCanvasWithAlgorithm(canvas);
        }

        return canvas.toDataURL('image/jpeg', this.config.quality);
    }

    scaleCanvasWithAlgorithm(canvas) {
        let scaledCanvas = document.createElement('canvas');

        let scale = this.config.maxWidth / canvas.width;

        scaledCanvas.width = canvas.width * scale;
        scaledCanvas.height = canvas.height * scale;

        let srcImgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        let destImgData = scaledCanvas.getContext('2d').createImageData(scaledCanvas.width, scaledCanvas.height);

        this.applyBilinearInterpolation(srcImgData, destImgData, scale);

        scaledCanvas.getContext('2d').putImageData(destImgData, 0, 0);

        return scaledCanvas;
    }

    getHalfScaleCanvas(canvas) {
        let halfCanvas = document.createElement('canvas');
        halfCanvas.width = canvas.width / 2;
        halfCanvas.height = canvas.height / 2;

        halfCanvas.getContext('2d').drawImage(canvas, 0, 0, halfCanvas.width, halfCanvas.height);

        return halfCanvas;
    }

    applyBilinearInterpolation(srcCanvasData, destCanvasData, scale) {
        function inner(f00, f10, f01, f11, x, y) {
            let un_x = 1.0 - x;
            let un_y = 1.0 - y;
            return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
        }

        let i, j;
        let iyv, iy0, iy1, ixv, ix0, ix1;
        let idxD, idxS00, idxS10, idxS01, idxS11;
        let dx, dy;
        let r, g, b, a;
        for (i = 0; i < destCanvasData.height; ++i) {
            iyv = i / scale;
            iy0 = Math.floor(iyv);
            // Math.ceil can go over bounds
            iy1 = (Math.ceil(iyv) > (srcCanvasData.height - 1) ? (srcCanvasData.height - 1) : Math.ceil(iyv));
            for (j = 0; j < destCanvasData.width; ++j) {
                ixv = j / scale;
                ix0 = Math.floor(ixv);
                // Math.ceil can go over bounds
                ix1 = (Math.ceil(ixv) > (srcCanvasData.width - 1) ? (srcCanvasData.width - 1) : Math.ceil(ixv));
                idxD = (j + destCanvasData.width * i) * 4;
                // matrix to vector indices
                idxS00 = (ix0 + srcCanvasData.width * iy0) * 4;
                idxS10 = (ix1 + srcCanvasData.width * iy0) * 4;
                idxS01 = (ix0 + srcCanvasData.width * iy1) * 4;
                idxS11 = (ix1 + srcCanvasData.width * iy1) * 4;
                // overall coordinates to unit square
                dx = ixv - ix0;
                dy = iyv - iy0;
                // I let the r, g, b, a on purpose for debugging
                r = inner(srcCanvasData.data[idxS00], srcCanvasData.data[idxS10], srcCanvasData.data[idxS01], srcCanvasData.data[idxS11], dx, dy);
                destCanvasData.data[idxD] = r;

                g = inner(srcCanvasData.data[idxS00 + 1], srcCanvasData.data[idxS10 + 1], srcCanvasData.data[idxS01 + 1], srcCanvasData.data[idxS11 + 1], dx, dy);
                destCanvasData.data[idxD + 1] = g;

                b = inner(srcCanvasData.data[idxS00 + 2], srcCanvasData.data[idxS10 + 2], srcCanvasData.data[idxS01 + 2], srcCanvasData.data[idxS11 + 2], dx, dy);
                destCanvasData.data[idxD + 2] = b;

                a = inner(srcCanvasData.data[idxS00 + 3], srcCanvasData.data[idxS10 + 3], srcCanvasData.data[idxS01 + 3], srcCanvasData.data[idxS11 + 3], dx, dy);
                destCanvasData.data[idxD + 3] = a;
            }
        }
    }
}
