import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderWindowComponent } from './uploader-window.component';

describe('UploaderWindowComponent', () => {
  let component: UploaderWindowComponent;
  let fixture: ComponentFixture<UploaderWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploaderWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
