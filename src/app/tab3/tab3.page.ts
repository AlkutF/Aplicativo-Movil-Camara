import { Component, OnInit } from '@angular/core';
import { ServicioDeFotos, FotoDeUsuario } from '../services/photo.service';
import { ActionSheetController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page  implements OnInit {
  public fotos: FotoDeUsuario[] = [];

  constructor(
    public servicioDeFotos: ServicioDeFotos,
    public controladorDeAccion: ActionSheetController,
    public controladorDeToast: ToastController
  ) {}

  public async mostrarHojaDeAcciones(foto: FotoDeUsuario, posicion: number) {
    const hojaDeAcciones = await this.controladorDeAccion.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.servicioDeFotos.eliminarFoto(foto, posicion);
          }
        },
        {
          text: 'Guardar',
          role: 'save',
          icon: 'save',
          handler: async () => {
            await this.servicioDeFotos.guardarEnDispositivo(foto);
            this.presentarToast('Imagen guardada en el dispositivo');
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
    await hojaDeAcciones.present();
  }

  async ngOnInit() {
    await this.servicioDeFotos.cargarGuardado();
    this.cargarFotos();
  }

  private cargarFotos() {
    this.fotos = this.servicioDeFotos.fotos;
  }

  private async presentarToast(mensaje: string) {
    const toast = await this.controladorDeToast.create({
      message: mensaje,
      duration: 2000, 
      position: 'bottom' 
    });
    toast.present();
  }
}
