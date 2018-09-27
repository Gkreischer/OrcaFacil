import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastropecaComponent } from './cadastropeca.component';

describe('CadastropecaComponent', () => {
  let component: CadastropecaComponent;
  let fixture: ComponentFixture<CadastropecaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastropecaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastropecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
