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
        --phase --{Insert Name/Number} (--phase2 --{Insert Name/Number})
        Sets the Moon Phase to the name/number you input (second phase for Eberron)
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
	buttonSmall: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 75px;',
	buttonMedium: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;',
	buttonLarge: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;',
	table: 'style="text-align:center; font-size: 12px; width: 100%; border-style: 3px solid #cccccc;"',
	arrow: 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"',
	header: 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"',
	sub: 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"',
	tdReg: 'style="text-align: right;"',
	trTab: 'style="text-align: left; border-bottom: 1px solid #cccccc;"',
	tdTab: 'style="text-align: center; border-right: 1px solid #cccccc;"',
	span: 'style="display: inline; width: 10px; height: 10px; padding: 1px; border: 1px solid black; background-color: white;"',
};

const moonPhases = ['Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent', 'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous'];

const monthNames = [
	['Hammer', 'Alturiak', 'Ches', 'Tarsakh', 'Mirtul', 'Kythorn', 'Flamerule', 'Eleasis', 'Eleint', 'Marpenoth', 'Uktar', 'Nightal'],
	['Zarantyr', 'Olarune', 'Therendor', 'Eyre', 'Dravago', 'Nymm', 'Lharvion', 'Barrakas', 'Rhaan', 'Sypheros', 'Aryth', 'Vult'],
	['Fireseek', 'Readying', 'Coldeven', 'Planting', 'Flocktime', 'Wealsun', 'Reaping', 'Goodmonth', 'Harvester', 'Patchwall', "Ready'reat", 'Sunsebb'],
	['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	['Horisal', 'Misuthar', 'Dualahei', 'Thunsheer', 'Unndilar', 'Brussendar', 'Sydenstar', 'Fessuran', "Quen'pillar", 'Cuersaar', 'Duscar'],
];

class MultiWorldCalendar {
	constructor() {
		this.style = styles;
		this.world = 0;
		this.default = [state.mwcal.faerun, state.mwcal.eberron, state.mwcal.greyhawk, state.mwcal.modern, state.mwcal.talDorei];
		this.moons = moonPhases;
		this.months = monthNames;
		this.alarms = state.alarms;
		this.worlds = ['faerun', 'eberron', 'greyhawk', 'modern', 'talDorei'];
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
		case 0:
			state.mwcal[world].ord = 30 * (state.mwcal[world].month - 1) + state.mwcal[world].day;
			break;
		case 1:
			state.mwcal[world].ord = 28 * (state.mwcal[world].month - 1) + state.mwcal[world].day;
			break;
		case 2:
			state.mwcal[world].ord = 28 * (state.mwcal[world].month - 1) + state.mwcal[world].day;
			break;
		case 3:
			const modernDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			state.mwcal[world].ord = modernDays.slice(0, state.mwcal[world].month - 1).reduce((a, b) => a + b, 0) + state.mwcal[world].day;
			break;
		case 4:
			const talDays = [29, 30, 30, 31, 28, 31, 32, 29, 27, 29, 32];
			state.mwcal[world].ord = talDays.slice(0, state.mwcal[world].month - 1).reduce((a, b) => a + b, 0) + state.mwcal[world].day;
			break;
	}
}

function setWorld(world) {
	mwcal.world = mwcal.worlds.indexOf(world.toLowerCase());
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

function updDate() {
	const world = mwcal.world;
	const ordinal = state.mwcal[world].ord;

	let date, month;

	switch (world) {
		case 0:
			if (Math.ceil(ordinal / 30) <= 1) {
				month = monthNames[0][0];
				date = ordinal;
			} else {
				month = monthNames[0][Math.ceil(ordinal / 30) - 1];
				date = ordinal - (Math.ceil(ordinal / 30) - 1) * 30;
			}
			break;
		case 1:
			if (Math.ceil(ordinal / 28) <= 1) {
				month = monthNames[1][0];
				date = ordinal;
			} else {
				month = monthNames[1][Math.ceil(ordinal / 28) - 1];
				date = ordinal - (Math.ceil(ordinal / 28) - 1) * 28;
			}
			break;
		case 2:
			if (Math.ceil(ordinal / 28) <= 1) {
				month = monthNames[2][0];
				date = ordinal;
			} else {
				month = monthNames[2][Math.ceil(ordinal / 28) - 1];
				date = ordinal - (Math.ceil(ordinal / 28) - 1) * 28;
			}
			break;
		case 3:
			const modernDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			const modDay = modernDays[state.mwcal[world].month - 1];

			if (Math.ceil(ordinal / modernDays[state.mwcal[world].month - 1]) <= 1) {
				month = monthNames[3][0];
				date = ordinal;
			} else {
				month = monthNames[3][Math.ceil(ordinal / modDay) - 1];
				date = ordinal - (Math.ceil(ordinal / modDay) - 1) * modDay;
			}
			break;
		case 4:
			const talDays = [29, 30, 30, 31, 28, 31, 32, 29, 27, 29, 32];
			const talDay = talDays[state.mwcal[world].month - 1];

			if (Math.ceil(ordinal / talDay) <= 1) {
				month = monthNames[4][0];
				date = ordinal;
			} else {
				month = monthNames[4][Math.ceil(ordinal / talDay) - 1];
				date = ordinal - (Math.ceil(ordinal / talDay) - 1) * talDay;
			}
			break;
	}

	setMonth(month);
	setDay(date);
}

function setDay(day) {
	state.mwcal[mwcal.world].day = day;
}

function getMonth() {
	const month = state.mwcal[mwcal.world].month;
	return monthNames[mwcal.world][month - 1];
}

function setMonth(month) {
	const months = monthNames[mwcal.world];
	state.mwcal[mwcal.world].month = months.indexOf(month) + 1;
}

function setYear(year) {
	state.mwcal[mwcal.world].year = year;
}

function getHour() {
	if (state.mwcal[mwcal.world].hour < 10) return `0${state.mwcal[mwcal.world].hour}`;
	return state.mwcal[mwcal.world].hour;
}

function setHour(hour) {
	state.mwcal[mwcal.world].hour = hour;
}

function getMinute() {
	if (state.mwcal[mwcal.world].minute < 10) return `0${state.mwcal[mwcal.world].minute}`;
	return state.mwcal[mwcal.world].minute;
}

function setMinute(minute) {
	state.mwcal[mwcal.world].minute = minute;
}

function updMoon(phase, phase2) {
	if (!phase) {
		const ordinal = state.mwcal[mwcal.world].ord;
		const year = state.mwcal[mwcal.world].year;
		const remainder = year / 4 - Math.floor(year / 4);

		let moonArray = [];

		switch (mwcal.world) {
			default:
				switch (remainder) {
					default:
						moonArray = getMoonArray(1);
						break;
					case 0.25:
						moonArray = getMoonArray(2);
						break;
					case 0.5:
						moonArray = getMoonArray(3);
						break;
					case 0.75:
						moonArray = getMoonArray(4);
						break;
				}

				const moonNum = moonArray.split(',');
				getMoon(moonNum[ordinal % 8]);
				break;
			case 1:
				moonArray = getMoonArray();
				const lunaNum = moonArray[0].split(',');
				const celeneNum = moonArray[1].split(',');
				getMoon(lunaNum[ordinal % 8], celeneNum[ordinal % 8]);
				break;
		}
	} else {
		if (phase2) {
			state.mwcal[mwcal.world].moon = `Luna: ${phase}, Celene: ${phase2}`;
		} else {
			state.mwcal[mwcal.world].moon = phase;
		}
	}
}

function getMoonArray(num) {
	let moonArray;

	switch (mwcal.world) {
		default:
			switch (num) {
				case 1:
					moonArray =
						'0,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,4,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1';
					break;
				case 2:
					moonArray =
						'0,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1';
					break;
				case 3:
					moonArray =
						'0,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,0,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1';
					break;
				case 4:
					moonArray =
						'0,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,3,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,16,16,1,2,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,0,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16,1,2,2,3,3,4,4,5,6,6,7,7,7,8,8,9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16,1,2,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16';
					break;
			}
			break;
		case 1:
			moonArray = [
				'0,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7,7,8,8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,1,2,2,3,4,4,5,5,6,6,7',
				'0,16,16,16,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,5,6,6,6,6,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,8,8,9,9,10,10,10,10,10,10,10,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,13,14,14,14,14,14,14,14,15,15,15,15,15,15,15,16,16,16,16,16,16,16,16,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,5,6,6,6,6,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,8,8,9,9,10,10,10,10,10,10,10,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,13,14,14,14,14,14,14,14,15,15,15,15,15,15,15,16,16,16,16,16,16,16,16,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,5,6,6,6,6,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,8,8,9,9,10,10,10,10,10,10,10,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,13,14,14,14,14,14,14,14,15,15,15,15,15,15,15,16,16,16,16,16,16,16,16,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,5,6,6,6,6,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,8,8,9,9,10,10,10,10,10,10,10,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,13,14,14,14,14,14,14,14,15,15,15,15,15,15,15,16,16,16,16,16',
			];
			break;
	}

	return moonArray;
}

function getMoon(num, num2) {
	if (num2) {
		updMoon(getMoonPhase(num), getMoonPhase(num2));
	} else {
		updMoon(getMoonPhase(num));
	}
}

function getMoonPhase(input) {
	if (!isNaN(input)) {
		input = Number(input);
		if (input >= 0 && input <= 16) return moonPhases[Math.floor((input + 1) / 2)];
	} else if (typeof input === 'string') {
		const lowerCaseInput = input.toLowerCase();
		const index = moonPhases.findIndex(phase => phase.toLowerCase() === lowerCaseInput);
		if (index !== -1) return moonPhases[index];
	}
	return undefined;
}

function randomizeWeather() {
	let temp, wind, season, precip;
	const ordinal = state.mwcal[mwcal.world].ord;

	switch (ordinal) {
		case ordinal > 330 || ordinal <= 75:
			season = 'Winter';
			break;
		case ordinal <= 170:
			season = 'Spring';
			break;
		case ordinal <= 260:
			season = 'Summer';
			break;
		case ordinal <= 330:
			season = 'Fall';
			break;
	}

	let rand = randomInteger(21);

	switch (rand) {
		case rand >= 15 && rand <= 17:
			wind = 'the wind is blowing strongly ';

			switch (season) {
				case 'Winter':
					temp = 'It is a bitterly cold winter day, ';
					break;
				case 'Spring':
					temp = 'It is a cold spring day, ';
					break;
				case 'Summer':
					temp = 'It is a cool summer day, ';
					break;
				case 'Fall':
					temp = 'It is a cold fall day, ';
					break;
			}
			break;
		case rand >= 18 && rand <= 20:
			wind = 'the wind is blowing gently ';

			switch (season) {
				case 'Winter':
					temp = 'It is a mild winter day, ';
					break;
				case 'Spring':
					temp = 'It is a hot spring day, ';
					break;
				case 'Summer':
					temp = 'It is a blisteringly hot summer day, ';
					break;
				case 'Fall':
					temp = 'It is a hot fall day, ';
					break;
			}
			break;
		default:
			wind = 'there is no wind ';
			switch (season) {
				case 'Winter':
					temp = 'It is a cold winter day, ';
					break;
				case 'Spring':
					temp = 'It is a warm spring day, ';
					break;
				case 'Summer':
					temp = 'It is a hot summer day, ';
					break;
				case 'Fall':
					temp = 'It is a cool fall day, ';
					break;
			}
			break;
	}

	rand = randomInteger(21);

	switch (rand) {
		case rand >= 15 && rand <= 17:
			switch (season) {
				case 'Winter':
					precip = 'and snow falls softly from the sky.';
					break;
				default:
					precip = 'and it is raining lightly.';
					break;
			}
			break;
		case rand >= 18 && rand <= 20:
			switch (season) {
				case 'Winter':
					precip = 'and snow falls heavily from the sky.';
					break;
				default:
					precip = 'and a torrential rain is falling.';
					break;
			}
			break;
		default:
			switch (randomInteger(2)) {
				case 1:
					precip = 'and the sky is clear.';
					break;
				default:
					precip = 'and the sky is overcast.';
					break;
			}
			break;
	}

	state.mwcal[mwcal.world].weather = `${temp}${wind}${precip}`;
}

function toggleWeather() {
	state.mwcal[mwcal.world].wtype = !state.mwcal[mwcal.world].wtype;
}

function toggleMoon() {
	state.mwcal[mwcal.world].mtype = !state.mwcal[mwcal.world].mtype;
}

function calendarMenu() {
	updDate();

	const suffix = getSuffix();
	const day = state.mwcal[mwcal.world].day;
	const month = getMonth();
	const year = state.mwcal[mwcal.world].year;
	const hour = getHour();
	const minute = getMinute();
	const weather = state.mwcal[mwcal.world].wtype ? state.mwcal[mwcal.world].weather : null;
	const moon = state.mwcal[mwcal.world].mtype ? state.mwcal[mwcal.world].moon : null;
	const months = mwcal.months[mwcal.world].join('|');

	switch (weather) {
		default:
			switch (moon) {
				default:
					switch (mwcal.world) {
						default:
							sendChat(
								'Multi-World Calendar',
								`/w gm <div ${mwcal.style.divMenu}>` + //--
								`<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
								`<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
								`<div ${mwcal.style.arrow}></div>` + //--
								`<table>` + //--
								`<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Moon: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --moon --phase --?{Phase?|${mwcal.moons[mwcal.world].join('|')}}">${moon}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Weather: </td><td ${mwcal.style.tdReg}>${weather}</td></tr>` + //--
								`</table>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --advance --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year}">Advance Time</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather --toggle">Toggle Weather Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon --toggle">Toggle Moon Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather">Randomize Weather</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon">Randomize Moon Phase</a></div>` + //--
								`<br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm">Open Alarm Menu</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --show">Show to Players</a></div>` + //--
								`<br><br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --reset">Reset Calendar</a></div>` + //--
								`</div>`
							);
							break;
						case 1:
							sendChat(
								'Multi-World Calendar',
								`/w gm <div ${mwcal.style.divMenu}>` + //--
								`<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
								`<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
								`<div ${mwcal.style.arrow}></div>` + //--
								`<table>` + //--
								`<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Moon: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --moon --phase --?{Phase?|${mwcal.moons.join('|')}} --phase2 --?{Phase?|${mwcal.moons.join('|')}}">${moon}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Weather: </td><td ${mwcal.style.tdReg}>${weather}</td></tr>` + //--
								`</table>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --advance --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year}">Advance Time</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather --toggle">Toggle Weather Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon --toggle">Toggle Moon Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather">Randomize Weather</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon">Randomize Moon Phase</a></div>` + //--
								`<br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm">Open Alarm Menu</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --show">Show to Players</a></div>` + //--
								`<br><br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --reset">Reset Calendar</a></div>` + //--
								`</div>`
							);
							break;
					}
					break;
				case null:
					switch (mwcal.world) {
						default:
							sendChat(
								'Multi-World Calendar',
								`/w gm <div ${mwcal.style.divMenu}>` + //--
								`<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
								`<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
								`<div ${mwcal.style.arrow}></div>` + //--
								`<table>` + //--
								`<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Weather: </td><td ${mwcal.style.tdReg}>${weather}</td></tr>` + //--
								`</table>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --advance --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year}">Advance Time</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather --toggle">Toggle Weather Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon --toggle">Toggle Moon Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather">Randomize Weather</a></div>` + //--
								`<br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm">Open Alarm Menu</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --show">Show to Players</a></div>` + //--
								`<br><br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --reset">Reset Calendar</a></div>` + //--
								`</div>`
							);
							break;
						case 1:
							sendChat(
								'Multi-World Calendar',
								`/w gm <div ${mwcal.style.divMenu}>` + //--
								`<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
								`<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
								`<div ${mwcal.style.arrow}></div>` + //--
								`<table>` + //--
								`<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Weather: </td><td ${mwcal.style.tdReg}>${weather}</td></tr>` + //--
								`</table>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --advance --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year}">Advance Time</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather --toggle">Toggle Weather Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon --toggle">Toggle Moon Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather">Randomize Weather</a></div>` + //--
								`<br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm">Open Alarm Menu</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --show">Show to Players</a></div>` + //--
								`<br><br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --reset">Reset Calendar</a></div>` + //--
								`</div>`
							);
							break;
					}
					break;
			}
			break;
		case null:
			switch (moon) {
				default:
					switch (mwcal.world) {
						default:
							sendChat(
								'Multi-World Calendar',
								`/w gm <div ${mwcal.style.divMenu}>` + //--
								`<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
								`<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
								`<div ${mwcal.style.arrow}></div>` + //--
								`<table>` + //--
								`<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Moon: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --moon --phase --?{Phase?|${mwcal.moons[mwcal.world].join('|')}}">${moon}</a></td></tr>` + //--
								`</table>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --advance --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year}">Advance Time</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather --toggle">Toggle Weather Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon --toggle">Toggle Moon Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon">Randomize Moon Phase</a></div>` + //--
								`<br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm">Open Alarm Menu</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --show">Show to Players</a></div>` + //--
								`<br><br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --reset">Reset Calendar</a></div>` + //--
								`</div>`
							);
							break;
						case 1:
							sendChat(
								'Multi-World Calendar',
								`/w gm <div ${mwcal.style.divMenu}>` + //--
								`<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
								`<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
								`<div ${mwcal.style.arrow}></div>` + //--
								`<table>` + //--
								`<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Moon: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --moon --phase --?{Phase?|${mwcal.moons.join('|')}} --phase2 --?{Phase?|${mwcal.moons.join('|')}}">${moon}</a></td></tr>` + //--
								`</table>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --advance --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year}">Advance Time</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather --toggle">Toggle Weather Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon --toggle">Toggle Moon Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon">Randomize Moon Phase</a></div>` + //--
								`<br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm">Open Alarm Menu</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --show">Show to Players</a></div>` + //--
								`<br><br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --reset">Reset Calendar</a></div>` + //--
								`</div>`
							);
							break;
					}
					break;
				case null:
					switch (mwcal.world) {
						default:
							sendChat(
								'Multi-World Calendar',
								`/w gm <div ${mwcal.style.divMenu}>` + //--
								`<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
								`<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
								`<div ${mwcal.style.arrow}></div>` + //--
								`<table>` + //--
								`<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
								`</table>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --advance --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year}">Advance Time</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather --toggle">Toggle Weather Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon --toggle">Toggle Moon Display</a></div>` + //--
								`<br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm">Open Alarm Menu</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --show">Show to Players</a></div>` + //--
								`<br><br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --reset">Reset Calendar</a></div>` + //--
								`</div>`
							);
							break;
						case 1:
							sendChat(
								'Multi-World Calendar',
								`/w gm <div ${mwcal.style.divMenu}>` + //--
								`<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
								`<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
								`<div ${mwcal.style.arrow}></div>` + //--
								`<table>` + //--
								`<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
								`<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
								`</table>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --advance --?{Amount?|1} --?{Type?|Short Rest|Long Rest|Minute|Hour|Day|Week|Month|Year}">Advance Time</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --weather --toggle">Toggle Weather Display</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --moon --toggle">Toggle Moon Display</a></div>` + //--
								`<br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm">Open Alarm Menu</a></div>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --show">Show to Players</a></div>` + //--
								`<br><br>` + //--
								`<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal --reset">Reset Calendar</a></div>` + //--
								`</div>`
							);
							break;
					}
					break;
			}
			break;
	}
}
