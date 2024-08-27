import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { ActionSheetController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public photos: UserPhoto[] = [];

  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController
  ) {}

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          }
        },
        {
          text: 'Guardar',
          role: 'save',
          icon: 'save',
          handler: async () => {
            await this.photoService.saveToDevice(photo);
            this.presentToast('Imagen guardada en el dispositivo');
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {}
        }
      ]
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

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, 
      position: 'bottom' 
    });
    toast.present();
  }
}
