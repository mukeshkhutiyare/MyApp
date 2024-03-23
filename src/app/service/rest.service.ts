import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';
import { ToastController } from '@ionic/angular';
const { FilesystemDirectory, FilesystemEncoding } = Plugins['Filesystem'];

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private toastCtrl: ToastController) { }

  async writeImageToDirectory(imageData: string, directory: string, fileName: string): Promise<string> {
    try {
      // Check if directory exists, if not, create it
      await Filesystem.mkdir({
        path: directory,
        directory: FilesystemDirectory.Data,
        recursive: true // create parent directories if they don't exist
      });

      // Write file to directory
      const result = await Filesystem.writeFile({
        path: `${directory}/${fileName}`,
        data: imageData,
        directory: FilesystemDirectory.Data,
        encoding: FilesystemEncoding.Base64
      });

      return result.uri;
    } catch (error) {
      console.error('Unable to write file', error);
      return "null";
    }
  }


  async saveImageToDirectory(imageData: string, fileName: string): Promise<string> {
    try {
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: imageData,
        directory: FilesystemDirectory.Data
      });
      console.log('Saved file path:', savedFile.uri);
      return savedFile.uri;
    } catch (error) {
      console.error('Unable to write file', error);
      return "null";
    }
  }

  async saveProduct(data: string): Promise<string> {
    var prod = localStorage["products"];
    var new_prod = [];
    if (prod?.length < 3 || prod === undefined) {
      localStorage.setItem("products", JSON.stringify(data));
    } else {
      new_prod = JSON.parse(prod);
      new_prod.push(data);
      localStorage.setItem("products", JSON.stringify(new_prod));
    }
    console.log('Saved file path:', data);
    this.presentToast('save data success fully', 'bottom');
    return "save success ful";

  }

  async presentToast(msg: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastCtrl.create({
      message: msg, //'Your settings have been saved.',
      duration: 2000,
      position: position,
      cssClass: "custom-toast"
    });
    toast.present();
  }

  getProducts() {
    var product = localStorage["products"]
    if (product) {
      product = JSON.parse(product);
    }
    return product;
  }

  async getDistanceCalculate() {

    try {

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

    return distance.toFixed(2)+' km.';
  }

  degreesToRadians(degrees: any) {
    return degrees * (Math.PI / 180);
  }

}
