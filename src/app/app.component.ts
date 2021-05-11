import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as facedet from '@tensorflow-models/blazeface';
// import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  model: any;
  loading: boolean;
  img: any;
  predictions: any;
  videoShow = false;
  streamGlobal:any;

  constructor() {}

  @ViewChild('vidEl') video: ElementRef<HTMLVideoElement>;
  @ViewChild('canvEl') canvas: ElementRef<HTMLCanvasElement>;

  async ngOnInit() {
    this.loading = true;
    this.model = await facedet.load();
    this.loading = false;

    setInterval(async () => {
      this.predictions = this.model.estimateFaces(
        this.video.nativeElement
      );
    }, 2000);



    // work on canvas
    var ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.height = 1000;
    this.canvas.nativeElement.width = 1400;
    // this.canvas.nativeElement


    this.video.nativeElement.addEventListener('play', function () {
      var $this = this;
      (function loop() {
        if (!$this.paused && !$this.ended) {
          ctx.drawImage($this, 0, 0, 1400, 1000);
          //get coordinates


          ctx.beginPath();
          ctx.rect(20, 20, 150, 100);
          ctx.stroke();
          setTimeout(loop, 1000 / 30); // drawing at 30fp
        }
      })();
    });
  }

  ngAfterViewInit() {
    const videoEl = this.video.nativeElement;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.streamGlobal = stream
          videoEl.srcObject = stream;
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
    }
  }

  async fileChange(event: { target: { files: any[] } }) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (res: any) => {
        this.img = res.target.result;
        console.log(this.img);
      };
    }
  }
}
