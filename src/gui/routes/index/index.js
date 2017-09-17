import {h, Component} from 'preact';
import style from './style';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.handleBtn = this.handleBtn.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.state = {
            imgData: "IMG_6178.JPG",
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
                        <h1 class="display-3">Rank Calculator</h1>
                    </div>
                  <button type="button" class="btn btn-primary btn-lg" onClick={this.handleUpload}
                          style="background-color: #092768;"><i class="fa fa-file-image-o"></i> Calculate
                  </button>
                  <button type="button" class="btn btn-primary btn-lg" onClick={this.handleBtn} style="background-color: #092768;"><i class="fa fa-file-image-o"></i> Upload Image</button>
                  <input type="file" accept="image/*" id="file" name="file" capture="camera"
                         onChange={this.handleImage} style="display: none;" ref={(uploadInput) => {
                    this.uploadInput = uploadInput;
                  }}/>
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
      console.log("handling uploads");


      var location;
      let test = new XMLHttpRequest();
      test.onreadystatechange = function() {
        if (test.readyState == XMLHttpRequest.DONE) {
          let Data = JSON.parse(test.response);
          console.log(Data);
          location = Data.Location;
        }
      }
      test.open('GET', 'https://freefood-1bed5.firebaseio.com/inputData.json?orderBy="Location"&limitToFirst=1', true);
      test.send(null);


      let formData = new FormData();

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

              let publish = new XMLHttpRequest();
              var input = {"file": this.state.imgData.name, "response": response};

              publish.open("POST", "https://freefood-1bed5.firebaseio.com/outputData.json", true);
              publish.setRequestHeader('Content-Type', 'application/json');
              publish.send(JSON.stringify(input));

            } else {
                console.error("file upload failed :(", xhr);
            }
        };

     xhr.send(formData);






    }
}
