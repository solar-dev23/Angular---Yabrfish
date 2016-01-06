/**=========================================================
 * accountController: Controller for a Profile Accounts page
 * used in Profile Accounts page.
 * Author: Marcin - 2015.11.23
 =========================================================*/
 (function() {
    'use strict';

    angular
        .module('app.profile-accounts', ['ngAnimate', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'flash'])
        .filter('propsFilter', function() {
          return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
              items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                  var prop = keys[i];
                  var text = props[prop].toLowerCase();
                  if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                    itemMatches = true;
                    break;
                  }
                }

                if (itemMatches) {
                  out.push(item);
                }
              });
            } else {
              // Let the output be the input untouched
              out = items;
            }

            return out;
          }
        })
        .controller('accountController', accountController);

    function accountController($scope, $rootScope, $http, RouteHelpers, APP_APIS, Flash, ProductService, AuthService, ViewerService, LookupService, AccountService) {
      $scope.basepath = RouteHelpers.basepath;
      $scope.accounts = [];
      $scope.accountTypes = [];
      $scope.accountType = {};
      $scope.newAccount = {
        accountType: '',
        imageUrl: '',
        title: '',
        description: ''
      };
      $scope.location = [ {"lat": 51.50013, "lon":-0.126305} ];
      $scope.search_option = 'Name';
      $scope.searchType = 1;
      $scope.search_accounts = [];
      $scope.search_account = '';
      $scope.searchToken = '';

      $scope.countries = [{"id":"AF","text":"Afghanistan"},{"id":"AX","text":"Åland Islands"},{"id":"AL","text":"Albania"},{"id":"DZ","text":"Algeria"},{"id":"AS","text":"American Samoa"},{"id":"AD","text":"Andorra"},{"id":"AO","text":"Angola"},{"id":"AI","text":"Anguilla"},{"id":"AQ","text":"Antarctica"},{"id":"AG","text":"Antigua and Barbuda"},{"id":"AR","text":"Argentina"},{"id":"AM","text":"Armenia"},{"id":"AW","text":"Aruba"},{"id":"AU","text":"Australia"},{"id":"AT","text":"Austria"},{"id":"AZ","text":"Azerbaijan"},{"id":"BS","text":"Bahamas"},{"id":"BH","text":"Bahrain"},{"id":"BD","text":"Bangladesh"},{"id":"BB","text":"Barbados"},{"id":"BY","text":"Belarus"},{"id":"BE","text":"Belgium"},{"id":"BZ","text":"Belize"},{"id":"BJ","text":"Benin"},{"id":"BM","text":"Bermuda"},{"id":"BT","text":"Bhutan"},{"id":"BO","text":"Bolivia"},{"id":"BQ","text":"Bonaire"},{"id":"BA","text":"Bosnia and Herzegovina"},{"id":"BW","text":"Botswana"},{"id":"BV","text":"Bouvet Island"},{"id":"BR","text":"Brazil"},{"id":"IO","text":"British Indian Ocean Territory"},{"id":"VG","text":"British Virgin Islands"},{"id":"BN","text":"Brunei"},{"id":"BG","text":"Bulgaria"},{"id":"BF","text":"Burkina Faso"},{"id":"BI","text":"Burundi"},{"id":"KH","text":"Cambodia"},{"id":"CM","text":"Cameroon"},{"id":"CA","text":"Canada"},{"id":"CV","text":"Cape Verde"},{"id":"KY","text":"Cayman Islands"},{"id":"CF","text":"Central African Republic"},{"id":"TD","text":"Chad"},{"id":"CL","text":"Chile"},{"id":"CN","text":"China"},{"id":"CX","text":"Christmas Island"},{"id":"CC","text":"Cocos (Keeling) Islands"},{"id":"CO","text":"Colombia"},{"id":"KM","text":"Comoros"},{"id":"CG","text":"Republic of the Congo"},{"id":"CD","text":"DR Congo"},{"id":"CK","text":"Cook Islands"},{"id":"CR","text":"Costa Rica"},{"id":"HR","text":"Croatia"},{"id":"CU","text":"Cuba"},{"id":"CW","text":"Curaçao"},{"id":"CY","text":"Cyprus"},{"id":"CZ","text":"Czech Republic"},{"id":"DK","text":"Denmark"},{"id":"DJ","text":"Djibouti"},{"id":"DM","text":"Dominica"},{"id":"DO","text":"Dominican Republic"},{"id":"EC","text":"Ecuador"},{"id":"EG","text":"Egypt"},{"id":"SV","text":"El Salvador"},{"id":"GQ","text":"Equatorial Guinea"},{"id":"ER","text":"Eritrea"},{"id":"EE","text":"Estonia"},{"id":"ET","text":"Ethiopia"},{"id":"FK","text":"Falkland Islands"},{"id":"FO","text":"Faroe Islands"},{"id":"FJ","text":"Fiji"},{"id":"FI","text":"Finland"},{"id":"FR","text":"France"},{"id":"GF","text":"French Guiana"},{"id":"PF","text":"French Polynesia"},{"id":"TF","text":"French Southern and Antarctic Lands"},{"id":"GA","text":"Gabon"},{"id":"GM","text":"Gambia"},{"id":"GE","text":"Georgia"},{"id":"DE","text":"Germany"},{"id":"GH","text":"Ghana"},{"id":"GI","text":"Gibraltar"},{"id":"GR","text":"Greece"},{"id":"GL","text":"Greenland"},{"id":"GD","text":"Grenada"},{"id":"GP","text":"Guadeloupe"},{"id":"GU","text":"Guam"},{"id":"GT","text":"Guatemala"},{"id":"GG","text":"Guernsey"},{"id":"GN","text":"Guinea"},{"id":"GW","text":"Guinea-Bissau"},{"id":"GY","text":"Guyana"},{"id":"HT","text":"Haiti"},{"id":"HM","text":"Heard Island and McDonald Islands"},{"id":"VA","text":"Vatican City"},{"id":"HN","text":"Honduras"},{"id":"HK","text":"Hong Kong"},{"id":"HU","text":"Hungary"},{"id":"IS","text":"Iceland"},{"id":"IN","text":"India"},{"id":"ID","text":"Indonesia"},{"id":"CI","text":"Ivory Coast"},{"id":"IR","text":"Iran"},{"id":"IQ","text":"Iraq"},{"id":"IE","text":"Ireland"},{"id":"IM","text":"Isle of Man"},{"id":"IL","text":"Israel"},{"id":"IT","text":"Italy"},{"id":"JM","text":"Jamaica"},{"id":"JP","text":"Japan"},{"id":"JE","text":"Jersey"},{"id":"JO","text":"Jordan"},{"id":"KZ","text":"Kazakhstan"},{"id":"KE","text":"Kenya"},{"id":"KI","text":"Kiribati"},{"id":"KW","text":"Kuwait"},{"id":"KG","text":"Kyrgyzstan"},{"id":"LA","text":"Laos"},{"id":"LV","text":"Latvia"},{"id":"LB","text":"Lebanon"},{"id":"LS","text":"Lesotho"},{"id":"LR","text":"Liberia"},{"id":"LY","text":"Libya"},{"id":"LI","text":"Liechtenstein"},{"id":"LT","text":"Lithuania"},{"id":"LU","text":"Luxembourg"},{"id":"MO","text":"Macau"},{"id":"MK","text":"Macedonia"},{"id":"MG","text":"Madagascar"},{"id":"MW","text":"Malawi"},{"id":"MY","text":"Malaysia"},{"id":"MV","text":"Maldives"},{"id":"ML","text":"Mali"},{"id":"MT","text":"Malta"},{"id":"MH","text":"Marshall Islands"},{"id":"MQ","text":"Martinique"},{"id":"MR","text":"Mauritania"},{"id":"MU","text":"Mauritius"},{"id":"YT","text":"Mayotte"},{"id":"MX","text":"Mexico"},{"id":"FM","text":"Micronesia"},{"id":"MD","text":"Moldova"},{"id":"MC","text":"Monaco"},{"id":"MN","text":"Mongolia"},{"id":"ME","text":"Montenegro"},{"id":"MS","text":"Montserrat"},{"id":"MA","text":"Morocco"},{"id":"MZ","text":"Mozambique"},{"id":"MM","text":"Myanmar"},{"id":"NA","text":"Namibia"},{"id":"NR","text":"Nauru"},{"id":"NP","text":"Nepal"},{"id":"NL","text":"Netherlands"},{"id":"NC","text":"New Caledonia"},{"id":"NZ","text":"New Zealand"},{"id":"NI","text":"Nicaragua"},{"id":"NE","text":"Niger"},{"id":"NG","text":"Nigeria"},{"id":"NU","text":"Niue"},{"id":"NF","text":"Norfolk Island"},{"id":"KP","text":"North Korea"},{"id":"MP","text":"Northern Mariana Islands"},{"id":"NO","text":"Norway"},{"id":"OM","text":"Oman"},{"id":"PK","text":"Pakistan"},{"id":"PW","text":"Palau"},{"id":"PS","text":"Palestine"},{"id":"PA","text":"Panama"},{"id":"PG","text":"Papua New Guinea"},{"id":"PY","text":"Paraguay"},{"id":"PE","text":"Peru"},{"id":"PH","text":"Philippines"},{"id":"PN","text":"Pitcairn Islands"},{"id":"PL","text":"Poland"},{"id":"PT","text":"Portugal"},{"id":"PR","text":"Puerto Rico"},{"id":"QA","text":"Qatar"},{"id":"XK","text":"Kosovo"},{"id":"RE","text":"Réunion"},{"id":"RO","text":"Romania"},{"id":"RU","text":"Russia"},{"id":"RW","text":"Rwanda"},{"id":"BL","text":"Saint Barthélemy"},{"id":"SH","text":"Saint Helena, Ascension and Tristan da Cunha"},{"id":"KN","text":"Saint Kitts and Nevis"},{"id":"LC","text":"Saint Lucia"},{"id":"MF","text":"Saint Martin"},{"id":"PM","text":"Saint Pierre and Miquelon"},{"id":"VC","text":"Saint Vincent and the Grenadines"},{"id":"WS","text":"Samoa"},{"id":"SM","text":"San Marino"},{"id":"ST","text":"São Tomé and Príncipe"},{"id":"SA","text":"Saudi Arabia"},{"id":"SN","text":"Senegal"},{"id":"RS","text":"Serbia"},{"id":"SC","text":"Seychelles"},{"id":"SL","text":"Sierra Leone"},{"id":"SG","text":"Singapore"},{"id":"SX","text":"Sint Maarten"},{"id":"SK","text":"Slovakia"},{"id":"SI","text":"Slovenia"},{"id":"SB","text":"Solomon Islands"},{"id":"SO","text":"Somalia"},{"id":"ZA","text":"South Africa"},{"id":"GS","text":"South Georgia"},{"id":"KR","text":"South Korea"},{"id":"SS","text":"South Sudan"},{"id":"ES","text":"Spain"},{"id":"LK","text":"Sri Lanka"},{"id":"SD","text":"Sudan"},{"id":"SR","text":"Suriname"},{"id":"SJ","text":"Svalbard and Jan Mayen"},{"id":"SZ","text":"Swaziland"},{"id":"SE","text":"Sweden"},{"id":"CH","text":"Switzerland"},{"id":"SY","text":"Syria"},{"id":"TW","text":"Taiwan"},{"id":"TJ","text":"Tajikistan"},{"id":"TZ","text":"Tanzania"},{"id":"TH","text":"Thailand"},{"id":"TL","text":"Timor-Leste"},{"id":"TG","text":"Togo"},{"id":"TK","text":"Tokelau"},{"id":"TO","text":"Tonga"},{"id":"TT","text":"Trinidad and Tobago"},{"id":"TN","text":"Tunisia"},{"id":"TR","text":"Turkey"},{"id":"TM","text":"Turkmenistan"},{"id":"TC","text":"Turks and Caicos Islands"},{"id":"TV","text":"Tuvalu"},{"id":"UG","text":"Uganda"},{"id":"UA","text":"Ukraine"},{"id":"AE","text":"United Arab Emirates"},{"id":"GB","text":"United Kingdom"},{"id":"US","text":"United States"},{"id":"UM","text":"United States Minor Outlying Islands"},{"id":"VI","text":"United States Virgin Islands"},{"id":"UY","text":"Uruguay"},{"id":"UZ","text":"Uzbekistan"},{"id":"VU","text":"Vanuatu"},{"id":"VE","text":"Venezuela"},{"id":"VN","text":"Vietnam"},{"id":"WF","text":"Wallis and Futuna"},{"id":"EH","text":"Western Sahara"},{"id":"YE","text":"Yemen"},{"id":"ZM","text":"Zambia"},{"id":"ZW","text":"Zimbabwe"}];
      $scope.country = {};
      $scope.areaCountry = {};

      // Slide Tile Creation Steps.
      var step_count = 3;
      $scope.stepWidth = angular.element('.new-account-wrap').width();
      $scope.sliderWidth = angular.element('.new-account-wrap').width() * step_count;
      $scope.transform = '';
      var translate = 0;
      $scope.index = 0;

      $scope.slideWrap = function(dir){
        if(dir === 'next'){
          $scope.index ++;
          translate -= $scope.stepWidth;
          $scope.transform = "translate("+translate+"px, 0px)";
        }else{
          $scope.index --;
          translate += $scope.stepWidth;
          $scope.transform = "translate("+translate+"px, 0px)";
        }
      }
      
      $scope.getAccounts = function() {
        // Get Roles by viewer.
        ViewerService.getAccounts($rootScope.user.externalId).then(function(data){
          for(var i in data){
            $scope.accounts.push(data[i].account);
          }
        }, function(error){
          console.log(error);
          return;
        });
      }

      $scope.createAccount = function() {

      }

      // Get Account Type
      LookupService.getAccountTypes().then(function(types){
        $scope.accountTypes = types;
      }, function(error){
        console.log(error);
        return;
      });

      // Show/Hide extend wrap.
      $scope.extendAccount = function(element) {
        var accountId = element.externalId;
        var zoomVal = 17;
        var defaultMapPos = {lat: 51.50013, lng: -0.126305};

        if(element.extendWrap){
          element.extendWrap = false;
        }
        else{
          element.extendWrap = true;
        }
      }

      // Get Products of type = Account
      ProductService.getProducts('account').then(function(products){
        $scope.products = products;
      })

      $scope.selectOffer = function(offer) {
        $scope.selected = offer;
        $scope.offerDescription = offer.description;
        $scope.offerAmount = offer.grossPrice * 100;
        $scope.offerName = offer.name;
      }

      $scope.isSelected = function(offer) {
        return $scope.selected === offer;
      }

      $scope.doCheckout = function(token) {
        console.log(token.id);
      }

      $scope.showNewAccount = function() {
        if($scope.accounts.indexOf('new-account') < 0)
          $scope.accounts.unshift('new-account');
      }

      $scope.selectOpt = function(txt){
        $scope.search_option = txt;
        if(txt == 'Name')
          $scope.searchType = 1;
        else
          $scope.searchType = 2;
      }

      // Search Accounts
      $scope.$watch('search_account', function(newVal){
        if(newVal != '' && newVal.length > 6) {
            $scope.searchToken='ACCOUNT'+ new Date().getTime();
            $scope.search_account=newVal;
            $scope.searchAccounts();
        }
      });

      $scope.searchAccounts = function() {

        //---------------------------------------------------------//
        // Load Single Page Search
        //--------------------------------------------------------//
        if ( $scope.inMotion || ! AccountService.moreSearch($scope.searchToken) ) {
          //---------------------------------------------------------------
          // Check Cache Size of Controller if navigation has left the View
          //---------------------------------------------------------------
          if ( $scope.search_accounts.length < AccountService.searchCacheSize()) {
            $scope.search_accounts.length = 0;
            $scope.search_accounts = AccountService.cacheSearch();
          }
          return;
        }

        $scope.inMotion = true;
        $scope.loading = true;

        if ( ! AccountService.moreSearch($scope.searchToken) ) {
          $scope.loading = false;
          $scope.inMotion = true;
        } else {
          AccountService.searchAccounts($scope.searchToken, $scope.searchType, $scope.search_account, '1').then(function (searchRes) {
            $scope.search_accounts = AccountService.cacheSearch();
            $scope.loading = false;
            $scope.inMotion = false;
          }, function (error) {
            console.log(error);
            return;
          })
        }
      }
    }
})();