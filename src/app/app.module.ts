import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { LightsComponent } from './hue/lights/lights.component';
import { LightComponent } from './hue/light/light.component';
import { RoomsComponent } from './hue/rooms/rooms.component';
import { RoomComponent } from './hue/room/room.component';
import { LightsettingsComponent } from './hue/lightsettings/lightsettings.component';
import { SliderComponent } from './common/slider/slider.component';
import { AmpComponent } from './amp/amp.component';
import { MuteComponent } from './amp/mute/mute.component';

@NgModule({
    declarations: [
        AppComponent,
        ListComponent,
        LightsComponent,
        LightComponent,
        RoomsComponent,
        RoomComponent,
        LightsettingsComponent,
        SliderComponent,
        AmpComponent,
        MuteComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,

        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatSliderModule,
        MatSlideToggleModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
