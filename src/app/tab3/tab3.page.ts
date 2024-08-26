import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public photos: UserPhoto[] = [];

  constructor(public photoService: PhotoService,
    public actionSheetController: ActionSheetController) {}

    public async showActionSheet(photo: UserPhoto, position: number) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Photos',
        buttons: [{
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          }
        }, {
          text: 'Guardar',
          icon: 'save',
          handler:  () => {
           this.photoService.saveToDevice(photo);
          }
        },{
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            }
        }]
      });
      await actionSheet.present();
    }

  async ngOnInit() {
    await this.photoService.loadSaved();
    this.loadPhotos();
  }

  private loadPhotos() {
    this.photos = this.photoService.photos;
  }
}
