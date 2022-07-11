import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRecruitPageComponent } from './post-recruit-page.component';

describe('PostRecruitPageComponent', () => {
  let component: PostRecruitPageComponent;
  let fixture: ComponentFixture<PostRecruitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostRecruitPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostRecruitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
