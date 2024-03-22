import { Component } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Network } from '@capacitor/network';
import { ScreenReader } from '@capacitor/screen-reader';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor() { }

  ionViewWillEnter() {
    this.checkScreenReaderEnabled()
    console.log(':::- View is about to enter');
  }

  writeSecretFile = async () => {
    await Filesystem.writeFile({
      path: 'secrets/text.txt',
      data: 'This is a test',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  };

  readSecretFile = async () => {
    const contents = await Filesystem.readFile({
      path: 'secrets/text.txt',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    console.log('secrets:', contents);
  };

  deleteSecretFile = async () => {
    await Filesystem.deleteFile({
      path: 'secrets/text.txt',
      directory: Directory.Documents,
    });
  };

  readFilePath = async () => {
    // Here's an example of reading a file with a full file path. Use this to
    // read binary data (base64 encoded) from plugins that return File URIs, such as
    // the Camera.
    const contents = await Filesystem.readFile({
      path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt',
    });

    console.log('data:', contents);
  };




  stateChange = async ()=> ScreenReader.addListener('stateChange', ({ value }) => {
    console.log(`Screen reader is now ${value ? 'on' : 'off'}`);
  });

  checkScreenReaderEnabled = async () => {
    const { value } = await ScreenReader.isEnabled();

    console.log('Voice over enabled? ' + value);
  };

  sayHello = async () => {
    await ScreenReader.speak({ value: 'Hello World!' });
  };




  networkStatusChange = async () => Network.addListener('networkStatusChange', status => {
    console.log('Network status changed', status);
  });

  currentNetworkStatus = async () => {
    const status = await Network.getStatus();

    console.log('Network status:', status);
  };

}
