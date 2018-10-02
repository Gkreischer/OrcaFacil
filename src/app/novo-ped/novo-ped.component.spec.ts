import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoPedComponent } from './novo-ped.component';

describe('NovoPedComponent', () => {
  let component: NovoPedComponent;
  let fixture: ComponentFixture<NovoPedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovoPedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovoPedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
