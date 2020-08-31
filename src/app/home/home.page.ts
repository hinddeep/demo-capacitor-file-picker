import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core'; 
import { Platform } from '@ionic/angular';
const { FileSelector } = Plugins 
import 'capacitor-file-selector'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private platform: Platform) {}

  async select()
  {
    let multiple_selection = true
    //let ext = [".jpg",".png",".pdf",".jpeg"] // list of extensions
    let ext = ["MP3", "ImaGes"] // combination of extensions or category 
    //let ext = ["videos", "audios", "images"] // list of all category
    //let ext = ["*"] // Allow any file type
    ext = ext.map(v => v.toLowerCase());
    let formData = new FormData();
    let selectedFile = await FileSelector.fileSelector({
      multiple_selection: multiple_selection,
      ext: ext
    })

    if(this.platform.is("android"))
    {
      let paths = JSON.parse(selectedFile.paths)
      let original_names = JSON.parse(selectedFile.original_names)
      let extensions = JSON.parse(selectedFile.extensions)
      for (let index = 0; index < paths.length; index++) {
          const file = await fetch(paths[index]).then((r) => r.blob());
          formData.append(
            "myfile[]",
            file,
            original_names[index] + extensions[index]
          );
        }
    }
    else if(this.platform.is("ios"))
    {
      for (let index = 0; index < selectedFile.paths.length; index++) {
        const file = await fetch(selectedFile.paths[index]).then((r) => r.blob());
        formData.append(
          "myfile[]",
          file,
          selectedFile.original_names[index] + selectedFile.extensions[index]
        );
      }
    }
    else
    {
      FileSelector.addListener("onFilesSelected", (data:FileList) => {
            for(var i = 0; i < data.length; i++)
            {
              formData.append(
                "myfile[]",
                data.item(i),
                data.item(i).name + data.item(i).type 
              );
            }
        }); 
    }
  }
}
