import { TwoDvector } from '../TwoDvector/TwoDvector';
import { TwoDmatrix } from '../TwoDmatrix/TwoDmatrix';
import { TwoDanimation } from '../TwoDanimation/TwoDanimation';

export class Clock
{
	/*
	Static
	*/
	
	/**
	 * Creates a clock instance and add it in the storage array
	 * @param UTChourOffset: the clock time zone's hour offset from UTC
	 * @param UTCminuteOffset: the clock time zone's minute offset from UTC
	 * @returns the created clock instance index, if any (-1 otherwise)
	 */
	public static Create(	UTChourOffset: number,
							UTCminuteOffset: number): number
	{
		// Check input hour and minute offsets are valid
		UTChourOffset = parseInt(UTChourOffset.toString());
		// Integer hour values in [-12, +14] allowed
		if (	isNaN(UTChourOffset)
			||	UTChourOffset < -12
			||	UTChourOffset > 14)
		{
			alert("Invalid hour offset to create clock.");
			return -1;
		}
		UTCminuteOffset = parseInt(UTCminuteOffset.toString());
		switch (UTCminuteOffset)
		{
			// 0, 30 and 45 minute values allowed
			case 0:
			case 30:
			case 45:
			{
				break;
			}
			default:
			{
				alert("Invalid minute offset to create clock.");
				return -1;
			}
		}
		
		const newClockIndex = Clock.instances.length;
		Clock.instances.push(new Clock(	newClockIndex,
										UTChourOffset,
										UTCminuteOffset));
		// Update time in clock display right away
		Clock.instances[newClockIndex].update();
		
		return newClockIndex;
	}
	
	/**
	 * Adds provided 2D animation to specified clock instance
	 * @param animation: the 2D animation to add
	 * @param clockIndex: the index of the clock instance to add the animation to
	 */
	public static addAnimation(animation: TwoDanimation, clockIndex: number): void
	{
		// Check clock index
		if (	clockIndex < 0
			||	clockIndex >= Clock.instances.length
			||	clockIndex != Math.floor(clockIndex))
		{
			alert("Invalid clock index to add an animation.")
		}
		else
		{
			Clock.instances[clockIndex].animations.push(animation);
		}
	}
	
	// The storage array of created clock instances
	private static readonly instances: Clock[] = [];
	
	// Size (in pixels) of a clock display (where time is written)
	private static readonly displayPixelWidth = 150;
	private static readonly displayPixelHeight = 40;
	// Thickness (in pixels) of border around clock display
	private static readonly displayBorderPixelThickness = 2;
	// Size (in pixels) of a clock button
	private static readonly buttonPixelWidth = 10;
	private static readonly buttonPixelHeight = 10;
	
	// Size (in pixels) of a clock background
	private static readonly backgroundPixelSize = 166;
	// Thickness (in pixels) of border around clock background
	private static readonly backgroundBorderPixelThickness = 2;
	
	// Size (in pixels) of a clock div in HTML document
	private static readonly divPixelWidth =
		Math.max(		Clock.backgroundPixelSize
					+	2 * Clock.backgroundBorderPixelThickness,
						Clock.displayPixelWidth
					+	2 * Clock.displayBorderPixelThickness
					+	2 * Clock.buttonPixelWidth);
	private static readonly divPixelHeight =
		Math.max(		Clock.backgroundPixelSize
					+	2 * Clock.backgroundBorderPixelThickness,
						Clock.displayPixelHeight
					+	2 * Clock.displayBorderPixelThickness
					+	Clock.buttonPixelHeight);
	
	/**
	 * Gets the x position in clock div (in pixels)
	 * of a button set at the right of the display
	 * @returns the x position
	 */
	private static getRightButtonX(): number
	{
		return (	Clock.buttonPixelWidth
				+	Clock.displayPixelWidth 
				+	2 * Clock.displayBorderPixelThickness);
	}
	
	/**
	 * Gets the y position in clock div (in pixels)
	 * of a button set at the top of the display
	 * @returns the y position
	 */
	private static getTopButtonY(): number
	{
		return (	(		Clock.divPixelHeight
						-	Clock.displayPixelHeight) / 2
					-	Clock.displayBorderPixelThickness);
	}
	
