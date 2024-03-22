import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { RestService } from '../service/rest.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  product: any = {};
  selectedImage: string | ArrayBuffer | any;
  selectedImages: any = [];
  current_location: any={};
  constructor(private restService: RestService, private toastCrt: ToastController,private navCrt: NavController) { }

  ngOnInit() {    
    this.printCurrentPosition()
  }

  submit() {

    this.printCurrentPosition()
    this.product["photos"] = this.selectedImages;
    this.product["locations"] = this.current_location;
    const savedData = this.restService.saveProduct(this.product)
    console.log("submit", savedData);  
  }

  ionWillEnter() {
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    this.selectedImage = `data:image/jpeg;base64,${image.base64String}`;
    // console.log(this.selectedImage);
    this.saveImage(this.selectedImage);

  }

  async selectImages() {
    const imageOptions = {
      quality: 100,
      allowMultiple: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    };

    const capturedImages = await Camera.pickImages(imageOptions);
    this.selectedImages = capturedImages;
  }


  async printCurrentPosition() {

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates.coords);
      this.current_location["latitude"] = coordinates.coords.latitude;
      this.current_location["longitude"] = coordinates.coords.longitude;
      const distance = this.calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
      console.log('Distance:', distance, 'km');
    } catch (error) {
      console.error('Error getting current position:', error);
    }
  }


  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const earthRadiusKm = 6371; // Radius of the earth in kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c; // Distance in kilometers

    return distance;
  }

  degreesToRadians(degrees: any) {
    return degrees * (Math.PI / 180);
  }



  async onFileInputChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = async (e: any) => {
          const base64Data = e.target.result.split(',')[1];
          // const fileName = `M_images/${Date.now()}_${i}.jpg`;
          const fileName = `assets/images/_${i}.jpg`;
          const savedImagePath = await this.restService.saveImageToDirectory(base64Data, fileName);
          // this.displayImage(savedImagePath);
          this.selectedImages.push({ path: savedImagePath });
        };

        reader.readAsDataURL(file);
      }
    }
  }

  async displayImage(filePath: string) {
    debugger
    const imgElement = document.createElement('img');
    imgElement.src = "http://localhost:8100" + filePath;
    document.body.appendChild(imgElement);
  }


  async saveImage(images: any) {
    // Replace 'imageData' with your actual image data (e.g., obtained from a camera or file input)
    const imageData = images; // Sample base64 image data
    const directory = 'images';
    const fileName = `${Date.now()}.jpg`;

    const savedImagePath = await this.restService.writeImageToDirectory(imageData, directory, fileName);
    if (savedImagePath) {
      console.log('Image saved at:', savedImagePath);
    } else {
      console.error('Failed to save image.');
    }
  }

}
