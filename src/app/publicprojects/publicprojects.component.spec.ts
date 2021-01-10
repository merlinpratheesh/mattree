import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicprojectsComponent } from './publicprojects.component';

describe('PublicprojectsComponent', () => {
  let component: PublicprojectsComponent;
  let fixture: ComponentFixture<PublicprojectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicprojectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicprojectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
