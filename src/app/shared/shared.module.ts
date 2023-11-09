import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './map/location-picker/location-picker.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [
        LocationPickerComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [
        LocationPickerComponent
    ]
})

export class SharedModule{}