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
    divMenu: 'style="width: 200px; border: 1px solid black; background-color: #ffffff; padding: 5px;"',
    divButton: 'style="text-align:center;"',
    buttonSmall: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 75px;',
    buttonMedium: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;',
    buttonLarge: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;',
    table: 'style="text-align:center; font-size: 12px; width: 100%; border-style: 3px solid #cccccc;"',
    arrow: 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"',
    header: 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"',
    sub: 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"',
    tdReg: 'style="padding: 2px; padding-left: 5px; border: none;"',
    trTab: 'style="text-align: left; border-bottom: 1px solid #cccccc;"',
    tdTab: 'style="text-align: center; border-right: 1px solid #cccccc;"',
    span: 'style="display: inline; width: 10px; height: 10px; padding: 1px; border: 1px solid black; background-color: white;"',
};

const moonPhases = ['Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent', 'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous'];

const monthNames = [
    ['Hammer', 'Alturiak', 'Ches', 'Tarsakh', 'Mirtul', 'Kythorn', 'Flamerule', 'Eleasis', 'Eleint', 'Marpenoth', 'Uktar', 'Nightal'],
    ['Zarantyr', 'Olarune', 'Therendor', 'Eyre', 'Dravago', 'Nymm', 'Lharvion', 'Barrakas', 'Rhaan', 'Sypheros', 'Aryth', 'Vult'],
    ['Needfest', 'Fireseek', 'Readying', 'Coldeven', 'Growfest', 'Planting', 'Flocktime', 'Wealsun', 'Richfest', 'Reaping', 'Goodmonth', 'Harvester', 'Brewfest', 'Patchwall', 'Ready\'reat', 'Sunsebb'],
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ['Horisal', 'Misuthar', 'Dualahei', 'Thunsheer', 'Unndilar', 'Brussendar', 'Sydenstar', 'Fessuran', "Quen'pillar", 'Cuersaar', 'Duscar'],
];

