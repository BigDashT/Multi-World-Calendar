/*
Calendar for Eberron, Faerun, Greyhawk, Modern and Tal'Dorei Settings
Original by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Rewritten by Julexar (https://app.roll20.net/users/9989180/julexar)

GM Commands:
!mwcal
Displays the Calendar Menu
    --world --{Eberron|Faerun|Greyhawk|Modern|Tal'Dorei}
    Switches the calendar to the selected world
    --setday --{Insert Number}
    Sets the current day to the number you input
    --setmonth --{Insert Number}
    Sets the current month to the number you input
    --setyear --{Insert Number}
    Sets the current year to the number you input
    --settime --hour --{Insert Number} --minute --{Insert Number}
    Sets the current time to the numbers you input
    --advance --{Insert Number} --{short rest, long rest, hour, minute, day, week, month, year}
    Advances the calendar by the number/type you input
    --weather
    Randomises the Weather
        --toggle
        Toggles the Weather Display
    --moon
    Resets the Moon Phase
        --phase --{Insert Name/Number}
        Sets the Moon Phase to the name/number you input
        --toggle
        Toggles the Moon Display
    --show
    Displays the Calendar to the Players
    --reset
    Resets the Calendar to the Default Values

!month --{Insert Name/Number} --{Insert Name}
Renames a Month to the Name you input

!alarm
Displays the Alarm Menu
    --{Insert Number}
    Displays the Alarm Menu for the Alarm you input
        --settitle --{Insert Title}
        Sets the Title of the Alarm
        --setdate --{Insert Date}
        Sets the Date of the Alarm (Format: DD.MM.YYYY)
        --settime --{Insert Time}
        Sets the Time of the Alarm (Format: HH:MM [24h])
        --setmessage --{Insert Message}
        Sets the Message of the Alarm
    --new
    Opens the Alarm Creator
        --title --{Insert Title}
        Sets the Title of the Alarm
        --date --{Insert Date}
        Sets the Date of the Alarm (Format: DD.MM.YYYY)
        --time --{Insert Time}
        Sets the Time of the Alarm (Format: HH:MM [24h])
        --message --{Insert Message}
    --delete --{Insert Number}
    Deletes the Alarm you input
    --reset
    Resets the Alarms to the Default Values

Player Commands:
!mwcal
Displays the Calendar to the Players
*/

const styles = {
	divMenu: 'style="width: 300px; border: 1px solid black; background-color: #ffffff; padding: 5px;"',
	divButton: 'style="text-align:center;"',
	buttonSmall:
		'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 75px;',
	buttonMedium:
		'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;',
	buttonLarge:
		'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;',
	table: 'style="text-align:center; font-size: 12px; width: 100%; border-style: 3px solid #cccccc;"',
	arrow: 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"',
	header: 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"',
	sub: 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"',
	tdReg: 'style="text-align: right;"',
	trTab: 'style="text-align: left; border-bottom: 1px solid #cccccc;"',
	tdTab: 'style="text-align: center; border-right: 1px solid #cccccc;"',
	span: 'style="display: inline; width: 10px; height: 10px; padding: 1px; border: 1px solid black; background-color: white;"',
};

const moonPhases = [
	'Full Moon',
	'Waning Gibbous',
	'Last Quarter',
	'Waning Crescent',
	'New Moon',
	'Waxing Crescent',
	'First Quarter',
	'Waxing Gibbous',
];

const monthNames = {
	faerun: ['Hammer', 'Alturiak', 'Ches', 'Tarsakh', 'Mirtul', 'Kythorn', 'Flamerule', 'Eleasis', 'Eleint', 'Marpenoth', 'Uktar', 'Nightal'],
	eberron: ['Zarantyr', 'Olarune', 'Therendor', 'Eyre', 'Dravago', 'Nymm', 'Lharvion', 'Barrakas', 'Rhaan', 'Sypheros', 'Aryth', 'Vult'],
	greyhawk: [
		'Needfest',
		'Fireseek',
		'Readying',
		'Coldeven',
		'Growfest',
		'Planting',
		'Flocktime',
		'Wealsun',
		'Richfest',
		'Reaping',
		'Goodmonth',
		'Harvester',
	],
	modern: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	talDorei: [
		'Horisal',
		'Misuthar',
		'Dualahei',
		'Brussendar',
		'Sydenstar',
		'Fessuran',
		"Quen'pillar",
		'Cuersaar',
		'Duscar',
		'Brisar',
		'Brussendar',
		'Sydenstar',
	],
};

