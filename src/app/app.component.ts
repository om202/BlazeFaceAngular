import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as facedet from '@tensorflow-models/blazeface';
// import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  model: any;
  loading: boolean;
  img: any;
  predictions: any;

  constructor() { }

  @ViewChild('vidEl') video: ElementRef;


  async ngOnInit() {
    this.loading = true;
    this.model = await facedet.load();
    this.loading = false;

    setInterval(async () => {
      this.predictions = this.model.estimateFaces(this.video.nativeElement, false)
    }, 1000);

  }


  ngAfterViewInit() {
    const videoEl = this.video.nativeElement;
    if(navigator.mediaDevices.getUserMedia)
    {
      navigator.mediaDevices.getUserMedia({video:true})
      .then(
        (stream) => {
          videoEl.srcObject = stream;
        }
      )
      .catch(
        (error) => {
          console.log("Error: ", error);
        }
      )
    }
  }

  async fileChange(event: { target: { files: any[]; }; }) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (res: any) => {
        this.img = res.target.result;
        console.log(this.img)
      };
    }
  }



}