	/**
	 * Gets the y position in clock div (in pixels)
	 * of a button set at the bottom of the display
	 * @returns the y position
	 */
	private static getBottomButtonY(): number
	{
		return ((		Clock.divPixelHeight
					+	Clock.displayPixelHeight ) / 2
					+	Clock.displayBorderPixelThickness
				-	Clock.buttonPixelHeight);
	}
	
	/**
	 * Updates time in all created clock instances
	 */
	private static updateAllInstances(): void
	{
		for (let clock of Clock.instances)
		{
			clock.update();
		}
	}
	
	// The frame at at which the clocks are updated
	private static readonly updateFrameRate = 8;
	
	// Interval to update time and animation in all created clock instances at the same time
	private static readonly intervalId: ReturnType<typeof setInterval> =
		setInterval(Clock.updateAllInstances, 1000 / Clock.updateFrameRate);
	
	/*
	Instance
	*/
	
	// The clock time zone's offset to UTC (in minutes)
	private readonly UTCminuteOffset: number = 0;
	
	// The clock current edit mode
	// (0: no edit, 1: hour edit, 2: minute edit)
	private editModeIndex: number = 0;
	
	// The hour and minute offsets selected by user
	// (by pressing increase button in matching edit mode) 
	private userHourOffset: number = 0;
	private userMinuteOffset: number = 0;
	
	// The flag indicating whether light is on or not
	// (toggled by pressing light button)
	private lightFlag: boolean = false;
	
	// The flag indicating whether AM/PM mode is on or not
	// (toggled by pressing hour format button)
	private AM_PM_flag: boolean = false;
	
	private readonly animations: TwoDanimation[] = [];
	
