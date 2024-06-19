import { TwoDvector } from '../TwoDvector/TwoDvector';
import { TwoDmatrix } from '../TwoDmatrix/TwoDmatrix';

export class TwoDanimation
{
	/**
	 * Applies the transformation of provided animations at given time
	 * to specified document element
	 * @param animations: the animations to apply the transformation of
	 * @param time: the time (in seconds) at which the animation progress is computed
	 * @param documentElement: the document element to apply the animation to
	 */
	public static applyTo(	animations: TwoDanimation[],
							time: number,
							documentElement: HTMLElement): void
	{
		let M: TwoDmatrix = TwoDmatrix.getIdentity(); 
		
		// For each animation
		for (let animation of animations)
		{
			// If none type
			if (animation.type == 0)
			{
				// Skip to next
				continue;
			}
			// Compose transformation matrices
			M = M.multiplyBy(animation.getMatrix(time));
		}
		
		M.applyTransformTo(documentElement);
	}
	
	/**
	 * Constructs a 2D animation
	 * @param type: the animation transformation type
	 * @param relativeToPoint: the point the animation transformation is relative to
	 * @param startValue: the transformation value at animation start
	 * @param endValue: the transformation value at animation end
	 * @param timeOffset: the offset in time (in seconds) of the animation
	 * @param duration: the duration (in seconds) of the animation
	 *					(from transformation start value to end value)
	 */
	public constructor(	private readonly type: number,
						private readonly relativeToPoint: TwoDvector,
						private readonly startValue: TwoDvector,
						private readonly endValue: TwoDvector,
						private readonly timeOffset: number,
						private readonly duration: number)
	{
		// Check specified transformation type
		switch (this.type)
		{
			// None
			case 0:
			// Translation
			case 1:
			// Circular translation
			case 2:
			// Homothety
			case 3:
			// Rotation
			case 4:
			{
				break;
			}
			default:
			{
				alert("Invalid 2D animation type, switching to none by default.");
				this.type = 0;
			}
		}
		
		// Check specified time offset
		if (isNaN(timeOffset))
		{
			alert("Invalid 2D animation time offset, switching to 0 by default.");
			this.timeOffset = 0;
		}
		
		// Check specified duration
		if (isNaN(duration) || duration < 0)
		{
			alert("Invalid 2D animation duration, switching to 0 by default.");
			this.duration = 0;
		}
	}
	
	/**
	 * Gets the matrix representing the animation transformation at specified time
	 * @param time: the time (in seconds) at which the animation progress is computed
	 * @returns the matrix 
	 */
	private getMatrix(time: number): TwoDmatrix
	{
		// If duration is zero, consider the animation ended
		// (take the transformation end value)
		let valueX = this.endValue.getX();
		let valueY = this.endValue.getY();
		
		// If duration is not zero
		if (this.duration > 0)
		{
			// Check specified time
			if (isNaN(time))
			{
				alert(		"Invalid time to get animation matrix, "
						+	"switching to identity matrix by default.");
				return TwoDmatrix.getIdentity();
			}
			
			// Compute current loop index from specified time
			const loopCount = (time - this.timeOffset) / this.duration;
			// Compute current loop progress ratio
			const tau = loopCount - Math.floor(loopCount);
			// Compute transformation values for specified time
			valueX = (1 - tau) * this.startValue.getX() + tau * this.endValue.getX();
			valueY = (1 - tau) * this.startValue.getY() + tau * this.endValue.getY();
		}
		
		// Return matrix representing the transformation depending on its type
		switch (this.type)
		{
			// Translation
			case 1:
			{
				return TwoDmatrix.getTranslation(valueX, valueY);
			}
			// Circular translation
			case 2:
			{
				return TwoDmatrix.getCircularTranslation(valueX, this.relativeToPoint);
			}
			// Homothety
			case 3:
			{
				return TwoDmatrix.getHomothety(valueX, valueY, this.relativeToPoint);
			}
			// Rotation
			case 4:
			{
				return TwoDmatrix.getRotation(valueX, this.relativeToPoint);
			}
			default:
			{
				return TwoDmatrix.getIdentity();
			}
		}
	}
}
