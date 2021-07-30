/* ////////////////////////////////////////////////////////////////////////////// */
/* ////////////////////////////////////////////////////////////////////// VAR /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* --------------------------------------------------------------------- TIME --- */
var MS_HOUR = 3600000;
var MS_DAY = 86400000;

/* ////////////////////////////////////////////////////////////////////////////// */
/* ///////////////////////////////////////////////////////////////// DOCUMENT /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* -------------------------------------------------------------------- READY --- */
$(init);

/* --------------------------------------------------------------------- INIT --- */
function init() {
	// browser
	browser_init();
	
	// time
	time_init();

	// theme
	theme_init();
}


/* ////////////////////////////////////////////////////////////////////////////// */
/* ////////////////////////////////////////////////////////////////// BROWSER /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* --------------------------------------------------------------------- INIT --- */
function browser_init() {
	// vh
	browser_vh();
	
	// load
	browser_load();

	// resize
	browser_resize();
}

/* ----------------------------------------------------------------------- VH --- */
function browser_vh() {
	// listen for resize
	$(window).on('resize', function() {
		var vh;

		// single viewport unit
		vh = ($(window).innerHeight() * 0.01);

		// set custom root --vh property
		$(':root').css('--vh', [vh, 'px',].join(''));
	}).trigger('resize');
}

/* --------------------------------------------------------------------- LOAD --- */
function browser_load() {
	// remove load class
	setTimeout(function() { $('html').removeClass('browser_load'); }, 32);
}

/* ------------------------------------------------------------------- RESIZE --- */
function browser_resize() {
	var timer;

	// listen for resize
	$(window).on('resize', function() {
		// destroy timer
		clearTimeout(timer);

		// debounce
		timer = setTimeout(function() {
			// remove resize class
			$('html').removeClass('browser_resize');
		}, 320);

		// add resize class
		$('html').addClass('browser_resize');
	});
}


/* ////////////////////////////////////////////////////////////////////////////// */
/* ///////////////////////////////////////////////////////////////////// TIME /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* --------------------------------------------------------------------- INIT --- */
function time_init() {
	// process
	setInterval(time_process, 40);
}

/* ------------------------------------------------------------------ PROCESS --- */
function time_process() {
	var now = {},
		d;

	// store current date
	d = new Date();

	// determine now
	now.year = d.getFullYear();
	now.month = d.getMonth();
	now.weekday = d.getDay();
	now.day = d.getDate();
	now.hour = d.getHours();
	now.time = d.getTime();

	// loop through cell
	$('main .cell').not('.title').each(function() {
		var $cell;
		var value;
		
		// cache element
		$cell = $(this);

		// hour
		if ($cell.is('.hour')) value = time_process_hour($cell, now);
		// day
		else if ($cell.is('.day')) value = time_process_day($cell, now);
		// week
		else if ($cell.is('.week')) value = time_process_week($cell, now);
		// month
		else if ($cell.is('.month')) value = time_process_month($cell, now);
		// year
		else if ($cell.is('.year')) value = time_process_year($cell, now);
		// decade
		else if ($cell.is('.decade')) value = time_process_decade($cell, now);
		// century
		else if ($cell.is('.century')) value = time_process_century($cell, now);
		// millenium
		else if ($cell.is('.millenium')) value = time_process_millenium($cell, now);

		// percent
		time_percent($cell, value);
	});
}

/* ----------------------------------------------------------- PROCESS : HOUR --- */
function time_process_hour(cell, now) {
	var $cell,
		$stat;
	var output = {},
		time = {};
		
	// cache elements
	$cell = $(cell);
	$stat = $cell.find('.stat');

	// process time
	time.start = new Date(now.year, now.month, now.day, now.hour).getTime();
	time.end = (time.start + MS_HOUR);
	time.diff = (now.time - time.start);
	time.value = (time.diff / MS_HOUR);

	// format output
	output.millisecond = Math.round((time.end - now.time));
	output.second = Math.floor((output.millisecond / 1000));
	output.minute = Math.floor((output.second / 60));

	// render output
	$stat.find('.millisecond').html(format_number(output.millisecond));
	$stat.find('.second').html(format_number(output.second));
	$stat.find('.minute').html(format_number(output.minute));

	return time.value;
}

/* ------------------------------------------------------------ PROCESS : DAY --- */
function time_process_day(cell, now) {
	var $cell,
		$stat;
	var output = {},
		time = {};
		
	// cache elements
	$cell = $(cell);
	$stat = $cell.find('.stat');

	// process time
	time.start = new Date(now.year, now.month, now.day).getTime();
	time.end = (time.start + MS_DAY);
	time.diff = (now.time - time.start);
	time.value = (time.diff / MS_DAY);

	// format output
	output.second = Math.floor(((time.end - now.time) * (1 / 1000)));
	output.minute = Math.floor((output.second / 60));
	output.hour = Math.floor((output.minute / 60));

	// render output
	$stat.find('.second').html(format_number(output.second));
	$stat.find('.minute').html(format_number(output.minute));
	$stat.find('.hour').html(format_number(output.hour));

	return time.value;
}