	/**
	 * Constructs a clock instance
	 * @param index: the index of the clock instance in storage array and HTML document
	 * @param UTChourOffset: the clock time zone's hour offset from UTC
	 * @param UTCminuteOffset: the clock time zone's minute offset from UTC
	 */
	private constructor(private readonly index: number,
						UTChourOffset: number,
						UTCminuteOffset: number)
	{
		// Set clock time zone's offset from UTC (in minutes) from provided parameters
		this.UTCminuteOffset = UTChourOffset * 60;
		this.UTCminuteOffset += (this.UTCminuteOffset < 0 ? -1 : 1) * UTCminuteOffset;
		
		// Create clock div
		const newClockDiv = document.createElement("div");
		newClockDiv.setAttribute("id", this.getDivId());
		newClockDiv.setAttribute(	"style",
										"position: relative; "
									+	"width: " + Clock.divPixelWidth + "px; "
									+	"height: " + Clock.divPixelHeight + "px; "
									+	"margin: 10px;");
		// Add display
		const display = document.createElement("div");
		display
			.setAttribute(
				"style", 		
					"position: absolute; "
				+	"top: " + Clock.getTopButtonY().toString() + "px; "
				+	"left: " + Clock.buttonPixelWidth.toString() + "px; "
				+	"width: " + Clock.displayPixelWidth.toString() + "px; "
				+	"height: " + Clock.displayPixelHeight.toString() + "px; "
				+	"border: " + Clock.displayBorderPixelThickness.toString() + "px solid black; "
				+	"text-align: center; "
				+	"font-family: 'LCD', sans-serif; "
				+	"font-size: 24px;");
		const timeDiv = document.createElement("div");
		display.appendChild(timeDiv);
		const timeZoneDiv = document.createElement("div");
		timeZoneDiv.setAttribute("style", "font-size: 13px;");
		UTChourOffset = parseInt((this.UTCminuteOffset / 60).toString());
		timeZoneDiv.innerHTML =
				"GMT"
			+	(UTChourOffset < 0 ? "-" : "+")
			+	Math.abs(UTChourOffset).toString().padStart(2, "0")
			+	":"
			+	Math.abs(		this.UTCminuteOffset
							-	UTChourOffset * 60).toString().padStart(2, "0"); 
		display.appendChild(timeZoneDiv);
		newClockDiv.appendChild(display);
		
		// Add edit mode button at top right corner of display
		const editModeButton = document.createElement("div");
		editModeButton.setAttribute("title", "Edit mode");
		editModeButton
			.setAttribute(
				"style",
					"position: absolute; "
				+	"top: " + Clock.getTopButtonY().toString() + "px; "
				+	"left: " + Clock.getRightButtonX().toString() + "px; "
				+	"width: " + Clock.buttonPixelWidth.toString() + "px; "
				+	"height: " + Clock.buttonPixelHeight.toString() + "px; "
				+	"background-color: blue; "
				+	"cursor: pointer;");
		editModeButton
			.addEventListener(	"click",
								(e: Event) => this.pushEditModeButton());
		newClockDiv.appendChild(editModeButton);
		
		// Add increase button at bottom right corner of display
		const increaseButton = document.createElement("div");
		increaseButton.setAttribute("title", "+");
		increaseButton
			.setAttribute(
				"style",
					"position: absolute; "
				+	"top: " + Clock.getBottomButtonY().toString() + "px; "
				+	"left: " + Clock.getRightButtonX().toString() + "px; "
				+	"width: " + Clock.buttonPixelWidth.toString() + "px; "
				+	"height: " + Clock.buttonPixelHeight.toString() + "px; "
				+	"background-color: red; "
				+	"cursor: pointer;");
		increaseButton
			.addEventListener(	"click",
								(e: Event) => this.pushIncreaseButton());
		newClockDiv.appendChild(increaseButton);
		
		// Add light button at bottom left corner of display
		const lightButton = document.createElement("div");
		lightButton.setAttribute("title", "Light");
		lightButton
			.setAttribute(
				"style",
					"position: absolute; "
				+	"top: " + Clock.getBottomButtonY().toString() + "px; "
				+	"left: 0px; "
				+	"width: " + Clock.buttonPixelWidth.toString() + "px; "
				+	"height: " + Clock.buttonPixelHeight.toString() + "px; "
				+	"background-color: turquoise; "
				+	"cursor: pointer;");
		lightButton
			.addEventListener(	"click",
								(e: Event) => this.pushLightButton());
		newClockDiv.appendChild(lightButton);
		
		// Add reset button at bottom middle of display
		const resetButton = document.createElement("div");
		resetButton.setAttribute("title", "Reset");
		resetButton
			.setAttribute(
				"style",
					"position: absolute; "
				+	"top: " + (		Clock.getBottomButtonY()
								+	Clock.buttonPixelHeight).toString() + "px; "
				+	"left: " + (		(		Clock.buttonPixelWidth
											+	Clock.displayPixelWidth)
									/	2
								+	Clock.displayBorderPixelThickness).toString() + "px; "
				+	"width: " + Clock.buttonPixelWidth.toString() + "px; "
				+	"height: " + Clock.buttonPixelHeight.toString() + "px; "
				+	"background-color: orange; "
				+	"cursor: pointer;");
		resetButton
			.addEventListener(	"click",
								(e: Event) => this.pushResetButton());
		newClockDiv.appendChild(resetButton);
		
		// Add hour format button at top left corner of display
		const hourFormatButton = document.createElement("div");
		hourFormatButton.setAttribute("title", "Hour format");
		hourFormatButton
			.setAttribute(
				"style",
					"position: absolute; "
				+	"top: " + Clock.getTopButtonY().toString() + "px; "
				+	"left: 0; "
				+	"width: " + Clock.buttonPixelWidth.toString() + "px; "
				+	"height: " + Clock.buttonPixelHeight.toString() + "px; "
				+	"background-color: green; "
				+	"cursor: pointer;");
		hourFormatButton
			.addEventListener(	"click",
								(e: Event) => this.pushHourFormatButton());
		newClockDiv.appendChild(hourFormatButton);
		
		// Add background canvas
		const backgroundCanvas = document.createElement('canvas');
		backgroundCanvas.width = Clock.backgroundPixelSize + Clock.backgroundBorderPixelThickness;
		backgroundCanvas.height = backgroundCanvas.width;
		backgroundCanvas.style.zIndex = "-1";
		backgroundCanvas.style.position = "absolute";
		backgroundCanvas.style.left =
			((		Clock.divPixelWidth
				-	backgroundCanvas.width) / 2).toString() + "px";
		backgroundCanvas.style.top =
			((		Clock.divPixelHeight
				-	backgroundCanvas.height) / 2).toString() + "px";
		const context = backgroundCanvas.getContext('2d');
		context.lineWidth = Clock.backgroundBorderPixelThickness;
		const centerX = backgroundCanvas.width / 2;
		const centerY = backgroundCanvas.height / 2;
		const radius = (backgroundCanvas.width - context.lineWidth) / 2;
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.strokeStyle = '#000000';
		context.stroke();
		newClockDiv.appendChild(backgroundCanvas);
		
		// Add clock div to HTML document
		document.getElementById("clocksDiv").appendChild(newClockDiv);
	}
	
