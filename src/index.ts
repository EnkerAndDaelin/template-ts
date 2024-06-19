import './index.css';
import { TwoDvector } from './TwoDvector';
import { TwoDanimation } from './TwoDanimation';
import { Clock } from './Clock';

// Retrieve local time zone's offset from UTC (in minutes)
let localUTCdayMinuteOffset = -(new Date()).getTimezoneOffset();
// Compute local time zone's hour and minute offsets from UTC
// and set matching values in select elements by default
let localUTChourOffset = parseInt((localUTCdayMinuteOffset / 60).toString());
(document.getElementById('timeZoneHourSelect') as HTMLSelectElement)
	.value = (localUTChourOffset).toString();
(document.getElementById('timeZoneMinuteSelect') as HTMLSelectElement)
	.value = Math.abs(		localUTCdayMinuteOffset
						-	localUTChourOffset * 60).toString();

// Retrieve "create clock" button
const createClockButton =
	(document.getElementById("createClockButton") as HTMLButtonElement);
// Change its text depending on animation clock index parameter
const animationClockIndexSelect =
	(document.getElementById("animationClockIndexSelect") as HTMLSelectElement);
animationClockIndexSelect
	.addEventListener(
		"change",
		function (e)
		{
			createClockButton.textContent =
				(		+animationClockIndexSelect.value >= 0
					?	"Add animation"
					:	"Create clock");
		});
// Make it listen to clicks
createClockButton
	.addEventListener(
		"click",
		// When clicked, the button commands the creation of a new clock
		// with selected hour and minute offsets to UTC and animation
		function (e)
		{
			let animationClockIndex = +animationClockIndexSelect.value;
			if (animationClockIndex < 0)
			{
				// Retrieve time zone select elements
				const timeZoneHourSelect =
					(document.getElementById("timeZoneHourSelect") as HTMLInputElement);
				const timeZoneMinuteSelect =
					(document.getElementById("timeZoneMinuteSelect") as HTMLInputElement);
				
				// Create clock
				animationClockIndex = Clock.Create(	+timeZoneHourSelect.value,
													+timeZoneMinuteSelect.value);
				// If no clock was created
				if (animationClockIndex < 0)
				{
					// Exit right away
					return;
				}
				
				// If a clock was indeed created
					
				// Update animation clock index select
				const animationClockIndexSelectOption = document.createElement("option");
				animationClockIndexSelectOption.value = animationClockIndex.toString();
				animationClockIndexSelectOption.text = animationClockIndex.toString();
				animationClockIndexSelect.add(animationClockIndexSelectOption);
			}
			
			// Retrieve animation input elements
			const animationRelativeToPointXinput =
				(document
					.getElementById("animationRelativeToPointXinput") as HTMLInputElement);
			const animationRelativeToPointYinput =
				(document
					.getElementById("animationRelativeToPointYinput") as HTMLInputElement);
			const animationStartSpanOneInput =
				(document.getElementById("animationStartSpanOneInput") as HTMLInputElement);
			const animationStartSpanTwoInput =
				(document.getElementById("animationStartSpanTwoInput") as HTMLInputElement);
			const animationEndSpanOneInput =
				(document.getElementById("animationEndSpanOneInput") as HTMLInputElement);
			const animationEndSpanTwoInput =
				(document.getElementById("animationEndSpanTwoInput") as HTMLInputElement);
			const animationTimeOffsetInput =
				(document.getElementById("animationTimeOffsetInput") as HTMLInputElement);
			const animationTimeDurationInput =
				(document.getElementById("animationTimeDurationInput") as HTMLInputElement);
			
			// If selected animation type is not none
			const animationType = +animationTypeSelect.value;
			if (animationType > 0)
			{
				// Create animation
				const animation =
					new TwoDanimation(	+animationTypeSelect.value,
										new TwoDvector(	+animationRelativeToPointXinput.value,
														+animationRelativeToPointYinput.value),
										new TwoDvector(	+animationStartSpanOneInput.value,
														+animationStartSpanTwoInput.value),
										new TwoDvector(
												+animationEndSpanOneInput.value,
												+animationEndSpanTwoInput.value),
										+animationTimeOffsetInput.value,
										+animationTimeDurationInput.value);
				// Add it to clock
				Clock.addAnimation(animation, animationClockIndex);
			}
		});

// Change display of animation parameters depending on the chosen type
const animationTypeSelect =
	(document.getElementById("animationTypeSelect") as HTMLSelectElement);
animationTypeSelect
	.addEventListener(
		"change",
		function (e)
		{
			// Hide all parameters if none type
			document
				.getElementById("animationUl")
					.style
						.display = (	animationTypeSelect.value == "0"
									?	"none"
									:	"list-item");
			
			// Hide "relative to point" parameter if translation type
			document
				.getElementById("animationRelativeToPointLi")
					.style
						.display = (	animationTypeSelect.value == "1"
									?	"none"
									:	"list-item");
			
			let spanTwoDisplay = "inline";
			let spanChildZeroText = "X:";
			let spanChildTwoText = "pixels";
			// For circular translation and rotation types
			if (	animationTypeSelect.value == "2"
				||	animationTypeSelect.value == "4")
			{
				// Hide "Y" parameter
				spanTwoDisplay = "none";
				// Replace "X" and "pixels" with "angle" and "degrees"
				spanChildZeroText = "angle:";
				spanChildTwoText = "degrees";
			}
			
			// Do it for both start and end parameters
			for (const tag of ["Start", "End"])
			{
				const animationSpanOne =
					document.getElementById("animation" + tag + "SpanOne");
				animationSpanOne.children[0].innerHTML = spanChildZeroText;
				animationSpanOne.children[2].innerHTML = spanChildTwoText;
				document
					.getElementById("animation" + tag + "SpanTwo")
						.style
							.display = spanTwoDisplay;
			}
		});
