import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuteComponent } from './mute.component';

describe('MuteComponent', () => {
  let component: MuteComponent;
  let fixture: ComponentFixture<MuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