const daysInMonths = [
    Array(12).fill(30), // Faerun
    Array(12).fill(28), // Eberron
    [7, 28, 28, 28, 7, 28, 28, 28, 7, 28, 28, 28, 7, 28, 28, 28], // Greyhawk
    (year) => [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // Modern
    [29, 30, 30, 31, 28, 31, 32, 29, 27, 29, 32], // Tal'Dorei
];

function isLeapYear(year) {
    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
}

function getDaysInMonth(world, month, year) {
    if (world === 3) {
        return daysInMonths[3](year)[month - 1];
    }
    return daysInMonths[world][month - 1];
}

function daysInYear(world, year) {
    switch (world) {
        case 0: return 360;
        case 1: return 336;
        case 2: return 364;
        case 3: return isLeapYear(year) ? 366 : 365;
        case 4: return 328;
    }
}

class MultiWorldCalendar {
    constructor() {
        this.style = styles;
        this.world = 0;
        this.moons = moonPhases;
        this.months = monthNames;
        this.worlds = ['Faerun', 'Eberron', 'Greyhawk', 'Modern', "Tal'Dorei"];
    }

    handleInput(msg) {
        const args = msg.content.split(/\s+--/);

        if (msg.type !== 'api') return;

        if (playerIsGM(msg.playerid)) {
            switch (args[0]) {
                case '!mwcal':
                    switch (args[1]) {
                        default:
                            chkAlarms();
                            calendarMenu();
                        break;
                        case 'setday':
                            const day = parseInt(args[2]);

                            if (isNaN(day)) return sendChat('Multi-World Calendar', '/w gm Syntax Error! Please input a valid number for the day.');

                            setDay(day);
                            chkAlarms();
                            calendarMenu();
                        break;
                        case 'setmonth':
                            const month = args[2];

                            if (!monthNames[mwcal.world].includes(month)) return sendChat('Multi-World Calendar', '/w gm Syntax Error! Please input a valid month.');

                            setMonth(month);
                            chkAlarms();
                            calendarMenu();
                        break;
                        case 'setyear':
                            const year = parseInt(args[2]);

                            if (isNaN(year)) return sendChat('Multi-World Calendar', '/w gm Syntax Error! Please input a valid number for the year.');

                            setYear(year);
                            chkAlarms();
                            calendarMenu();
                        break;
                        case 'settime':
                            const hour = parseInt(args[3]);
                            const minute = parseInt(args[5]);

                            if (isNaN(hour) || isNaN(minute)) return sendChat('Multi-World Calendar', '/w gm Syntax Error! Please input a valid number for the time.');

                            setHour(hour);
                            setMinute(minute);
                            chkAlarms();
                            calendarMenu();
                        break;
                        case 'advance':
                            const amount = parseInt(args[2]);
                            const type = args[3];

                            if (isNaN(amount)) return sendChat('Multi-World Calendar', '/w gm Syntax Error! Please input a valid number for the amount.');
                            if (!['Short Rest', 'Long Rest', 'Hour', 'Minute', 'Day', 'Week', 'Month', 'Year'].includes(type)) return sendChat('Multi-World Calendar', '/w gm Syntax Error! Please input a valid type.');

                            advance(amount, type);
                            chkAlarms();
                            calendarMenu();
                        break;
                        case 'weather':
                            if (args[2] === 'toggle') {
                                toggleWeather()
                                calendarMenu();
                            } else {
                                randomizeWeather();
                                calendarMenu();
                            }
                        break;
                        case 'moon':
                            if (args[2] === 'toggle') {
                                toggleMoon();
                                calendarMenu();
                            } else {
                                const phase = args[2];
                                const phase2 = args[4];

                                updMoon(phase, phase2);
                                calendarMenu();
                            }
                        break;
                        case 'world':
                            if (!args[2] || !mwcal.worlds.find(w => w.toLowerCase() === args[2].toLowerCase())) return sendChat('Multi-World Calendar', '/w gm Invalid World! Please input a valid world.');

                            setWorld(args[2]);
                            chkAlarms();
                            calendarMenu();
                        break;
                        case 'show':
                            showCalendar();
                        break;
                        case 'reset':
                            setMWCalDefaults();
                            calendarMenu();
                        break;
                    }
                break;
                case '!month':
                    setMonthName(args[1], args[2]);
                break;
                case '!alarm':
                    switch (args[1]) {
                        case undefined:
                            alarmMenu();
                        break;
                        default:
                            const num = parseInt(args[1]);

                            if (isNaN(num)) return sendChat('Multi-World Calendar', 'Please input a valid number for the alarm.');

                            switch (args[2]) {
                                case 'settitle':
                                    setTitle(num, args[3]);
                                break;
                                case 'setdate':
                                    setDate(num, args[3]);
                                break;
                                case 'settime':
                                    setTime(num, args[3]);
                                break;
                                case 'setmessage':
                                    setMessage(num, args[3]);
                                break;
                                case 'setpause':
                                    const pause = args[3] === 'Yes';
                                    state.alarms[mwcal.world][num].pauseOnTrigger = pause;
                                    sendChat('Multi-World Calendar', `/w gm Alarm #${num} pause on trigger set to ${pause ? 'Yes' : 'No'}`);
                                break;
                                case 'setwhisper':
                                    const whisper = args[3] === 'Yes';
                                    state.alarms[mwcal.world][num].whisperToGM = whisper;
                                    sendChat('Multi-World Calendar', `/w gm Alarm #${num} whisper to GM set to ${whisper ? 'Yes' : 'No'}`);
                                break;
                            }

                            alarmMenu(num);
                        break;
                        case 'new':
                            if (args[3] === '' || args[3] === ' ') return sendChat('Multi-World Calendar', '/w gm Invalid Syntax! The name of a created Alarm may not be empty!');
                            let date = args[5].split('.');
                            if (!date || isNaN(parseInt(date[0])) || isNaN(parseInt(date[1])) || isNaN(parseInt(date[2]))) return sendChat('Multi-World Calendar', '/w gm Invalid Syntax! The Date must be formatted correctly and must contain numbers!');
                            let time = args[7] ? args[7].split(':') : null;
                            if (time && (isNaN(parseInt(time[0])) || isNaN(parseInt(time[1])))) return sendChat('Multi-World Calendar', '/w gm Invalid Syntax! The Time must be formatted correctly and must contain numbers!');
                            
                            createAlarm(args[3], args[5], args[7], args[9]);
                        break;
                        case 'delete':
                            deleteAlarm(args[2]);
                            alarmMenu();
                        break;
                        case 'reset':
                            setAlarmDefaults();
                            sendChat('Multi-World Calendar', '/w gm Successfully reset all existing Alarms!');
                            alarmMenu();
                        break;
                    }
                break;
            }
        } else {
            if (args[0] === '!mwcal') {
                showCalendar();
            }
        }
    }

    checkInstall() {
        if (!state.check) {
            state.check = true;
            setMWCalDefaults();
            setAlarmDefaults();
        }

        if (!state.mwcal) {
            setMWCalDefaults();
        }

        if (!state.alarms) {
            setAlarmDefaults();
        }
    }

    registerEventHandlers() {
        on('chat:message', this.handleInput);
        log('Multi-World Calendar - Registered Event Handlers!');
    }
}

const mwcal = new MultiWorldCalendar();

function setMWCalDefaults() {
    state.mwcal = [
        {
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
        {
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
        {
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
        {
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
        {
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
    ];

    log('Multi-World Calendar - Successfully registered Calendar Defaults!');
}

function setAlarmDefaults() {
    state.alarms = [
        [],
        [],
        [],
        [],
        []
    ];

    log('Multi-World Calendar - Successfully registered Alarm Defaults!');
}

function updOrdinal() {
    const world = mwcal.world;
    const year = state.mwcal[world].year;
    let sum = 0;
    for (let m = 1; m < state.mwcal[world].month; m++) {
        sum += getDaysInMonth(world, m, year);
    }
    state.mwcal[world].ord = sum + state.mwcal[world].day;
}

function clampDay() {
    const world = mwcal.world;
    const year = state.mwcal[world].year;
    const month = state.mwcal[world].month;
    const maxDays = getDaysInMonth(world, month, year);
    if (state.mwcal[world].day > maxDays) state.mwcal[world].day = maxDays;
    if (state.mwcal[world].day < 1) state.mwcal[world].day = 1;
}

function setWorld(world) {
    if (!(mwcal.worlds.find(w => w.toLowerCase() === world.toLowerCase()))) return sendChat('Multi-World Calendar', 'Invalid World. Please make sure to either use the correct Name!');

    mwcal.world = mwcal.worlds.findIndex(w => w.toLowerCase() === world.toLowerCase());
}

function getSuffix() {
    const day = state.mwcal[mwcal.world].day;

    if (day >= 11 && day <= 13) return 'th';

    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

function updDate() {
    const world = mwcal.world;
    let ordinal = state.mwcal[world].ord;
    let year = state.mwcal[world].year;

    // Wrap years if ordinal overflows
    while (ordinal > daysInYear(world, year)) {
        ordinal -= daysInYear(world, year);
        year++;
    }

    let remaining = ordinal;
    let m = 1;
    while (remaining > getDaysInMonth(world, m, year)) {
        remaining -= getDaysInMonth(world, m, year);
        m++;
    }

    state.mwcal[world].month = m;
    state.mwcal[world].day = remaining;
    state.mwcal[world].year = year;
    updOrdinal();
}

function setDay(day) {
    state.mwcal[mwcal.world].day = day;
    clampDay();
    updOrdinal();
}

function getMonth() {
    const month = state.mwcal[mwcal.world].month;
    return mwcal.months[mwcal.world][month-1];
}

function setMonth(month) {
    const months = mwcal.months[mwcal.world];
    state.mwcal[mwcal.world].month = months.indexOf(month) + 1;
    clampDay();
    updOrdinal();
}

function setMonthName(month, name) {
    const monnum = mwcal.months[mwcal.world].indexOf(month)
    mwcal.months[mwcal.world][monnum] = name;
    monthNames = mwcal.months;
}

function setYear(year) {
    state.mwcal[mwcal.world].year = year;
    clampDay();
    updOrdinal();
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

    if (ordinal > 325 || ordinal <= 70) season = 'Winter';
    else if (ordinal <= 165) season = 'Spring';
    else if (ordinal <= 255) season = 'Summer';
    else if (ordinal <= 325) season = 'Fall';
    

    let rand = randomInteger(21);

    if (rand >= 15 && rand <= 17) {
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
    } else if (rand >= 18 && rand <= 20) {
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
    } else if (rand < 15) {
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
    }

    rand = randomInteger(21);
    
    if (rand <= 15 && rand <= 17) {
        switch (season) {
            case 'Winter':
                precip = 'and snow falls softly from the sky.';
            break;
            default:
                precip = 'and it is raining lightly.';
            break;
        }
    } else if (rand >= 18 && rand <= 20) {
        switch (season) {
            case 'Winter':
                precip = 'and snow falls heavily from the sky.';
            break;
            default:
                precip = 'and a torrential rain is falling.';
            break;
        }
    } else if (rand < 15) {
        switch (randomInteger(2)) {
            case 1:
                precip = 'and the sky is clear.';
            break;
            default:
                precip = 'and the sky is overcast.';
            break;
        }
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
                            sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
                                `<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
                                `<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
                                `<div ${mwcal.style.arrow}></div>` + //--
                                `<table>` + //--
                                `<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Moon: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --moon --phase --?{Phase?|${mwcal.moons.join('|')}}">${moon}</a></td></tr>` + //--
                                `</table>` + //--
                                `<div>Weather: <br>${weather}</div>` + //--
                                `<br><br>` + //--
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
                            sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
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
                                `<tr><td ${mwcal.style.tdReg}>Weather: </td></tr>` + //--
                                `</table>` + //--
                                `<div>${weather}</div>` + //--
                                `<br><br>` + //--
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
                            sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
                                `<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
                                `<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
                                `<div ${mwcal.style.arrow}></div>` + //--
                                `<table>` + //--
                                `<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Weather: </td></tr>` + //--
                                `</table>` + //--
                                `<div>${weather}</div>` + //--
                                `<br><br>` + //--
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
                            sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
                                `<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
                                `<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
                                `<div ${mwcal.style.arrow}></div>` + //--
                                `<table>` + //--
                                `<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Weather: </td></tr>` + //--
                                `</table>` + //--
                                `<div>${weather}</div>` + //--
                                `<br><br>` + //--
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
                            sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
                                `<div ${mwcal.style.header}>Multi-World Calendar</div>` + //--
                                `<div ${mwcal.style.sub}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
                                `<div ${mwcal.style.arrow}></div>` + //--
                                `<table>` + //--
                                `<tr><td ${mwcal.style.tdReg}>World: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --world --?{World?|${mwcal.worlds.join('|')}}">${state.mwcal[mwcal.world].name}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Day: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setday --?{Day?|${day}}">${day}${suffix}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Month: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setmonth --?{Month?|${months}}">${month}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Year: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --setyear --?{Year?|${year}}">${year}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --settime --hour --?{Hour?|${hour}} --minute --?{Minute?|${minute}}">${hour}:${minute}</a></td></tr>` + //--
                                `<tr><td ${mwcal.style.tdReg}>Moon: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!mwcal --moon --phase --?{Phase?|${mwcal.moons.join('|')}}">${moon}</a></td></tr>` + //--
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
                            sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
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

function showCalendar() {
    updDate();

    const suffix = getSuffix();
    const day = state.mwcal[mwcal.world].day;
    const month = getMonth();
    const year = state.mwcal[mwcal.world].year;
    const hour = getHour();
    const minute = getMinute();
    const weather = state.mwcal[mwcal.world].wtype ? state.mwcal[mwcal.world].weather : null;
    const moon = state.mwcal[mwcal.world].mtype ? state.mwcal[mwcal.world].moon : null;

    switch (weather) {
        default:
            switch (moon) {
                default:
                    sendChat('Multi-World Calendar', `<div ${mwcal.style.divMenu}>` + //--
                        `<div ${mwcal.style.header}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
                        `<div ${mwcal.style.sub}>Player View</div>` + //--
                        `<div ${mwcal.style.arrow}></div>` + //--
                        `${day}${suffix} of ${month}, ${year}` + //--
                        `<br>Current Time: ${hour}:${minute}` + //--
                        `<br>Today\'s Weather: ${weather}<br>` + //--
                        `<br>Moon Phase: ${moon}` + //--
                        `</div>`
                    );
                break;
                case null:
                    sendChat('Multi-World Calendar', `<div ${mwcal.style.divMenu}>` + //--
                        `<div ${mwcal.style.header}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
                        `<div ${mwcal.style.sub}>Player View</div>` + //--
                        `<div ${mwcal.style.arrow}></div>` + //--
                        `${day}${suffix} of ${month}, ${year}` + //--
                        `<br>Current Time: ${hour}:${minute}` + //--
                        `<br>Today\'s Weather: ${weather}<br>` + //--
                        `</div>`
                    );
                break;
            }
        break;
        case null:
            switch (moon) {
                default:
                    sendChat('Multi-World Calendar', `<div ${mwcal.style.divMenu}>` + //--
                        `<div ${mwcal.style.header}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
                        `<div ${mwcal.style.sub}>Player View</div>` + //--
                        `<div ${mwcal.style.arrow}></div>` + //--
                        `${day}${suffix} of ${month}, ${year}` + //--
                        `<br>Current Time: ${hour}:${minute}` + //--
                        `<br>Moon Phase: ${moon}` + //--
                        `</div>`
                    );
                break;
                case null:
                    sendChat('Multi-World Calendar', `<div ${mwcal.style.divMenu}>` + //--
                        `<div ${mwcal.style.header}>${state.mwcal[mwcal.world].name} Calendar</div>` + //--
                        `<div ${mwcal.style.sub}>Player View</div>` + //--
                        `<div ${mwcal.style.arrow}></div>` + //--
                        `${day}${suffix} of ${month}, ${year}` + //--
                        `<br>Current Time: ${hour}:${minute}` + //--
                        `</div>`
                    );
                break;
            }
        break;
    }
}

function compareDates(aY, aM, aD, aH = 0, aMin = 0, bY, bM, bD, bH = 0, bMin = 0) {
  if (aY !== bY) return aY - bY;
  if (aM !== bM) return aM - bM;
  if (aD !== bD) return aD - bD;
  if (aH !== bH) return aH - bH;
  return aMin - bMin;
}

function advance(amount, type) {
  let world = mwcal.world;
  let currentState = {
    year: state.mwcal[world].year,
    month: state.mwcal[world].month,
    day: state.mwcal[world].day,
    ord: state.mwcal[world].ord,
    hour: state.mwcal[world].hour,
    minute: state.mwcal[world].minute
  };

  // Compute target by cloning and applying advance
  let targetState = {...currentState};
  let tOrdinal = targetState.ord;
  let tMonth = targetState.month;
  let tYear = targetState.year;
  let tHour = targetState.hour;
  let tMinute = targetState.minute;

  switch (type.toLowerCase()) {
    case 'short rest':
      tHour += amount;
      break;
    case 'long rest':
      tHour += amount * 8;
      break;
    case 'minute':
      tMinute += amount;
      break;
    case 'hour':
      tHour += amount;
      break;
    case 'day':
      tOrdinal += amount;
      break;
    case 'week':
      tOrdinal += amount * 7;
      break;
    case 'month':
      for (let k = 0; k < amount; k++) {
        tMonth++;
        if (tMonth > monthNames[world].length) {
          tMonth = 1;
          tYear++;
        }
      }
      let maxDay = getDaysInMonth(world, tMonth, tYear);
      if (targetState.day > maxDay) targetState.day = maxDay;
      let sum = 0;
      for (let m = 1; m < tMonth; m++) {
        sum += getDaysInMonth(world, m, tYear);
      }
      tOrdinal = sum + targetState.day;
      break;
    case 'year':
      tYear += amount;
      let maxD = getDaysInMonth(world, tMonth, tYear);
      if (targetState.day > maxD) targetState.day = maxD;
      sum = 0;
      for (let m = 1; m < tMonth; m++) {
        sum += getDaysInMonth(world, m, tYear);
      }
      tOrdinal = sum + targetState.day;
      break;
  }

  // Normalize target time
  while (tMinute >= 60) {
    tHour++;
    tMinute -= 60;
  }
  while (tHour >= 24) {
    tOrdinal++;
    tHour -= 24;
  }
  // Normalize target ordinal
  while (tOrdinal > daysInYear(world, tYear)) {
    tOrdinal -= daysInYear(world, tYear);
    tYear++;
  }

  // Update target month/day from tOrdinal
  let tRemaining = tOrdinal;
  let tM = 1;
  while (tRemaining > getDaysInMonth(world, tM, tYear)) {
    tRemaining -= getDaysInMonth(world, tM, tYear);
    tM++;
  }
  targetState.month = tM;
  targetState.day = tRemaining;
  targetState.year = tYear;
  targetState.hour = tHour;
  targetState.minute = tMinute;
  targetState.ord = tOrdinal;

  // Find pause alarms in between current and target
  let pauseAlarms = [];
  state.alarms[world].forEach((alarm, index) => {
    if (alarm.pauseOnTrigger) {
      let aHour = alarm.hour !== undefined ? alarm.hour : 0;
      let aMinute = alarm.minute !== undefined ? alarm.minute : 0;
      if (compareDates(currentState.year, currentState.month, currentState.day, currentState.hour, currentState.minute, alarm.year, alarm.month, alarm.day, aHour, aMinute) < 0 &&
          compareDates(targetState.year, targetState.month, targetState.day, targetState.hour, targetState.minute, alarm.year, alarm.month, alarm.day, aHour, aMinute) >= 0) {
        pauseAlarms.push({alarm, index, hour: aHour, minute: aMinute});
      }
    }
  });

  if (pauseAlarms.length > 0) {
    // Sort by date/time to find earliest
    pauseAlarms.sort((a, b) => compareDates(a.alarm.year, a.alarm.month, a.alarm.day, a.hour, a.minute, b.alarm.year, b.alarm.month, b.alarm.day, b.hour, b.minute));
    const earliest = pauseAlarms[0].alarm;
    const eHour = pauseAlarms[0].hour;
    const eMinute = pauseAlarms[0].minute;

    // Set state to earliest pause alarm's date/time
    state.mwcal[world].year = earliest.year;
    state.mwcal[world].month = earliest.month;
    state.mwcal[world].day = earliest.day;
    state.mwcal[world].hour = eHour;
    state.mwcal[world].minute = eMinute;
    updOrdinal();
    updDate();
    sendChat('Multi-World Calendar', '/w gm Advance stopped at alarm time due to pause option. Run advance again to continue.');
  } else {
    // Apply full target
    state.mwcal[world].year = targetState.year;
    state.mwcal[world].month = targetState.month;
    state.mwcal[world].day = targetState.day;
    state.mwcal[world].hour = targetState.hour;
    state.mwcal[world].minute = targetState.minute;
    state.mwcal[world].ord = targetState.ord;
    updDate();
  }
}

function isPastOrPresent(alarm) {
  const c = state.mwcal[mwcal.world];
  if (alarm.year < c.year) return true;
  if (alarm.year > c.year) return false;
  if (alarm.month < c.month) return true;
  if (alarm.month > c.month) return false;
  if (alarm.day < c.day) return true;
  if (alarm.day > c.day) return false;
  if (alarm.hour === undefined) return true;
  if (alarm.hour < c.hour) return true;
  if (alarm.hour > c.hour) return false;
  if (alarm.minute <= c.minute) return true;
  return false;
}

function alarmMenu(num) {
    const list = [];
    
    if (isNaN(num)) {
        if (state.alarms[mwcal.world].length === 0) {
            sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
                `<div ${mwcal.style.header}>Alarm Menu</div>` + //--
                `<div ${mwcal.style.sub}>${mwcal.worlds[mwcal.world]}</div>` + //--
                `<div ${mwcal.style.arrow}></div>` + //--
                `<div ${mwcal.style.divButton}>No Alarms set</div>` + //--
                `<br><br>` + //--
                `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm --new --title --?{Title?|Insert Title} --date --?{Date?|DD.MM.YYYY} --time --?{Time (24h)?|HH:MM} --message --?{Message?|Insert Message}">Create Alarm</a></div>` + //--
                `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal">Open Calendar</a></div>` + //--
                `</div>`
            );
        } else {
            for (let i=0; i<state.alarms[mwcal.world].length; i++) {
                list.push(i);
            }

            const alarmList = list.join('|');
            log(alarmList);

            sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
                `<div ${mwcal.style.header}>Alarm Menu</div>` + //--
                `<div ${mwcal.style.sub}>${mwcal.worlds[mwcal.world]}</div>` + //--
                `<div ${mwcal.style.arrow}></div>` + //--
                `<table>` + //--
                `<tr><td ${mwcal.style.tdReg}>Alarm: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!alarm --?{Alarm?|${alarmList}}">Not selected</a></td></tr>` + //--
                `</table>` + //--
                `<br><br>` + //--
                `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm --new --title --?{Title?|Insert Title} --date --?{Date?|DD.MM.YYYY} --time --?{Time (24h)?|HH:MM} --message --?{Message?|Insert Message}">Create Alarm</a></div>` + //--
                `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal">Open Calendar</a></div>` + //--
                `</div>`
            );
        }
    } else {
        const alarm = state.alarms[mwcal.world][num];
        
        if (!alarm) {
            if (!state.alarms[mwcal.world]) {
                sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
                    `<div ${mwcal.style.header}>Alarm Menu</div>` + //--
                    `<div ${mwcal.style.sub}>${mwcal.worlds[mwcal.world]}</div>` + //--
                    `<div ${mwcal.style.arrow}></div>` + //--
                    `<div ${mwcal.style.divButton}>No Alarms set</div>` + //--
                    `<br><br>` + //--
                    `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm --new --title --?{Title?|Insert Title} --date --?{Date?|DD.MM.YYYY} --time --?{Time (24h)?|HH:MM} --message --?{Message?|Insert Message}">Create Alarm</a></div>` + //--
                    `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal">Open Calendar</a></div>` + //--
                    `</div>`
                );
            } else {
                for (let i=0; i<state.alarms[mwcal.world].length; i++) {
                    list.push(i);
                }
    
                const alarmList = list.join('|');
    
                sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
                    `<div ${mwcal.style.header}>Alarm Menu</div>` + //--
                    `<div ${mwcal.style.sub}>${mwcal.worlds[mwcal.world]}</div>` + //--
                    `<div ${mwcal.style.arrow}></div>` + //--
                    `<table>` + //--
                    `<tr><td ${mwcal.style.tdReg}>Alarm: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!alarm --?{Alarm?|${alarmList}}">Not selected</a></td></tr>` + //--
                    `</table>` + //--
                    `<br><br>` + //--
                    `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm --new --title --?{Title?|Insert Title} --date --?{Date?|DD.MM.YYYY} --time --?{Time (24h)?|HH:MM} --message --?{Message?|Insert Message}">Create Alarm</a></div>` + //--
                    `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal">Open Calendar</a></div>` + //--
                    `</div>`
                );
            }
        } else {
            for (let i=0; i<state.alarms[mwcal.world].length; i++) {
                list.push(i);
            }
    
            const alarmList = list.join('|');
    
            const title = alarm.title;
            const date = `${alarm.day}.${alarm.month}.${alarm.year}`;
            const time = alarm.hour !== undefined ? `${alarm.hour}:${alarm.minute}` : 'No time set';
            const splitDate = date.split('.');
            const splitTime = time.split(':');
            const message = alarm.message;
            const pause = alarm.pauseOnTrigger ? 'Yes' : 'No';
            const whisper = alarm.whisperToGM ? 'Yes' : 'No';
    
            sendChat('Multi-World Calendar', `/w gm <div ${mwcal.style.divMenu}>` + //--
                `<div ${mwcal.style.header}>Alarm Menu</div>` + //--
                `<div ${mwcal.style.arrow}></div>` + //--
                `<table>` + //--
                `<tr><td ${mwcal.style.tdReg}>Alarm: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!alarm --?{Alarm?|${alarmList}}">${title}</a></td></tr>` + //--
                `<tr><td ${mwcal.style.tdReg}>Title: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!alarm --${num} --settitle --?{Title?|${title}}">${title}</a></td></tr>` + //--
                `<tr><td ${mwcal.style.tdReg}>Date: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!alarm --${num} --setdate --?{Date|${date}}">${date}</a></td></tr>` + //--
                `<tr><td ${mwcal.style.tdReg}>Time: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!alarm --${num} --settime --?{Time|${time}}">${time}</a></td></tr>` + //--
                `<tr><td ${mwcal.style.tdReg}>Message: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!alarm --${num} --setmessage --?{Message?|${message}}">${message}</a></td></tr>` + //--
                `<tr><td ${mwcal.style.tdReg}>Pause on Trigger: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!alarm --${num} --setpause --?{Pause on trigger?|Yes|No}">${pause}</a></td></tr>` + //--
                `<tr><td ${mwcal.style.tdReg}>Whisper to GM: </td><td ${mwcal.style.tdReg}><a ${mwcal.style.buttonMedium}" href="!alarm --${num} --setwhisper --?{Whisper to GM?|Yes|No}">${whisper}</a></td></tr>` + //--
                `</table>` + //--
                `<br><br>` + //--
                `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm --new --title --?{Title?|Insert Title} --date --?{Date?|DD.MM.YYYY} --time --?{Time (24h)?|HH:MM} --message --?{Message?|Insert Message}">Create Alarm</a></div>` + //--
                `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!alarm --delete --${num}">Delete Alarm</a></div>` + //--
                `<div ${mwcal.style.divButton}><a ${mwcal.style.buttonLarge}" href="!mwcal">Open Calendar</a></div>` + //--
                `</div>`
            );
        }
    }
}

function createAlarm(title, dateStr, timeStr, message) {
    const splitDate = dateStr.split('.');
    const day = parseInt(splitDate[0]);
    const month = parseInt(splitDate[1]);
    const year = parseInt(splitDate[2]);
    const numMonths = monthNames[mwcal.world].length;
    const maxDays = getDaysInMonth(mwcal.world, month, year);

    if (isNaN(day) || isNaN(month) || isNaN(year) || year <= 0 || month < 1 || month > numMonths || day < 1 || day > maxDays) {
        return sendChat('Multi-World Calendar', '/w gm Invalid date! Year must be > 0, month 1-' + numMonths + ', day 1-' + maxDays + ' for the given month/year.');
    }

    let hour, minute;
    if (timeStr) {
        const splitTime = timeStr.split(':');
        hour = parseInt(splitTime[0]);
        minute = parseInt(splitTime[1]);
        if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            return sendChat('Multi-World Calendar', '/w gm Invalid time! Hour must be 0-23, minute 0-59.');
        }
    } // else hour/minute remain undefined for date-only alarm

    const alarm = {
        title: title,
        day: day,
        month: month,
        year: year,
        hour: hour,
        minute: minute,
        message: message,
        pauseOnTrigger: false,
        whisperToGM: false
    };

    state.alarms[mwcal.world].push(alarm);

    sendChat('Multi-World Calendar', `/w gm Alarm #${state.alarms[mwcal.world].length - 1} created!`)
    sendChat('Multi-World Calendar', `/w gm Title: ${title}, Date: ${dateStr}, Time: ${timeStr || 'No time set'}, Message: ${message}`);

    alarmMenu(state.alarms[mwcal.world].length - 1);
}

function setTitle(num, title) {
    if (!state.alarms[mwcal.world][num]) return sendChat('Multi-World Calendar', '/w gm Alarm does not exist!');
    state.alarms[mwcal.world][num].title = title;

    sendChat('Multi-World Calendar', `/w gm Alarm #${num} title set to "${title}"`);
}

function setDate(num, dateStr) {
    if (!state.alarms[mwcal.world][num]) return sendChat('Multi-World Calendar', '/w gm Alarm does not exist!');
    const splitDate = dateStr.split('.');
    const day = parseInt(splitDate[0]);
    const month = parseInt(splitDate[1]);
    const year = parseInt(splitDate[2]);
    const numMonths = monthNames[mwcal.world].length;
    const maxDays = getDaysInMonth(mwcal.world, month, year);

    if (isNaN(day) || isNaN(month) || isNaN(year) || year <= 0 || month < 1 || month > numMonths || day < 1 || day > maxDays) {
        return sendChat('Multi-World Calendar', '/w gm Invalid date! Year must be > 0, month 1-' + numMonths + ', day 1-' + maxDays + ' for the given month/year.');
    }

    state.alarms[mwcal.world][num].day = day;
    state.alarms[mwcal.world][num].month = month;
    state.alarms[mwcal.world][num].year = year;

    sendChat('Multi-World Calendar', `/w gm Alarm #${num} date set to ${dateStr}`);
}

function setTime(num, timeStr) {
    if (!state.alarms[mwcal.world][num]) return sendChat('Multi-World Calendar', '/w gm Alarm does not exist!');
    const splitTime = timeStr.split(':');
    const hour = parseInt(splitTime[0]);
    const minute = parseInt(splitTime[1]);

    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return sendChat('Multi-World Calendar', '/w gm Invalid time! Hour must be 0-23, minute 0-59.');
    }

    state.alarms[mwcal.world][num].hour = hour;
    state.alarms[mwcal.world][num].minute = minute;

    sendChat('Multi-World Calendar', `/w gm Alarm #${num} time set to ${timeStr}`);
}

function setMessage(num, message) {
    if (!state.alarms[mwcal.world][num]) return sendChat('Multi-World Calendar', '/w gm Alarm does not exist!');
    state.alarms[mwcal.world][num].message = message;

    sendChat('Multi-World Calendar', `/w gm Alarm #${num} message set to \"${message}\"`);
}

function deleteAlarm(num) {
    if (!state.alarms[mwcal.world][num]) return sendChat('Multi-World Calendar', '/w gm Alarm does not exist!');
    state.alarms[mwcal.world].splice(num, 1);

    sendChat('Multi-World Calendar', `/w gm Alarm #${num} deleted`);
}

function chkAlarms() {
    const alarms = state.alarms[mwcal.world];
    if (!alarms) return;

    const toDelete = [];
    alarms.forEach((alarm, index) => {
        if (isPastOrPresent(alarm)) {
            const timeStr = alarm.hour !== undefined ? `${alarm.hour}:${alarm.minute}` : 'No time set';
            const alarmMsg = `<div ${mwcal.style.divMenu}>` +
                `<div ${mwcal.style.header}>Alarm Triggered #${index}</div>` +
                `<div ${mwcal.style.arrow}></div>` +
                `Title: ${alarm.title}<br>` +
                `Date: ${alarm.day}.${alarm.month}.${alarm.year}<br>` +
                `Time: ${timeStr}<br>` +
                `Message: ${alarm.message}` +
                `</div>`;
            sendChat('Multi-World Calendar', alarm.whisperToGM ? `/w gm ${alarmMsg}` : alarmMsg);
            toDelete.push(index);
        }
    });

    // Delete in reverse to avoid index shifts
    toDelete.sort((a, b) => b - a).forEach(index => deleteAlarm(index));
}

on('ready', () => {
    mwcal.checkInstall();
    mwcal.registerEventHandlers();
});
