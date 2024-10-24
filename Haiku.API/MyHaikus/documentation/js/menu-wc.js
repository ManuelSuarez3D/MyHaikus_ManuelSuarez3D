'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">my-haikus documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-55dafb1285bd0091360a6deca326ac28cf967f6d7300a576e90f914ae3c9bdabfef438d887d870bf002478c5bb73e7a11b6f289d9506cc4c73bf8054abdc1318"' : 'data-bs-target="#xs-components-links-module-AppModule-55dafb1285bd0091360a6deca326ac28cf967f6d7300a576e90f914ae3c9bdabfef438d887d870bf002478c5bb73e7a11b6f289d9506cc4c73bf8054abdc1318"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-55dafb1285bd0091360a6deca326ac28cf967f6d7300a576e90f914ae3c9bdabfef438d887d870bf002478c5bb73e7a11b6f289d9506cc4c73bf8054abdc1318"' :
                                            'id="xs-components-links-module-AppModule-55dafb1285bd0091360a6deca326ac28cf967f6d7300a576e90f914ae3c9bdabfef438d887d870bf002478c5bb73e7a11b6f289d9506cc4c73bf8054abdc1318"' }>
                                            <li class="link">
                                                <a href="components/AddAuthorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddAuthorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddAuthorFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddAuthorFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddAuthorHaikuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddAuthorHaikuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddAuthorHaikuFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddAuthorHaikuFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddUserHaikuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddUserHaikuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddUserHaikuFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddUserHaikuFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllAuthorHaikusComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllAuthorHaikusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllAuthorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllAuthorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllUserHaikusComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllUserHaikusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllUsersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllUsersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SingleAuthorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SingleAuthorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SingleAuthorHaikuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SingleAuthorHaikuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SingleUserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SingleUserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SingleUserHaikuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SingleUserHaikuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateAuthorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateAuthorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateAuthorFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateAuthorFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateAuthorHaikuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateAuthorHaikuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateAuthorHaikuFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateAuthorHaikuFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateProfileFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateProfileFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateUserHaikuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateUserHaikuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateUserHaikuFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateUserHaikuFormComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-AppModule-55dafb1285bd0091360a6deca326ac28cf967f6d7300a576e90f914ae3c9bdabfef438d887d870bf002478c5bb73e7a11b6f289d9506cc4c73bf8054abdc1318"' : 'data-bs-target="#xs-directives-links-module-AppModule-55dafb1285bd0091360a6deca326ac28cf967f6d7300a576e90f914ae3c9bdabfef438d887d870bf002478c5bb73e7a11b6f289d9506cc4c73bf8054abdc1318"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-55dafb1285bd0091360a6deca326ac28cf967f6d7300a576e90f914ae3c9bdabfef438d887d870bf002478c5bb73e7a11b6f289d9506cc4c73bf8054abdc1318"' :
                                        'id="xs-directives-links-module-AppModule-55dafb1285bd0091360a6deca326ac28cf967f6d7300a576e90f914ae3c9bdabfef438d887d870bf002478c5bb73e7a11b6f289d9506cc4c73bf8054abdc1318"' }>
                                        <li class="link">
                                            <a href="directives/IsAuthorizedDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IsAuthorizedDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/IsUnAuthenticatedDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IsUnAuthenticatedDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/MatchingValidator.html" data-type="entity-link" >MatchingValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/SyllableValidator.html" data-type="entity-link" >SyllableValidator</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthorHaikuService.html" data-type="entity-link" >AuthorHaikuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthorizationService.html" data-type="entity-link" >AuthorizationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthorService.html" data-type="entity-link" >AuthorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorHandlingService.html" data-type="entity-link" >ErrorHandlingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImageService.html" data-type="entity-link" >ImageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginService.html" data-type="entity-link" >LoginService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogoutService.html" data-type="entity-link" >LogoutService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileService.html" data-type="entity-link" >ProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegisterService.html" data-type="entity-link" >RegisterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserHaikuService.html" data-type="entity-link" >UserHaikuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsernameValidator.html" data-type="entity-link" >UsernameValidator</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/XmlSerializerService.html" data-type="entity-link" >XmlSerializerService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthorizationInterceptor.html" data-type="entity-link" >AuthorizationInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthenticationGuard.html" data-type="entity-link" >AuthenticationGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthorizationGuard.html" data-type="entity-link" >AuthorizationGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/UnAuthenticatedGuard.html" data-type="entity-link" >UnAuthenticatedGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AccountDto.html" data-type="entity-link" >AccountDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthorDto.html" data-type="entity-link" >AuthorDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthorHaikuDto.html" data-type="entity-link" >AuthorHaikuDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImageDto.html" data-type="entity-link" >ImageDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JWTokenDto.html" data-type="entity-link" >JWTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginationMetaDataDto.html" data-type="entity-link" >PaginationMetaDataDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProfileDto.html" data-type="entity-link" >ProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserDto.html" data-type="entity-link" >UserDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserHaikuDto.html" data-type="entity-link" >UserHaikuDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserUpdateDto.html" data-type="entity-link" >UserUpdateDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});