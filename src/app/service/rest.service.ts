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
    localStorage.setItem("products", JSON.stringify(data));  
      console.log('Saved file path:', data);
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

}
