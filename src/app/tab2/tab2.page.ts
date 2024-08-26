import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public latestPhoto: UserPhoto | undefined;

  constructor(private photoService: PhotoService) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
    this.loadLatestPhoto();
  }

  async addPhotoToGallery() {
    await this.photoService.addNewToGallery();
    this.loadLatestPhoto();
  }

  private loadLatestPhoto() {
    this.latestPhoto = this.photoService.photos[0];
  }
}
