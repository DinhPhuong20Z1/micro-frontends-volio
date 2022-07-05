import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMetaComponent } from './dialog-meta.component';

describe('DialogMetaComponent', () => {
  let component: DialogMetaComponent;
  let fixture: ComponentFixture<DialogMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
