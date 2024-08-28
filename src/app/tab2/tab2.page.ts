import { Component, OnInit } from '@angular/core';
import { ServicioDeFotos, FotoDeUsuario } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public fotoMasReciente: FotoDeUsuario | undefined;

  constructor(private servicioDeFotos: ServicioDeFotos) {}

  async ngOnInit() {
    await this.servicioDeFotos.cargarGuardado();
    this.cargarFotoMasReciente();
  }

  async agregarFotoAGaleria() {
    await this.servicioDeFotos.agregarNuevaAGaleria();
    this.cargarFotoMasReciente();
  }

  private cargarFotoMasReciente() {
    this.fotoMasReciente = this.servicioDeFotos.fotos[0];
  }
}
