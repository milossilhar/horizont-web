import { AfterViewInit, Component, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [],
  template: '<div id="supertokensui"></div>',
  styles: ``
})
export class AuthComponent implements AfterViewInit, OnDestroy {

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit(): void {
    this.loadScript("https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@v0.48.0/build/static/js/main.81589a39.js");
  }

  ngOnDestroy(): void {
    const script = this.document.getElementById("supertokens-script");
    if (script) {
      script.remove();
    }
  }

  private loadScript(src: string) {
    const script = this.renderer.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.id = "supertokens-script";
    script.onload = () => {
      (window as any).supertokensUIInit('supertokensui', {
        appInfo: {
          appName: "Horizont Stránka",
          apiDomain: "http://localhost:8088",
          apiBasePath: "/api/supertokens",
          websiteDomain: "http://localhost:4200",
          websiteBasePath: "/auth",
        },
        recipeList: [
          (window as any).supertokensUIEmailPassword.init({
            signInAndUpFeature: {
              signUpForm: {
                formFields: [
                  { id: 'name', label: 'Meno', placeholder: 'Meno' },
                  { id: 'surname', label: 'Priezvisko', placeholder: 'Priezvisko' },
                  { id: 'birthdate', label: 'Dátum narodenia', placeholder: 'Dátum narodenia' },
                ]
              }
            }
          }),
          (window as any).supertokensUISession.init(),
        ],
      });
    };
    this.renderer.appendChild(this.document.body, script);
  }
}
