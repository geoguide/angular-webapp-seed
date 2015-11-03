'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.applicationFactory
 * @description
 * # applicationFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('applicationFactory', function ($location,$http,API_URL) {
	// Service logic
	// ...
	var _this = this;
	// Public API here
	var countries = [
		{ iso_code: 'AFG', country: 'Afghanistan' },
		{ iso_code: 'ALA', country: 'Aland Islands' },
		{ iso_code: 'ALB', country: 'Albania' },
		{ iso_code: 'DZA', country: 'Algeria' },
		{ iso_code: 'ASM', country: 'American Samoa' },
		{ iso_code: 'AND', country: 'Andorra' },
		{ iso_code: 'AGO', country: 'Angola' },
		{ iso_code: 'AIA', country: 'Anguilla' },
		{ iso_code: 'ATA', country: 'Antarctica' },
		{ iso_code: 'ATG', country: 'Antigua and Barbuda' },
		{ iso_code: 'ARG', country: 'Argentina' },
		{ iso_code: 'ARM', country: 'Armenia' },
		{ iso_code: 'ABW', country: 'Aruba' },
		{ iso_code: 'AUS', country: 'Australia' },
		{ iso_code: 'AUT', country: 'Austria' },
		{ iso_code: 'AZE', country: 'Azerbaijan' },
		{ iso_code: 'BHS', country: 'Bahamas' },
		{ iso_code: 'BHR', country: 'Bahrain' },
		{ iso_code: 'BGD', country: 'Bangladesh' },
		{ iso_code: 'BRB', country: 'Barbados' },
		{ iso_code: 'BLR', country: 'Belarus' },
		{ iso_code: 'BEL', country: 'Belgium' },
		{ iso_code: 'BLZ', country: 'Belize' },
		{ iso_code: 'BEN', country: 'Benin' },
		{ iso_code: 'BMU', country: 'Bermuda' },
		{ iso_code: 'BTN', country: 'Bhutan' },
		{ iso_code: 'BOL', country: 'Bolivia' },
		{ iso_code: 'BIH', country: 'Bosnia and Herzegovina' },
		{ iso_code: 'BWA', country: 'Botswana' },
		{ iso_code: 'BVT', country: 'Bouvet Island' },
		{ iso_code: 'BRA', country: 'Brazil' },
		{ iso_code: 'VGB', country: 'British Virgin Islands' },
		{ iso_code: 'IOT', country: 'British Indian Ocean Territory' },
		{ iso_code: 'BRN', country: 'Brunei Darussalam' },
		{ iso_code: 'BGR', country: 'Bulgaria' },
		{ iso_code: 'BFA', country: 'Burkina Faso' },
		{ iso_code: 'BDI', country: 'Burundi' },
		{ iso_code: 'KHM', country: 'Cambodia' },
		{ iso_code: 'CMR', country: 'Cameroon' },
		{ iso_code: 'CAN', country: 'Canada' },
		{ iso_code: 'CPV', country: 'Cape Verde' },
		{ iso_code: 'CYM', country: 'Cayman Islands' },
		{ iso_code: 'CAF', country: 'Central African Republic' },
		{ iso_code: 'TCD', country: 'Chad' },
		{ iso_code: 'CHL', country: 'Chile' },
		{ iso_code: 'CHN', country: 'China' },
		{ iso_code: 'HKG', country: 'Hong Kong, Special Administrative Region of China' },
		{ iso_code: 'MAC', country: 'Macao, Special Administrative Region of China' },
		{ iso_code: 'CXR', country: 'Christmas Island' },
		{ iso_code: 'CCK', country: 'Cocos (Keeling) Islands' },
		{ iso_code: 'COL', country: 'Colombia' },
		{ iso_code: 'COM', country: 'Comoros' },
		{ iso_code: 'COG', country: 'Congo (Brazzaville)' },
		{ iso_code: 'COD', country: 'Congo, Democratic Republic of the' },
		{ iso_code: 'COK', country: 'Cook Islands' },
		{ iso_code: 'CRI', country: 'Costa Rica' },
		{ iso_code: 'CIV', country: 'Côte d\'Ivoire' },
		{ iso_code: 'HRV', country: 'Croatia' },
		{ iso_code: 'CUB', country: 'Cuba' },
		{ iso_code: 'CYP', country: 'Cyprus' },
		{ iso_code: 'CZE', country: 'Czech Republic' },
		{ iso_code: 'DNK', country: 'Denmark' },
		{ iso_code: 'DJI', country: 'Djibouti' },
		{ iso_code: 'DMA', country: 'Dominica' },
		{ iso_code: 'DOM', country: 'Dominican Republic' },
		{ iso_code: 'ECU', country: 'Ecuador' },
		{ iso_code: 'EGY', country: 'Egypt' },
		{ iso_code: 'SLV', country: 'El Salvador' },
		{ iso_code: 'GNQ', country: 'Equatorial Guinea' },
		{ iso_code: 'ERI', country: 'Eritrea' },
		{ iso_code: 'EST', country: 'Estonia' },
		{ iso_code: 'ETH', country: 'Ethiopia' },
		{ iso_code: 'FLK', country: 'Falkland Islands (Malvinas)' },
		{ iso_code: 'FRO', country: 'Faroe Islands' },
		{ iso_code: 'FJI', country: 'Fiji' },
		{ iso_code: 'FIN', country: 'Finland' },
		{ iso_code: 'FRA', country: 'France' },
		{ iso_code: 'GUF', country: 'French Guiana' },
		{ iso_code: 'PYF', country: 'French Polynesia' },
		{ iso_code: 'ATF', country: 'French Southern Territories' },
		{ iso_code: 'GAB', country: 'Gabon' },
		{ iso_code: 'GMB', country: 'Gambia' },
		{ iso_code: 'GEO', country: 'Georgia' },
		{ iso_code: 'DEU', country: 'Germany' },
		{ iso_code: 'GHA', country: 'Ghana' },
		{ iso_code: 'GIB', country: 'Gibraltar' },
		{ iso_code: 'GRC', country: 'Greece' },
		{ iso_code: 'GRL', country: 'Greenland' },
		{ iso_code: 'GRD', country: 'Grenada' },
		{ iso_code: 'GLP', country: 'Guadeloupe' },
		{ iso_code: 'GUM', country: 'Guam' },
		{ iso_code: 'GTM', country: 'Guatemala' },
		{ iso_code: 'GGY', country: 'Guernsey' },
		{ iso_code: 'GIN', country: 'Guinea' },
		{ iso_code: 'GNB', country: 'Guinea-Bissau' },
		{ iso_code: 'GUY', country: 'Guyana' },
		{ iso_code: 'HTI', country: 'Haiti' },
		{ iso_code: 'HMD', country: 'Heard Island and Mcdonald Islands' },
		{ iso_code: 'VAT', country: 'Holy See (Vatican City State)' },
		{ iso_code: 'HND', country: 'Honduras' },
		{ iso_code: 'HUN', country: 'Hungary' },
		{ iso_code: 'ISL', country: 'Iceland' },
		{ iso_code: 'IND', country: 'India' },
		{ iso_code: 'IDN', country: 'Indonesia' },
		{ iso_code: 'IRN', country: 'Iran, Islamic Republic of' },
		{ iso_code: 'IRQ', country: 'Iraq' },
		{ iso_code: 'IRL', country: 'Ireland' },
		{ iso_code: 'IMN', country: 'Isle of Man' },
		{ iso_code: 'ISR', country: 'Israel' },
		{ iso_code: 'ITA', country: 'Italy' },
		{ iso_code: 'JAM', country: 'Jamaica' },
		{ iso_code: 'JPN', country: 'Japan' },
		{ iso_code: 'JEY', country: 'Jersey' },
		{ iso_code: 'JOR', country: 'Jordan' },
		{ iso_code: 'KAZ', country: 'Kazakhstan' },
		{ iso_code: 'KEN', country: 'Kenya' },
		{ iso_code: 'KIR', country: 'Kiribati' },
		{ iso_code: 'PRK', country: 'Korea, Democratic People\'s Republic of' },
		{ iso_code: 'KOR', country: 'Korea, Republic of' },
		{ iso_code: 'KWT', country: 'Kuwait' },
		{ iso_code: 'KGZ', country: 'Kyrgyzstan' },
		{ iso_code: 'LAO', country: 'Lao PDR' },
		{ iso_code: 'LVA', country: 'Latvia' },
		{ iso_code: 'LBN', country: 'Lebanon' },
		{ iso_code: 'LSO', country: 'Lesotho' },
		{ iso_code: 'LBR', country: 'Liberia' },
		{ iso_code: 'LBY', country: 'Libya' },
		{ iso_code: 'LIE', country: 'Liechtenstein' },
		{ iso_code: 'LTU', country: 'Lithuania' },
		{ iso_code: 'LUX', country: 'Luxembourg' },
		{ iso_code: 'MKD', country: 'Macedonia, Republic of' },
		{ iso_code: 'MDG', country: 'Madagascar' },
		{ iso_code: 'MWI', country: 'Malawi' },
		{ iso_code: 'MYS', country: 'Malaysia' },
		{ iso_code: 'MDV', country: 'Maldives' },
		{ iso_code: 'MLI', country: 'Mali' },
		{ iso_code: 'MLT', country: 'Malta' },
		{ iso_code: 'MHL', country: 'Marshall Islands' },
		{ iso_code: 'MTQ', country: 'Martinique' },
		{ iso_code: 'MRT', country: 'Mauritania' },
		{ iso_code: 'MUS', country: 'Mauritius' },
		{ iso_code: 'MYT', country: 'Mayotte' },
		{ iso_code: 'MEX', country: 'Mexico' },
		{ iso_code: 'FSM', country: 'Micronesia, Federated States of' },
		{ iso_code: 'MDA', country: 'Moldova' },
		{ iso_code: 'MCO', country: 'Monaco' },
		{ iso_code: 'MNG', country: 'Mongolia' },
		{ iso_code: 'MNE', country: 'Montenegro' },
		{ iso_code: 'MSR', country: 'Montserrat' },
		{ iso_code: 'MAR', country: 'Morocco' },
		{ iso_code: 'MOZ', country: 'Mozambique' },
		{ iso_code: 'MMR', country: 'Myanmar' },
		{ iso_code: 'NAM', country: 'Namibia' },
		{ iso_code: 'NRU', country: 'Nauru' },
		{ iso_code: 'NPL', country: 'Nepal' },
		{ iso_code: 'NLD', country: 'Netherlands' },
		{ iso_code: 'ANT', country: 'Netherlands Antilles' },
		{ iso_code: 'NCL', country: 'New Caledonia' },
		{ iso_code: 'NZL', country: 'New Zealand' },
		{ iso_code: 'NIC', country: 'Nicaragua' },
		{ iso_code: 'NER', country: 'Niger' },
		{ iso_code: 'NGA', country: 'Nigeria' },
		{ iso_code: 'NIU', country: 'Niue' },
		{ iso_code: 'NFK', country: 'Norfolk Island' },
		{ iso_code: 'MNP', country: 'Northern Mariana Islands' },
		{ iso_code: 'NOR', country: 'Norway' },
		{ iso_code: 'OMN', country: 'Oman' },
		{ iso_code: 'PAK', country: 'Pakistan' },
		{ iso_code: 'PLW', country: 'Palau' },
		{ iso_code: 'PSE', country: 'Palestinian Territory, Occupied' },
		{ iso_code: 'PAN', country: 'Panama' },
		{ iso_code: 'PNG', country: 'Papua New Guinea' },
		{ iso_code: 'PRY', country: 'Paraguay' },
		{ iso_code: 'PER', country: 'Peru' },
		{ iso_code: 'PHL', country: 'Philippines' },
		{ iso_code: 'PCN', country: 'Pitcairn' },
		{ iso_code: 'POL', country: 'Poland' },
		{ iso_code: 'PRT', country: 'Portugal' },
		{ iso_code: 'PRI', country: 'Puerto Rico' },
		{ iso_code: 'QAT', country: 'Qatar' },
		{ iso_code: 'REU', country: 'Réunion' },
		{ iso_code: 'ROU', country: 'Romania' },
		{ iso_code: 'RUS', country: 'Russian Federation' },
		{ iso_code: 'RWA', country: 'Rwanda' },
		{ iso_code: 'BLM', country: 'Saint-Barthélemy' },
		{ iso_code: 'SHN', country: 'Saint Helena' },
		{ iso_code: 'KNA', country: 'Saint Kitts and Nevis' },
		{ iso_code: 'LCA', country: 'Saint Lucia' },
		{ iso_code: 'MAF', country: 'Saint-Martin (French part)' },
		{ iso_code: 'SPM', country: 'Saint Pierre and Miquelon' },
		{ iso_code: 'VCT', country: 'Saint Vincent and Grenadines' },
		{ iso_code: 'WSM', country: 'Samoa' },
		{ iso_code: 'SMR', country: 'San Marino' },
		{ iso_code: 'STP', country: 'Sao Tome and Principe' },
		{ iso_code: 'SAU', country: 'Saudi Arabia' },
		{ iso_code: 'SEN', country: 'Senegal' },
		{ iso_code: 'SRB', country: 'Serbia' },
		{ iso_code: 'SYC', country: 'Seychelles' },
		{ iso_code: 'SLE', country: 'Sierra Leone' },
		{ iso_code: 'SGP', country: 'Singapore' },
		{ iso_code: 'SVK', country: 'Slovakia' },
		{ iso_code: 'SVN', country: 'Slovenia' },
		{ iso_code: 'SLB', country: 'Solomon Islands' },
		{ iso_code: 'SOM', country: 'Somalia' },
		{ iso_code: 'ZAF', country: 'South Africa' },
		{ iso_code: 'SGS', country: 'South Georgia and the South Sandwich Islands' },
		{ iso_code: 'SSD', country: 'South Sudan' },
		{ iso_code: 'ESP', country: 'Spain' },
		{ iso_code: 'LKA', country: 'Sri Lanka' },
		{ iso_code: 'SDN', country: 'Sudan' },
		{ iso_code: 'SUR', country: 'Suriname *' },
		{ iso_code: 'SJM', country: 'Svalbard and Jan Mayen Islands' },
		{ iso_code: 'SWZ', country: 'Swaziland' },
		{ iso_code: 'SWE', country: 'Sweden' },
		{ iso_code: 'CHE', country: 'Switzerland' },
		{ iso_code: 'SYR', country: 'Syrian Arab Republic (Syria)' },
		{ iso_code: 'TWN', country: 'Taiwan, Republic of China' },
		{ iso_code: 'TJK', country: 'Tajikistan' },
		{ iso_code: 'TZA', country: 'Tanzania *, United Republic of' },
		{ iso_code: 'THA', country: 'Thailand' },
		{ iso_code: 'TLS', country: 'Timor-Leste' },
		{ iso_code: 'TGO', country: 'Togo' },
		{ iso_code: 'TKL', country: 'Tokelau' },
		{ iso_code: 'TON', country: 'Tonga' },
		{ iso_code: 'TTO', country: 'Trinidad and Tobago' },
		{ iso_code: 'TUN', country: 'Tunisia' },
		{ iso_code: 'TUR', country: 'Turkey' },
		{ iso_code: 'TKM', country: 'Turkmenistan' },
		{ iso_code: 'TCA', country: 'Turks and Caicos Islands' },
		{ iso_code: 'TUV', country: 'Tuvalu' },
		{ iso_code: 'UGA', country: 'Uganda' },
		{ iso_code: 'UKR', country: 'Ukraine' },
		{ iso_code: 'ARE', country: 'United Arab Emirates' },
		{ iso_code: 'GBR', country: 'United Kingdom' },
		{ iso_code: 'USA', country: 'United States of America' },
		{ iso_code: 'UMI', country: 'United States Minor Outlying Islands' },
		{ iso_code: 'URY', country: 'Uruguay' },
		{ iso_code: 'UZB', country: 'Uzbekistan' },
		{ iso_code: 'VUT', country: 'Vanuatu' },
		{ iso_code: 'VEN', country: 'Venezuela (Bolivarian Republic of)' },
		{ iso_code: 'VNM', country: 'Viet Nam' },
		{ iso_code: 'VIR', country: 'Virgin Islands, US' },
		{ iso_code: 'WLF', country: 'Wallis and Futuna Islands' },
		{ iso_code: 'ESH', country: 'Western Sahara' },
		{ iso_code: 'YEM', country: 'Yemen' },
		{ iso_code: 'ZMB', country: 'Zambia' },
		{ iso_code: 'ZWE', country: 'Zimbabwe' },
	];
	var usStates = [
		{ name: 'ALABAMA', abbreviation: 'AL'},
		{ name: 'ALASKA', abbreviation: 'AK'},
		{ name: 'AMERICAN SAMOA', abbreviation: 'AS'},
		{ name: 'ARIZONA', abbreviation: 'AZ'},
		{ name: 'ARKANSAS', abbreviation: 'AR'},
		{ name: 'CALIFORNIA', abbreviation: 'CA'},
		{ name: 'COLORADO', abbreviation: 'CO'},
		{ name: 'CONNECTICUT', abbreviation: 'CT'},
		{ name: 'DELAWARE', abbreviation: 'DE'},
		{ name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
		{ name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
		{ name: 'FLORIDA', abbreviation: 'FL'},
		{ name: 'GEORGIA', abbreviation: 'GA'},
		{ name: 'GUAM', abbreviation: 'GU'},
		{ name: 'HAWAII', abbreviation: 'HI'},
		{ name: 'IDAHO', abbreviation: 'ID'},
		{ name: 'ILLINOIS', abbreviation: 'IL'},
		{ name: 'INDIANA', abbreviation: 'IN'},
		{ name: 'IOWA', abbreviation: 'IA'},
		{ name: 'KANSAS', abbreviation: 'KS'},
		{ name: 'KENTUCKY', abbreviation: 'KY'},
		{ name: 'LOUISIANA', abbreviation: 'LA'},
		{ name: 'MAINE', abbreviation: 'ME'},
		{ name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
		{ name: 'MARYLAND', abbreviation: 'MD'},
		{ name: 'MASSACHUSETTS', abbreviation: 'MA'},
		{ name: 'MICHIGAN', abbreviation: 'MI'},
		{ name: 'MINNESOTA', abbreviation: 'MN'},
		{ name: 'MISSISSIPPI', abbreviation: 'MS'},
		{ name: 'MISSOURI', abbreviation: 'MO'},
		{ name: 'MONTANA', abbreviation: 'MT'},
		{ name: 'NEBRASKA', abbreviation: 'NE'},
		{ name: 'NEVADA', abbreviation: 'NV'},
		{ name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
		{ name: 'NEW JERSEY', abbreviation: 'NJ'},
		{ name: 'NEW MEXICO', abbreviation: 'NM'},
		{ name: 'NEW YORK', abbreviation: 'NY'},
		{ name: 'NORTH CAROLINA', abbreviation: 'NC'},
		{ name: 'NORTH DAKOTA', abbreviation: 'ND'},
		{ name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
		{ name: 'OHIO', abbreviation: 'OH'},
		{ name: 'OKLAHOMA', abbreviation: 'OK'},
		{ name: 'OREGON', abbreviation: 'OR'},
		{ name: 'PALAU', abbreviation: 'PW'},
		{ name: 'PENNSYLVANIA', abbreviation: 'PA'},
		{ name: 'PUERTO RICO', abbreviation: 'PR'},
		{ name: 'RHODE ISLAND', abbreviation: 'RI'},
		{ name: 'SOUTH CAROLINA', abbreviation: 'SC'},
		{ name: 'SOUTH DAKOTA', abbreviation: 'SD'},
		{ name: 'TENNESSEE', abbreviation: 'TN'},
		{ name: 'TEXAS', abbreviation: 'TX'},
		{ name: 'UTAH', abbreviation: 'UT'},
		{ name: 'VERMONT', abbreviation: 'VT'},
		{ name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
		{ name: 'VIRGINIA', abbreviation: 'VA'},
		{ name: 'WASHINGTON', abbreviation: 'WA'},
		{ name: 'WEST VIRGINIA', abbreviation: 'WV'},
		{ name: 'WISCONSIN', abbreviation: 'WI'},
		{ name: 'WYOMING', abbreviation: 'WY' }
	];

	return {
		goTo: function (path,search) {
			$location.path(path).search('type',search);
		}, userInfo: {
			
		}, getDashboardStats: function(){
			return $http.get(API_URL+'/admin/dashboard-stats').then(function(response){
				return response.data;
			});
		}, usStates: usStates, countries: countries
	};
	
  });
