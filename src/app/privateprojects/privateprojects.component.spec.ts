import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateprojectsComponent } from './privateprojects.component';

describe('PrivateprojectsComponent', () => {
  let component: PrivateprojectsComponent;
  let fixture: ComponentFixture<PrivateprojectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateprojectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateprojectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
