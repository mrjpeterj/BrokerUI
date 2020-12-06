import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightsettingsComponent } from './lightsettings.component';

describe('LightsettingsComponent', () => {
  let component: LightsettingsComponent;
  let fixture: ComponentFixture<LightsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightsettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