/* ----------------------------------------------------------- PROCESS : WEEK --- */
function time_process_week(cell, now) {
	var $cell,
		$stat;
	var output = {},
		time = {},
		tmp;
		
	// cache elements
	$cell = $(cell);
	$stat = $cell.find('.stat');

	// process time
	if (now.weekday === 0) {
		tmp = (now.day - 6);
		if (tmp >= 0) time.start = new Date(now.year, now.month, tmp).getTime();
		else time.start = (new Date(now.year, now.month).getTime() - (MS_DAY * (tmp * -1)));
	}
	else if (now.weekday === 1) {
		time.start = new Date(now.year, now.month, now.day).getTime();
	}
	else {
		tmp = ((now.day - now.weekday) + 1);
		if (tmp >= 0) time.start = new Date(now.year, now.month, tmp).getTime();
		else time.start = (new Date(now.year, now.month).getTime() - (MS_DAY * (tmp * -1)));
	}
	time.end = (time.start + (MS_DAY * 7));
	time.diff = (now.time - time.start);
	time.value = (time.diff / (time.end - time.start));

	// format output
	output.second = Math.floor(((time.end - now.time) * (1 / 1000)));
	output.minute = Math.floor((output.second / 60));
	output.hour = Math.floor((output.minute / 60));
	output.day = Math.floor((output.hour / 24));

	// render output
	$stat.find('.minute').html(format_number(output.minute));
	$stat.find('.hour').html(format_number(output.hour));
	$stat.find('.day').html(format_number(output.day));

	return time.value;
}

/* ---------------------------------------------------------- PROCESS : MONTH --- */
function time_process_month(cell, now) {
	var $cell,
		$stat;
	var output = {},
		time = {};

	// cache elements
	$cell = $(cell);
	$stat = $cell.find('.stat');

	// process time
	time.start = new Date(now.year, now.month).getTime();
	if (now.month === 11) time.end = new Date((now.year + 1), 0).getTime();
	else time.end = new Date(now.year, (now.month + 1)).getTime();
	time.diff = (now.time - time.start);
	time.value = (time.diff / (time.end - time.start));

	// format output
	output.second = Math.floor(((time.end - now.time) * (1 / 1000)));
	output.minute = Math.floor((output.second / 60));
	output.hour = Math.floor((output.minute / 60));
	output.day = Math.floor((output.hour / 24));

	// render output
	$stat.find('.minute').html(format_number(output.minute));
	$stat.find('.hour').html(format_number(output.hour));
	$stat.find('.day').html(format_number(output.day));

	return time.value;
}

/* ----------------------------------------------------------- PROCESS : YEAR --- */
function time_process_year(cell, now) {
	var $cell,
		$stat;
	var output = {},
		time = {},
		tmp;

	// cache elements
	$cell = $(cell);
	$stat = $cell.find('.stat');

	// process time
	if ((now.year % 4) === 0) tmp = 366;
	else tmp = 365;
	time.start = new Date(now.year, 0).getTime();
	time.end = new Date((now.year + 1), 0).getTime();
	time.diff = (now.time - time.start);
	time.value = (time.diff / (time.end - time.start));

	// format output
	output.second = Math.floor(((time.end - now.time) * (1 / 1000)));
	output.minute = Math.floor((output.second / 60));
	output.hour = Math.floor((output.minute / 60));
	output.day = Math.floor((output.hour / 24));
	output.week = Math.floor(output.day / 7);
	output.month = Math.floor(output.day / 30);
	
	// render output
	$stat.find('.day').html(format_number(output.day));
	$stat.find('.week').html(format_number(output.week));
	$stat.find('.month').html(format_number(output.month));

	return time.value;
}

/* --------------------------------------------------------- PROCESS : DECADE --- */
function time_process_decade(cell, now) {
	var $cell,
		$stat;
	var output = {},
		time = {},
		tmp;

	// cache elements
	$cell = $(cell);
	$stat = $cell.find('.stat');

	// process time
	tmp = parseInt(now.year.toString().substr(-1));
	if (tmp === 0) {
		time.start = new Date((now.year - 9), 0).getTime();
		time.end = new Date((now.year + 1), 0).getTime();
	} else if (tmp === 1) {
		time.start = new Date(now.year, 0).getTime();
		time.end = new Date((now.year + 10), 0).getTime();
	} else {
		time.start = new Date((now.year - (tmp - 1)), 0).getTime();
		time.end = new Date((now.year + (11 - tmp)), 0).getTime();
	}
	time.diff = (now.time - time.start);
	time.value = (time.diff / (time.end - time.start));

	// format output
	output.second = Math.floor(((time.end - now.time) * (1 / 1000)));
	output.minute = Math.floor((output.second / 60));
	output.hour = Math.floor((output.minute / 60));
	output.day = Math.floor((output.hour / 24));
	output.week = Math.floor(output.day / 7);
	output.month = Math.floor(output.day / 30);
	output.year = Math.floor(output.month / 12);

	// render output
	$stat.find('.week').html(format_number(output.week));
	$stat.find('.month').html(format_number(output.month));
	$stat.find('.year').html(format_number(output.year));

	return time.value;
}

