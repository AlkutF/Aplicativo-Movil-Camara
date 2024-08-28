import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServicioDeFotos {
  public fotos: FotoDeUsuario[] = [];
  private ALMACENAMIENTO_DE_FOTOS: string = 'fotos';
  private plataforma: Platform;

  constructor(plataforma: Platform) {
    this.plataforma = plataforma;
  }

  public async agregarNuevaAGaleria() {
    const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera, 
      quality: 100 
    });

    const archivoImagenGuardado = await this.guardarImagen(fotoCapturada);
    this.fotos.unshift(archivoImagenGuardado);

    await Preferences.set({
      key: this.ALMACENAMIENTO_DE_FOTOS,
      value: JSON.stringify(this.fotos),
    });
  }

  public async eliminarFoto(foto: FotoDeUsuario, posicion: number) {
    this.fotos.splice(posicion, 1);
    await Preferences.set({
      key: this.ALMACENAMIENTO_DE_FOTOS,
      value: JSON.stringify(this.fotos)
    });

    const nombreArchivo = foto.archivoRuta.substr(foto.archivoRuta.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: nombreArchivo,
      directory: Directory.Data
    });
  }

  public async cargarGuardado() {
    const { value } = await Preferences.get({ key: this.ALMACENAMIENTO_DE_FOTOS });
    this.fotos = (value ? JSON.parse(value) : []) as FotoDeUsuario[];

    if (!this.plataforma.is('hybrid')) {
      for (let foto of this.fotos) {
        try {
          const archivoLeido = await Filesystem.readFile({
            path: foto.archivoRuta,
            directory: Directory.Data
          });
          foto.rutaWebview = `data:image/jpeg;base64,${archivoLeido.data}`;
        } catch (error) {
          console.error('Error al leer el archivo', error);
        }
      }
    }
  }

  private async guardarImagen(foto: Photo): Promise<FotoDeUsuario> {
    const datosBase64 = await this.leerComoBase64(foto);
    const nombreArchivo = `${Date.now()}.jpeg`;

    await Filesystem.writeFile({
      path: nombreArchivo,
      data: datosBase64,
      directory: Directory.Data
    });

    return {
      archivoRuta: nombreArchivo,
      rutaWebview: foto.webPath
    };
  }

  private async leerComoBase64(foto: Photo): Promise<string> {
    const respuesta = await fetch(foto.webPath!);
    const blob = await respuesta.blob();
    return this.convertirBlobABase64(blob);
  }

  private convertirBlobABase64(blob: Blob): Promise<string> {
    return new Promise((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onerror = rechazar;
      lector.onload = () => resolver(lector.result as string);
      lector.readAsDataURL(blob);
    });
  }

  public async guardarEnDispositivo(foto: FotoDeUsuario) {
    try {
      const archivo = await Filesystem.readFile({
        path: foto.archivoRuta,
        directory: Directory.Data
      });
  
      let blob: Blob;
      if (typeof archivo.data === 'string') {
        blob = await this.convertirBase64ABlob(archivo.data);
      } else {
        blob = archivo.data;
      }
  
      const nuevoNombreArchivo = `guardado_${Date.now()}.jpeg`;
      await Filesystem.writeFile({
        path: nuevoNombreArchivo,
        data: await this.blobABase64(blob),
        directory: Directory.Documents
      });
  
      console.log('Foto guardada exitosamente en', nuevoNombreArchivo);
      return true; 
    } catch (error) {
      console.error('Error al guardar la foto', error);
      return false; 
    }
  }

  private async convertirBase64ABlob(base64: string): Promise<Blob> {
    const respuesta = await fetch(`data:image/jpeg;base64,${base64}`);
    return await respuesta.blob();
  }

  private async blobABase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onloadend = () => resolver(lector.result as string);
      lector.onerror = rechazar;
      lector.readAsDataURL(blob);
    });
  }
}

export interface FotoDeUsuario {
  archivoRuta: string;
  rutaWebview?: string;
}
