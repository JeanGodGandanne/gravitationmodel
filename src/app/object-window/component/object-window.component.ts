import { Component, OnInit } from '@angular/core';
import {ObjectWindowService} from '../object-window.service';
import {EzbService} from '../../layer/einzugsgebiete/ezb.service';

@Component({
  selector: 'app-object-window',
  templateUrl: './object-window.component.html',
  styleUrls: ['./object-window.component.scss']
})
export class ObjectWindowComponent implements OnInit {
  constructor(public readonly objectWindowsService: ObjectWindowService,
              private readonly ezbService: EzbService) { }

  ngOnInit(): void {
  }

  calculateGravitationModelForFiliale(): void {
    // this.ezbService.drawGravitationModel(this.objectWindowsService.currentlySelectedFiliale as number);
    this.ezbService.calculateHuffModel(this.objectWindowsService.currentlySelectedFiliale as number);
  }
}
