import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from './components/angular-components/loading-bar/loading-bar.service';
import { ConfigurationService } from './components/conf/configuration.service';
import { ApiHttpClient } from './components/http/api-http-client.service';
import { SessionService } from './components/session/session.service';

@Component({
	selector: 'n9-app',
	templateUrl: 'app.component.html'
})
export class AppComponent {

	private localeFilePrefix = 'locale-';

	constructor(
		private translateService: TranslateService,
		private sessionService: SessionService,
		private conf: ConfigurationService,
		private loadingBarService: LoadingBarService,
		private http: ApiHttpClient,
		private httpAngularService: Http) {
		// i18n configuration
		this.translateService.setDefaultLang(this.localeFilePrefix + 'fr-FR');
		this.translateService.use(this.localeFilePrefix + 'fr-FR');

		// session configuration
		this.sessionService.load();
		// api client configuration
		this.http.baseUrl = this.conf.getAsString('api');

		this.sessionService.session$.subscribe((session) => {
			if (session && session.profile && session.profile.language) this.translateService.use('locale-' + session.profile.language);
		});
		// this.session.session$.subscribe(p => console.log('new session value', p));
		// this.session.login$.subscribe(p => console.log("logged in"));
		// this.session.logout$.subscribe(p => console.log("logged out"));
		this.http.requestStart().subscribe(() => {
			this.loadingBarService.start();
		});
		this.http.requestEndSuccess().subscribe(() => {
			this.loadingBarService.complete();
		});
		this.http.requestEndError().subscribe(() => {
			this.loadingBarService.complete();
		});
	}
}