	/**
	 * Gets the id of clock instance's div in HTML document
	 * @return the div id
	 */
	private getDivId(): string
	{
		return "clock#" + this.index + "div";
	}
	
	/**
	 * Updates time in clock instance's display
	 */
	private update(): void
	{
		// Retrieve current date in client browser
		const currentDate = new Date();
		// Compute minute count since start of client browser's day in clock time zone
		let dayMinutes = 		currentDate.getHours() * 60
							+	currentDate.getMinutes()
							+	currentDate.getTimezoneOffset()
							+	this.UTCminuteOffset;
		// If negative, take minute count since start of previous day
		if (dayMinutes < 0)
		{
			dayMinutes += 24 * 60;
		}
		
		// Compute hour count since clock time zone's day start,
		// taking user edition into account and care to loop in [0, 23] range
		let hours = (Math.floor(dayMinutes / 60) + this.userHourOffset) % 24;
		
		// Handle AM/PM hour format if enabled
		let AM_PM_suffix = "";
		if (this.AM_PM_flag)
		{
			// If hour count since day start is 11 or below
			if (hours < 12)
			{
				// Time is AM
				AM_PM_suffix = " AM";
				// There is no 0 hour in AM/PM mode,
				// so if hour is 0, write 12 instead
				if (hours == 0)
				{
					hours = 12;
				}
			}
			// If hour count since day start is 12 or above
			else
			{
				// Time is PM
				AM_PM_suffix = " PM";
				// If hour is 13 or above
				if (hours > 12)
				{
					// Subtract 12 to stay in [1, 12] range
					hours -= 12;
				}
			}
		}
		
		// Write time in clock's display in hh:mm'ss" format,
		// with leading 0 where relevant and AM/PM suffix if needed
		document.getElementById(this.getDivId()).children[0].children[0].innerHTML =
				hours.toString().padStart(2, "0") + ":"
			+	((dayMinutes % 60 + this.userMinuteOffset) % 60).toString().padStart(2, "0") + "'"
			+	currentDate.getSeconds().toString().padStart(2, "0") + '"'
			+	AM_PM_suffix;
			
		// Apply animations progress to clock
		TwoDanimation.applyTo(	this.animations,
								currentDate.getTime() / 1000,
								document.getElementById(this.getDivId()));
	}
	
	/**
	 * Pushes edit mode button on clock instance
	 */
	private pushEditModeButton(): void
	{
		// Switch to next edit mode,
		// taking care to loop in [0, 2] range
		this.editModeIndex = (this.editModeIndex + 1) % 3;
	}
	
	/**
	 * Pushes increase button on clock instance
	 */
	private pushIncreaseButton(): void
	{
		// If hour edit mode
		if (this.editModeIndex == 1)
		{
			// Add one to user hour offset, looping in [0, 23] range
			this.userHourOffset = (this.userHourOffset + 1) % 24;
			// Update time in display right away
			this.update();
		}
		// If minute edit mode
		else if (this.editModeIndex == 2)
		{
			// Add one to user minute offset, looping in [0, 59] range
			this.userMinuteOffset = (this.userMinuteOffset + 1) % 60;
			// Update time in display right away
			this.update();
		}
		// If no edit mode, do nothing
	}
	
	/**
	 * Pushes light button on clock instance
	 */
	private pushLightButton(): void
	{
		// Toggle light flag
		this.lightFlag = !this.lightFlag;
		// Change display's background color accordingly:
		// transparent if light off, turquoise if light on
		(document
			.getElementById(this.getDivId())
				.children[0] as HTMLElement)
					.style
						.backgroundColor = (this.lightFlag ? "turquoise" : "transparent");
	}
	
	/**
	 * Pushes reset button on clock instance
	 */
	private pushResetButton(): void
	{
		// Reset user hour and minute offsets to zero
		this.userHourOffset = 0;
		this.userMinuteOffset = 0;
		// Update time in display right away
		this.update();
	}
	
	/**
	 * Pushes hour format button on clock instance
	 */
	private pushHourFormatButton(): void
	{
		// Toggle AM/PM flag
		this.AM_PM_flag = !this.AM_PM_flag;
		// Update time in display right away
		this.update();
	}
}
