import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightComponent } from './light.component';

describe('LightComponent', () => {
    let component: LightComponent;
    let fixture: ComponentFixture<LightComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LightComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LightComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('state', {
            Name: 'Test',
            On: false,
            Brightness: 0,
            ColorMode: 'none',
            Hue: 0,
            Saturation: 0,
            ColorTemperature: 0,
            Alert: 'none',
            Effect: 'none',
            Reachable: false
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