class MultiWorldCalendar {
	constructor() {
		this.style = styles;
		this.world = 0;
		this.default = [state.mwcal.faerun, state.mwcal.eberron, state.mwcal.greyhawk, state.mwcal.modern, state.mwcal.talDorei];
		this.moons = moonPhases;
		this.months = monthNames;
		this.alarms = state.alarms;
	}
}

const mwcal = new MultiWorldCalendar();

function setMWCalDefaults() {
	state.mwcal = {
		faerun: {
			name: 'Faerun',
			ord: 1,
			year: 1486,
			day: 1,
			month: 1,
			hour: 1,
			minute: 0,
			weather: 'It is a cool but sunny day',
			moon: 'Full Moon',
			mtype: true,
			wtype: true,
		},
		eberron: {
			name: 'Eberron',
			ord: 1,
			year: 998,
			day: 1,
			month: 1,
			hour: 1,
			minute: 0,
			weather: 'It is a cool but sunny day',
			moon: 'Luna: Full, Celene: Full',
			mtype: true,
			wtype: true,
		},
		greyhawk: {
			name: 'Greyhawk',
			ord: 1,
			year: 591,
			day: 1,
			month: 1,
			hour: 1,
			minute: 0,
			weather: 'It is a cool but sunny day',
			moon: 'Full Moon',
			mtype: true,
			wtype: true,
		},
		modern: {
			name: 'Modern',
			ord: 1,
			year: 2020,
			day: 1,
			month: 1,
			hour: 1,
			minute: 0,
			weather: 'It is a cool but sunny day',
			moon: 'Full Moon',
			mtype: true,
			wtype: true,
		},
		talDorei: {
			name: "Tal'Dorei",
			ord: 1,
			year: 812,
			day: 1,
			month: 1,
			hour: 1,
			minute: 0,
			weather: 'It is a cool but sunny day',
			moon: 'Full Moon',
			mtype: true,
			wtype: true,
		},
	};

	log('Multi-World Calendar: Successfully registered Calendar defaults!');
}

function setAlarmDefaults() {
	state.alarms = [];

	log('Multi-World Calendar: Successfully registered Alarm defaults!');
}

function updOrdinal() {
	switch (mwcal.world) {
		case 1:
			state.mwcal[world].ord = 30 * (state.mwcal[world].month - 1) + state.mwcal[world].day;
			break;
		case 2:
			state.mwcal[world].ord = 28 * (state.mwcal[world].month - 1) + state.mwcal[world].day;
			break;
		case 3:
			state.mwcal[world].ord = 28 * (state.mwcal[world].month - 1) + state.mwcal[world].day;
			break;
		case 4:
			const modernDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			state.mwcal[world].ord = modernDays.slice(0, state.mwcal[world].month - 1).reduce((a, b) => a + b, 0) + state.mwcal[world].day;
			break;
		case 5:
			const talDays = [29, 30, 30, 31, 28, 31, 32, 29, 27, 29, 32];
			state.mwcal[world].ord = talDays.slice(0, state.mwcal[world].month - 1).reduce((a, b) => a + b, 0) + state.mwcal[world].day;
			break;
	}
}

function setWorld(world) {
	const worlds = ['faerun', 'eberron', 'greyhawk', 'modern', 'talDorei'];
	mwcal.world = worlds.indexOf(world.toLowerCase());
}

function getSuffix() {
	const ordinal = state.mwcal[mwcal.world].ord;

	if (ordinal >= 11 && ordinal <= 13) return 'th';

	switch (ordinal % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}