/* -------------------------------------------------------- PROCESS : CENTURY --- */
function time_process_century(cell, now) {
	var $cell,
		$stat;
	var output = {},
		time = {};

	// cache elements
	$cell = $(cell);
	$stat = $cell.find('.stat');

	// process time
	time.start = new Date(2001, 0).getTime();
	time.end = new Date(2101, 0).getTime();
	time.diff = (now.time - time.start);
	time.value = (time.diff / (time.end - time.start));

	// format output
	output.second = Math.floor(((time.end - now.time) * (1 / 1000)));
	output.minute = Math.floor((output.second / 60));
	output.hour = Math.floor((output.minute / 60));
	output.day = Math.floor((output.hour / 24));
	output.week = Math.floor(output.day / 7);
	output.month = Math.floor(output.day / 30);
	output.year = Math.floor(output.month / 12);
	output.decade = Math.floor(output.year / 10);

	// render output
	$stat.find('.month').html(format_number(output.month));
	$stat.find('.year').html(format_number(output.year));
	$stat.find('.decade').html(format_number(output.decade));

	return time.value;
}

/* ------------------------------------------------------ PROCESS : MILLENIUM --- */
function time_process_millenium(cell, now) {
	var $cell,
		$stat;
	var output = {},
		time = {};

	// cache elements
	$cell = $(cell);
	$stat = $cell.find('.stat');

	// process time
	time.start = 2001;
	time.end = 3001;
	time.diff = (now.year - time.start);
	time.value = (time.diff / 1000);

	// format output
	output.year = (time.end - now.year);
	output.decade = Math.floor((output.year / 10));
	output.century = Math.floor((output.decade / 10));

	// render output
	$stat.find('.year').html(format_number(output.year));
	$stat.find('.decade').html(format_number(output.decade));
	$stat.find('.century').html(format_number(output.century));

	return time.value;
}

/* ------------------------------------------------------------------ PERCENT --- */
function time_percent($cell, value) {
	var percent,
		rotate,
		width;

	// calculate percent
	percent = Math.round((value * 100));

	// format output
	rotate = (((360 / 100)) * percent);
	width = percent;

	// render output
	$cell.find('.chart').css('--rotate', rotate);
	$cell.find('.percent').html(percent);
	$cell.find('.progress .fill').css('--width', width);
}


/* ////////////////////////////////////////////////////////////////////////////// */
/* //////////////////////////////////////////////////////////////////// THEME /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* --------------------------------------------------------------------- INIT --- */
function theme_init() {
	// prepare
	theme_prepare();

	// toggle
	theme_toggle();

	// select
	theme_select();
}

/* ------------------------------------------------------------------ PREPARE --- */
function theme_prepare() {
	var theme,
		key;

	// build storage key
	key = [location.host, 'theme',].join(':');

	// retrieve theme
	theme = localStorage.getItem(key);

	// validate theme
	if (theme === null || typeof theme === 'undefined') theme = 'grey';

	// add theme class
	$('html').addClass(['theme', theme,].join('_'));
}

/* ------------------------------------------------------------------- TOGGLE --- */
function theme_toggle() {
	// listen for click
	$('.theme a.toggle').on('click', function() {
		var $theme;

		// cache element
		$theme = $(this).closest('.theme');

		// toggle active class
		$theme.toggleClass('active');
	});
}

/* ------------------------------------------------------------------- SELECT --- */
function theme_select() {
	// listen for click
	$('.theme .list a.color').on('click', function() {
		var $theme;
		var theme,
			key;

		// cache element
		$color = $(this);
		$theme = $color.closest('.theme');

		// theme key
		theme = $color.attr('data-theme-key');

		// build storage key
		key = [location.host, 'theme',].join(':');

		// store theme
		localStorage.setItem(key, theme);

		// toggle theme class
		$('html').removeClass(function(_, name) { return (name.match(/(^|\s)theme\S+/g) || []).join(' '); });
		$('html').addClass(['theme', theme,].join('_'));

		// remove active class
		$theme.removeClass('active');
	});
}


/* ////////////////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////// FORMAT /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* ------------------------------------------------------------------- NUMBER --- */
function format_number(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
