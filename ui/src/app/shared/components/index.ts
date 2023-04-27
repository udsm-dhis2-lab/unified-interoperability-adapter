import { BodyComponent } from './body/body.component';
import { ButtonComponent } from './button/button.component';
import { DataelementEntryFieldComponent } from './dataelement-entry-field/dataelement-entry-field.component';
import { DefaultFormComponent } from './default-form/default-form.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SectionFormComponent } from './section-form/section-form.component';
import { SidenavComponent } from './sidenav/sidenav.component';

export const sharedComponents: Array<any> = [
  SidenavComponent,
  HeaderComponent,
  FooterComponent,
  ButtonComponent,
  BodyComponent,
  SectionFormComponent,
  DataelementEntryFieldComponent,
  DefaultFormComponent,
];
